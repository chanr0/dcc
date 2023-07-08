// Color function
import * as d3 from "d3";

export function contColor(census: number) {
    const firstHalf = d3.scaleSequential(["#0092e0", "#C3C3C3"])
        .domain([1.7, 50]); // Lowest and highest census values
    const secondHalf = d3.scaleSequential(["#C3C3C3", "#EBC42F"])
        .domain([50, 96.4]); // Lowest and highest census values

    if (census <= 50) {
        return firstHalf(census);
    } else {
        return secondHalf(census);
    }
}


export const discreteColor = d3.scaleOrdinal()
    .domain(["he", "she"])
    .range(["#0092e0", "#EBC42F"]);
