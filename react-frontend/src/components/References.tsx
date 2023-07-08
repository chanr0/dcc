import "./styles.scss";
import React from "react";
import bias from "../imgs/bias.jpg";

const References = () => {
    return <section className="mt-6">
        {/* <!-- Content --> */}
        <div
            className="container-lg max-w-screen-xl position-relative text-lg-start mt-3 mb-20">
            <hr className="mt-16 mb-7" style={{height: "1px", color: "#000000"}}/>
            <h1 className="text-md mb-4">Acknowledgments</h1>
            <p className="text-sm mb-0">We would like to thank Frederic Boesel and Steven H. Wang for their support in the initial stages of the project, and
                Anej Svete for his helpful comments on the final version of the paper.
                Further, we would like to thank Javier Rando for his support with building this blog post, and Javier Sanguino for his help with the app deployment.
                </p>
            <p className="text-sm mb-6">This work was funded by the ETH AI center. 
                </p>
            <h1 className="text-md mb-4">References</h1>
                    <p className="text-sm mb-2"><a href={"https://aclanthology.org/D15-1075.pdf"} >{"Bowman et al. \"A large annotated corpus for learning natural language inference\" (2015)."}</a></p>
                    <p className="text-sm mb-2"><a href={"https://aclanthology.org/D17-1215.pdf"} className="text-sm mb-2">{"Jia and Liang \"Adversarial Examples for Evaluating Reading Comprehension System\" (2017)."}</a></p>
                    <p className="text-sm mb-2"><a href={"https://aclanthology.org/P19-1334.pdf"} className="text-sm mb-2">{"McCoy et al. \"Right for the Wrong Reasons: Diagnosing Syntactic Heuristics in Natural Language Inference\" (2019)."}</a></p>
                    <p className="text-sm mb-2"><a href={"https://aclanthology.org/2020.emnlp-main.746.pdf"} className="text-sm mb-2">{"Swayamdipta et al. \"Dataset Cartography: Mapping and Diagnosing Datasets with Training Dynamics\" (2020)."}</a></p>
                    <p className="text-sm mb-2"><a href={"https://aclanthology.org/2021.emnlp-main.135.pdf"} className="text-sm mb-2">{"Gardner et al. \"Competency Problems: On Finding and Removing Artifacts in Language Data\" (2021)."}</a></p>
                    <p className="text-sm mb-2"><a href={"https://aclanthology.org/2021.acl-long.523.pdf"} className="text-sm mb-2">{"Wu et al. \"Polyjuice: Generating Counterfactualsfor Explaining, Evaluating, and Improving Models\" (2021)."}</a></p>

                    {/* <p className="text-sm mb-2">{"Gupta, Umang, et al. \"Mitigating Gender Bias in Distilled Language Models via Counterfactual Role Reversal.\" arXiv preprint arXiv:2203.12574 (2022)."}</p>
                    <p className="text-sm mb-2">{"Devlin, Jacob, et al. \"Bert: Pre-training of deep bidirectional transformers for language understanding.\" arXiv preprint arXiv:1810.04805 (2018)."}</p>
                    <p className="text-sm mb-2">{"Bolukbasi, Tolga, et al. \"Man is to computer programmer as woman is to homemaker? debiasing word embeddings.\" Advances in neural information processing systems 29 (2016)"}</p>
                    <p className="text-sm mb-2">{"Vaswani, Ashish, et al. \"Attention is all you need.\" Advances in neural information processing systems 30 (2017)."}</p>
                    <p className="text-sm mb-2">{"Brown, Tom, et al. \"Language models are few-shot learners.\" Advances in neural information processing systems 33 (2020): 1877-1901."}</p>
                    <p className="text-sm mb-2">{"Liang, Paul Pu, et al. \"Towards understanding and mitigating social biases in language models.\" International Conference on Machine Learning. PMLR, 2021."}</p>
                    <p className="text-sm mb-2">{"European Parliament. \"Recent trends in female employment\""}</p>
                    <p className="text-sm mb-2">{"Swinger, Nathaniel, et al. . \"What are the biases in word embeddings?\"In Proceedings of the 2019 AAAI/ACM Conference on AI, Ethics, and Society, pages 305–311, 2019"}</p>
                    <p className="text-sm mb-2">{"Pearce, A. \"What have language models learned?\" In VISxAI 2021"}</p> */}
        </div>
    </section>
};

export default References;