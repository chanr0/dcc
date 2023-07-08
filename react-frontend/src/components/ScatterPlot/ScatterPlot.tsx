import React, { useEffect, useState} from 'react'
import { DataArray } from '../../components/types/DataArray';
import {queryBackendData2} from '../../backend/BackendQueryEngine';

import './ScatterPlot.scss'
import * as d3 from 'd3'
import { Types } from './types'
export interface ScatterPlotProps {
    width: number
    height: number
    top: number
    right: number
    bottom: number
    left: number
    fill?: string
}

const ScatterPlot = (props: ScatterPlotProps) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        draw()
    })
    const draw = async () => {
        const width = props.width - props.left - props.right
        const height = props.height - props.top - props.bottom

        const svg = d3
            .select('.basicScatterChart')
            .append('svg')
            .attr('width', width + props.left + props.right)
            .attr('height', height + props.top + props.bottom)
            .append('g')
            .attr('transform', `translate(${props.left},${props.top})`)

        console.log('Hi, all good');
        // useEffect(() => {
        //     queryBackendData2(`get-data?name=moons`).then((e) => {
        //         setData(e)
        //     });
        // });
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv").then( function(data) {
        // const data = await fetch(`get-data?name=moons`,
        // {
        //     method: 'GET'
        // }
        // ).then(response => response.json()).then(d => d)
        ;//.then((data) => {

        console.log(  );
        const x = d3.scaleLinear().domain([0, 18000]).range([0, width]);
        console.log('print x');
        console.log(x);
        svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
        const colors = ["blue", "red"];
        const y = d3.scaleLinear().domain([0, 4.5]).range([height, 0])
        svg.append('g').call(d3.axisLeft(y))
        svg
            .append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d) => {
                return x(((d as unknown) as Types.Data).X1)
            })
            .attr('cy', (d) => {
                return y(((d as unknown) as Types.Data).X2)
            })
            .attr('r', 0.8)
            //.style('fill', function (d) { return colors[d.cluster]; })
            .style('fill', 'grey')
        })

    }
    return <div className="ScatterPlot" />
}


export default ScatterPlot;
