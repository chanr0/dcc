import React, {useEffect, useState} from 'react';
import queryBackend from '../../backend/BackendQueryEngine';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import BuildIcon from '@mui/icons-material/Build';
import {
    Checkbox,
    FormControl,
    InputLabel,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Slider,
    TextField,
    Radio
} from '@mui/material';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import {capitalize, deepCopyArray} from "../../utils";
import LinePlot from "./LinePlot";
import ProfessionList from "./ProfessionList";
import onBoarding from "../../imgs/onBoardingLine.png";
import legend from "../../imgs/legendLine.png";
import summary from "../../imgs/linessummary.png";

interface Props {
    embeddings: any[];
    allLayers: number[];
    allAlgorithms: string[];
    profession: string;
}

enum Sort {
    Alphabet = "Alphabet",
    FemaleDominated = "Female dominated first",
    MaleDominated = "Male dominated first"
}

// DynamicGenderBiasTab shows the male and female cluster as well as the masks. The user can interact with he visualization
const DynamicLineGenderBias: React.FunctionComponent<Props> = ({embeddings, allLayers, allAlgorithms, profession}: Props) => {

    // Selectors
    const [activeLayer, setActiveLayer] = useState<number>(0);
    const [activeAlgorithm, setActiveAlgorithm] = useState<string>(allAlgorithms[allAlgorithms.length - 3]);
    const [allProfessions, setAllProfessions] = useState([]);
    const [activeProfessions, setActiveProfessions] = useState([]);

    // Sorting
    const [sort, setSort] = useState<string>(Sort.FemaleDominated);
    const [sortedEmbeddings, setSortedEmbeddings] = useState(embeddings);
    const [uniqueEmbeddings, setUniqueEmbeddings] = useState([]);

    const [plotSort, setPlotSort] = useState<string>(Sort.FemaleDominated);
    const [showPreview, setShowPreview] = useState<boolean>(true);

    const [search, setSearch] = useState<string>("");

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
        }
        const uniqueEmb = embeddings.filter((value, index, self) => self.map(x => x.profession).indexOf(value.profession) === index);
        let allProf = uniqueEmb.map((item) => item.profession).filter((item, i, ar) => ar.indexOf(item) === i);
        setUniqueEmbeddings(deepCopyArray(uniqueEmb));
        setAllProfessions(allProf);
        setActiveProfessions(["hairdresser", "receptionist", "dietitian", "housekeeper", "cleaner", "maid", "therapist", "nurse", "manicurist",
            "teacher", "cashier", "tutor", "artist", "cook", "architect", "composer", "surgeon", "butcher",
            "police", "mechanic", "carpenter", "builder", "plumber", "electrician", "chef", "dishwasher"])
    }, [embeddings]);


    function handleToggle(profession: string) {
        // Remove if included
        if (activeProfessions.includes(profession)) {
            setActiveProfessions(deepCopyArray(activeProfessions.filter(p => p != profession)))
        } else {
            setActiveProfessions(deepCopyArray([...activeProfessions, profession]));
        }
    };

    function renameAlgo(algorithm: string) {
        if (algorithm.toLowerCase().includes("umap")) {
            let split = algorithm.split("-", 2)
            return `${split[0].toUpperCase()} (num. neighbors = ${split[1]})`
        }
        return algorithm
    }

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
                                dHe: entry['pronoun'] === "mask" ? entry[distanceKey][layer]['distance_he'] : null,
                                dShe: entry['pronoun'] === "mask" ? entry[distanceKey][layer]['distance_she'] : null
                            }]
                        })
                    }
                })
            }).flat(Infinity).filter(d => d));
        }
    }, [embeddings]);

    return (
        <>
            <div className="container-lg max-w-screen-xl position-relative pb-5">
                <h4 className="ls-tight font-bolder mb-5 text-xl">Comparing mask positioning on a common scale</h4>
                <p className={"mb-3"}>To carefully explore the relative distance between the [MASK] and pronouns in the
                    embedding space, we have built a visualization that brings all professions to a common scale.
                    Each circle now represents the embedding for [MASK] in a sentence of the shape "<span
                        className={"font-code"}>[MASK] is a profession</span>".
                    Their position indicates the relative distance to embeddings for "he" and "she" of the same
                    profession (vertical lines).
                </p>
                <div className={"row"}>
                    <div className={"col"}>
                        <p className={"mb-3"}>Circles close
                            to the blue vertical line indicate professions for which the [MASK] embedding is closer to "he" than "she". 
                            This allows us to quickly identify for which professions the [MASK] embedding gets close to a given pronoun.
                            Color represents, as before, the percentage of people identifying as women that occupy those
                            positions.
                        </p>
                        <p className={"mb-3"}>
                            Results show a potential correlation between real-world distribution and where the LM places the masked embedding. However, there exist outliers which are also interesting to explore.
                            We can see, for instance, the embeddings for "cook" and "chef" being close to "she" even when though these professions are male dominated in the real-world. We hypothesize that
                            there are other factors at play that influence the placement of the mask, such as stereotypes, since these two professions are closely related to cooking which is an activity historically linked to women.
                        </p>
                    </div>

                    <div className={"col mt-1"}>
                        <div className="card">
                            <div className="p-2">
                                <img alt="..."
                                     src={summary}
                                     style={{imageRendering: "-webkit-optimize-contrast", width: "100%"}}/>
                            </div>
                        </div>
                    </div>
                </div>

                <p className={"mt-6 font-bolder"}>Explore the visualization yourself</p>
            </div>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}} className={"d-flex justify-content-center"}>
                <Grid container spacing={2} style={{height: "100%", minHeight: "100%", maxWidth: "1500px"}}>
                    <Grid item xs={4}>
                        <Card sx={{height: "100%"}}>
                            <CardContent style={{height: "100%"}}>
                                {showPreview &&
                                <div className={"d-flex flex-wrap align-content-center p-6"} style={{height: "100%"}}>
                                    <h3>This is just a preview!</h3>
                                    <p className={"ls-tight mt-3 mb-3"}>Make sure you understand each of the elements in
                                        the plot before enabling the interaction.</p>

                                    <div onClick={() => setShowPreview(false)}
                                         className="btn d-inline-flex btn-primary">
                                        <span>Enable interaction</span>
                                    </div>
                                </div>}
                                {!showPreview && <>
                                    <div style={{paddingRight: "1em", paddingLeft: "1em", paddingTop: "1em"}}>
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
                                        <TextField id="outlined-basic" label="Search" variant="outlined" size={"small"}
                                                   sx={{marginTop: 2, marginBottom: 1, marginLeft: 1}}
                                                   onChange={t => setSearch(t.target.value)} placeholder={"Search..."}
                                                   value={search}/>
                                        <ProfessionList embeddings={sortedEmbeddings} selected={activeProfessions}
                                                        handleToggle={handleToggle} search={search} referenceProfession={profession}/>
                                    </div>
                                    <Divider variant="fullWidth" sx={{marginBottom: 2}}/>
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
                                                value={activeLayer}
                                                onChange={(_, newValue: number) => setActiveLayer(newValue)}
                                            />
                                        </div>
                                    </div>
                                    <Divider variant="fullWidth" style={{marginTop: 10, marginBottom: 20}}/>
                                    <div style={{paddingRight: "1em", paddingLeft: "1em"}}>
                                        <h5 className={"text-md"} style={{paddingBottom: "1em"}}>Select projection</h5>
                                        {allAlgorithms.length > 0 && <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Projection</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={activeAlgorithm}
                                                label="Algorithm"
                                                onChange={(event) => setActiveAlgorithm(event.target.value)}
                                            >
                                                {allAlgorithms.map((algo) =>
                                                    <MenuItem
                                                        value={algo}>{algo.toLowerCase().includes("umap") ? renameAlgo(algo) : algo.toUpperCase()}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>}
                                    </div>
                                    <Divider variant="fullWidth" style={{marginTop: 20, marginBottom: 20}}/>
                                    <div style={{paddingRight: "1em", paddingLeft: "1em"}}>
                                        <h5 className={"text-md"} style={{paddingBottom: "1em"}}>Select plotting
                                            order</h5>
                                        {allAlgorithms.length > 0 && <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Plotting order</InputLabel>
                                            <Select
                                                labelId="id"
                                                id="id2"
                                                value={plotSort}
                                                label="Plotting order"
                                                onChange={(event) => setPlotSort(event.target.value)}
                                            >
                                                <MenuItem value={Sort.Alphabet} id={Sort.Alphabet}>Alphabet</MenuItem>
                                                <MenuItem value={Sort.FemaleDominated} id={Sort.FemaleDominated}>Female
                                                    dominated</MenuItem>
                                                <MenuItem value={Sort.MaleDominated} id={Sort.MaleDominated}>Male
                                                    dominated</MenuItem>

                                            </Select>
                                        </FormControl>}
                                    </div>
                                </>}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={8}>
                        <Card sx={{height: "fit-content", minHeight: "100%", "overflow": "visible"}}>
                            <CardContent sx={{height: "fit-content", "overflow": "visible"}}>
                                {showPreview && <div><img alt="..."
                                                          src={onBoarding}
                                                          style={{imageRendering: "-webkit-optimize-contrast"}}/></div>}
                                {!showPreview && <div>
                                    <img src={legend}
                                         style={{imageRendering: "-webkit-optimize-contrast", width: "100%"}}/>
                                    <hr/>
                                    <LinePlot data={dataReady}
                                              activeProfessions={activeProfessions}
                                              activeLayer={activeLayer}
                                              activeAlgorithm={activeAlgorithm}
                                              sort={plotSort}
                                              profession={profession}/></div>}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </>
    )
        ;
}

export default DynamicLineGenderBias;
