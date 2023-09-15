from typing import Optional
from fastapi import APIRouter
from fastapi.middleware import cors
import pydantic
from pydantic_models.nli_data_point import NLIDataResponse, NLISubmissionDisplay
from datamap_estimation import get_checkpoints, estimate_datamap_coordinates

import pandas as pd
# import data
# import model
import os

router = APIRouter()


@router.get("/get-showcase-data", response_model=NLIDataResponse)
def upload_showcase_data(count: int = 0):
    data = pd.read_pickle('data/showcase_data.pkl')
    print(data.iloc[count])
    return [data.iloc[count].to_dict()]

# @router.get('/get-data')
@router.get('/get-data')
def upload_moons_data():
    datamap_data = pd.read_csv('data/d3_datamap_test_v4.csv')
    # datamap_data = pd.read_csv('data/d3_datamap_test_v2.csv')
    return datamap_data.to_dict(orient='records')

NO_CHECKPOINTS = True
if NO_CHECKPOINTS: 
    checkpoints, tokenizer, model = None, None, None
else: 
    checkpoints, tokenizer = get_checkpoints(model_dir='data/models_0301_checkpoints_smaller/')
    # checkpoints, tokenizer = {'test': 0}, None
    model = list(checkpoints.values())[-1]

@router.get('/datamap-coordinates')
def get_datamap_coordinates(sentence1: str, sentence2: str, label: str) -> str:
    if NO_CHECKPOINTS: 
        return [0.25, 0.25]
    else: 
        estimate = estimate_datamap_coordinates(
            sentence1, sentence2, label, list(checkpoints.values()), tokenizer, use_less_checkpoints=False
        )
        print(estimate)
        return estimate

@router.get('/get-data-old')
def upload_moons_data_old():
    datamap_data = pd.read_csv('data/d3_datamap_test.csv')
    return datamap_data.to_dict(orient='records')
    
@router.get("/data-count")
def get_data_length() -> int:
    df_data = pd.read_pickle('data/cartography_filtered/htl_ambi_dashboard_2000.pkl')
    _df_adv = pd.read_csv('data/NCF_samples.csv')
    df_data = df_data[
        df_data.apply(
            lambda x: x.nn_querying_premises[0] in _df_adv.sentence1.tolist(),
            axis=1
        )
    ]
    grouped_data = df_data.groupby(["sentence1", "sentence2"])[["gold_label"]].count()

    return len(grouped_data)


from pydantic_models.nli_data_point import NLIDataResponse, NLIDataSubmission, \
    NLISubmissionDisplay
import numpy as np
@router.post("/submit-data")
async def submit_data(data_row: NLIDataSubmission):
    """
    Function receives a new submitted counterfactual and updates it in the submitted tsv file to store.
    """
    if NO_CHECKPOINTS: 
        prob_dict = {'entailment': 1.0, 'neutral': 0.0, 'contradiction': 0.0}
    else: 
        from roberta_inference  import roberta_probability
        prob_dict = roberta_probability(data_row["suggestionRP"], data_row["suggestionRH"], tokenizer, model)
    new_data = pd.DataFrame.from_dict([data_row])

    new_data['Neutral'] = [prob_dict['neutral']]
    new_data['Entailment'] = [prob_dict['entailment']]
    new_data['Contradiction'] = [prob_dict['contradiction']]

    # we handle the duplicates here:
    if os.path.exists("data/NLI/submitted/cfs_submitted.tsv"):
        old_data = pd.read_csv("data/NLI/submitted/cfs_submitted.tsv", sep="\t")
        data = pd.concat([old_data, new_data], ignore_index=True).replace('', np.nan, regex=True,
                                                                      inplace=False)
    else: 
        data = new_data.replace('', np.nan, regex=True, inplace=False)
    data.drop_duplicates(["sentence1", "sentence2", "suggestionRP", "suggestionRH", "annotator_label"],inplace=True, ignore_index=True)
    data.to_csv(f"data/NLI/submitted/cfs_submitted.tsv", index=False, header=True,
                sep="\t")
    return True


@router.post("/delete-data")
async def delete_data(sentence1: str, sentence2: str, new_premise: str, new_hypothesis: str, label: str):
    old_data = pd.read_csv(SUBMITTED_SAMPLES_PATH, sep="\t")
    # find line(s) to delete and write new df
    print(old_data.shape)
    # print(old_data['sentence1'] == sentence1)
    # print(old_data['sentence2'] == sentence2)
    print(old_data['suggestionRH'])
    print(new_hypothesis)
    print(old_data['suggestionRH'] == new_hypothesis)
    # print(old_data['suggestionRP'] == new_premise)
    
    print(len(old_data))
    if len(old_data) == 1:
        os.remove(SUBMITTED_SAMPLES_PATH)
    else:
        new_data = old_data.drop(
            old_data[(old_data["sentence1"] == sentence1)
            & (old_data["sentence2"] == sentence2)
            & (old_data["suggestionRH"] == new_hypothesis)
            & (old_data['suggestionRP'] == new_premise)
            & (old_data['annotator_label'] == label)
        ].index)
        print(new_data.shape)
        new_data.to_csv(SUBMITTED_SAMPLES_PATH, index=False, header=True,
                    sep="\t")
        return True


# @router.get("/upload-data", response_model=NLIDataResponse)
@router.get("/upload-data", response_model=NLIDataResponse)
def upload_data(count: int):

    df_data = pd.read_pickle('data/cartography_filtered/htl_ambi_dashboard_2000.pkl')
    _df_adv = pd.read_csv('data/NCF_samples.csv')
    df_data = df_data[
        df_data.apply(
            lambda x: x.nn_querying_premises[0] in _df_adv.sentence1.tolist(),
            axis=1
        )
    ]
    if len(df_data) == 0:
        raise ValueError(df_data)
    return [df_data.iloc[count].to_dict()]

SUBMITTED_SAMPLES_PATH = 'data/NLI/submitted/cfs_submitted.tsv'
# @router.get("/upload-submitted-data", response_model=NLISubmissionDisplay)
@router.get("/upload-submitted-data", response_model=NLISubmissionDisplay)
def upload_submitted_data(sentence1: str, sentence2: str):

    if not os.path.exists(SUBMITTED_SAMPLES_PATH):
        _df = pd.DataFrame(
            columns=['sentence1', 'sentence2', 'gold_label', 'suggestionRP', 'suggestionRH', 'annotator_label', 'Neutral', 'Entailment', 'Contradiction'])
        _df.to_csv(SUBMITTED_SAMPLES_PATH, sep='\t')

    data = pd.read_csv(SUBMITTED_SAMPLES_PATH, sep="\t")
    # return data.rename(
    #     columns={"suggestionRP": "New Premise", "suggestionRH": "New Hypothesis", "Robot_Label": "Robot Label", "annotator_label": "Human Label"})[
    #         ["New Premise", "New Hypothesis", "Robot Label", "Human Label"]].to_dict(orient="records")
    # matching_data = data[(data['sentence1'] == sentence1) & (data['sentence2'] == sentence2)]

    # compute robot label
    labels = ["Entailment", "Neutral", "Contradiction"]
    robot_labels = list()
    for index, row in data.iterrows():
        probs = [row["Entailment"], row["Neutral"],row["Contradiction"]]
        label_index = probs.index(max(probs))
        label = labels[label_index]
        robot_labels.append(label)

    data["Robot_Label"] = robot_labels
    # renaming here for the table in the frontend
    data = data.rename(
        columns={"suggestionRP": "New Premise", "suggestionRH": "New Hypothesis", "Robot_Label": "Robot Label", "annotator_label": "Human Label"})
    data["id"] = data.index + 1
    return data[["id", "New Premise", "New Hypothesis", "Robot Label", "Human Label"]].to_dict(orient="records")

from fastapi import APIRouter, UploadFile, File
@router.post("/files/")
async def create_file(file: bytes = File(...)):
    return {"file_size": len(file)}


@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}

from fastapi.responses import HTMLResponse
@router.get("/", response_class=HTMLResponse)
async def root():
    html_content = """
        <html>
            <head>
                <title>Week 2</title>
            </head>
            <body>
                <h1>Test Python Backend</h1>
                Visit the <a href="/docs">API doc</a> (<a href="/redoc">alternative</a>) for usage information.
            </body>
        </html>
        """
    return HTMLResponse(content=html_content, status_code=200)


@router.get("/version")
async def version() -> dict:
  return {
    "commit": os.environ['COMMIT_ID'],
    "job": os.environ['JOB_ID'],
    "current_date": datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")
  }

# @app.post("/custom/prof")
# def post_profession(item: Profession):
#     bert = get_model('distilbert-base-uncased')
#     tokenizer = get_tokenizer('distilbert-base-uncased')

#     data.df = pd.concat([data.df, pd.DataFrame([
#         model.compute(bert, tokenizer, 'he',     item.profession, data.mappers),
#         model.compute(bert, tokenizer, 'she',    item.profession, data.mappers),
#         model.compute(bert, tokenizer, '[MASK]', item.profession, data.mappers),
#     ])], ignore_index=True)
