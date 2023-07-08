import React, {useEffect, useRef, useState} from 'react';
import * as d3 from "d3";
import {contColor, contColor as color} from "../../utils/colorMaps";
import { DataPointRegression, linearRegression } from './utils';

/*
interface Props {
    data: { census: number, he_prob: number, she_prob: number, profession: string }[];
    activeProfession: string;
    setActiveProfession: (arg0: string) => void
}*/

interface Props {
    data: DataPointRegression[];
    maleCluster: {x: number, y: number};
    femaleCluster: {x: number, y: number};
    activeProfession: string | null;
    setActiveProfession: (profession: string | null) => void;
    activeLayer: number,
    activeAlgorithm: string,
}

const ScatterPlot: React.FunctionComponent<Props> = ({data, maleCluster, femaleCluster, activeProfession, setActiveProfession, activeLayer, activeAlgorithm}: Props) => {

    // `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    console.log("r2 is: ", linearRegression(data)["r2"]);

    //data[activeAlgorithm][activeLayer].forEach((element) => element.census == null ? console.log("is null for "+activeAlgorithm + " Layer "+activeLayer+ " profession "+element["profession"]) : null);

    const opacity_off = 1;
    const [hoverProfession, setHoverProfession] = useState("");

    const margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 60
    };

    const width = 450;
    const height = 450;

    // Axis
    const x = d3.scaleLinear()
        .domain([-10, 100]).nice()
        .range([margin.left, width-margin.right]);

    const y = d3.scaleLinear()
        .domain([-10, 100]).nice()
        .range([height-margin.bottom, 0]);

    // Hovering actions
    function highlight(profession: string) {
        const selected_prof = profession;
        const svg = d3.select(svgRef.current);

        svg.selectAll(".dot")
            .transition()
            .style("opacity", 0.2);

        svg.selectAll(".dot." + selected_prof)
            .transition()
            .duration(200)
            .attr("r", 10)
            .style("opacity", 1.0);

        svg.selectAll(".text." + selected_prof)
            .transition()
            .duration(200)
            .style("visibility", "visible");

        svg.selectAll(".text2." + selected_prof)
            .transition()
            .duration(200)
            .style("visibility", "visible");

        svg.selectAll(".text3." + selected_prof)
            .transition()
            .duration(200)
            .style("visibility", "visible");

        svg.selectAll(".text4." + selected_prof)
            .transition()
            .duration(200)
            .style("visibility", "visible");

        svg.selectAll(".textsep." + selected_prof)
            .transition()
            .duration(200)
            .style("visibility", "visible");

        svg.selectAll(".rect." + selected_prof)
            .transition()
            .duration(200)
            .style("visibility", "visible");
    }

    function doNotHighlight() {
        const svg = d3.select(svgRef.current);

        svg.selectAll(".dot")
            .transition()
            .attr("r", 5)
            .style("opacity", opacity_off);

        svg.selectAll(".text").transition()
            .duration(100)
            .style("visibility", "hidden");

        svg.selectAll(".text2").transition()
            .duration(100)
            .style("visibility", "hidden");

        svg.selectAll(".text3").transition()
            .duration(100)
            .style("visibility", "hidden");

        svg.selectAll(".text4").transition()
            .duration(100)
            .style("visibility", "hidden");

        svg.selectAll(".textsep").transition()
            .duration(100)
            .style("visibility", "hidden");

        svg.selectAll(".rect").transition()
            .duration(100)
            .style("visibility", "hidden");
    }

    useEffect(() => {
        if (activeProfession !== "") {
            doNotHighlight()
            highlight(activeProfession)
        } else {
            doNotHighlight()
        }
    }, [activeProfession])


    function handleHighlight() {
        var selected_prof = d3.select(this).attr("profession");
        setActiveProfession(selected_prof);
    }

    function handleDoNotHighlight() {
        doNotHighlight()
    }


    useEffect(() => {
        // Ref to current svg object
        const svg = d3.select(svgRef.current);
        console.log("activeAlgo is: ", activeAlgorithm);

        const dataReady = [...data.map(e => ({...e, bbox: {width: undefined, height: undefined}}))];

        // Set the size of the viewBox
        svg.attr("viewBox", [0, 0, width, height])

        // Include axis
        svg.append("g")
            .attr("transform", `translate(0,${height-margin.bottom})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("class", "axis-label")
            .text("Females in occupation (%)")
            .attr("transform", `translate(${width/2},50)`)
            .style("font-size", "14px")
            .style("fill", "black");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .append("text")
            .attr("class", "axis-label")
            .text("Normalized distance of \"she\" (%)")
            .attr("transform", `translate(-45,145) rotate(-90)`)
            .style("font-size", "14px")
            .style("fill", "black");


        // Create circles
        const circles = svg.selectAll(".dot")
            .data(dataReady)
            .join("circle")
            .attr("class", function (d) {
                return "dot " + d.profession
            })
            .attr("profession", d=>d.profession)
            .attr("r", 5)
            .style("fill", d => color(d.census))
            .style("opacity", opacity_off)
            .on("mouseover", handleHighlight)
            .on("mouseleave", handleDoNotHighlight)
            .transition() // Transition must be located before the elements that we want to transition, coordinates in this case
            .attr("cx", d => x(d.census * 100))
            .attr("cy", d => y(d.metric * 100));

        // Create background for labels
        svg.selectAll(".rect")
            .data(dataReady)
            .join("rect")
            .attr("class", function (d) {
                return "rect " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "white")
            .attr('stroke', d=>color(d.census))
            .attr('stroke-width', '2')
            .style("z-index", 100)
            .attr("x", d => x(d.census * 100))
            .attr("y", d => y(d.metric * 100))
            .attr("dy", "1.35em");

        // Create labels
        var labels = svg.selectAll(".text")
            .data(dataReady)
            .join("text")
            .attr("class", function (d) {
                return "text " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "black")
            .style("font-weight", "bold")
            .style("z-index", 1000)
            .style("font-size", "14px")
            .attr("x", d => x(d.census * 100))
            .attr("y", d => y(d.metric * 100))
            .attr("dy", "1.35em")
            .attr('transform', function(d) {return `translate(-70, 10)`}) // hardcoded
            .text(function (d) {
                return `${d.profession.toUpperCase()}`
            });

        var labels2 = svg.selectAll(".text2")
            .data(dataReady)
            .join("text")
            .attr("class", function (d) {
                return "text2 " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "black")
            .style("z-index", 1000)
            .style("font-size", "14px")
            .attr("x", d => x(d.census* 100))
            .attr("y", d => y(d.metric * 100))
            .attr("dy", "1.35em")
            .attr('transform', function(d) {return `translate(-70, 60)`}); // hardcoded

        var labels3 = svg.selectAll(".text3")
            .data(dataReady)
            .join("text")
            .attr("class", function (d) {
                return "text3 " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "black")
            .style("z-index", 1000)
            .style("font-size", "14px")
            .attr("x", d => x(d.census * 100))
            .attr("y", d => y(d.metric * 100))
            .attr("dy", "1.35em")
            .attr('transform', function(d) {return `translate(-70, 24)`}) // hardcoded
            .text(function (d) {
                return `LM Bias: ${(d.metric*100).toFixed(1)}%`
            });

        var labels4 = svg.selectAll(".text4")
            .data(dataReady)
            .join("text")
            .attr("class", function (d) {
                return "text3 " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "black")
            .style("z-index", 1000)
            .style("font-size", "14px")
            .attr("x", d => x(d.census * 100))
            .attr("y", d => y(d.metric * 100))
            .attr("dy", "1.35em")
            .attr('transform', function(d) {return `translate(-70, 38)`}) // hardcoded
            .text(function (d) {
                return `Census: ${(d.census*100).toFixed(1)}%`
            });

        // Resize backgrounds to match text length
        // Save the dimensions of the text elements
        svg.selectAll(".text2")
            .each((d: {[key: string] : any}) => {d["bbox"] = (d3.selectAll(".text2." + d.profession).nodes()[0] as SVGSVGElement).getBBox();});

        // Update the rectangles using the sizes we just added to the data
        const xMargin = 8
        const yMargin = 4
        svg.selectAll(".rect")
            .data(dataReady)
            .join("rect")
            .attr("width", d => Math.max(d.bbox.width + 2 * xMargin, 120))
            .attr("height", d => Math.max(d.bbox.height*5 - 4, 50))
            .attr('transform', function(d) {return `translate(-${xMargin+70}, ${yMargin+10})`});


    }, [data]);

    return (
        <React.Fragment>
            <div ref={wrapperRef} style={{marginBottom: "2rem", height: "100%", width: "100%"}}>
                <svg ref={svgRef} style={{overflow: "visible", height: "100%", width: "100%"}}/>
            </div>
        </React.Fragment>
    );
};

const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        const observeTarget = ref.current;
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                setDimensions(entry.contentRect);
            });
        });
        resizeObserver.observe(observeTarget);
        return () => {
            resizeObserver.unobserve(observeTarget);
        };
    }, [ref]);
    return dimensions;
};

export default ScatterPlot;
