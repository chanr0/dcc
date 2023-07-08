# Contextualized Word Embeddings 

# Final delivery
This section contains the relevant information regarding the delivery of the project.

- **Target users**: people with some background on Artificial Intelligence (not necessarily experts) willing to learn more about bias in language models and where it may be originated from.
- **Research question**: Is bias in language models aligned with real-world demographics?

### Report
Our team decided to do an interactive block format report because it aligns best with the purpose of our visualizations. It can be accessed [here](http://contextualized-xai-iml22.course-xai-iml22.isginf.ch). We are planning a submission to VISxAI, so any feedback would be really appreciated.

### Code execution
The latest version of the code can be accessed on this [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/final_submission) and executed using Docker as documented in its [corresponding section](#how-to-run). The current code is already deployed in the kubernetes cluster. See [http://contextualized-xai-iml22.course-xai-iml22.isginf.ch](http://contextualized-xai-iml22.course-xai-iml22.isginf.ch)

## Contribution statement

Since we do not have a PDF report, we include here our contribution statement.

**Note on team members:** we were initially 4 people but two dropped during the semester. Philippe quitted at the very beginning and did not have a contribution at all. James dropped half way through the semester and he had equal contribution in topic exploration and backend design until then.

For Javier Rando and Alexander the contribution statements are included below.

- Javier Rando (60% contribution). At the beginning, I worked on topic exploration and experiments to find accurate data for our visualizations and tasks. When we decided what to work on, I was in charge of building a report-like website, D3 visualizations and their interaction when other components were updated, and Docker integration. Finally, I was also responsible for poster and report design.
- Alexander Theus (40% contribution). In the beginning of this project, I explored multiple experiment set-ups to arrive at one that would produce interesting results. At last, I found that we could generate sentences of the form "[MASK] is a [PROFESSION]", and look at the distance of the pronoun "he" and "she" to the mask embedding. This turned out to be very interesting, and hence our dashboard was based on this idea alone. Later, I was responsible for all the interactions in the tab (selection, filtering, etc.) for the visualization components. I was responsible for further plots such as the one relating to linear regression, and worked on the final dashboard report structure and text. 

# Repository details and weekly updates

[[_TOC_]]

## Team Members
1. Javier Rando Ramirez
2. Alexander Theus
3. James Houlahan (dropped project)
4. Philippe Mösch (dropped project)

## Project Description 
To explore (visualize, understand) how bias manifests in the latent space of language model(s).

**Research question**: Is bias in language models aligned with real-world demographics?

### Users
People with some background on Artificial Intelligence (not necessarily experts) willing to learn more about bias in language models and where it may be originated from.

### Datasets
- [USA Labor Force Statistics](https://www.bls.gov/cps/cpsaat11.htm)

## Folder Structure
A simplified structure containing the most important files and folders.

``` bash
├── backend-project
│   ├── src   
│       ├── app.py             # main app
│       ├── data.py            # utils for data handling
├── react-frontend
│   ├── src
│   │   ├── App.scss
│   │   ├── App.tsx            # Main file that calls all sections
│   │   ├── backend
│   │   │   ├── BackendQueryEngine.tsx  # Handles queries to backend
│   │   ├── components          # Code for all different components
├── README.md
└── requirements.txt
```

## Requirements
Handled by docker. Otherwise, install node dependencies and requirements for Python.

## How to Run

The code in `final_submission` [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/final_submission) is ready for local execution. For deployment in the cluster, code in `ci-cd-pipeline` branch or this [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/cluster_deployment) is required.

### Backend

**Using Docker**

```bash
$ docker build -t backend:dev1 .
$ docker run --rm -d -p 8000:8000/tcp backend:dev1
```

### Frontend

**Important:** make sure to use the code in the `main` branch for local execution and `ci-cd-pipeline` for cluster deployment.

**Using Docker**

```bash
$ docker build -t frontend:dev1 .
$ docker run --rm -d -p 3000:3000/tcp frontend:dev1
```

## Milestones

#### Week 1
- [x] Formed group

#### Week 2
- [x] Decided on direction we wanted to take the project, created team video

#### Week 3
- [x] Backend has `POST /embedding` route which receives sentences, runs them through BERT, maps the embedding down to 2D using UMAP, and returns the result
- [x] Frontend sends sentences to backend's `POST /embedding` route and displays a scatterplot of the result

#### Week 4
- [x] DistilBERT sentence embeddings collected for full IMDb dataset
- [x] UMAP models with varying hyperparams prefit on these embeddings
- [x] Various improvements to frontend visualization

#### Week 5
- [x] (Javi) Build a pipeline to start working with the [Equity Evaluation Corpus (EEC)](https://saifmohammad.com/WebPages/Biases-SA.html) and retrieve relevant information to fill the masks with. (#1)
- [x] (James) Explore optimal UMAP hyperparams for embedding clustering (#2)
- [x] (Alex) Explore contextual embedding of names associated with differentraces and its relation to emotions (no relation found)

#### Week 6
- [x] (James) Gendered contextual word embeddings [#4]
- [x] (Javi) Explored generic pronouns embeddings for different activities [#5]
- [x] (Alex) Explore mask placement with respect to "he" and "she" pronoun with respect to different emotions and professions. No relation found for different emotions, but found one for different professions.

#### Week 7
- [x] (Javi) Set up Docker [#8]
- [x] (Javi) Exploration of a new latent space [#9]
- [x] (James) Gendered contextual word embeddings in each layer of BERT model [#6]
- [x] (Alex) Final notebook for latent space of contextual embedding [#7]

#### Week 8 (Easter)

#### Week 9
During this week, we created a static dashboard (although we already support interaction between components) to visualize the embeddings generated by a DistilBERT model.
- [x] Sketch definition [#10]
- [x] API spec definition [#11]
- [x] Implementation (ongoing) [#12, #13]
  - [x] (Javi) D3 Plot 
  - [x] (Alex) Interactions
  - [x] (James) Backend

#### Week 10
Mostly all the changes were reported in the same issue #17. Summary of the tasks during this week.
- Sorting for professions (#16). Also the selector is now a radio button to allow the user to select just one profession at a time.
- Code reformatting
  - New component for interactive dashboard (#15)
  - Different components for each of the sections of the report
  - Created queries to backend using the "use" interface from React to render the components only when content was retrieved from backend (to avoid updating several times while loading data)
  - Defined styles
- Report structure defined and template components created. We implemented most of the sections we are planning to have in our report. Text is currently just filled with "lorem ipsum".
- Updated API definition and frontend parsing to improve usability.
- Census dataset was enriched by doubling the number of professions.
- Visualization for "real world data" which presents the color scale that will be used throughout the report and lets the user inspect which is the actual distribution of male/female in real world jobs.
- Gender bias visualization from an statistical point of view. To introduce the user to the problem, we built a scatter plot that displays the probability of "he" and "she" to fill the mask in sentences of the shape "[MASK] is a [PROFESSION]" for all professions in the census dataset and color represents the actual percentage of women. It shows how the model seems to assign probabilities that align with real world data. Also, as we will see through the report, overall males get assigned higher probability (language models tend to think of men when speaking generally).
- Favicon and app name #18

#### Week 11
- (Javi) Updated color map for clearer visualizations.
- (Javi) Included more data in census dataset to get more points.
- (Javi) Improves in component structures
- (Javi) Introduced forces to scatter plot to avoid overlaps.
- (Javi) Applied new color map to interactive tool.
- (Javi) New interactive visualization to represent relative distance of MASK to each pronoun #19
- (Javi) Improved styling in embeddings interactive tool to distinguish between masks and pronouns. Still needs to be improved #20
- (Javi) Adapted HeatMap to display more professions (increased census dataset) #21
- (Alex) Linear regression visualization with interactions to explore correlation of mask placement to demographic data for different settings [#22]

#### Week 12
- (Javi) Included search bar for lists
- (Javi) Improved interaction with scatter plots
- (Javi) Fixed selected profession to be always first in list
- (Javi) Included profession list and interaction in probabilities scatter plot
- (Javi) Fixed labels placing in probabilities scatter plot (no longer out of the plot).

#### Week 13 -> end
During these last weeks, the team focused on improving interaction, writing and fixing minor bugs. Also, we worked on the poster and presentation together. We did not report tasks in detail.

## Versioning
Our project required a lot of work behind the scenes to identify potentially interesting embeddings. We will include new versions whenever we update the application. See issues for the ongoing exploration. For the first weeks, see here the versions for each of the required deliveries.

- Week 1: N/A
- Week 2: N/A
- Week 3: [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/week3)
- Week 4: [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/week4)
- Week 9 (first functional dashboard): [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/week9)
- Week 10 (report structure defined): [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/week10)
- Week 11: [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/week11)
- Poster session: [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/poster-session)
- Final submission: [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/final_submission)
- Cluster deployment: [tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/Contextualized-xai-iml22/-/tags/cluster_deployment)
