import React, {useEffect, useRef} from "react";
import * as d3 from "d3";
import {DataPoint, DataArray} from "../types";
import {contColor as color} from "../utils/colorMaps";

interface Props {
    census: {[key:string]: number}
}

const HeatMapPlot: React.FunctionComponent<Props> = ({census}: Props) => {
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

    const defaultProfessions = ["electrician", "secretary", "CEO"];

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

    useEffect(() => {

        // Ref to current svg object
        const svg = d3.select(svgRef.current);

        // Set the size of the viewBox
        svg.attr("viewBox", [0, 0, width, height])

        // Define x axis as scaleBand
        var x = d3.scaleBand()
            .range([margin.left, width - margin.right])
            .domain(Array.from(Array(nCols).keys()).map(i => i.toString()));

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
            .attr("y", 2)
            .attr("rx", 0)
            .attr("ry", 0)
            .attr("width", size )
            .attr("height", size )
            .style("fill", function(d) { return color(d.census * 100)} )
            .style("stroke-width", 0)
            .style("stroke", "none")
            .style("opacity", 1)

        // Additional annotations on top
        svg.append("text")
            .attr("x", 0)
            .attr("y", 16)
            .attr('transform', function(d) {return `translate(10, 0)`})
            .style("font-size", "7px")
            .text("Male dominated professions");

        svg.append("text")
            .attr("x", 195)
            .attr("y", 16)
            .attr('transform', function(d) {return `translate(2, 0)`})
            .style("font-size", "7px")
            .text("Female dominated professions");


    }, [])


    return (
        <React.Fragment>
            <div ref={wrapperRef}>
                <svg ref={svgRef} style={{overflow: "visible"}}/>
            </div>
        </React.Fragment>
    );
}

export default HeatMapPlot;