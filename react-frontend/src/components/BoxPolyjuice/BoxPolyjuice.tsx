// import {v4 as uuidv4} from 'uuid';
// import * as uuid from 'uuid/v4';
import { v4 as uuid } from 'uuid';

import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import Container from '@mui/material/Container';
import {
    MenuItem,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import {queryBackendStr} from "../../backend/BackendQueryEngine";

import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AnyMxRecord } from 'dns';
import { NLIDataArray } from '../../components/types/NLIDataArray';

import { submitData } from '../../backend/BackendQueryEngine';


interface Props {
    data: NLIDataArray;
    suggestion: string[];
    count: number;
    setCount: any;
    decrCount: any;
    decrCountMore: any;
    incrCount: any;
    incrCountMore: any;
    premiseAnnotation: any;
    setPremiseAnnotation: any;
    hypothesisAnnotation: string;
    setHypothesisAnnotation: any;
    robertaLabel: string;
    setRobertaLabel: any;
    datamapEstimate: number[];
    setDatamapEstimate: any;
    nnCount: number;
    setNNCount: any;
    queryingNNCount: number;
    setQNNCount: any;
    cflabel: string;
    setcflabel: any;
    // mode: string;
    // UpdateLabeled: any;
    UpdateLabeledOld: any;
}


const BoxPolyjuice: React.FunctionComponent<Props> = ({ 
                                                          data,
                                                          suggestion,
                                                          count,
                                                          setCount,
                                                          decrCount,
                                                          decrCountMore,
                                                          incrCount,
                                                          incrCountMore,
                                                          premiseAnnotation,
                                                          setPremiseAnnotation,
                                                          hypothesisAnnotation,
                                                          setHypothesisAnnotation,
                                                          robertaLabel,
                                                          setRobertaLabel,
                                                          datamapEstimate,
                                                          setDatamapEstimate,
                                                          nnCount,
                                                          setNNCount,
                                                          queryingNNCount,
                                                          setQNNCount,
                                                          cflabel,
                                                          setcflabel,

                                                        //   mode,
                                                        //   UpdateLabeled,
                                                          UpdateLabeledOld,
                                                      }: Props) => {


    const textArea = useRef<any>(null);

    const sentence1 = data.map((d) => d.sentence1)[0];
    const sentence2 = data.map((d) => d.sentence2)[0];
    const gold_label = data.map((d) => d.gold_label)[0];

    function findMostCommonItem<T>(arr: T[]): T | undefined {
        const frequencyMap = new Map<T, number>();
      
        for (const item of arr) {
          if (frequencyMap.has(item)) {
            frequencyMap.set(item, frequencyMap.get(item)! + 1);
          } else {
            frequencyMap.set(item, 1);
          }
        }
      
        let mostCommonItem: T | undefined;
        let maxFrequency = 0;
        const entriesArray = Array.from(frequencyMap.entries());
      
        for (const [item, frequency] of entriesArray) {
          if (frequency > maxFrequency) {
            mostCommonItem = item;
            maxFrequency = frequency;
          }
        }
      
        return mostCommonItem;
      }
    
    const nn_premises = data.map((d) => d.nn_premises)[0];
    const nn_hypotheses = data.map((d) => d.nn_hypotheses)[0];
    const nn_querying_premises = data.map((d) => d.nn_querying_premises)[0];
    const nn_querying_hypotheses = data.map((d) => d.nn_querying_hypotheses)[0];

    const original_sentence1 = nn_querying_premises[0];
    const nns_querying_sentence1 = nn_querying_premises.slice(1, nn_querying_premises.length); 
    const original_sentence2 = nn_querying_hypotheses[0];
    const nns_querying_sentence2 = nn_querying_hypotheses.slice(1, nn_querying_hypotheses.length);

    const nns_sentence1 = nn_premises.slice(1, nn_premises.length); 
    const nns_sentence2 = nn_hypotheses.slice(1, nn_hypotheses.length);


    const handleUpdateSentence = () => {
        setPremiseAnnotation(sentence1)
        setHypothesisAnnotation(sentence2)
        setCount(1)
    }

    useEffect(handleUpdateSentence, [sentence1])

    const handleSubmit = () => {
        // const input_cf = hypothesisAnnotation;
        // const input_cf_label = cflabel;

        if ((hypothesisAnnotation === '') || (premiseAnnotation === '')) {
            alert('Please enter a counterfactual')
            return
        }

        const data = {
            "uid": uuid(), 
            "sentence1": sentence1,
            "sentence2": sentence2,
            "gold_label": gold_label,
            "suggestionRP": premiseAnnotation,
            "suggestionRH": hypothesisAnnotation,
            "annotator_label": cflabel,
        }

        // fetch("http://127.0.0.1:8000/submit-data", {
        //     method: "POST",
        //     headers: {"Content-Type": "application/json"},
        //     body: JSON.stringify(data)
        // }).then(UpdateLabeledOld())
        submitData(`submit-data`, data).then(UpdateLabeledOld());

        setNNCount(0);
        setQNNCount(0);
        setPremiseAnnotation(sentence1);
        setHypothesisAnnotation(sentence2);
    }

    const handleDatamapQuery = () => {
        if (cflabel === '') {
            alert('Please select a label to estimate the datamap location.')
            return
        }
        queryBackendStr(
            `datamap-coordinates?sentence1=${premiseAnnotation}&sentence2=${hypothesisAnnotation}&label=${cflabel}`).then((response) => {
            setDatamapEstimate(response)
        });
    };

    const incrNNSuggestion = () => {
        if (nnCount < nn_premises.length - 2) {
            setNNCount(nnCount + 1)
        }
    }

    const decrNNSuggestion = () => {
        if (nnCount > 0) {
            setNNCount(nnCount -1)
        }
    }

    const incrQNNSuggestion = () => {
        if (queryingNNCount < nn_querying_premises.length - 2) {
            setQNNCount(queryingNNCount + 1)
        }
    }

    const decrQNNSuggestion = () => {
        if (queryingNNCount > 0) {
            setQNNCount(queryingNNCount -1)
        }
    }

    console.log(count)
    return (
        <Container fixed style={{ border: 0, boxShadow: "none"}}>
            {/*<Typography variant="h4" component="div"> Annotate the Suggested Sentence Pair </Typography>*/}
            {/*<Divider/>*/}

            <Stack alignItems={"flex"} justifyContent={"left"} spacing={3} sx={{ my: 3, mx: 2, width: "100%"}}>

            <Box className='.original_seed' sx={{padding: 1, textAlign: 'left', borderRadius: '3px', border: 1, borderColor: 'grey.500' }}>
            {/*<Typography variant="h6" component="div"> <strong>Original Suggested Sentence Pair</strong> </Typography>*/}
                <Typography variant="body1"> <strong>Premise:</strong> {original_sentence1} </Typography>
                <Typography variant="body1"> <strong>Hypothesis:</strong> {original_sentence2} </Typography>
                <Typography variant="body1"> <strong>Gold Label:</strong> {gold_label}, <strong> Prediction:</strong> {findMostCommonItem(data[0].nn_labels)}  </Typography>
                {/* <Typography variant="body1"> <strong>Prediction:</strong> {original_sentence2} </Typography> */}
                <Stack
                    alignItems="center"
                    justifyContent="center" spacing={2} direction="row" sx={{p: 1}}>
                    <Button variant="contained" color='inherit' onClick={(e) => {decrCountMore(); setRobertaLabel('-'); setDatamapEstimate([NaN, NaN]);}}>Previous</Button>
                    <Button variant="contained" onClick={(e) => {
                    incrCountMore(); setRobertaLabel('-'); setDatamapEstimate([NaN, NaN]);
                    // setNNCount(0); setQNNCount(0);
                    }} color='inherit'>Next</Button>
                </Stack>
            </Box>

            <Accordion sx={{
                        border: 3,
                        borderRadius: '4px',
                        borderColor: '#FFB08F',
                        // backgroundColor: '#FFB08F'
                    }}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                >
                <Typography> <strong> Similar examples used with the same label</strong> </Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Box sx={{
                        // border: 1,
                        borderRadius: '4px',
                        borderColor: 'grey.500',
                    }}>
                        <Typography variant="body1"> <strong>Premise:</strong> {nns_querying_sentence1[queryingNNCount]} </Typography>
                        <Typography variant="body1"> <strong>Hypothesis:</strong> {nns_querying_sentence2[queryingNNCount]} </Typography> 
                        <Typography variant="body1"> <strong>Gold Label:</strong> {gold_label} </Typography> 
                        {/* <Typography variant="body1"> <strong>Variability:</strong> {nn_querying_variability[queryingNNCount]}</Typography>
                        <Typography variant="body1"> <strong>Confidence:</strong> {nn_querying_confidence[queryingNNCount]}</Typography>
         */}
                        <Stack
                            alignItems="center"
                            justifyContent="center" spacing={2} direction="row" sx={{p: 1}}>
                            <Button variant="contained" color='inherit' onClick={decrQNNSuggestion}>Previous</Button>
                            <Button variant="contained" onClick={incrQNNSuggestion} color='inherit'>Next</Button>
                        </Stack>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{
                        border: 3,
                        borderRadius: '4px',
                        borderColor: '#C9DAFF',
                        // backgroundColor: '#C9DAFF'
                    }}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                >
                <Typography> <strong> Most similar samples</strong> </Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Box sx={{
                        // border: 1,
                        borderRadius: '4px',
                        borderColor: 'grey.500',
                    }}>
                        <Typography variant="body1"> <strong>Premise:</strong> {nns_sentence1[nnCount]} </Typography>
                        <Typography variant="body1"> <strong>Hypothesis:</strong> {nns_sentence2[nnCount]} </Typography> 
                        <Typography variant="body1"> <strong>Gold Label:</strong> {data[0].nn_labels[nnCount]} </Typography> 
                        {/* <Typography variant="body1"> <strong>Variability:</strong> {nn_variability[nnCount]}</Typography>
                        <Typography variant="body1"> <strong>Confidence:</strong> {nn_confidence[nnCount]}</Typography> */}
                        
                        <Stack
                            alignItems="center"
                            justifyContent="center" spacing={2} direction="row" sx={{p: 1}}>
                            <Button variant="contained" color='inherit'
                                    onClick={decrNNSuggestion}>Previous</Button>
                            <Button variant="contained" onClick={incrNNSuggestion} color='inherit'>Next</Button>
                        </Stack>
                    </Box>
                </AccordionDetails>
            </Accordion>
    
            <Stack alignItems="center" justifyContent="center" spacing={2} direction="row" sx={{p: 1}}>
            <Button variant="contained"  onClick={(e) => {
                decrCount(); setRobertaLabel('-'); setDatamapEstimate([NaN, NaN]);
                }} style={{minHeight: '80px', maxHeight: '40px'}}> <ArrowBackIosNewIcon /> </Button>

            <Stack spacing={2}>
                <Grid container spacing={2}>
                <Typography component="div"><strong>Revise GPT-3 suggestions and make a new example </strong> </Typography>

                    <Grid item xs={13}>

                    {/* TODO: debug not being able to edit the text field. */}
                    <TextField fullWidth id="counterfactual" inputRef={textArea}
                                    // variant="standard"
                                label={"✍ Edit the premise suggestion:" 
                                //+ BLANK_CHAR.repeat(15) + ""}
                                }
                                multiline
                                value={premiseAnnotation}
                                // onSelect={handleSelect}
                                onChange={(e) => {setPremiseAnnotation(e.target.value); setRobertaLabel('-'); setDatamapEstimate([NaN, NaN]);}}
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
                        <TextField fullWidth id="counterfactual" inputRef={textArea}
                                    // variant="standard"
                                label={"✍ Edit the hypothesis suggestion:" 
                                //+ BLANK_CHAR.repeat(15) + ""}
                                }
                                multiline
                                value={hypothesisAnnotation}
                                // onSelect={handleSelect}
                                onChange={(e) => {setHypothesisAnnotation(e.target.value); setRobertaLabel('-'); setDatamapEstimate([NaN, NaN]);}}
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
                                setcflabel('Entailment');
                            }}/>
                            <FormControlLabel value="Neutral" control={<Radio/>}
                                                label="Neutral"
                                                sx={{"& .MuiFormControlLabel-label": {color: "gray"}}}
                                                onClick={(e) => {
                                setcflabel('Neutral');
                            }}/>
                            <FormControlLabel value="Contradiction" control={<Radio/>}
                                                sx={{"& .MuiFormControlLabel-label": {color: "red"}}}
                                                label="Contradiction" onClick={(e) => {
                                setcflabel('Contradiction');
                            }}/>
                        </RadioGroup>
                    <Button variant="contained" onClick={handleDatamapQuery} style={{textTransform: 'none'}}>
                        Estimate Data Map location
                    </Button>
                    </Stack>

                </Grid>

                </Stack>
                <Button variant="contained" style={{minHeight: '80px', maxHeight: '40px'}} onClick={(e) => {
                    incrCount(); setRobertaLabel('-'); setDatamapEstimate([NaN, NaN]);
                    // setNNCount(0); setQNNCount(0);
                    }}><ArrowForwardIosIcon/></Button>

                </Stack>
                    <Button variant={"contained"} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Stack>
        </Container>
    );
};

export default BoxPolyjuice
