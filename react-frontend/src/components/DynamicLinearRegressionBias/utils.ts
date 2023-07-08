import { Coordinate } from "../../types";

export type DataPointRegression = {
    census: number;
    he: Coordinate;
    she: Coordinate;
    mask: Coordinate;
    metric: number;
    profession: string;
}

export const calculateCluster = (coords: Coordinate[]) => {
    let sumX = 0;
    let sumY = 0;

    coords.forEach((coord) => {sumX += coord.x; sumY += coord.y});

    return {x: sumX / coords.length, y: sumY / coords.length};
}

export const distance = (pr1: Coordinate, pr2: Coordinate) => {
    return Math.sqrt(Math.pow(pr1.x - pr2.x, 2) + Math.pow(pr1.y - pr2.y, 2));
}

export const calculateMetric = (he: Coordinate, she: Coordinate, mask: Coordinate) => {
    const he_mask = distance(he, mask);
    return (he_mask/(he_mask + distance(she, mask)));
}

export const linearRegression = (data: DataPointRegression[]): {slope: number; intercept: number; r2: number} => {
    var lr = {"slope": null, "intercept": null, "r2": null};
    var n = data.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < n; i++) {
        const x = data[i].census;
        const y = data[i].metric;

        sum_x += x;
        sum_y += y;
        sum_xy += (x*y);
        sum_xx += (x*x);
        sum_yy += (y*y);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}