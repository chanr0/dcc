import "./styles.scss";
import React, {useState} from "react";
import bias from "../imgs/bias.jpg";
import HeatMap from "./HeatMap";
import DataMapVisualization  from "./DataMap";
import StaticDataMapVisualization from "./StaticDataMap";
import { capitalize } from "@mui/material";
import {contColor as color} from "../utils/colorMaps";
import { NLIDataArray } from "./types/NLIDataArray";
import { DataArrayExtended } from './types/DataArrayExtended';
import snli from "../imgs/snli.png";
import dcc_2 from "../imgs/dcc_2.png";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

import {
    TextField
} from "@mui/material"

import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import Typography from '@mui/material/Typography';


import {useEffect} from 'react';

import {queryBackendData, queryBackendData3} from '../backend/BackendQueryEngine';


interface Props {}



const Introduction: React.FunctionComponent<Props> = ({}: Props) => {

    const [scatterData, setScatterData] = useState<DataArrayExtended>([]);
    const [showcaseData, setShowcaseData] = useState<NLIDataArray>();
    const [count, setCount] = useState(0);
    const [showEstimate, setShowEstimate] = useState(false);

    const totalCount = 10;

    const incrCount = () => {
        console.log(totalCount)
        if (count < totalCount - 1) {
            setCount(count + 1)
        }
    };
    
    const decrCount = () => {
        if (count > 0) {
            setCount(count - 1)
        }
    };

    useEffect(() => {
        queryBackendData3(`get-data`).then((e) => {
            setScatterData(e)
        });
    }, []);
    // comment: this per default only loads the first datapoint
    useEffect(() => {
        queryBackendData(`get-showcase-data`).then((e) => {
            setShowcaseData(e)
        });
    },  []);

    return <section className="mt-6">
        {/* <!-- Content --> */}
        <div
            className="container-lg max-w-screen-xl position-relative text-lg-start pt-5 pb-5 pt-lg-6">
            <h1 className="ls-tight font-bolder display-6 mb-5">Introduction</h1>
            <hr/>

            <div className="bg-white position-relative d-flex p-2 rounded shadow-sm mb-4" role="alert">
                <div className="w-1 bg-warning rounded-pill"/>
                <div className="ms-4 py-2 d-flex">
                    <div className="">
                        <span className="d-block font-semibold text-heading">Before you start!</span>
                        <p className="text-sm">
                            This report assumes basic prior knowledge on how Language Models work.
                            If you are not familiar with them, you may consider taking a look at <a href="https://towardsdatascience.com/bert-explained-state-of-the-art-language-model-for-nlp-f8b21a9b6270" className="alert-link">this resource</a>.
                        </p>
                    </div>
                </div>
            </div>
            <p className="mb-3"> The availability of crowdsourced, large-scale dataset in natural language processing empowered advancements in a wide range of downstream
            tasks, including the natural language inference (NLI) task <a href={"https://aclanthology.org/D15-1075.pdf"}>(Bowman et al., 2015)</a>.
            While being influential, crowdsourcing frameworks can introduce artifacts, biases, and spurious correlations that can 
            negatively impact the robustness and out-of-domain generalization of the models that are trained using such datasets
            <a href={"https://aclanthology.org/D17-1215.pdf"}> (Jia and Liang, 2017</a>;
            <a href={"https://aclanthology.org/P19-1334.pdf"}> McCoy et al., 2019)</a>.
            </p>

            <p className="mb-3">
                A <b>spurious correlation</b> exists when a feature correlates with the target label while there is no causal relationship between the
                feature and the label. For example, the fact that a sentence contains the word <i>amazing</i> (as a feature) might correlate with a positive sentiment
                but does not <i>cause</i> the sentiment label to be positive; one could imagine crafting a sentence like <i>"The amazing concert was ruined by the terrible
                acoustics in the venue."</i>, which has a negative sentiment.
                Spurious corrleations exist in crowdsourced datasets <a href={"https://aclanthology.org/2021.emnlp-main.135.pdf"}>(Gardner, 2021)</a>,
                and this will prevent many models trained on such datasets from performing on adversarial or out-of-domain test sets
                <a href={"https://aclanthology.org/P19-1334.pdf"}> (McCoy et al., 2019)</a>.
            </p>

            <p className="mb-3">
                One approach to prevent a model from relying on spurious correlations between a feature and the label is to break
                such correlations by providing <b>counterfactual samples</b> during training. Counterfactual samples contain that feature, but have a different label.
                In our previous example, <i>"The amazing concert was ruined by the terrible acoustics in the venue."</i> is a counterfactual sentence,
                since it contains the word <i>amazing</i>, but has a negative sentiment.
            </p>

            <p className="mb-3">
                Generating useful counterfactuals is hard; it involves initially detecting such relevant non-causal features,
                which goes beyond existing minimal-edit-based approaches. We propose - and will guide you through - our interactive dashboard 
                offering a human-in-the-loop approach to first identify such features and then generate counterfactual samples, which can be useful
                to augment data to train more robust models, or as parts of adversarial test suits.
            </p>

            <h1 className="ls-tight font-bolder display-6 mb-5 mt-10">Preliminaries</h1>
            <hr/>
            {/* <!-- Gender in real world --> */}
            <div className="row g-10 g-lg-20 justify-content-around align-items-center mt-1">

                <div className="col mb-4">
                    <h4 className="ls-tight font-bolder mb-5 mt-10 text-lg">Natural Language Inference</h4>
                        <p className="mb-3">                    
                        We use our dashboard for the <b>Natural Language Inference</b> (NLI) task. 
                        The goal of the NLI task is to determine whether a first sentence - the <b>premise</b> - <i>entails</i>, <i>contradicts </i> 
                        or is <i>neutral</i> to a second sentence - the <b>hypothesis</b>.
                        </p>
                </div>
                <div className="col-lg-7">
                    <div className="card">
                            <div className="card">
                                    <div className="p-2" >
                                        <img alt="..."
                                            src={snli}
                                            style={{imageRendering: "-webkit-optimize-contrast", width: "100%"}}/>
                                    </div>
                                    <div className="card-body" style={{paddingTop: "3px"}}>
                                        <p className="text-xs">
                                            Random SNLI <a href={"https://aclanthology.org/D15-1075.pdf"}> (Bowman et al., 2015)</a> sample.
                                            Premises are on the left, hypotheses on the right. The gold label is shown in bold, it corresponds to
                                            the majority annotation.

                                        </p>
                                    </div>
                            </div>
                        </div>
                    </div>
            </div>

            <div className="row g-10 g-lg-20 mt-10 mb-14 justify-content-around align-items-center">
                <div className="col-lg-7">
                    <div className="card">
                    {/* <p className="text-lg text-dark" style={{textAlign: "center", paddingTop: "1em"}}> SNLI Data Map </p> */}
                        <div className="card-body" style={{paddingTop: "0", paddingBottom: "5em"}}>
                            <DataMapVisualization scatter_data={scatterData} />
                        </div>
                    </div>
                </div>
                <div className="col mb-4">
                    <h4 className="ls-tight font-bolder mb-5 mt-10 text-lg">Data Maps</h4>

                    <p className="mb-3">
                        <b>Data Maps</b>
                        <a href={"https://aclanthology.org/2020.emnlp-main.746.pdf"}> (Swayamdipta et al., 2020) </a>
                        are a useful tool to diagnose the characteristics
                        of datasets with respect to a model's behavior during training.
                        They propose two axes to locate each training data point in two dimensions.
                        First, the <b>confidence</b> is defined as the average probability that the model assigns
                        to the <i>true</i> label throughout training checkpoints, and second, the <b>variability</b> of its confidence across the checkpoints.
                        </p>

                        <p className="mb-3">
                            A sample is considered <i>confusing</i> to the model, if it falls into the <i>hard-to-learn</i> or <i>ambiguous</i> regions
                            of the Data Map, i.e., in regions of low confidence, and/or high variability.
                        </p>
                        <p className="mb-3">
                        This is an interactive Data Map for a random subsample of the SNLI dataset
                            <a href={"https://aclanthology.org/D15-1075.pdf"}> (Bowman et al., 2015)</a>, for a RoBERTa model trained for six epochs.
                        Hover over the markers to explore the dataset!
                    </p>
                </div>
            </div>

            <h4 className="ls-tight font-bolder mb-5 mt-10 text-lg">Data-Constrained Counterfactuals</h4>
            <div className="bg-white position-relative d-flex p-2 rounded shadow-sm mb-4" role="alert">
                <div className="w-1 bg-warning rounded-pill"/>
                <div className="ms-4 py-2 d-flex">
                    <div className="">
                        {/* <span className="d-block font-bold text-heading mb-4">Definition</span> */}
                        <p className="text-s">
                            We define a <b><i>data-constrained counterfactual</i></b> (DCC) to be a data point with high annotator agreement, fulfilling two conditions:
                        </p>
                        <p className="text-s">
                            (1) There exist other data points in the training set that are similar to this data point, but have a different label.
                        </p>
                        <p className="text-s">
                            (2) It is not easy for the model to label it correctly, i.e., it falls into either the <i>hard-to-learn</i> or <i>ambiguous </i>
                            region in the Data Map.
                        </p>
                    </div>
                </div>
            </div>

            <p>
                In other words, <i>data-constrained counterfactuals</i> are naturally occurring counterfactual samples,
                as they share some features with other samples, which are however labeled differently. Further, the samples are easy to understand for humans
                (high annotator agreement), but the model struggles to label it correctly, possibly due to the spurious features it shares with its neighbors.
            </p>

            <h1 className="ls-tight font-bolder display-6 mb-5 mt-14">Dashboard Walkthrough</h1>
            <hr/>
            <div className="row g-10 g-lg-20 justify-content-around align-items-center mt-3 ">
                <div className="col-lg-7 mt-4">
                        <div className="card mb-4">
                                <div className="card">
                                        <div className="p-2" >
                                            <img alt="..."
                                                src={dcc_2}
                                                style={{imageRendering: "-webkit-optimize-contrast", width: "100%"}}/>
                                        </div>
                                </div>
                        </div>
                </div>
                <div className="col mb-4 mt-4">
                    <h4 className="ls-tight font-bolder mb-0 mt-5 text-lg">Understanding</h4>

                    <p className="mb-3 mt-3">
                            In this example, we're given the data-constrained counterfactual shown to the left. During <i>understanding</i>,
                            we want the user to understand the annotation (<i>neutral</i>) as well as how the model reasons about the data point.
                    </p>
                    <p className="mb-3">
                        The annotation is correctly <i>neutral</i>, since there is no indication that the people mentioned in the premise are related.
                        The model only has low confidence of in the correct label, and would instead predict <i>entailment</i>.
                    </p> 
                </div>
            </div>
        <hr/>
            <div className="row g-10 g-lg-20 justify-content-around align-items-center mt-3 ">
                <div className="col-lg-4 mb-4">
                    <h4 className="ls-tight font-bolder mb-5 mt-5 text-lg">Diagnosing</h4>

                    <p className="mb-3">
                        During <i>diagnosis</i>, we look at the nearest neighbors (in blue), as well as the nearest neighbors with the same label (in orange), to figure out
                        what common features the model relies on for prediction.
                    </p>  
                    <p className="mb-3">
                        In this example, we find the highlighted blue nearest neighbor, which has the common feature of a woman and a child being mapped to a parent-child relationship.
                        However, in the blue sample, the possessive <i>her</i> makes it so that the premise actually entails the hypothesis, whereas this is not
                        necessarily the case in the grey DCC.
                    </p>  
                </div>
                <div className="col-lg-7 mt-2">
                    <div className="card">
                        <div className="card-body" style={{paddingTop: "0", paddingBottom: "5em", paddingRight: "5em"}}>
                        {showcaseData && scatterData &&
                                    <StaticDataMapVisualization
                                    scatter_data={scatterData}
                                    showcase_data= {showcaseData}
                                    show_estimate={false}/>}
                        </div>
                    </div>
                </div>
            </div>

            <hr/>

            <div className="row g-10 g-lg-20 justify-content-around align-items-center mt-3 ">
                
                <div className="col-lg-6 mt-2">
                    <div className="card">
                        <div className="card-body" style={{paddingTop: "0", paddingBottom: "5em", paddingRight: "5em"}}>
                        {showcaseData && scatterData &&
                                    <StaticDataMapVisualization
                                    scatter_data={scatterData}
                                    showcase_data={showcaseData}
                                    show_estimate={showEstimate}/>}
                        </div>
                    </div>

                </div>
                <div className="col-lg-6 mb-4">
                    <h4 className="ls-tight font-bolder mb-5 mt-5 text-lg">Refining</h4>

                    <p className="mb-3">
                        During <i>refinement</i>, users are encouraged to generate adversarial samples addressing the spurious correlations 
                        identified during <i>understanding</i>. To this end, we provide GPT-3 generated suggestions, prompted to follow a similar reasoning as the DCC.
                    </p>  
                    <p className="mb-4">
                        In the example shown below, the suggestion also contains an assumption about a relationship between two people, without an indication of such,
                        resulting in a neutral label.
                    </p>  
                    <p className="mb-5">
                    Users can do syntactic refinements, labeling, and finally get iterative feedback from the model via the Data Map estimate.
                        If the sample ends up being <i>confusing</i> to the model, it might be a useful counterfactual sample. Try submitting the example yourself!
                    </p>

                <div className="card">
                <div className="card-body" style={{paddingTop: "2em", paddingBottom: "3em", paddingRight: "5em", paddingLeft: "5em"}}>
                    <Stack spacing={2} >
                        
                    <Grid container spacing={2}>
                    <Typography component="div"><strong>Revise GPT-3 suggestions and make a new example </strong> </Typography>

                        <Grid item xs={13}>
                        {/* TODO: debug not being able to edit the text field. */}
                        <TextField fullWidth id="counterfactual" 
                                    inputRef={null}
                                    label={"✍ Edit the premise suggestion:"}
                                    disabled={true}
                                    multiline
                                    value={'A woman in a green dress and a man in a grey suit.'}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: "black",
                                            "font-weight": "bold",
                                            // "font-size": 20,
                                        },
                                        "& label.Mui-focused": {
                                            // Override default styling,
                                            // Which change the label to be smaller font
                                            // color: "black",
                                        },
                                        "& .MuiOutlinedInput-input": { // Defunct
                                            "&::selection": {
                                                color: "white",
                                                background: "purple",
                                            }
                                        }
                                    }}
                                    inputProps={{fontSize: 30}}
                            />
                        </Grid>
                        <Grid item xs={13}>
                            <TextField fullWidth id="counterfactual"
                                    inputRef={null}
                                    label={"✍ Edit the hypothesis suggestion:"}
                                    disabled={true}
                                    multiline
                                    value={'A couple is dressed up.'}
                                    onChange={(e) => {
                                        console.log('cf')
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: "black",
                                            "font-weight": "bold",
                                            // "font-size": 20,
                                        },
                                        "& label.Mui-focused": {
                                            // Override default styling,
                                            // Which change the label to be smaller font
                                            // color: "black",
                                        },
                                        "& .MuiOutlinedInput-input": { // Defunct
                                            "&::selection": {
                                                color: "white",
                                                background: "purple",
                                            }
                                        }
                                    }}
                                    inputProps={{fontSize: 30}}
                            />
                        </Grid>
                        <Stack width={"100%"} spacing={2} alignItems={'center'}>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                sx={{}}
                            >
                                <FormControlLabel value="Entailment" control={<Radio/>}
                                                    sx={{"& .MuiFormControlLabel-label": {color: "green"}}}
                                                    label="Entailment" onClick={(e) => {
                                    // setcflabel('Entailment');
                                    console.log('click registered')
                                }} disabled={true}/>
                                <FormControlLabel value="Neutral"  control={<Radio/>}
                                                    label="Neutral"
                                                    checked={true}
                                                    sx={{"& .MuiFormControlLabel-label": {color: "gray"}}}
                                                    onClick={(e) => {
                                    // setcflabel('Neutral');
                                    console.log('click registered')
                                }}disabled/>
                                <FormControlLabel value="Contradiction" control={<Radio/>}
                                                    sx={{"& .MuiFormControlLabel-label": {color: "red"}}}
                                                    label="Contradiction" onClick={(e) => {
                                    // setcflabel('Contradiction');
                                    console.log('click registered')
                                }}disabled={true}/>
                            </RadioGroup>
                        <Button variant="contained"
                            onClick={() => setShowEstimate(true)}
                            style={{textTransform: 'none', backgroundColor: "#C9DAFF", color: "black"}}>
                            Estimate Data Map location
                        </Button>
                        </Stack>
                    </Grid>
                    </Stack>
                </div>
                </div>
                </div>
            </div>
        </div>
    </section>
};

export default Introduction;