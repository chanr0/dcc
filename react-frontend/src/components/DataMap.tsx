import React, { useEffect, useState, useRef } from 'react';
import { DataArrayExtended } from './types/DataArrayExtended';

import * as d3 from 'd3'
import { DataPointExtended } from './types/DataPointExtended';

interface Props {
    scatter_data: DataArrayExtended;
}

const DataMapVisualization = ({scatter_data}: Props) => {

    const [highlightedPoint, setHighlightedPoint] = useState("");

    const width = 450;
    const height = 300;
    const svgRef = useRef();
    const wrapperRef = useRef();

    function hideAllLabels() {
        const svg = d3.select(svgRef.current);
        // Hide labels for all professions
        // console.log('hide all labels')
        svg.selectAll(".text1").transition().duration(200).style("visibility", "hidden");
        svg.selectAll(".text2").transition().duration(200).style("visibility", "hidden");
        svg.selectAll(".text3").transition().duration(200).style("visibility", "hidden");
        svg.selectAll(".label").transition().duration(200).style("visibility", "hidden");
        svg.selectAll(".line").transition().duration(200).style("visibility", "hidden");
    }

    function highlightProf(prof: string) {
        const svg = d3.select(svgRef.current);
        hideAllLabels();
        svg.selectAll(".circle")
            .transition()
            .duration(200)
            .style("opacity", 0.1);
        // svg.selectAll("."+"hello")
        svg.selectAll("." + prof)
            .transition()
            .duration(200)
            .style("visibility", "visible")
            .style("opacity", 1);
    }

    function highlight (d){
        // console.log('highlight')
        const svg = d3.select(svgRef.current);
        var selected_prof = d3.select(this).attr("guid");
        d3.select(this).attr("r", 5).style("opacity", 1).style("fill", 'black')
        setHighlightedPoint(selected_prof);
    }

    function doNotHighlight (d){
        // console.log('dont highlight')
        const svg = d3.select(svgRef.current);
        hideAllLabels();
        console.log(svg.selectAll(".circle"))
        svg.selectAll(".circle")
            .transition()
            .duration(200)
            .style("opacity", 0.1);
        d3.select(this).attr("r", 3).style("opacity", 1).style("fill", 'lightgrey');
        setHighlightedPoint("");
    }

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        if (highlightedPoint !== "") {
            console.log(svg.selectAll(".circle"))
            hideAllLabels();
            let actProf = highlightedPoint.slice(); // Without this, it does not work
            highlightProf(actProf)
        }
        // } else {
        //     hideAllLabels();
        //     svg.selectAll(".rect")
        //     .transition()
        //     .duration(200)
        //     .style("opacity", 1);
        //     showDefaultLabels();
        // }
    }, [highlightedPoint])
    // }); 


    useEffect(() => {

        // Ref to current svg object
        const svg = d3.select(svgRef.current);
        svg.attr("viewBox", [0, 0, width, height])

        const margin = {
            top: 0,
            right: 30,
            bottom: 20,
            left: 50
        };

        const xScale = d3.scaleLinear()
            .domain([0, 0.5])
            .range([margin.left, width-margin.right]);
        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([height-margin.bottom, 0]);

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
            .attr("transform", `translate(-40,115) rotate(-90)`)
            .style("font-size", "10px")
            .style("fill", "black");
        }

        svg.selectAll()
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
            // .attr('z-index', 1)
            .attr("fill", "lightgrey")
            .style("opacity", 1)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)
            // TODO: implement click
            .on("click", function (d) {
                console.log(d['target']['__data__']['guid'])
                const point = d['target']['__data__']['guid'];
                setHighlightedPoint(point);
                // setProfession(prof);
            });
            // .on("click", function(d) {
            //     d3.select(this).attr("r", 5).style("opacity", 1).style("fill", 'black'); 
            // })

        svg.selectAll(".label")
            .data(scatter_data)
            .join("rect")
            .attr("class", function (d) {
                return "label " + d.guid
            })
            .style("visibility", "hidden")
            .style("z-index", 1000)
            .style("fill", "#C9DAFF")
            .attr("rx", 3)
            .attr("ry", 3)
            // .attr('stroke', d => color())
            .attr('stroke', 'black')
            .attr('stroke-width', '0.5')
            .attr("x", d => xScale(d.variability))
            .attr("y", d => yScale(d.confidence));
            // .attr("height", 100)
            // .attr("width", 30);
        
            // .attr("x", d => x(d.col.toString()))
            // .attr("y", d => (defaultProfessions.includes(d.profession)) ? -18.5 : 0);

        // // Create labels for percentage of females
        svg.selectAll(".text1")
            .data(scatter_data)
            .join("text")
            .attr("class", function (d) {
                return "text1 " + d.guid
            })
            .style("visibility", "hidden")
            .style("z-index", 10)
            .style("fill", "black")
            .style("font-size", "8px")
            .attr("x", d => xScale(d.variability))
            .attr("y", d => yScale(d.confidence))
            // .attr("x", d => x(d.col.toString()))
            // .attr("y", d => (defaultProfessions.includes(d.profession)) ? -18.5 : 0)
            .attr('transform', function(d) {return `translate(-7, 17)`}) // hardcoded
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
            .style("font-size", "8px")
            .attr("x", d => xScale(d.variability))
            .attr("y", d => yScale(d.confidence))
            .attr('transform', function(d) {return `translate(-7, 28)`}) // hardcoded
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
            .style("font-size", "8px")
            .attr("x", d => xScale(d.variability))
            .attr("y", d => yScale(d.confidence))
            .attr('transform', function(d) {return `translate(-7, 39)`}) // hardcoded
            .text(function (d) {
                // return `Females: ${(d.census*100).toFixed(1)}%`
                return `Label: ${d.gold_label}, Prediction: ${d.prediction}`
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



        // Resize backgrounds to match text length
        // Save the dimensions of the text elements

        // svg.selectAll(".text2")
        //     .each((d: DataPoint) => {d["bbox"] = (d3.selectAll(".text2." + d.guid).nodes()[0] as SVGSVGElement).getBBox();});

        svg.selectAll(".text1")
            .each((d: DataPointExtended) => {d["bbox1"] = (d3.selectAll(".text1." + d.guid).nodes()[0] as SVGSVGElement).getBBox();});

        svg.selectAll(".text2")
            .each((d: DataPointExtended) => {d["bbox2"] = (d3.selectAll(".text2." + d.guid).nodes()[0] as SVGSVGElement).getBBox();});

        // Update the rectangles using the sizes we just added to the data
        const xMargin = 5
        const yMargin = 10

        svg.selectAll(".label")
            .data(scatter_data)
            .join("circle")
            .attr("width", d => Math.max(d["bbox1"]["width"], d["bbox2"]["width"])+ 2 * xMargin)
            .attr("height", d => Math.max(d["bbox1"]["height"], d["bbox2"]["height"]) * 2 + 2 * yMargin)
            // .attr("height", d => d["bbox2"]["height"] * 2 + 2 * yMargin)
            .attr('transform', function(d) {return `translate(-10, 8)`})
            // .attr('transform', function(d) {return `translate(-7, 14)`}) // hardcoded

}, [scatter_data]);


return (
    <React.Fragment>
        <div ref={wrapperRef} style={{marginTop: 40}}>
            <svg ref={svgRef} style={{overflow: "visible"}}/>
            {/* {x_scatter[0]} */}
        </div>
    </React.Fragment>
);
}
export default DataMapVisualization