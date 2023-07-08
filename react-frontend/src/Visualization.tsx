import React, { useEffect, useState, useRef} from 'react';
import { NLIDataArray } from "./components/types/NLIDataArray";
import { DataArray } from './components/types/DataArray';

import BoxPolyjuice from "./components/BoxPolyjuice/BoxPolyjuice";
import {
    queryBackendDisplayData
} from "./backend/BackendQueryEngine";
import LabeledTable from "./components/BoxTable/BoxTable";

import { NLISubmissionDisplay } from "./components/types/NLISubmissionDisplay";
import { ScatterPlotProps } from './components/ScatterPlot/ScatterPlot';

import { Step } from "react-joyride";
import useTour from "./useTour_button";
import Typography from "@mui/material/Typography";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from "@mui/material/Card";
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import { CardContent } from '@mui/material';


import * as d3 from 'd3'


interface Props {
    total_count: number;
    data: NLIDataArray;
    scatter_data: DataArray; 
    count: number;
    incrCount: any;
    incrCountMore: any;
    decrCount: any;
    decrCountMore: any;
}

const scatterPlotProps: ScatterPlotProps = {
    width: 100,
    height: 200,
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
}


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1}}>
        <Typography mr={2}>
            Progress: 
        </Typography>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}


// for the counterfatcual examples: probably need to make sure they cover all codes and possible changes in the labels
const STEPS: Step[] = [
    {
        content: <h2>Welcome. Let us guide you through the process of generating
            counterfactuals!</h2>,
        locale: { skip: <strong aria-label="skip">Skip Introduction</strong> },
        placement: "center",
        target: "body",
    },
    {
        content: (
            <div>
                <small>The sentence pair is given as a premise and hypothesis. The task of our
                    model is to determine, given a premise sentence,
                    whether a hypothesis sentence is true (entailment), false (contradiction)
                    or neither (neutral). See following examples.</small>
            </div>),
        placement: "center",
        target: "body",
        title: (<div><h3> DEFINING THE NLI TASK</h3></div>)
    },
    {
        content: (
            <small>
                <div>
                    <strong> Premise: </strong> A soccer game with multiple males playing.
                </div>
                <div>
                    <strong> Hypothesis: </strong> Some men are playing a sport.
                </div>
                <div>
                    <strong> Label: </strong> Entailment
                </div>
            </small>),
        placement: "center",
        target: "body",
        title: (<div><h3>SENTENCE PAIR EXAMPLES</h3></div>)
    },
    {
        content: (
            <small>
                <div>
                    <strong> Premise: </strong> A man inspects the uniform of a figure in some
                    East Asian country.
                </div>
                <div>
                    <strong> Hypothesis: </strong> The man is sleeping.
                </div>
                <div>
                    <strong> Label: </strong> Contradiction
                </div>
            </small>),
        placement: "center",
        target: "body",
        title: (<div><h3>SENTENCE PAIR EXAMPLES</h3></div>)
    },
    {
        content: (
            <small>
                <div>
                    <strong> Premise: </strong> An older and younger man smiling.
                </div>
                <div>
                    <strong> Hypothesis: </strong> Two men are smiling and laughing at the
                    cats playing on the floor.
                </div>
                <div>
                    <strong> Label: </strong> Neutral
                </div>
            </small>),
        placement: "center",
        target: "body",
        title: (<div><h3>SENTENCE PAIR EXAMPLES</h3></div>)
    },
    {
        content: (<small> Your task is to detect, point out and replicate reasoning patterns in the provided data which
            the model struggles to understand. The interactive workflow is split into 
            <strong>understanding, diagnosing</strong> and <strong>refinement</strong>, which will be explained followingly.
        </small>),
        placement: "center",
        target: "body",
        title: (<div><h3>THE TASK</h3></div>)
    },

    {
        content: (<small> On the very top is a sentence pair,
            which the model has struggeled to label correctly.
            The understanding tasks are to understand the
            label, as well as the model reasoning see Data Map for the seed sample
            colored in black.
        </small>),
        placement: "right-start",
        target: ".demo_box_polyjuice",
        title: (<div><h3>Task: Understanding</h3></div>)
    },
    {
        content: (<small> To put the sample in context,
            we provide the most similar sentences with the same label (in orange),
            as well as the generally most similar sentences to the seed sentence (in blue).
            This should be used during diagnosing tasks, to get an understanding
            of why the seed sample might have been hard to understand to the model.
        </small>),
        placement: "right-start",
        target: ".demo_box_polyjuice",
        title: (<div><h3>Task: Diagnosing</h3></div>)
    },
    {
        content: (<small> Once you have made yourself familiar with the reasoning,
            and are convinced that the model may be missing a reasoning pattern,
            you can then generate new sentences following the challenging pattern and label them.
            To assess whether the model struggles with a sample, you can estimate its
            location on the datamap.
        </small>),
        placement: "right",
        target: ".demo_box_polyjuice",
        title: (<div><h3>Task: Refining</h3></div>)
    },
    {
        content: (
            <small> The datamap shows model training dynamics, i.e.
                how sure the model was about the <strong>ground truth</strong> label (y-axis),
                and how much it's prediction varied (x-axis).

                A sample is interesting to us if it ends up in the lower-left part of the plot,
                as this means that the model struggles to predict the correct label, therefore
                may not yet understand the reasoning of the new sample.
            </small>),
        placement: "left-start",
        target: ".demo_box_sentencepair",
        title: (<div><h3>Datamap</h3></div>)
    },
    {
        content: (
            <small> Additionally, the new samples are listed in a table. In this more structured,
                less cluttered view, sentencepairs can also be deleted.
            </small>),
        placement: "left-end",
        target: ".demo_box_sentencepair",
        title: (<div><h3>Datamap Table View</h3></div>)
    }
];


const Visualization: React.FunctionComponent<Props> = ({
    total_count,
    data,
    scatter_data,
    count,
    incrCount,
    incrCountMore,
    decrCount,
    decrCountMore
}: Props) => {

    const [nnCount, setNNCount] = useState(0);
    const [queryingNNCount, setQNNCount] = useState(0);
    const [cflabel, setcflabel] = useState('')

    const [cfCount, setCfCount] = useState(0);
    const [premiseAnnotation, setPremiseAnnotation] = useState("");
    const [hypothesisAnnotation, setHypothesisAnnotation] = useState("");
    const [CFOldLabeled, setCFOldLabeled] = useState<NLISubmissionDisplay>([]);


    const [robertaLabel, setRobertaLabel] = useState('-');
    const [datamapEstimate, setDatamapEstimate] = useState([NaN, NaN]);

    // adding a mode of what we are changing. Hidden to the user for now but we can integrate this at some point
    // const mode = 'Hypothesis'
    const sentence1 = data.map((d) => d.sentence1)[0];
    const sentence2 = data.map((d) => d.sentence2)[0];

    const svgRef = useRef(null);

    // initiate the labeled list of counterfactuals:
    const handleUpdateLabeledOld = () => {
        // update the counterfactual table
        queryBackendDisplayData(`upload-submitted-data?sentence1=` + sentence1 + '&sentence2=' + sentence2).then(
            (response) => {
                setCFOldLabeled(response);
        })
    };    

    useEffect(handleUpdateLabeledOld, [data, sentence1, sentence2])

    const w = 300;
    const h = 200;

    // I don't think this is very efficient. It re-draws the datamap as well each time.
    useEffect(() => {
        d3.selectAll("g").remove();
        d3.selectAll('circle').remove();
    }, [data, queryingNNCount, nnCount, datamapEstimate]); 

    // const draw = async () => {
    //     const w = 400;
    //     const h = 300;
    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr('width', w)
            .attr('height', h)
            .style('overflow', 'visible')
            .style('margin-top', '100px');
        const xScale = d3.scaleLinear()
            .domain([0, 0.6])
            .range([0, w]);
        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([h, 0]);

        const xAxis = d3.axisBottom(
            xScale).ticks(5);
        const yAxis = d3.axisLeft(yScale).ticks(5);

        const x = scatter_data.map((d) => d.X1);
        const y = scatter_data.map((d) => d.X2);

        const nn_x = data.map((d) => d.nn_variability)[0]; 
        const nn_y = data.map((d) => d.nn_confidence)[0];
        const nn_labels = data.map((d) => d.nn_labels)[0]; 
        const gold_label = nn_labels[0]

        const nn_x_querying = data.map((d) => d.nn_querying_variability)[0];
        const nn_y_querying = data.map((d) => d.nn_querying_confidence)[0];
        const nn_labels_querying = Array(nn_y_querying.length).fill(gold_label) // per definition.

        const polygon_data = d3.zip(nn_x, nn_y);
        const polygon_data_querying = d3.zip(nn_x_querying, nn_y_querying);
        const hull = d3.polygonHull(polygon_data.map((d) => [xScale(d[0]), yScale(d[1])]));
        const hull_querying = d3.polygonHull(polygon_data_querying.map((d) => [xScale(d[0]), yScale(d[1])]));

        const polygon_data_extended = nn_x.map(
            function(e, i){
                return [e, nn_y[i], nn_labels[i]]
            }
        )
        const polygon_data_querying_extended = nn_x_querying.map(
            function(e, i){
                return [e, nn_y_querying[i], nn_labels_querying[i]]
            }
        )


        svg.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${h})`);
        svg.append('g')
            .call(yAxis);
        
        svg.append('text')
            .attr('x', w/2)
            .attr('y', h+50)
            .text('variance');
        svg.append('text')
            .attr('y', -40)
            .attr('x', -h + 60)
            .text('confidence')
            .attr("transform", "rotate(-90)");

        svg.append("text")
            .attr("x", w/2 + 30)             
            .attr("y", 0 - (20))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Data Map");
        

        svg.selectAll('g')
            .data(d3.zip(x, y))
            .enter()
            .append('circle')
                .attr('cx', d => xScale(d[0]))
                .attr('cy', d => yScale(d[1]))
                .attr('r', 2)
                .attr("fill", "silver")
            .on('mouseover', function () {
                d3.select(this).transition()
                        .duration(1)
                        .attr("r", 10)
                        .style('fill', '#91CCBE')
                        .style('stroke', '#91CCBE');
            })
            .on('mouseout', function () {
                d3.select(this).transition()
                        .duration(200)
                        .attr("r", 2)
                        .style("fill", "silver")
                        .style('stroke', 'silver');
        });

        let teamArea =  svg.append('g').selectAll(".teamHull").data([hull]);

        teamArea.enter().append("path")
        // teamArea.append('path')
        .attr("class", "teamHull")
        .attr("d", (d) => "M" + (d as [number, number][]).join("L") + "Z")
        .attr("fill", "white")
        .attr("opacity", 0.4)
        .attr("stroke", "gray")
        .attr("stroke-width", "1")
        .attr("stroke-location", "outside")
        .attr("stroke-linejoin", "round");
    
    
        let teamArea_querying = svg.append('g').selectAll(".teamHull").data([hull_querying]);
            teamArea_querying.enter().append("path")
            // teamArea.append('path')
            .attr("class", "teamHull")
            .attr("d", (d) => "M" + (d as [number, number][]).join("L") + "Z")
            .attr("fill", "white")
            .attr("opacity", 0.4)
            .attr("stroke", "gray")
            .attr("stroke-width", "1")
            .attr("stroke-location", "outside")
            .attr("stroke-linejoin", "round");

        var symbol = d3.symbol();

        let teamDots =  svg.append('g').selectAll(".teamHull").data(polygon_data_extended);
        teamDots.enter().append("path")
        .attr("class", "teamHull")
        .attr('d',
            symbol.type(function(d: any[]): any{
                if (d[2] == 'entailment'){return d3.symbolCircle}
                else if (d[2] == 'neutral'){return d3.symbolCross}
                else {return d3.symbolDiamond}
            })
            .size(
                function(d: any[], i: number): number{
                    if(i === nnCount + 1){return 200}
                    else{return 50}
                }
            )
        )
        .attr("fill", function(d: any[], i: number): string {
            if (i===0) {
                return 'black';
            }else {
                return '#C9DAFF';
            }
        })
        .attr("opacity", 1)
        .attr('stroke', 'black')
        .attr("stroke-width", "1")
        .attr("stroke-location", "outside")
        .attr("stroke-linejoin", "round")
        .attr('transform', function(d){
            return "translate(" + xScale(d[0] as number) + "," + yScale(d[1] as number) + ")"});


        let teamDots_querying =  svg.append('g').selectAll(".teamHull")
        .data(polygon_data_querying_extended);

        teamDots_querying.enter().append("path")
        .attr("class", "teamHull")
        .attr('d',
            symbol.type(function(d: any[]): any{
                if (d[2] == 'entailment'){return d3.symbolCircle}
                else if (d[2] == 'neutral'){return d3.symbolCross}
                else {return d3.symbolDiamond}
            })
            .size(
                function(d: any[], i: number): number{
                    if(i === queryingNNCount + 1){return 200}
                    else{return 50}
                }
            )
        )
        .attr("fill", function(d: any[], i: number): string {
            if (i===0) {
                return 'black';
            }else {
                return '#FFB08F';
            }
        })
        .attr('stroke', 'black')
        .attr("opacity", 1)
        .attr("stroke-width", "1")
        .attr("stroke-location", "outside")
        .attr("stroke-linejoin", "round")
        .attr('transform', function(d){
            return "translate(" + xScale(d[0] as number) + "," + yScale(d[1] as number) + ")"});
        
        // draw the estimated dot.
        if (!Number.isNaN(datamapEstimate[0])){
            console.log(datamapEstimate)
            svg.append('g').selectAll()
                .data([datamapEstimate])
                .enter().append('path')
                .attr("class", "teamHull")
                .attr('d', symbol.type(d3.symbolTriangle))
                .attr("fill", '#91CCBE')
                .attr("opacity", 1)
                .attr('stroke', 'black')
                .attr("stroke-width", "1")
                .attr("stroke-location", "outside")
                .attr("stroke-linejoin", "round")
                .attr('transform', function(d){
                    return "translate(" + xScale(d[0] as number) + "," + yScale(d[1] as number) + ")"});
                    // Add one dot in the legend for each name.
            svg.selectAll()
            .data(['Suggestion Estimate'])
            .enter()
            .append('path')
            .attr('d',
            symbol.type(d3.symbolSquare).size(50))
            .attr("fill", '#91CCBE')
            .attr("opacity", 1)
            .attr("stroke-width", "1")
            .attr("stroke-location", "outside")
            .attr("stroke-linejoin", "round")
            .attr('transform',
                "translate(" + xScale(0.5) + "," + yScale(0.8 - 0.15) + ")");

            svg.selectAll()
            .data(['Suggestion Estimate'])
            .enter()
            .append("text")
            .attr("x", xScale(0.52))
            .attr("y", yScale(0.8 - 0.15))
            .style("font-size", "12px")
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            }


        // Add one dot in the legend for each name.
        var keys = ['entailment', 'neutral', 'contradiction']

        // Add one dot in the legend for each name.
        svg.selectAll()
            .data(keys)
            .enter()
            .append('path')
            .attr('d',
            symbol.type(function(d: string): any{
                if (d == 'entailment'){return d3.symbolCircle}
                else if (d == 'neutral'){return d3.symbolCross}
                else {return d3.symbolDiamond}
            }).size(50))
            .attr("fill", 'gray')
            .attr("opacity", 1)
            .attr("stroke-width", "1")
            .attr("stroke-location", "outside")
            .attr("stroke-linejoin", "round")
            .attr('transform', function(d, i){
                return "translate(" + xScale(0.5) + "," + yScale(1.0 - i*0.05) + ")"});

        svg.selectAll()
        .data(keys)
        .enter()
        .append("text")
        .attr("x", xScale(0.52))
        .attr("y", function(d,i){ return yScale(1 - i*0.05)})
        .style("font-size", "12px")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

        var keys_2 = ['original', 'same label NNs', 'NNs']

        // Add one dot in the legend for each name.
        svg.selectAll()
        .data(keys_2)
        .enter()
        .append('path')
        .attr('d',
        symbol.type(d3.symbolSquare).size(50))
        .attr("fill", function(d:string, i: number): string{
            if(d == 'original'){return 'black'}
            else if(d == 'same label NNs'){return '#FFB08F'}
            else{return '#C9DAFF'}
        })
        .attr("opacity", 1)
        .attr("stroke-width", "1")
        .attr("stroke-location", "outside")
        .attr("stroke-linejoin", "round")
        .attr('transform', function(d, i){
            return "translate(" + xScale(0.5) + "," + yScale(0.8 - i*0.05) + ")"});

        svg.selectAll()
        .data(keys_2)
        .enter()
        .append("text")
        .attr("x", xScale(0.52))
        .attr("y", function(d,i){ return yScale(0.8 - i*0.05)})
        .style("font-size", "12px")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

        // return <div className="ScatterPlot" />
    // }, [data, sentence1, sentence2]);
}, [data, sentence1, sentence2, nnCount, queryingNNCount, datamapEstimate]);


    // selecting the suggestion to work with based on the mode:
    let suggestion = [""];

    const initializeCF = () => {
        setPremiseAnnotation(sentence1);
        setHypothesisAnnotation(sentence2);

    }
    useEffect(initializeCF, [sentence1, sentence2])

    const tour = useTour(STEPS);

    let styleNoBorder = { border: "none", boxShadow: "none" };

    const colorpalette ={
        "Entailment": "#2e7d32",
        "entailment": "#2e7d32",
        "Neutral": "gray",
        "neutral": "gray",
        "Contradiction": "#d32f2f",
        "contradiction": "#d32f2f",
    }

return (
    <React.Fragment>
        {/* <div ref={wrapperRef} style={{marginTop: 40}}>
            <svg ref={svgRef} style={{overflow: "visible"}}/>
            {x_scatter[0]}
        </div> */}
        <div className='demo-wrapper'>
            {/* hi */}

        <div className='demo_box_tour_button'>
            {tour}
        </div>

        <Container maxWidth={false}>
            <Stack spacing={3}>
                <Card elevation={3}>
                    <Box sx={{ width: '90%'}}  my={2} ml={5} mr={5}>
                                <LinearProgressWithLabel value={(count/total_count) * 100} />
                            </Box>
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />} p={2} my={2} mr={2} spacing={2}>
                        {/* <Card className="demo_box_polyjuice" style={styleNoBorder} sx={{ width: '50%' }}> */}
                        <Card className="demo_box_polyjuice" style={styleNoBorder} sx={{ width: '50%', flex: 1}}>
                            <BoxPolyjuice 
                                data={data}
                                suggestion={suggestion}
                                setCount={setCfCount}
                                count={cfCount}
                                incrCount={incrCount}
                                incrCountMore={incrCountMore}
                                decrCount={decrCount} decrCountMore={decrCountMore}
                                premiseAnnotation={premiseAnnotation}
                                setPremiseAnnotation={setPremiseAnnotation}
                                hypothesisAnnotation={hypothesisAnnotation}
                                setHypothesisAnnotation={setHypothesisAnnotation}
                                robertaLabel={robertaLabel} setRobertaLabel={setRobertaLabel}
                                datamapEstimate={datamapEstimate} setDatamapEstimate={setDatamapEstimate}
                                nnCount={nnCount} setNNCount={setNNCount}
                                queryingNNCount={queryingNNCount} setQNNCount={setQNNCount}
                                cflabel={cflabel} setcflabel={setcflabel}
                                UpdateLabeledOld={handleUpdateLabeledOld}
                            />
                        </Card>
                        <Card className="demo_box_sentencepair" style={styleNoBorder} sx={{ flex: 1 }}>
                        <CardContent
                                sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                h: '30px'
                                }}
                            >      
                            <div
                                style={{
                                position: 'relative',
                                top: '50%',
                                transform: 'translateY(-20%)',
                                }}
                            >
                                <svg ref={svgRef} style={{overflow: "auto"}}/>
                            </div>
                        </CardContent>
                        <Card style={styleNoBorder} sx={{ flex: 1, marginTop: 2}}>
                        {CFOldLabeled && <LabeledTable
                            CFLabeled={CFOldLabeled} sentence1={sentence1} sentence2={sentence2}
                            // UpdateLabeled={handleUpdateLabeled}
                            UpdateLabeledOld={handleUpdateLabeledOld}
                            colorpalette={colorpalette}
                        />}
                        </Card>
                        </Card>

                    </Stack>
                </Card>
            </Stack>
        </Container>
        </div>

    </React.Fragment>
);
}
export default Visualization

