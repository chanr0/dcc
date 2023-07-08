import "./styles.scss";
import React, {useEffect, useState} from "react";
import bias from "../imgs/bias.png";
import doctor from "../imgs/doctor.svg";
import nurse from "../imgs/nurse.svg";
import he from "../imgs/he.svg";
import she from "../imgs/she.svg";

import HeatMap from "./HeatMap";
import ProbsScatterPlot from "./ProbsScatterPlot";
import Legend from "./Legend";
import PairBarChart from "./PairBarChart";
import ProfessionList from "./DynamicGenderBias/ProfessionList";
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {deepCopyArray} from "../utils";
import { List, ListItem, ListItemText } from '@mui/material';


interface Props {
}


enum Sort {
    Alphabet = "Alphabet",
    FemaleDominated = "Female dominated",
    MaleDominated = "Male dominated"
}

const BiasLMs: React.FunctionComponent<Props> = ({}: Props) => {

    //const [activeProfession, setActiveProfession] = useState("")
    const [activeCensus, setActiveCensus] = useState(0)
    const [activeHeProb, setActiveHeProb] = useState(0)
    const [activeSheProb, setActiveSheProb] = useState(0)

    const [search, setSearch] = useState("")



    return <section className="mt-6">
        <div className="container-lg max-w-screen-xl position-relative text-lg-start pt-5 pb-5 pt-lg-6">


            <div className="row justify-content-around align-items-center mt-0">
                <h1 className="ls-tight font-bolder display-12 mb-5">Analysis</h1>
                <hr/>
                <p className="mb-3">
                    By interacting with the dashboard ourselves in multiple sessions, we find interesting patterns and DCC instances following those patterns.
                    We find and categorize three high-level features that correlate spuriously with the samples' label, which we name: Semantic Relevance,
                    Logical Fallacies, and Bias.
                </p>
            </div>
            <div className="row justify-content-around align-items-stretch mt-6">
                <div className="col-4">
                    <div className="card p-5" style={{ height: "100%" }}>
                    <p style={{fontSize: "18px", textAlign: "center", color: "black", paddingBottom: "10px"}}>Lexical Overlap</p>
                    <p className="pb-4"><b>Premise</b>: People are walking towards something, and most of them have backpacks.</p>
                    <p className="pb-4"><b>Hypothesis</b>: People are moving towards something that <i>requires</i> the use of a backpack.</p>
                    <p className="pb-4"><b>Label</b>: Neutral, <b>Prediction</b>: Entailment</p>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card p-5" style={{ height: "100%" }}>
                    <p style={{fontSize: "18px", textAlign: "center", color: "black", paddingBottom: "10px"}}>Logical Fallacies</p>
                    <p className="pb-4"><b>Premise</b>: A man wearing <i>only</i> red pants does a trick on a ladder.</p>
                    <p className="pb-4"><b>Hypothesis</b>: The man is wearing a black shirt.</p>
                    <p className="pb-4"><b>Label</b>: Contradiction, <b>Prediction</b>: Neutral</p>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card p-5" style={{ height: "100%" }}>
                    <p style={{fontSize: "18px", textAlign: "center", color: "black", paddingBottom: "10px"}}>Biases</p>
                    <p className="pb-4"><b>Premise</b>: A woman, a man, and a child.</p>
                    <p className="pb-4"><b>Hypothesis</b>: A <i>family</i>.</p>
                    <p className="pb-4"><b>Label</b>: Neutral, <b>Prediction</b>: Entailment</p>
                    </div>
                </div>
            </div>

            <div className="row justify-content-around align-items-center mt-10">
                <h1 className="ls-tight font-bolder display-12 mb-5">Discussion</h1>
                <hr/>
                <p>The visual interactive dashboard for diagnosing spurious correlations and counterfactual generation can open up research opportunities in
                    the following domains:</p>
                    <List>
                        <ListItem>
                            <p> <b>Bi-Directional Explanation of Reasoning Patterns</b>: Our dashboard opens up
                            a possibility for efficient collaboration between humans and AI. AI can help humans to find and
                            group similar structures, whereas humans can explain the reasoning to AI.</p>
                        </ListItem>
                        <ListItem>
                            <p>
                                <b>Diversifying Training Data based on DCCs</b>: Receiving an estimate of the model's
                                understanding of the sample during refinement enables users to understand and pinpoint the
                                patterns that pose a challenge to the model. GPT-3 suggestions assist the user by providing
                                a diverse set of examples following that reasoning pattern, enabling rich counterfactual training data augmentation.
                            </p>
                        </ListItem>
                        <ListItem>
                            <p>
                                <b>Towards more Robust NLI Models</b>: The counterfactual samples generated using our dashboard can be used
                                as adversarial test suites for evaluating existing models. Initial small test sets gathered as a proof-of-concept,
                                indicate to be promising, i.e., indicate to be challenging even for adversarially trained models. A thorough investigation is part of ongoing and future work.
                            </p>
                        </ListItem>
                        </List>
            </div>
</div>
    </section>
};

export default BiasLMs;