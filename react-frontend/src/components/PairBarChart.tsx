import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {contColor, contColor as color} from "../utils/colorMaps";
import "./styles.scss";

interface Props {
    values: { title: string, value: number }[];
    title: string;
    census: number
}

const PairBarChart: React.FunctionComponent<Props> = ({values, title, census}: Props) => {

    const margin = {
        top: 30,
        right: 5,
        bottom: 60,
        left: 30
    };

    const h = 400;
    const w = 300;

    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {

        // Ref to current svg object
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove()

        // Set height depending on professions
        const width = w - margin.right - margin.left;
        const height = h - margin.bottom - margin.top;

        // Set the size of the viewBox
        svg.attr("viewBox", [0, 0, width + margin.right + margin.left, height + margin.top + margin.bottom])

        // Define y axis
        const x = d3.scaleBand()
            .domain(values.map(v => v.title))
            .range([margin.left, width])
            .padding(0.1)

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([ height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("transform", `translate(${margin.left}, 0)`);

        // Size for each element in the x axis.
        var size = x.bandwidth();

        // add the bars
        svg.selectAll("bar")
            .data(values)
            .join("rect")
            .attr("x", d => x(d.title))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", contColor(census))

        // Additional title on bottom
        svg.append("text")
            .attr("x", (width)/2)
            .attr("y", height + margin.bottom)
            .attr('transform', function(d) {return `translate(10, -10)`})
            .style("font-size", "20px")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text(title);

        // Additional axis title
        svg.append("text")
            .attr("x", x(values[0]['title']))
            .attr("y", height)
            .attr('transform', `translate(50, 15)`)
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .text(values[0]['title']);

        svg.append("text")
            .attr("x", x(values[1]['title']))
            .attr("y", height)
            .attr('transform', `translate(50, 15)`)
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .text(values[1]['title']);

        // Include percentage annotation for bars
        svg.append("text")
            .attr("x", x(values[1]['title']))
            .attr("y", y(values[1]['value']))
            .attr('transform', `translate(50, -15)`)
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .text(values[1]['value'].toFixed(1) + "%");

        svg.append("text")
            .attr("x", x(values[0]['title']))
            .attr("y", y(values[0]['value']))
            .attr('transform', `translate(50, -15)`)
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .text(values[0]['value'].toFixed(1) + "%");

    }, [values])


    return (
        <React.Fragment>
            <div ref={wrapperRef}>
                <svg ref={svgRef} style={{overflow: "visible"}}/>
            </div>
        </React.Fragment>
    );
}

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

export default PairBarChart;