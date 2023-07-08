import React, { useEffect, useState, useRef } from 'react';
import { NLIDataArray } from "./types/NLIDataArray";
import { DataArrayExtended } from './types/DataArrayExtended';

import * as d3 from 'd3'



interface Props {

    scatter_data: DataArrayExtended;
    showcase_data: NLIDataArray
    show_estimate: boolean
}

  
const StaticDataMapVisualization = ({scatter_data, showcase_data, show_estimate}: Props) => {

    const [highlightedPoint, setHighlightedPoint] = useState("");
    const nn_x = showcase_data.map((d) => d.nn_variability)[0]; 
    const nn_y = showcase_data.map((d) => d.nn_confidence)[0];
    const nn_labels = showcase_data.map((d) => d.nn_labels)[0]; 
    const gold_label = nn_labels[0]

    const nn_x_querying = showcase_data.map((d) => d.nn_querying_variability)[0];
    const nn_y_querying = showcase_data.map((d) => d.nn_querying_confidence)[0];
    const nn_labels_querying = Array(nn_y_querying.length).fill(gold_label) // per definition.

    const polygon_data = d3.zip(nn_x, nn_y);
    const polygon_data_querying = d3.zip(nn_x_querying, nn_y_querying);

    const width = 450;
    const height = 450;

    const svgRef = useRef();
    const wrapperRef = useRef();


    useEffect(() => {

        // Ref to current svg object
        const svg = d3.select(svgRef.current);
        svg.attr("viewBox", [0, 0, width, height])

        const margin = {
            top: 20,
            right: 10,
            bottom: 20,
            left: 50
        };

        const xScale = d3.scaleLinear()
            .domain([0, 0.6])
            .range([margin.left, width-margin.right]);
        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([height-margin.bottom, 0]);

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

        // Include axis.
        if (svg.selectAll(".x-axis").empty()) {
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height-margin.bottom})`)
                .call(d3.axisBottom(xScale).ticks(5))
            .append("text")
            .text("Variability")
            // .text("Probability for \"he\" (%)")
            .attr("transform", `translate(${width/2+10},50)`)
            // .style("font-size", "18px")
            .style("fill", "black");
        }

        if (svg.selectAll(".y-axis").empty()) {
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale).ticks(5))
            .append("text")
            // .text("Probability for \"she\" (%)")
            .text("Confidence")
            .attr("transform", `translate(-40,200) rotate(-90)`)
            .style("font-size", "10px")
            .style("fill", "black");
        }

        svg.selectAll()
            // .data(d3.zip(x_scatter, y_scatter))
            .data(scatter_data)
            .enter()
            .append('circle')
            .attr("class", function(d){
                return "circle" + d.guid
            })
            .attr('cx', d => xScale(d.variability))
            .attr('cy', d => yScale(d.confidence))
            .attr("guid", d => d.guid.toString())
            .attr('r', 3)
            .attr('z-index', 1)
            .attr("fill", "silver")
            .style("opacity", 1)
            // .on("mouseover", highlight)
            // .on("mouseleave", doNotHighlight)
            // TODO: implement click
            // .on("click", function (d) {
            //     const prof = d['target']['__data__']['profession'];
            //     setProfession(prof);
            // });
        
        
        // // Create background for labels
        // svg
        //     .selectAll(".label")
        //     .data(scatter_data)
        //     .join("circle")
        //     .attr("class", function (d) {
        //         return "label " + d.guid
        //     })
        //     // .style("visibility", "visible")
        //     .style("fill", "white")
        //     .attr("rx", 1)
        //     .attr("ry", 1)
        //     // .attr('stroke', d => color())
        //     .attr('stroke', 'black')
        //     .attr('stroke-width', '0.5')
        //     .style("z-index", 100)
        //     .attr("x", d => xScale(d.variability))
        //     .attr("y", d => yScale(d.confidence));
        //     // .attr("x", d => x(d.col.toString()))
        //     // .attr("y", d => (defaultProfessions.includes(d.profession)) ? -18.5 : 0);

        // // Create labels for percentage of females
        svg
            .selectAll(".text1")
            .data(scatter_data)
            .join("text")
            .attr("class", function (d) {
                return "text1 " + d.guid
            })
            .style("visibility", "hidden")
            .style("z-index", 10)
            // .style("font-size", "3px")
            .style("fill", "black")
            .style("font-size", "5px")
            .style("font-weight", "bold")
            .attr("x", d => xScale(d.variability))
            .attr("y", d => yScale(d.confidence))
            // .attr("x", d => x(d.col.toString()))
            // .attr("y", d => (defaultProfessions.includes(d.profession)) ? -18.5 : 0)
            .attr('transform', function(d) {return `translate(-7, 14)`}) // hardcoded
            .text(function (d) {
                // return `Females: ${(d.census*100).toFixed(1)}%`
                return `Premise: ${d.sentence1}`
            });

        // // Create labels for percentage of females
        svg
            .selectAll(".text2")
            .data(scatter_data)
            .join("text")
            .attr("class", function (d) {
                return "text2 " + d.guid
            })
            .style("visibility", "hidden")
            .style("z-index", 1000)
            // .style("font-size", "3px")
            .style("fill", "black")
            .style("font-size", "5px")
            .attr("x", d => xScale(d.variability))
            .attr("y", d => yScale(d.confidence))
            .attr('transform', function(d) {return `translate(-7, 20)`}) // hardcoded
            .text(function (d) {
                // return `Females: ${(d.census*100).toFixed(1)}%`
                return `Hypothesis: ${d.sentence2}`
            });
    

        // // Create labels for percentage of females
        svg
            .selectAll(".text3")
            .data(scatter_data)
            .join("text")
            .attr("class", function (d) {
                return "text3 " + d.guid
            })
            .style("visibility", "hidden")
            .style("z-index", 1000)
            // .style("font-size", "3px")
            .style("fill", "black")
            .style("font-size", "5px")
            .attr("x", d => xScale(d.variability))
            .attr("y", d => yScale(d.confidence))
            .attr('transform', function(d) {return `translate(-7, 35)`}) // hardcoded
            .text(function (d) {
                // return `Females: ${(d.census*100).toFixed(1)}%`
                return `Prediction: ${d.prediction}, Label: ${d.gold_label}`
            });

        // // // Create labels for percentage of females
        // svg
        //     .selectAll(".text4")
        //     .data(scatter_data)
        //     .join("text")
        //     .attr("class", function (d) {
        //         return "text4 " + d.guid
        //     })
        //     .style("visibility", "hidden")
        //     .style("z-index", 1000)
        //     // .style("font-size", "3px")
        //     .style("fill", "black")
        //     .style("font-size", "5px")
        //     .attr("x", d => xScale(d.variability))
        //     .attr("y", d => yScale(d.confidence))
        //     .attr('transform', function(d) {return `translate(-7, 20)`}) // hardcoded
        //     .text(function (d) {
        //         // return `Females: ${(d.census*100).toFixed(1)}%`
        //         return `Hypothesis: ${d.prediction}`
        //     });

        // // Resize backgrounds to match text length
        // // Save the dimensions of the text elements
        // svg.selectAll(".text2")
        // .each((d: DataPoint) => {d["bbox"] = (d3.selectAll(".text2." + d.guid).nodes()[0] as SVGSVGElement).getBBox();});

        // // Update the rectangles using the sizes we just added to the data
        // const xMargin = 3
        // const yMargin = 2

        // svg.selectAll(".label")
        //     .data(scatter_data)
        //     .join("circle")
        //     .attr("width", d => d["bbox"]["width"] + 2 * xMargin)
        //     .attr("height", d => d["bbox"]["height"] * 2 + 2 * yMargin)
        //     .attr('transform', function(d) {return `translate(-9, 5)`})


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
                        // if(i === nnCount + 1){return 200}
                        if(i === 4){return 200}
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
            .attr("z-index", 1000)
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
                // .size(
                //     function(d: any[], i: number): number{
                //         // if(i === queryingNNCount + 1){return 200}
                //         if(i === 1000){return 200}
                //         else{return 50}
                //     }
                // )
                .size(50)
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
            .attr("z-index", 100)
            .attr("stroke-location", "outside")
            .attr("stroke-linejoin", "round")
            .attr('transform', function(d){
                return "translate(" + xScale(d[0] as number) + "," + yScale(d[1] as number) + ")"});
       
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

        svg.append('rect')
            .attr('x', xScale(0.1) + 50)
            .attr('y', yScale(0.29)- 55/2)
            .attr('rx', 3)
            .attr('ry', 3)
            .attr('width', 230)
            .attr('height', 50)
            .text("text")
            .attr('stroke', 'black')
            .attr('fill', 'lightgrey');

        svg.append('rect')
            .attr('x', xScale(-0) + 50)
            .attr('y', yScale(0.97)- 55/2)
            .attr('rx', 3)
            .attr('ry', 3)
            .attr('width', 230)
            .attr('height', 50)
            .text("text")
            .attr('stroke', 'black')
            .attr('fill', '#C9DAFF');
        
        if(show_estimate){
            svg.append('rect')
            .attr('x', xScale(0.1) + 50)
            .attr('y', yScale(0.07)- 55/2)
            .attr('rx', 3)
            .attr('ry', 3)
            .attr('width', 280)
            .attr('height', 50)
            .text("text")
            .attr('stroke', 'black')
            .attr('fill', '#FAC898');
        }

        svg.append("text")
            .attr("x", xScale(0.2))
            .attr("y", yScale(0.32))
            .style("font-size", "8px")
            .html("Premise:<tspan style='font-weight: bold;'> A woman, man and two children.</span>")

        svg.append("text")
            .attr("x", xScale(0.2))
            .attr("y", yScale(0.29))
            .style("font-size", "8px")
            .html("Hypothesis: <tspan style='font-weight: bold;'>A family.</span>")
        
        svg.append("text")
            .attr("x", xScale(0.2))
            .attr("y", yScale(0.26))
            .style("font-size", "8px")
            .html("Label: <tspan style='font-weight: bold;'>Neutral</tspan>, Prediction: <tspan style='font-weight: bold;'>Entailment</tspan>")
        
        if(show_estimate){
            svg.append('path')
            // .attr('size', 20)
            .attr('z-index', 1)
            .attr('d', d3.symbol().type(d3.symbolTriangle).size(200))
            .attr('stroke', 'black')
            .attr("fill", "#FAC898")
            .style("opacity", 1)
            .attr('transform', function(d){
                return "translate(" + xScale(0.1 as number) + "," + yScale(0.1 as number) + ")"});

        svg.selectAll()
            .data(['Suggestion Estimate'])
            .enter()
            .append('path')
            .attr('d',
            symbol.type(d3.symbolTriangle).size(50))
            .attr("fill", '#FAC898')
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
        
        svg.append("text")
            .attr("x", xScale(0.2))
            .attr("y", yScale(0.1))
            .style("font-size", "8px")
            .html("Premise:<tspan style='font-weight: bold;'> A woman in a green dress and a man in a grey suit.</span>")

        svg.append("text")
            .attr("x", xScale(0.2))
            .attr("y", yScale(0.07))
            .style("font-size", "8px")
            .html("Hypothesis: <tspan style='font-weight: bold;'>A couple is dressed up.</span>")
        
        svg.append("text")
            .attr("x", xScale(0.2))
            .attr("y", yScale(0.04))
            .style("font-size", "8px")
            .html("Label: <tspan style='font-weight: bold;'>Neutral</tspan>, Prediction: <tspan style='font-weight: bold;'>Entailment</tspan>")
        
        // Define a horizontal link from the first circle to the second
        const link_3 = d3.linkVertical()
                .x(d => d[0])
                .y(d => d[1])({source: [xScale(0.101),yScale(0.085)], target: [165,405]},);
    
        svg
            .append('path')
            .attr('d', link_3)
            // .attr('marker-end', 'url(#arrow)')
            .attr('stroke', 'black')
            .attr('fill', 'none');
        }
        // Define a horizontal link from the first circle to the second
        const link_1 = d3.linkVertical()
            .x(d => d[0])
            .y(d => d[1])({source: [xScale(0.2)-15,yScale(0.3)], target: [92,320]},);

        svg
            .append('path')
            .attr('d', link_1)
            // .attr('marker-end', 'url(#arrow)')
            .attr('stroke', 'black')
            .attr('fill', 'none');


        svg.append("text")
            .attr("x", xScale(0.1))
            .attr("y", yScale(1))
            .style("font-size", "8px")
            .html("Premise: <tspan style='font-weight: bold;'>A woman pushes <tspan style='font-style: italic;'>her</tspan> baby in a stroller.</tspan>");
            // .text("Premise: A woman pushes ")
            // .append("tspan")
            // .style("font-style", "italic")
            // .text("her")
            // .style("font-style", "normal")
            // .text(" baby in a stroller.");

        svg.append("text")
            .attr("x", xScale(0.1))
            .attr("y", yScale(0.97))
            .style("font-size", "8px")
            .html("Hypothesis: <tspan style='font-weight: bold;'>A <tspan style='font-style: italic;'>mother</tspan> and baby are walking.</tspan> ")
        
        svg.append("text")
            .attr("x", xScale(0.1))
            .attr("y", yScale(0.94))
            .style("font-size", "8px")
            .html("Label: <tspan style='font-weight: bold;'>Entailment</tspan>, Prediction: <tspan style='font-weight: bold;'>Entailment</tspan>")


        // Define a horizontal link from the first circle to the second
        const link_2 = d3.linkVertical()
            .x(d => d[0])
            .y(d => d[1])({source: [xScale(0.061),yScale(0.85)], target: [192,35]},);

        svg
            .append('path')
            .attr('d', link_2)
            // .attr('marker-end', 'url(#arrow)')
            .attr('stroke', 'black')
            .attr('fill', 'none');


         
        // svg.append('textbox')
        //     .attr("x", 10)
        //     .attr("y", 10)
        //     .attr("width", 200)
        //     .attr("height", 100)
        //     .append("xhtml:body")
        //     .style("font", "14px 'Arial'")
        //     // .html('<textarea style="width: 100%; height: 100%; resize: none; border: 1px solid #ccc;"></textarea>');
        
        // // draw the estimated dot.
        // if (!Number.isNaN(datamapEstimate[0])){
        //     svg.append('g').selectAll()
        //         .data([datamapEstimate])
        //         .enter().append('path')
        //         .attr("class", "teamHull")
        //         .attr('d', symbol.type(d3.symbolTriangle))
        //         .attr("fill", '#91CCBE')
        //         .attr("opacity", 1)
        //         .attr('stroke', 'black')
        //         .attr("stroke-width", "1")
        //         .attr("stroke-location", "outside")
        //         .attr("stroke-linejoin", "round")
        //         .attr('transform', function(d){
        //             return "translate(" + xScale(d[0] as number) + "," + yScale(d[1] as number) + ")"});
        //             // Add one dot in the legend for each name.
        //     svg.selectAll()
        //     .data(['Suggestion Estimate'])
        //     .enter()
        //     .append('path')
        //     .attr('d',
        //     symbol.type(d3.symbolSquare).size(50))
        //     .attr("fill", '#91CCBE')
        //     .attr("opacity", 1)
        //     .attr("stroke-width", "1")
        //     .attr("stroke-location", "outside")
        //     .attr("stroke-linejoin", "round")
        //     .attr('transform',
        //         "translate(" + xScale(0.5) + "," + yScale(0.8 - 0.15) + ")");

        //     svg.selectAll()
        //     .data(['Suggestion Estimate'])
        //     .enter()
        //     .append("text")
        //     .attr("x", xScale(0.52))
        //     .attr("y", yScale(0.8 - 0.15))
        //     .style("font-size", "12px")
        //     .text(function(d){ return d})
        //     .attr("text-anchor", "left")
        //     .style("alignment-baseline", "middle")
        //     }
    



        // // Resize backgrounds to match text length
        // // Save the dimensions of the text elements

        // svg.selectAll(".text2")
        //     .each((d: DataPoint) => {d["bbox"] = (d3.selectAll(".text2." + d.guid).nodes()[0] as SVGSVGElement).getBBox();});

        // // svg.selectAll(".text1")
        // //     .each((d: DataPoint) => {d["bbox1"] = (d3.selectAll(".text1." + d.guid).nodes()[0] as SVGSVGElement).getBBox();});

        // // svg.selectAll(".text2")
        // //     .each((d: DataPoint) => {d["bbox2"] = (d3.selectAll(".text2." + d.guid).nodes()[0] as SVGSVGElement).getBBox();});

        // // Update the rectangles using the sizes we just added to the data
        // const xMargin = 5
        // const yMargin = 10

        // // console.log(scatter_data["bbox"]["width"])

        // svg.selectAll(".label")
        //     .data(scatter_data)
        //     .join("circle")
        //     .attr("width", d => Math.max(d["bbox1"]["width"], d["bbox2"]["width"])+ 2 * xMargin)
        //     .attr("height", d => Math.max(d["bbox1"]["height"], d["bbox2"]["height"]) * 2 + 2 * yMargin)
        //     // .attr("height", d => d["bbox2"]["height"] * 2 + 2 * yMargin)
        //     .attr('transform', function(d) {return `translate(-10, 22)`})
        //     // .attr('transform', function(d) {return `translate(-7, 14)`}) // hardcoded

}, [scatter_data, show_estimate]);


return (
    <React.Fragment>
        <div ref={wrapperRef} style={{marginTop: 120}}>
            <svg ref={svgRef} style={{overflow: "visible"}}/>
            {/* {x_scatter[0]} */}
        </div>
    </React.Fragment>
);
}
export default StaticDataMapVisualization