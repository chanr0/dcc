import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import BuildIcon from '@mui/icons-material/Build';
import {FormControl, InputLabel, MenuItem, Select, Slider, TextField} from '@mui/material';
import Divider from '@mui/material/Divider';
import {deepCopyArray} from "../../utils";
import ScatterPlot from "./ScatterPlot";
import ProfessionList from "./ProfessionList";
import onBoarding from "../../imgs/scatterOnBoarding.png";
import legend from "../../imgs/legendScatter.png";
import engineer from "../../imgs/engineer.png";
import layers from "../../imgs/low_layers.png";
import bias from "../../imgs/bias.png";

interface Props {
    embeddings: any[];
    allLayers: number[];
    allAlgorithms: string[];
    profession: string;
    setProfession: (value: string) => void;
}

enum Sort {
    Alphabet = "Alphabet",
    FemaleDominated = "Female dominated",
    MaleDominated = "Male dominated"
}

// DynamicGenderBiasTab shows the male and female cluster as well as the masks. The user can interact with he visualization
const DynamicGenderBias: React.FunctionComponent<Props> = ({embeddings, allLayers, allAlgorithms, profession, setProfession}: Props) => {

    // Selectors
    const [activeLayer, setActiveLayer] = useState<number>(0);
    const [activeAlgorithm, setActiveAlgorithm] = useState<string>(allAlgorithms[allAlgorithms.length - 3]);
    const [sort, setSort] = useState<string>(Sort.Alphabet);
    const [sortedEmbeddings, setSortedEmbeddings] = useState(embeddings);
    const [uniqueEmbeddings, setUniqueEmbeddings] = useState([]);

    const [showPreview, setShowPreview] = useState(true);
    const [search, setSearch] = useState("");

    function handleSelection(prof) {
        setProfession(prof);
    }

    useEffect(() => {
        if (sort === Sort.Alphabet) {
            setSortedEmbeddings(deepCopyArray(uniqueEmbeddings.sort((a, b) => a.profession.localeCompare(b.profession))));
        } else if (sort === Sort.FemaleDominated) {
            setSortedEmbeddings(deepCopyArray(uniqueEmbeddings.sort((a, b) => a.profession.localeCompare(b.profession)).sort((a: any, b: any) => {
                if (a.census === b.census) {
                    return 0;
                }
                return a.census > b.census ? -1 : 1;
            })));
        } else if (sort === Sort.MaleDominated) {
            setSortedEmbeddings(deepCopyArray(uniqueEmbeddings.sort((a, b) => a.profession.localeCompare(b.profession)).sort((a: any, b: any) => {
                if (a.census === b.census) {
                    return 0;
                }
                return a.census < b.census ? -1 : 1;
            })));
        }

    }, [uniqueEmbeddings, sort]);


    useEffect(() => {
        if (embeddings.length > 0) {
            setActiveLayer(allLayers[allLayers.length - 1]);
            setLayerSlider(allLayers[allLayers.length - 1]);
        }
        const uniqueEmb = embeddings.filter((value, index, self) => self.map(x => x.profession).indexOf(value.profession) === index);
        setUniqueEmbeddings(deepCopyArray(uniqueEmb));
    }, [embeddings]);

    const [dataReady, setDataReady] = useState([]);

    useEffect(() => {
        if (embeddings.length > 0) {
            setDataReady(embeddings.map(function (entry) {
                return Object.keys(entry).map(function (d) {
                    if (allAlgorithms.includes(d)) {
                        const algo = d;
                        return Object.keys(entry[d]).map(function (layer) {
                            let distanceKey = algo + "-distance";
                            return [{
                                algorithm: algo,
                                layer: parseInt(layer),
                                profession: entry['profession'],
                                census: entry['census'],
                                pronoun: entry['pronoun'],
                                x: entry[d][layer]['x'],
                                y: entry[d][layer]['y'],
                                dHe: entry['pronoun'] === "mask" ? entry[distanceKey]['distance_he'] : null,
                                dShe: entry['pronoun'] === "mask" ? entry[distanceKey]['distance_she'] : null
                            }]
                        })
                    }
                })
            }).flat(Infinity).filter(d => d));
        }
    }, [embeddings]);

    function renameAlgo(algorithm: string) {
        if (algorithm.toLowerCase().includes("umap")) {
            let split = algorithm.split("-", 2)
            return `${split[0].toUpperCase()} (num. neighbors = ${split[1]})`
        }
        return algorithm
    }

    // Used to change layer at the end of interaction
    const [layerSlider, setLayerSlider] = useState(activeLayer);

    return (
        <>
            <div className="container-lg max-w-screen-xl position-relative pt-5 pb-5 pt-lg-6"
                 style={{}}>
                <h4 className="ls-tight font-bolder mb-5 text-xl">Latent Space Exploration</h4>
                <p className={"mb-3"}>Now, it is time to explore the latent space generated by a language model at a given layer
                    using different projection algorithms. We created different sentences of the shape "[MASK/HE/SHE] is a [PROFESSION]"
                    for all professions in our groundtruth. Then, we project the contextualized embeddings for [MASK/HE/SHE] to 2D.</p>
                <p className={"mb-3"}> The model will create an embedding for [MASK] that represents its beliefs about the missing word. Thus,
                    <strong> we are interested in exploring where [MASK] is placed with respect to the pronouns </strong>
                    because distance is representative of similarity in this contextualized space. Are masks for professions dominated by females mapped closer to embeddings for the word "she"?</p>
                <p>
                    Crosses (+) represent the embeddings for "he" and "she", and circles
                    (·) display the contextualized representation for [MASK]. Color for mask embeddings represents, as throughout the whole analysis, the percentage of people
                    identifying
                    as women that occupy those positions. You can use the right sidebar to filter and interact with
                    the plotted data.</p>

                <div className="row mt-5" style={{}}>

                    <div className={"col"}>
                        <div className="card">
                            <div className="p-2">
                                <img alt="..."
                                     src={engineer}
                                     style={{imageRendering: "-webkit-optimize-contrast", width: "100%"}}/>
                            </div>
                            <div className="card-body" style={{paddingTop: "0px"}}>
                                <p className="text-xs">
                                    Distance between the [MASK] and pronouns encodes the model's beliefs about gender. In this example, for engineer (17% females in groundtruth)
                                    the [MASK] token gets mapped close to the pronoun "he", indicating the model thinks a man is more likely to work as an engineer.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={"col"}>
                        <div className="card">
                            <div className="p-2">
                                <img alt="..."
                                     src={layers}
                                     style={{imageRendering: "-webkit-optimize-contrast", width: "100%"}}/>
                            </div>
                            <div className="card-body" style={{paddingTop: "0px"}}>
                                <p className="text-xs">
                                    Our work also provides insights on how gender is encoded in LMs for different layers. For all internal layers, the [MASK] obtains an embedding
                                    very close to "he", indicating the model thinks generally in masculine. It is only in the last layer where the model encodes its beliefs about gender.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className={"mt-6 font-bolder"}>Explore the latent space yourself</p>

            </div>

            <div style={{paddingLeft: "10px", paddingRight: "10px"}} className={"d-flex justify-content-center"}>
            <Grid container spacing={2} style={{height: "100%", maxWidth: "1500px"}}>
                <Grid item xs={4}>
                    <Card sx={{height: "fit-content", minHeight: "100%", "overflow": "visible"}}>
                        <CardContent style={{height: "100%"}}>
                            {showPreview && <div className={"d-flex flex-wrap align-content-center p-6"} style={{height: "100%"}}>
                                <h3>This is just a preview!</h3>
                                <p className={"ls-tight mt-3 mb-3"}>Make sure you understand each of the elements in the plot before enabling the interaction.</p>

                                <div onClick={() => setShowPreview(false)} className="btn d-inline-flex btn-primary">
                                    <span>Enable interaction</span>
                                </div>
                            </div>}
                            {!showPreview && <><div style={{paddingRight: "1em", paddingLeft: "1em", paddingTop: "1em"}}>
                                <h5 className={"text-md"}>Select professions</h5>
                                <FormControl size="small" sx={{paddingTop: 2, paddingBottom: 1}}>
                                    <InputLabel id="id2" sx={{paddingTop: 3}}>Sort by</InputLabel>
                                    <Select
                                        labelId="id"
                                        id="id2"
                                        value={sort}
                                        label="Sort by"
                                        onChange={(event) => setSort(event.target.value)}
                                    >
                                        <MenuItem value={Sort.Alphabet} id={Sort.Alphabet}>Alphabet</MenuItem>
                                        <MenuItem value={Sort.FemaleDominated} id={Sort.FemaleDominated}>Female
                                            dominated</MenuItem>
                                        <MenuItem value={Sort.MaleDominated} id={Sort.MaleDominated}>Male
                                            dominated</MenuItem>

                                    </Select>
                                </FormControl>
                                <TextField id="outlined-basic" label="Search" variant="outlined" size={"small"}  sx={{marginTop: 2, marginBottom: 1, marginLeft: 1}} onChange={t => setSearch(t.target.value)} placeholder={"Search..."} value={search}/>
                                <ProfessionList embeddings={sortedEmbeddings} selected={profession}
                                                handleToggle={handleSelection} height={250} search={search}/>
                            </div>
                                <Divider variant="fullWidth" sx={{marginBottom: 2}}/>
                            {/*<div style={{paddingRight: "1em", paddingLeft: "1em"}}>
                            <TextField id="outlined-basic" label="Enter a custom profession" variant="outlined"/>
                            <Divider variant="fullWidth" sx={{marginBottom: 2}}/>
                        </div>*/}
                                <div style={{paddingRight: "1em", paddingLeft: "1em"}}>
                                <h5 className={"text-md"}>Select language model layer</h5>
                                <div style={{marginLeft: 1, marginRight: 1}}>
                                <Slider
                                aria-label="Restricted values"
                                defaultValue={0}
                                min={allLayers ? Math.min(...allLayers) : 0}
                                max={allLayers ? Math.max(...allLayers) : 0}
                                valueLabelDisplay="auto"
                                step={1}
                                marks={true}
                                value={layerSlider}
                                onChange={(_, newLayer: number) => setLayerSlider(newLayer)}
                                onChangeCommitted={() => setActiveLayer(layerSlider)}
                                />
                                </div>
                                </div>
                                <Divider variant="fullWidth" style={{marginTop: 10, marginBottom: 20}}/>
                                <div style={{paddingRight: "1em", paddingLeft: "1em"}}>
                                <h5 className={"text-md"} style={{paddingBottom: "1em"}}>Select projection</h5>
                            {allAlgorithms.length && <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Algorithm</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={activeAlgorithm}
                                label="Algorithm"
                                onChange={(event) => setActiveAlgorithm(event.target.value)}
                                >
                            {allAlgorithms.map((algo) =>
                                <MenuItem value={algo}>{algo.toLowerCase().includes("umap") ? renameAlgo(algo) : algo.toUpperCase()}</MenuItem>)
                            }
                                </Select>
                                </FormControl>}
                                </div></>}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={8}>
                    <Card sx={{height: "fit-content", minHeight: "100%", "overflow": "visible"}}>
                        <CardContent sx={{height: "100%"}}>
                            {showPreview && <div style={{height: "100%", width: "100%"}}><img alt="..."
                                                 src={onBoarding}
                                                 style={{imageRendering: "-webkit-optimize-contrast", width: "100%"}}/></div>}
                            {!showPreview && <div>
                                <img src={legend} style={{imageRendering: "-webkit-optimize-contrast", width: "100%"}}/>
                                <hr/>
                                 <ScatterPlot data={dataReady}
                                          activeProfession={profession}
                                          setActiveProfession={setProfession}
                                          activeLayer={activeLayer}
                                          activeAlgorithm={activeAlgorithm}/>
                            </div>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
                </div>
            <div className="container-lg max-w-screen-xl position-relative pt-5 pb-5 pt-lg-6"
                 style={{}}><p className={"mb-3 mt-3 font-bolder"}>How to interpret the plot</p>
            <p className={"mb-3"}>
                There are two distinct clusters for the male and female pronoun (take a look to yellow and blue
                crosses). The masks form an interesting spectrum between these two clusters.
                Does proximity to clusters relate with real-world occupation statistics?
                By changing the layer, you can see that DistilBERT maps all masks to the male pronoun for lower
                layers, and it is only in the very last layer that it encodes gender and spreads out the masks
                between the male and female cluster.
            </p></div></>

    );
}

export default DynamicGenderBias;
