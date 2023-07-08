import React, {useEffect, useRef, useState} from 'react';
import * as d3 from "d3";
import {DataArray, DataPoint} from "../../types";
import {contColor as color, contColor, discreteColor} from "../../utils/colorMaps";
import "./styles.scss"
import {capitalize, deepCopyArray} from "../../utils";


interface Props {
    data: DataArray;
    activeProfessions: string[] | null;
    activeLayer: number,
    activeAlgorithm: string,
    sort: string,
    profession: string
}

enum Sort {
    Alphabet = "Alphabet",
    FemaleDominated = "Female dominated first",
    MaleDominated = "Male dominated first"
}

const LinePlot: React.FunctionComponent<Props> = ({data, activeProfessions, activeLayer, activeAlgorithm, sort, profession}: Props) => {

    // `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    // Default width and height
    const w = 800;
    const h = 550;

    const opacity_off = 0.3;

    const margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 20
    };

    const [professions, setProfessions] = useState([]);
    const [simulationExecuted, setSimulationExecuted] = useState(false);

    function color(pronoun: string, census: number) {
        if (pronoun === "mask") {
            return contColor(census*100);
        } else {
            return discreteColor(pronoun);
        }
    }

    // Hovering
    const [hoverProfession, setHoverProfession] = useState("");

    // Hovering actions
    function highlight(profession: string) {
        const selected_prof = profession;
        const svg = d3.select(svgRef.current);

        svg.selectAll(".dot." + selected_prof)
            .transition()
            .duration(200)
            .attr("r", 12);

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
            .attr("r", 7);

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
        if (hoverProfession !== "") {
            doNotHighlight()
            highlight(hoverProfession)
        } else {
            doNotHighlight()
        }
    }, [hoverProfession])


    function handleHighlight() {
        var selected_prof = d3.select(this).attr("profession");
        setHoverProfession(selected_prof);
    }

    function handleDoNotHighlight() {
        doNotHighlight()
    }

    function sortData(data: any[]) {
        if (sort === Sort.Alphabet) {
            return data.sort((a, b) => b.profession.localeCompare(a.profession));
        } else if (sort === Sort.FemaleDominated) {
            return data.sort((a, b) => b.profession.localeCompare(a.profession)).sort((a: any, b: any) => {
                if (a.census === b.census) {
                    return 0;
                }
                return b.census > a.census ? -1 : 1;
            });
        } else if (sort === Sort.MaleDominated) {
            return data.sort((a, b) => b.profession.localeCompare(a.profession)).sort((a: any, b: any) => {
                if (a.census === b.census) {
                    return 0;
                }
                return b.census < a.census ? -1 : 1;
            });
        }

        return data;
    }

    useEffect(() => {
        // Ref to current svg object
        const svg = d3.select(svgRef.current);

        // Filter data

        const filteredData = sortData(data.filter(entry => entry.layer === activeLayer && entry.algorithm === activeAlgorithm && (activeProfessions.includes(entry.profession) || entry.profession === profession) && entry.dHe));
        

        // Set height depending on professions
        const width = dimensions ? dimensions.width : w;
        const height = filteredData.length*18;

        // Set the size of the viewBox
        svg.attr("viewBox", [0, 0, width, height]).style("overflow", "visible")

        // Axis
        const x = d3.scaleLinear()
            .domain([0, 1])
            .range([margin.left + 75, width - margin.right]);

        // Plotting professions
        const professions = filteredData.map(d => d.profession)

        const y = d3.scalePoint()
            .domain(professions)
            .range([height - margin.bottom, margin.top + 40]);

        // Update available professions
        filteredData.forEach((d) => {
            if (!professions.includes(d.profession)) {
                professions.push(d.profession);
            }
        });

        // Create lines
        const lines = svg.selectAll(".line")
            .data(filteredData)
            .join("path")
            .attr("class", function (d) {
                return "line " + d.profession + " mask";
            })
            .attr("profession", function (d) {
                return capitalize(d.profession)
            })
            .attr("layer", function (d) {
                return d.layer
            })
            .attr("algorithm", function (d) {
                return d.algorithm
            })
            .attr('d', d => d3.line()([[x(0), y(d.profession)], [x(1), y(d.profession)]]))
            .style("fill", "black")
            .attr('stroke',  d => d.profession === profession ? 'rgba(0,0,0, 0.9)' : 'rgba(0,0,0, 0.6)')
            .attr('stroke-width', d => d.profession === profession ? '0.4px' : '0.1px');

        // Create end lines

        svg.select(".startLine").remove()
        svg.append("path")
            .attr("class", "startLine")
            .attr('d', d => d3.line()([[x(0), y(professions[0]) + 10], [x(0), y(professions[professions.length - 1]) - 20]]))
            .attr('stroke', contColor(1.7))
            .attr('stroke-width', '2px');


        svg.select(".endLine").remove()
        svg.append("path")
            .attr("class", "endLine")
            .attr('d', d => d3.line()([[x(1), y(professions[0]) + 10], [x(1), y(professions[professions.length - 1]) - 20]]))
            .style("fill", "black")
            .attr('stroke', contColor(96.4))
            .attr('stroke-width', '2px');

        // Create lines titles
        svg.select(".startTitle").remove()
        svg.append("text")
            .attr("class", "startTitle")
            .text("Embedding for \"he\"")
            .attr("transform", "translate(80,30)")
            .style("font-size", "12px")
            .style("font-weight", "800")
            .style("fill", contColor(1.7));

        svg.select(".endTitle").remove()
        svg.append("text")
            .attr("class", "endTitle")
            .text("Embedding for \"she\"")
            .attr("transform", `translate(${width-130},30)`)
            .style("font-size", "12px")
            .style("font-weight", "800")
            .style("fill", contColor(97));

        // Create y axis
        svg.select(".yaxis").remove()
        svg.append("g")
            .attr("class", "yaxis")
            .attr("transform", `translate(${margin.left + 75},0)`)
            .call(d3.axisLeft(y))
            .style("font-size", "10px")
            .style("fill", "black");
        svg.select(".domain").remove() // remove axis stroke

        // Create circles
        const circles = svg.selectAll(".dot")
            .data(filteredData)
            .join("circle")
            .attr("class", function (d) {
                return "dot " + d.profession + " mask";
            })
            .attr("pronoun", function (d) {
                return d.pronoun
            })
            .attr("profession", function (d) {
                return d.profession
            })
            .attr("layer", function (d) {
                return d.layer
            })
            .attr("algorithm", function (d) {
                return d.algorithm
            })
            .attr("r", 6)
            .style("fill", d => color(d.pronoun, d.census) as string)
            .style("opacity", 1)
            //.transition() // Transition must be located before the elements that we want to transition, coordinates in this case
            .attr("cx", d => x(d.dHe))
            .attr("cy", d => y(d.profession))
            .on("mouseover", handleHighlight)
            .on("mouseleave", handleDoNotHighlight);

        // Create background for labels
        svg.selectAll(".rect")
            .data(filteredData)
            .join("rect")
            .attr("class", function (d) {
                return "rect " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "white")
            .attr('stroke', d => color(d.pronoun, d.census) as string)
            .attr('stroke-width', '2')
            .style("z-index", 100)
            .attr("x", d => x(d.dHe))
            .attr("y", d => y(d.profession))
            .attr("dy", "1.35em");

        // Create labels
        var labels = svg.selectAll(".text")
            .data(filteredData)
            .join("text")
            .attr("class", function (d) {
                return "text " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "black")
            .style("font-weight", "bold")
            .style("z-index", 1000)
            .style("font-size", "14px")
            .attr("x", d => x(d.dHe))
            .attr("y", d => y(d.profession))
            .attr("dy", "1.35em")
            .attr('transform', d => translatePos(d, 0, 14)) // hardcoded
            .text(function (d) {
                return `${d.profession.toUpperCase()}`
            });

        var labels2 = svg.selectAll(".text2")
            .data(filteredData)
            .join("text")
            .attr("class", function (d) {
                return "text2 " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "black")
            .style("z-index", 1000)
            .style("font-size", "14px")
            .attr("x", d => x(d.dHe))
            .attr("y", d => y(d.profession))
            .attr("dy", "1.35em")
            .attr('transform', d => translatePos(d, 0, 64))// hardcoded
            .text(function (d) {
                return `Groundtruth: ${(d.census*100).toFixed(1)}% females`
            });

        var labels3 = svg.selectAll(".text3")
            .data(filteredData)
            .join("text")
            .attr("class", function (d) {
                return "text3 " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "black")
            .style("z-index", 1000)
            .style("font-size", "14px")
            .attr("x", d => x(d.dHe))
            .attr("y", d => y(d.profession))
            .attr("dy", "1.35em")
            .attr('transform', d => translatePos(d, 0, 28)) // hardcoded
            .text(function (d) {
                return `Similarity to "she": ${(d.dHe*100).toFixed(1)}%`
            });

        var labels4 = svg.selectAll(".text4")
            .data(filteredData)
            .join("text")
            .attr("class", function (d) {
                return "text3 " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", "black")
            .style("z-index", 1000)
            .style("font-size", "14px")
            .attr("x", d => x(d.dHe))
            .attr("y", d => y(d.profession))
            .attr("dy", "1.35em")
            .attr('transform', d => translatePos(d, 0, 42)) // hardcoded
            .text(function (d) {
                return `Similarity to "he": ${(d.dShe*100).toFixed(1)}%`
            });

        var labelsSeparator = svg.selectAll(".textsep")
            .data(filteredData)
            .join("path")
            .attr("class", function (d) {
                return "textsep " + d.profession
            })
            .attr('d', d => d3.line()([[x(d.dHe) + xPath(d), y(d.profession)+68], [x(d.dHe) + xPath(d) + 100, y(d.profession)+68]]))// hardcoded
            .style("visibility", "hidden")
            .style("stroke", "rgba(0,0,0,0.4)")
            .attr('stroke-width', '1px');

        // Resize backgrounds to match text length
        // Save the dimensions of the text elements
        svg.selectAll(".text2")
            .each((d: {[key: string] : any}) => {d["bbox"] = (d3.selectAll(".text2." + d.profession).nodes().filter(n => n['__data__']['pronoun'] === d.pronoun)[0] as SVGSVGElement).getBBox();});

        // Update the rectangles using the sizes we just added to the data
        const xMargin = 8
        const yMargin = 2
        svg.selectAll(".rect")
            .data(filteredData)
            .join("rect")
            .attr("width", d => Math.max(d.bbox.width + 2 * xMargin, 120))
            .attr("height", d => Math.max(d.bbox.height*4 + 3, 0))
            .attr('transform', d => translatePos(d, -xMargin, yMargin+12));

        function translatePos(d: DataPoint, xMargin: number, yMargin: number) {
            if (d.dHe <= 0.25){
                return `translate(${xMargin}, ${yMargin})`
            } else if (d.dHe >= 0.75) {
                return `translate(${xMargin-180}, ${yMargin})`
            } else {
                return `translate(${xMargin-80}, ${yMargin})`
            }
        }

        function xPath(d: DataPoint) {
            if (d.dHe <= 0.25){
                return 0
            } else if (d.dHe >= 0.75) {
                return -180
            } else {
                return -80
            }
        }
    }, [activeProfessions, data, activeLayer, activeAlgorithm, dimensions, sort, profession]);

    return (
        <React.Fragment>
            <div ref={wrapperRef} style={{height: "100%", overflow: "visible"}}>
                <svg ref={svgRef}/>
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

export default LinePlot;
