import React, {useEffect, useRef, useState} from 'react';
import * as d3 from "d3";
import {DataArray, DataPoint} from "../../types";
import {contColor, discreteColor} from "../../utils/colorMaps";
import {deepCopyArray} from "../../utils";

interface Props {
    data: DataArray;
    activeProfession: string | null;
    setActiveProfession: (profession: string | null) => void;
    activeLayer: number,
    activeAlgorithm: string,
}

const ScatterPlot: React.FunctionComponent<Props> = ({data, activeProfession, setActiveProfession, activeLayer, activeAlgorithm}: Props) => {

    // `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    // Default width and height
    const w = 800;
    const h = 450;

    const opacity_off = 0.3;

    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };

    const [professions, setProfessions] = useState([]);
    const [execute, setExecute] = useState(1);
    const [currentProfession, setCurrentProfession] = useState("");

    function color(pronoun: string, census: number) {
        if (pronoun === "mask") {
            return contColor(census*100);
        } else {
            return discreteColor(pronoun);
        }
    }

    function displayProfession(profession: string) {
        const svg = d3.select(svgRef.current);

        if (!profession) {
            return;
        }

        let suffix = profession ? `.${profession}` : ""

        svg.selectAll(".dot" + suffix)
            .transition()
            .duration(200)
            .attr("transform", (d: DataPoint) => `translate(${d.x}, ${d.y}) scale(2,2)`)
            .style("opacity", 1.0);

        svg.selectAll(".text" + suffix)
            .transition()
            .duration(200)
            .style("visibility", "visible");

        svg.selectAll(".rect" + suffix)
            .transition()
            .duration(200)
            .style("visibility", "visible");
    }

    function hideProfessions() {
        const svg = d3.select(svgRef.current);

        svg.selectAll(`.dot`)
            .transition()
            .duration(200)
            .attr("transform", (d: DataPoint) => `translate(${d.x}, ${d.y})`)
            .style("opacity", opacity_off)

        svg.selectAll(`.dot.mask`)
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("transform", (d: DataPoint) => `translate(${d.x}, ${d.y})`)

        svg.selectAll(".text").transition()
            .duration(100)
            .style("visibility", "hidden");

        svg.selectAll(".rect").transition()
            .duration(100)
            .style("visibility", "hidden");
    }

    useEffect(() => {
        setExecute(execute+1);
    }, [data, activeLayer, activeAlgorithm]);

    useEffect(() => {
        console.log("Hiding");
        hideProfessions();
        if (activeProfession !== "") {
            let actProf = activeProfession.slice(); // Without this, it does not work
            displayProfession(actProf);
            console.log("Displayed ", actProf);
        }
    }, [activeProfession, currentProfession])

    useEffect(() => {
        if (currentProfession) {
            hideProfessions();
            displayProfession(currentProfession);
        }
    }, [currentProfession])

    function handleHighlight() {
        var selected_prof = d3.select(this).attr("profession");
        setCurrentProfession(selected_prof);
    }

    function handleDoNotHighlight() {
        setCurrentProfession("");
        hideProfessions();
    }


    useEffect(() => {
        const width = dimensions ? dimensions.width : w;
        const height = dimensions ? dimensions.height : h;

        // Ref to current svg object
        const svg = d3.select(svgRef.current);

        // Set the size of the viewBox
        svg.attr("viewBox", [0, 0, width, height])

        setProfessions([]);

        // Shape encoder
        const shape = d3.scaleOrdinal([true, false], d3.symbols.map(s => d3.symbol().type(s)()))

        // Filter data
        const filteredData = data.filter(entry => entry.layer === activeLayer && entry.algorithm === activeAlgorithm);

        // Axis
        const x = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.x)).nice()
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.y)).nice()
            .range([height - margin.bottom, margin.top]);

        // Update available professions
        filteredData.forEach((d) => {
            if (!professions.includes(d.profession)) {
                professions.push(d.profession);
            }
        });

        var simulation = d3.forceSimulation(filteredData)
            .force("x", d3.forceX(function(d) { return x(d.x); }).strength(1))
            .force("y", d3.forceY(function(d) { return y(d.y) ;}).strength(1))
            .force("collide", d3.forceCollide().radius(7))
            .force("manyBody", d3.forceManyBody().strength(2))
            .stop();

        for (var i = 0; i < 50; ++i) {
            simulation.tick();
        }

        x.domain(d3.extent(filteredData, d => d.x)).nice()
        y.domain(d3.extent(filteredData, d => d.y)).nice()

        // Remove previous data
        svg.selectAll(".dot").remove()
        svg.selectAll(".rect").remove()
        svg.selectAll(".text").remove()


        // Create circles
        const circles = svg.selectAll(".dot")
            .data(filteredData)
            .join("path")
            .attr("class", function (d) {
                return "dot " + d.profession + (d.pronoun === "mask" ? " mask" : " nomask");
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
            .attr("r", d => (activeProfession == d.profession) ? 10 : 5)
            .style("fill", d => color(d.pronoun, d.census) as string)
            .style("opacity", d => (activeProfession === d.profession || d.pronoun === "mask") ? 1.0 : opacity_off)
            .on("mouseover", handleHighlight)
            .on("mouseleave", handleDoNotHighlight)
            .on("click", function (d) {
                let prof = d['target']['__data__']['profession'];
                if (activeProfession === d.profession) {
                    setActiveProfession(null);
                } else {
                    setActiveProfession(prof);
                }
            })
            .transition() // Transition must be located before the elements that we want to transition, coordinates in this case
            .attr("transform", d => `translate(${d.x}, ${d.y})`)
            .attr("d", d => shape(d.pronoun === "mask"));

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
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("dy", "1.35em");

        // Create labels
        var labels = svg.selectAll(".text")
            .data(filteredData)
            .join("text")
            .attr("class", function (d) {
                return "text " + d.profession
            })
            .style("visibility", "hidden")
            .style("fill", d => color(d.pronoun, d.census) as string)
            .style("z-index", 1000)
            .style("font-size", "14px")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("dy", "1.35em")
            .attr('transform', function(d) {return `translate(-50, 10)`}) // hardcoded
            .text(function (d) {
                return `${d.pronoun !== "mask" ? d.pronoun.toUpperCase() : `[MASK]`} is a ${d.profession}`
            });

        // Resize backgrounds to match text length
        // Save the dimensions of the text elements
        svg.selectAll(".text")
            .each((d: DataPoint) => {d["bbox"] = (d3.selectAll(".text." + d.profession).nodes().filter(n => n['__data__']['pronoun'] === d.pronoun)[0] as SVGSVGElement).getBBox();});

        // Update the rectangles using the sizes we just added to the data
        const xMargin = 8
        const yMargin = 4
        svg.selectAll(".rect")
            .data(filteredData)
            .join("rect")
            .attr("width", d => d.bbox.width + 2 * xMargin)
            .attr("height", d => d.bbox.height + 2 * yMargin)
            .attr('transform', function(d) {return `translate(-${xMargin+50}, ${yMargin+8})`});

        hideProfessions();
        displayProfession(activeProfession);

    }, [execute, dimensions]);

    return (
        <React.Fragment>
            <div ref={wrapperRef} style={{marginBottom: "2rem", height: "100%"}}>
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

export default ScatterPlot;
