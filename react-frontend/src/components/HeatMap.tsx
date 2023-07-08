import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {DataPoint} from "../types";
import {contColor as color} from "../utils/colorMaps";


interface Props {
    census: {[key:string]: number};
    profession: string;
    setProfession: (value: string) => void;
}


const HeatMapPlot = ({census, profession, setProfession}: Props) => {
    const [highlightedProfession, setHighlightedProfession] = useState("");
    const nRows = 1;
    const nCols = Math.ceil(Object.keys(census).length / nRows);

    const margin = {
        top: 20,
        right: 10,
        bottom: 20,
        left: 10
    };

    const height = 20;
    const width = 300;

    const svgRef = useRef();
    const wrapperRef = useRef();

    const defaultProfessions = ["electrician", "secretary"];

    // Sort by ascending value
    // Step - 1
    // Create the array of key-value pairs
    var items = Object.keys(census).map(
        (key) => { return [key, census[key]] });

    // Step - 2
    // Sort the array based on the second element (i.e. the value)
    items.sort(
        (first: [string, number], second: [string, number]) => { return first[1] - second[1] }
    );

    const dataReady = items.map(function(item: [string, number], i: number) {
        return {"i": i, "profession": item[0], "census": item[1], "row": i%nRows, "col": Math.floor(i / nRows) , "bbox": {
                width: undefined,
                height: undefined}};
    })


    function hideAllLabels() {
        const svg = d3.select(svgRef.current);
        // Hide labels for all professions
        svg.selectAll(".text1").transition().duration(200).style("visibility", "hidden");
        svg.selectAll(".text2").transition().duration(200).style("visibility", "hidden");
        svg.selectAll(".label").transition().duration(200).style("visibility", "hidden");
        svg.selectAll(".line").transition().duration(200).style("visibility", "hidden");
    }

    function highlightProf(prof: string) {
        const svg = d3.select(svgRef.current);
        hideAllLabels();
        svg.selectAll(".rect")
            .transition()
            .duration(200)
            .style("opacity", 0.1);

        svg.selectAll("." + prof)
            .transition()
            .duration(200)
            .style("visibility", "visible")
            .style("opacity", 1.);
    }
    function highlight (d){
        console.log('highlight')
        const svg = d3.select(svgRef.current);
        var selected_prof = d3.select(this).attr("profession");
        // console.log(d3.select(this))
        setHighlightedProfession(selected_prof);
    }

    function doNotHighlight (d){
        const svg = d3.select(svgRef.current);
        hideAllLabels();
        console.log(svg.selectAll(".rect"))
        svg.selectAll(".rect")
            .transition()
            .duration(200)
            .style("opacity", 1);
        //showDefaultLabels();
        setHighlightedProfession("");
    }

    function showDefaultLabels (delay = 600) {
        const svg = d3.select(svgRef.current);
        // Show the labels for default professions (hardcoded).
        for (let i=0; i<defaultProfessions.length; i++) {
            svg.selectAll("."+defaultProfessions[i]).transition().delay(delay).style("visibility", "visible").style("opacity", 1);
        }
        svg.selectAll("."+profession).transition().delay(delay).style("visibility", "visible").style("opacity", 1);
    }

    useEffect(() => {
        hideAllLabels();
        showDefaultLabels(0);
    }, [profession]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        if (highlightedProfession !== "") {
            hideAllLabels();
            let actProf = highlightedProfession.slice(); // Without this, it does not work
            highlightProf(actProf)
        } else {
            hideAllLabels();
            svg.selectAll(".rect")
            .transition()
            .duration(200)
            .style("opacity", 1);
            showDefaultLabels();
        }
    }, [highlightedProfession])


    useEffect(() => {

        // Ref to current svg object
        const svg = d3.select(svgRef.current);

        // Set the size of the viewBox
        svg.attr("viewBox", [0, 0, width, height])

        // Define x axis as scaleBand
        var x = d3.scaleBand()
            .range([margin.left, width - margin.right])
            .domain(Array.from(Array(nCols).keys()).map(i => i.toString()))
            .padding(0.05);

        // Size for each element in the x axis.
        var size = x.bandwidth();

        // add the squares
        svg.selectAll()
            .data(dataReady, function(d) {return d.row.toString()+':'+d.col.toString();})
            .enter()
            .append("rect")
            .attr("profession", d => d.profession)
            .attr("class", function (d) {
                return "rect " + d.profession
            })
            .attr("x", function(d) { return x(d.col.toString()) })
            .attr("rx", 1)
            .attr("ry", 1)
            .attr("width", size )
            .attr("height", size )
            .style("fill", function(d) { return color(d.census * 100)} )
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 1)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)
            .on("click", function (d) {
                const prof = d['target']['__data__']['profession'];
                setProfession(prof);
            });

        // Create background for labels
        svg
            .selectAll(".label")
            .data(dataReady)
            .join("rect")
            .attr("class", function (d) {
                return "label " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "white")
            .attr("rx", 1)
            .attr("ry", 1)
            .attr('stroke', d => color(d.census * 100))
            .attr('stroke-width', '0.5')
            .style("z-index", 100)
            .attr("x", d => x(d.col.toString()))
            .attr("y", d => (defaultProfessions.includes(d.profession)) ? -18.5 : 0);

        // Create labels for profession name
        svg
            .selectAll(".text1")
            .data(dataReady)
            .join("text")
            .attr("class", function (d) {
                return "text1 " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "black")
            .style("z-index", 1000)
            .style("font-size", "3px")
            .style("font-weight", "bold")
            .attr("x", d => x(d.col.toString()))
            .attr("y", d => (defaultProfessions.includes(d.profession)) ? -18.5 : 0)
            .attr('transform', function(d) {return `translate(-7, 10)`}) // hardcoded
            .text(function (d) {
                return `${d.profession.toUpperCase()}`
            });

        // Create labels for percentage of females
        svg
            .selectAll(".text2")
            .data(dataReady)
            .join("text")
            .attr("class", function (d) {
                return "text2 " + d.profession
            })
            .style("visibility", "hidden")
            .style("z-index", 1000)
            .style("font-size", "3px")
            .style("fill", "black")
            .attr("x", d => x(d.col.toString()))
            .attr("y", d => (defaultProfessions.includes(d.profession)) ? -18.5 : 0)
            .attr('transform', function(d) {return `translate(-7, 14)`}) // hardcoded
            .text(function (d) {
                return `Females: ${(d.census*100).toFixed(1)}%`
            });

        // // Resize backgrounds to match text length
        // // Save the dimensions of the text elements
        svg.selectAll(".text2")
            .each((d: DataPoint) => {d["bbox"] = (d3.selectAll(".text2." + d.profession).nodes()[0] as SVGSVGElement).getBBox();});

        // Update the rectangles using the sizes we just added to the data
        const xMargin = 3
        const yMargin = 2

        svg.selectAll(".label")
            .data(dataReady)
            .join("rect")
            .attr("width", d => d["bbox"]["width"] + 2 * xMargin)
            // .attr("width", 10)
            .attr("height", d => d["bbox"]["height"] * 2 + 2 * yMargin)
            // .attr("height", 10)
            .attr('transform', function(d) {return `translate(-9, 5)`})

        // End resize rectangles

        // Create triangles to place between squares and labels
        const markerBoxHeight = 20;
        const markerBoxWidth = 20;
        const refY = markerBoxHeight / 2;
        const refX = markerBoxWidth / 2;

        svg.selectAll(".line")
            .data(dataReady)
            .join("path")
            .attr("class", function (d) {
                return "line " + d.profession
            })
            .attr('d', d => d3.line()([[x(d.col.toString()), 5], [x(d.col.toString()), 3]]))
            .attr('stroke', 'rgba(0,0,0,0)')
            .attr('stroke-width', '0.1px')
            .attr('marker-end', d => `url(#arrow-${d.profession})`)
            .attr('transform', function(d) {return `translate(${size/2}, 0.8)`})
            .style('visibility', 'hidden');

        svg.selectAll(".marker")
            .data(dataReady)
            .join('marker')
            .attr("class", function (d) {
                return "marker " + d.profession
            })
            .attr("id", function (d) {
                return "arrow-" + d.profession
            })
            .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
            .attr('refX', d => defaultProfessions.includes(d.profession) ? refX+49 : refX)
            .attr('refY', refY)
            .attr('markerWidth', markerBoxWidth)
            .attr('markerHeight', markerBoxHeight)
            .attr('orient', d => defaultProfessions.includes(d.profession) ? 90 : 'auto-start-reverse')
            .append('path')
            .attr('d', d3.line()([[0, 0], [0, 20], [20, 10]]))
            .attr('fill', d=>color(d.census * 100));

        // Additional annotations on top
        svg.append("text")
            .attr("x", 0)
            .attr("y", -13)
            .attr('transform', function(d) {return `translate(10, -5)`})
            .style("font-size", "4px")
            .text("Male dominated professions");

        svg.append("text")
            .attr("x", 227)
            .attr("y", -13)
            .attr('transform', function(d) {return `translate(5, -5)`})
            .style("font-size", "4px")
            .text("Female dominated professions");

        // Line between texts
        svg
            .append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
            .attr('refX', refX)
            .attr('refY', refY)
            .attr('markerWidth', markerBoxWidth)
            .attr('markerHeight', markerBoxHeight)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', d3.line()([[0, 0], [0, 20], [20, 10]]))
            .attr('fill', '#bababa');

        svg.append("path")
            .attr('d', d3.line()([[76, -6], [215, -6]]))
            .attr('stroke', '#bababa')
            .attr('stroke-width', '0.1px')
            .attr('marker-end', 'url(#arrow)')
            .attr('marker-start', 'url(#arrow)');

        svg.append("text")
            .attr("x", 150)
            .attr('transform', function(d) {return `translate(-30, -8)`})
            .style("font-size", "3px")
            .style("fill", "#bababa")
            .text("Hover over a square to see a profession");

        showDefaultLabels(100);
    }, [])


    return (
        <React.Fragment>
            <div ref={wrapperRef} style={{marginTop: 120}}>
                <svg ref={svgRef} style={{overflow: "visible"}}/>
            </div>
        </React.Fragment>
    );
}

export default HeatMapPlot;