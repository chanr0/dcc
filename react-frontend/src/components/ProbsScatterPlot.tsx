import React, {useEffect, useRef, useState} from 'react';
import * as d3 from "d3";
import {contColor, contColor as color} from "../utils/colorMaps";

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


interface Props {
    data: { census: number, he_prob: number, she_prob: number, profession: string }[];
    activeProfession: string;
    setActiveProfession: (arg0: string) => void
}

const ScatterPlot: React.FunctionComponent<Props> = ({data, activeProfession, setActiveProfession}: Props) => {

    // `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

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

    // Axis selector
    var axisVars = {he_prob: "Probability for \"he\" (%)", census: "Groundtruth females (%)"};
    const [xAxisVar, setXAxisVar] = useState("census");
    const [yAxisVar, setYAxisVar] = useState("she_prob");


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
            .attr("r", 12)
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
            .attr("r", 7)
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
        doNotHighlight();
        if (activeProfession !== "") {
            highlight(activeProfession)
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
        doNotHighlight();
        // Ref to current svg object
        const svg = d3.select(svgRef.current);

        const dataReady = [...data.map(e => ({...e, bbox: {width: undefined, height: undefined}}))];

        // Set the size of the viewBox
        svg.attr("viewBox", [0, 0, width, height])

        // Include axis.
        if (svg.selectAll(".x-axis").empty()) {
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height-margin.bottom})`)
                .call(d3.axisBottom(x))
            //.append("text")
            //.text("Probability for \"he\" (%)")
            //.attr("transform", `translate(${width/2},50)`)
            //.style("font-size", "18px")
            //.style("fill", "black");
        }

        if (svg.selectAll(".y-axis").empty()) {
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))
            .append("text")
            .text("Probability for \"she\" (%)")
            .attr("transform", `translate(-45,115) rotate(-90)`)
            .style("font-size", "18px")
            .style("fill", "black");
        }

        // Remove tick for -10 probability in axes
        svg.selectAll(".tick text")
            .filter(function(d) { return d === -10; })
            .remove();

        // Create circles
        const circles = svg.selectAll(".dot")
            .data(dataReady)
            .join("circle")
            .attr("class", function (d) {
                return "dot " + d.profession
            })
            .attr("profession", d=>d.profession)
            .attr("r", 7)
            .style("fill", d => color(d.census * 100))
            .style("stroke", "white")
            .style("stroke-width", "0.5px")
            .style("opacity", opacity_off)
            .on("mouseover", handleHighlight)
            .on("mouseleave", handleDoNotHighlight)
            .transition() // Transition must be located before the elements that we want to transition, coordinates in this case
            .attr("cx", d => x(d[xAxisVar] * 100))
            .attr("cy", d => y(d[yAxisVar] * 100));

        // // Create background for labels
        // svg.selectAll(".rect")
        //     .data(dataReady)
        //     .join("rect")
        //     .attr("class", function (d) {
        //         return "rect " + d.profession
        //     })
        //     .style("visibility", "hidden")
        //     .style("fill", "white")
        //     .attr('stroke', d => color(d.census * 100))
        //     .attr('stroke-width', '2')
        //     .style("z-index", 100)
        //     .attr("x", d => x(d[xAxisVar] * 100))
        //     .attr("y", d => y(d.she_prob * 100))
        //     .attr("dy", "1.35em");

        // // Create labels
        // var labels = svg.selectAll(".text")
        //     .data(dataReady)
        //     .join("text")
        //     .attr("class", function (d) {
        //         return "text " + d.profession
        //     })
        //     .style("visibility", "hidden")
        //     .style("fill", "black")
        //     .style("font-weight", "bold")
        //     .style("z-index", 1000)
        //     .style("font-size", "18px")
        //     .attr("x", d => x(d[xAxisVar] * 100))
        //     .attr("y", d => y(d.she_prob * 100))
        //     .attr("dy", "1.35em")
        //     .attr('transform', d => translatePos(d, -70, 10)) // hardcoded
        //     .text(function (d) {
        //         return `${d.profession.toUpperCase()}`
        //     });

        // var labels2 = svg.selectAll(".text2")
        //     .data(dataReady)
        //     .join("text")
        //     .attr("class", function (d) {
        //         return "text2 " + d.profession
        //     })
        //     .style("visibility", "hidden")
        //     .style("fill", "black")
        //     .style("z-index", 1000)
        //     .style("font-size", "16px")
        //     .attr("x", d => x(d[xAxisVar] * 100))
        //     .attr("y", d => y(d.she_prob * 100))
        //     .attr("dy", "1.35em")
        //     .attr('transform', d => translatePos(d, -70, 78)) // hardcoded
        //     .text(function (d) {
        //         return `Groundtruth: ${(d.census * 100).toFixed(1)}% females`
        //     });

        // var labels3 = svg.selectAll(".text3")
        //     .data(dataReady)
        //     .join("text")
        //     .attr("class", function (d) {
        //         return "text3 " + d.profession
        //     })
        //     .style("visibility", "hidden")
        //     .style("fill", "black")
        //     .style("z-index", 1000)
        //     .style("font-size", "16px")
        //     .attr("x", d => x(d[xAxisVar] * 100))
        //     .attr("y", d => y(d.she_prob * 100))
        //     .attr("dy", "1.35em")
        //     .attr('transform', d => translatePos(d, -70, 30)) // hardcoded
        //     .text(function (d) {
        //         return `LM \"she\" prob: ${(d.she_prob*100).toFixed(1)}%`
        //     });

        // var labels4 = svg.selectAll(".text4")
        //     .data(dataReady)
        //     .join("text")
        //     .attr("class", function (d) {
        //         return "text4 " + d.profession
        //     })
        //     .style("visibility", "hidden")
        //     .style("fill", "black")
        //     .style("z-index", 1000)
        //     .style("font-size", "16px")
        //     .attr("x", d => x(d[xAxisVar] * 100))
        //     .attr("y", d => y(d.she_prob * 100))
        //     .attr("dy", "1.35em")
        //     .attr('transform', d => translatePos(d, -70, 50)) // hardcoded
        //     .text(function (d) {
        //         return `LM \"he\" prob: ${(d.he_prob*100).toFixed(1)}%`
        //     });

        // var labelsSeparator = svg.selectAll(".textsep")
        //     .data(dataReady)
        //     .join("path")
        //     .attr("class", function (d) {
        //         return "textsep " + d.profession
        //     })
        //     .attr('d', d => {
        //         let offset = d[xAxisVar] > 0.65 ? -80 : 0;
        //         return d3.line()([[x(d[xAxisVar] * 100)-70 + offset, y(d.she_prob * 100) + 80], [x(d[xAxisVar] * 100) + 70 + offset, y(d.she_prob * 100) + 80]])
        //     })// hardcoded
        //     .style("visibility", "hidden")
        //     .style("stroke", "rgba(0,0,0,0.4)")
        //     .attr('stroke-width', '1px');

        // // Resize backgrounds to match text length
        // // Save the dimensions of the text elements
        // svg.selectAll(".text2")
        //     .each((d: {[key: string] : any}) => {d["bbox"] = (d3.selectAll(".text2." + d.profession).nodes().filter(n => n['__data__']['pronoun'] === d.pronoun)[0] as SVGSVGElement).getBBox();});

        // // Update the rectangles using the sizes we just added to the data
        // const xMargin = 8
        // const yMargin = 2
        // svg.selectAll(".rect")
        //     .data(dataReady)
        //     .join("rect")
        //     .attr("width", 240)
        //     .attr("height", 98)
        //     .attr('transform', d => translatePos(d, -(xMargin+70), yMargin+8));


        // function translatePos(d: { census: number, he_prob: number, she_prob: number, profession: string }, xMargin: number, yMargin: number) {
        //     if (d[xAxisVar] > 0.65) {
        //         return `translate(${xMargin-80}, ${yMargin})`
        //     }
        //     else
        //         {
        //             return `translate(${xMargin}, ${yMargin})`
        //         }
        // }

    }, [xAxisVar, yAxisVar]);

    return (
        <React.Fragment>
            <div ref={wrapperRef} style={{marginBottom: "0.5rem"}}>
                <svg ref={svgRef} style={{overflow: "visible", zIndex: "1000", position: "relative"}}/>
                <select value={xAxisVar} onChange={event => setXAxisVar(event.target.value)} style={{transform: "translate(5em, -0.5em)"}}>
                    {Object.keys(axisVars).map(v => (
                        <option key={v} value={v} selected={v === xAxisVar} disabled={v === yAxisVar}>{axisVars[v]}</option>
                    ))}
                </select>
            </div>
        </React.Fragment>
    );
};

export default ScatterPlot;
