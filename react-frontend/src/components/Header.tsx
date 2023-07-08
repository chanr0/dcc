import "./styles.scss";
import Button from "@mui/material/Button";

const Header = () => {
    return <section className="position-relative pt-20 pb-20 bg-cover bg-size--cover header-background">
        {/* Overlay */}
        <span className="position-absolute top-0 start-0 w-full h-full bg-black opacity-40"></span>
        {/* <!-- Content --> */}
        <div
            className="container-lg max-w-screen-xl position-relative overlap-10 text-center text-lg-center pt-3 pb-12 pt-lg-4">
            {/* <div>
                <Button style={{
                            background: 'transparent',
                            color: 'white',
                            border: '1px solid black',
                            outline: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            marginTop: 0,
                            marginBottom: 20,
                            width: 150,
                            alignContent: ''
                        }}>
                        Dashboard
                    </Button>
            </div> */}
            <div className="row row-grid align-items-center">
                <div className="col-lg-15 text-center text-lg-center">
                    <h1 className="ls-tight font-bolder display-6 text-white mb-4">
                        Which Spurious Correlations Affect Reasoning in NLI Models?
                    </h1>
                    <p className="lead text-white text-opacity-80">
                    A Visual Interactive Diagnosis through <i>Data-Constrained Counterfactuals</i>.
                    </p>
                    {/* <p className="text-white mt-4 text-s mb-0 w-lg-2/3"> */}
                    <p className="text-white mt-7">
                       Robin Chan<sup>1</sup>, Afra Amini<sup>1,2</sup>, Mennatallah El-Assady<sup>1,2</sup>
                    </p>
                    {/* <p className="text-white mt-0 text-s mb-0 w-lg-2/3"> */}
                    <p className="text-white">

                       <sup>1</sup> ETH Zürich, <sup>2</sup> ETH AI Center
                    </p>
                    {/* <p className="text-white mt-4 text-s mb-10 col-lg-5"> */}
                    <p className="text-white">
                       {/* In <i>Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics: System Demonstrations</i>, 2023. Toronto, CA. */}
                       In <i>Proceedings of ACL 2023: System Demonstrations.</i> Toronto, CA.
                    </p>
                </div>
            </div>
        </div>
    </section>
};

export default Header;