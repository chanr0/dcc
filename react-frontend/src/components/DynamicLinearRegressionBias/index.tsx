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
import { forEachChild } from 'typescript';
import {calculateCluster, distance, calculateMetric} from "./utils"

interface Props {
    embeddings: any[];
    allLayers: number[];
    allAlgorithms: string[];
    allProfessions: string[];
}

enum Sort {
    Alphabet = "Alphabet",
    FemaleDominated = "Female dominated",
    MaleDominated = "Male dominated"
}

// DynamicGenderBiasTab shows the male and female cluster as well as the masks. The user can interact with he visualization
const DynamicLinearRegressionBias: React.FunctionComponent<Props> = ({embeddings, allLayers, allAlgorithms, allProfessions}: Props) => {

    // Selectors
    const [activeProfession, setActiveProfession] = useState("engineer");
    const [activeLayer, setActiveLayer] = useState<number>(0);
    const [activeAlgorithm, setActiveAlgorithm] = useState<string>(allAlgorithms[allAlgorithms.length - 1]);
    const [sort, setSort] = useState<string>(Sort.Alphabet);
    const [sortedEmbeddings, setSortedEmbeddings] = useState(embeddings);
    const [uniqueEmbeddings, setUniqueEmbeddings] = useState([]);
    const [femaleClusterCenter, setFemaleClusterCenter] = useState({});
    const [maleClusterCenter, setMaleClusterCenter] = useState({});

    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        let temp = {};
        allAlgorithms.forEach((algo) => {
            temp[algo] = {};
            allLayers.forEach((layer) => {
                temp[algo][layer] = {};
            })
        });
        setFemaleClusterCenter(temp);
        setMaleClusterCenter(deepCopyArray(temp));
    }, []);

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
            let femClusterTemp = {};
            let maleClusterTemp = {};

            let he_coords = {};
            let she_coords = {};
            allAlgorithms.forEach((algo) => {
                he_coords[algo] = {};
                she_coords[algo] = {};
                femClusterTemp[algo] = {};
                maleClusterTemp[algo] = {};
                allLayers.forEach((layer) => {
                    he_coords[algo][layer] = [];
                    she_coords[algo][layer] = [];
                    femClusterTemp[algo][layer] = {};
                    maleClusterTemp[algo][layer] = {};
                });
            });

            embeddings.forEach((embedding) => {
                const pronoun = embedding["pronoun"];

                if (pronoun === "he") {
                    allAlgorithms.forEach((algo) => allLayers.forEach((layer) => {
                        he_coords[algo][layer].push(embedding[algo][layer]);
                    }));
                } else if (pronoun === "she") {
                    console.log("Went in here");
                    allAlgorithms.forEach((algo) => allLayers.forEach((layer) => {
                        she_coords[algo][layer].push(embedding[algo][layer]);
                    }));
                }
            })
            allAlgorithms.forEach((algo) => allLayers.forEach((layer) => {
                femClusterTemp[algo][layer] = calculateCluster(she_coords[algo][layer]);
                maleClusterTemp[algo][layer] = calculateCluster(he_coords[algo][layer]);
            }));
            setFemaleClusterCenter(femClusterTemp);
            setMaleClusterCenter(maleClusterTemp);
        }
    }, [embeddings]);
    console.log("maleCluster: ", maleClusterCenter);
    console.log("femaleCluster: ", femaleClusterCenter);

    useEffect(() => {
        if (embeddings.length > 0) {
            setActiveLayer(allLayers[allLayers.length - 1]);
        }
        const uniqueEmb = embeddings.filter((value, index, self) => self.map(x => x.profession).indexOf(value.profession) === index);
        setUniqueEmbeddings(deepCopyArray(uniqueEmb));
    }, [embeddings]);

    const [dataReady, setDataReady] = useState({});

    useEffect(() => {
        let dataReadyTemp = {};
        if (embeddings.length > 0 && Object.keys(femaleClusterCenter).length !== 0 && Object.keys(maleClusterCenter).length !== 0) {
            allAlgorithms.forEach((algo) => {
                dataReadyTemp[algo] = {};
                allLayers.forEach((layer) => {
                    dataReadyTemp[algo][layer] = [];
                    allProfessions.forEach((prof) => {
                        dataReadyTemp[algo][layer].push({"profession": prof, "census": null, "he": {x: null, y: null}, "she": {x: null, y: null}, "mask": {x: null, y: null}, "metric": null});
                    })
                })
            });
            embeddings.forEach((embedding) => {
                allAlgorithms.forEach((algo) => {
                    allLayers.forEach((layer) => {
                        const found = dataReadyTemp[algo][layer].findIndex(element => element["profession"] === embedding["profession"]);
                        dataReadyTemp[algo][layer][found][embedding["pronoun"]] = embedding[algo][layer];
                        //dataReadyTemp[algo][layer][embedding["profession"]][embedding["pronoun"]] = embedding[algo][layer];
                        dataReadyTemp[algo][layer][found]["census"] = embedding["census"];
                    })
                });
            });
            allAlgorithms.forEach((algo) => allLayers.forEach((layer) => 
                dataReadyTemp[algo][layer].forEach(element => element["metric"] = calculateMetric(element["he"], element["she"], element["mask"])))); // Can exchange this for he and she
            setDataReady(dataReadyTemp);
        }
    }, [embeddings, maleClusterCenter, femaleClusterCenter]);

    return (
        <>
            <div className="container-lg max-w-screen-xl position-relative pt-5 pb-5 pt-lg-6"
                 style={{textAlign: "center"}}>
                <h1 className="ls-tight font-bolder display-6 mb-5">Linear Regression between Occupation Participation and Mask Placement (WORK IN PROGRESS)</h1>
                <p>The following visualization lets you explore the correlation between the percentage of women within an occupation (x-axis) and the normalized distance of the mask to the female pronoun (y-axis).
                    TODO: Make the plot more visually appealing, choose gender neutral color for the dots, add regression line and show r2 value.
                </p>
            </div>
            <Grid container spacing={2} style={{height: "100%", paddingLeft: 10, paddingRight: 10}}>
                <Grid item xs={4}>
                    <Card sx={{height: "40em"}}>
                        <CardContent style={{height: "100%"}}>
                            {<><div style={{paddingRight: "1em", paddingLeft: "1em", paddingTop: "1em"}}>
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
                                <ProfessionList embeddings={sortedEmbeddings} selected={activeProfession}
                                                handleToggle={setActiveProfession}/>
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
                                value={activeLayer}
                                onChange={(_, newValue: number) => setActiveLayer(newValue)}
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
                                <MenuItem value={algo}>{algo.toUpperCase()}</MenuItem>)
                            }
                                </Select>
                                </FormControl>}
                                </div></>}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={8}>
                    <Card sx={{height: "40em"}}>
                        <CardContent sx={{height: "100%"}}>
                            {Object.keys(dataReady).length !== 0 && <ScatterPlot data={dataReady[activeAlgorithm][activeLayer]}
                                          maleCluster={maleClusterCenter[activeAlgorithm][activeLayer]}
                                          femaleCluster={femaleClusterCenter[activeAlgorithm][activeLayer]}
                                          activeProfession={activeProfession}
                                          setActiveProfession={setActiveProfession}
                                          activeLayer={activeLayer}
                        activeAlgorithm={activeAlgorithm}/>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid></>
    );
}

export default DynamicLinearRegressionBias;