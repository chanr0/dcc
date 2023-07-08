export type Coordinate = {
    x: number;
    y: number;
}
export interface DataPoint {
    profession: string,
    pronoun: string,
    x: number,
    y: number,
    layer: number,
    census: number,
    algorithm: string,
        bbox?: any,
    dHe: number | null,
    dShe: number | null,

}

export type DataArray = DataPoint[];

export interface Margins {
    top: number;
    right: number;
    bottom: number;
    left: number;
}