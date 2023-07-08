import "./styles.scss";
import { List, ListItem, ListItemText } from '@mui/material';

const Disucssion = () => {

    return <section className="mt-6">
        {/* <!-- Content --> */}
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
    </section>
};

export default Disucssion;