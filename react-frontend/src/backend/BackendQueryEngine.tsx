import { NLIDataArray } from "../components/types/NLIDataArray";
import { NLISubmissionDisplay } from "../components/types/NLISubmissionDisplay";
import { NLIEmbeddingArray } from "../components/types/NLIEmbeddingArray";
import { NLISubmissionDisplayGraph } from "../components/types/NLISubmissionDisplayGraph";
import { DataArray } from "../components/types/DataArray";
import { DataArrayExtended } from "../components/types/DataArrayExtended";

export interface queryBackendProps {
    route: string;
}
// CHANGE THIS WHEN MOVING FROM LOCALHOST!
// export const BASE_URL = `http://be.${window.location.hostname}/api/v1`

export const BASE_URL = "http://localhost:8000/api/v1";

export const queryBackend = async (route: string) => {
    const requestURL = `${BASE_URL}/${route}`;
    // const formData = new FormData();
    const data = await fetch(requestURL,
        {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        }
    ).then(response => response.json());

    return data;
}

export interface queryBackendProps {
    route: string;
}

export const queryBackendData = async (route: string): Promise<NLIDataArray> => {
    const requestURL = `${BASE_URL}/${route}`;
    const data = await fetch(requestURL,
        {
            method: 'GET'
        }
    ).then(response => response.json()).then(d => d as NLIDataArray);

    return data;
}

export const queryBackendData2 = async (route: string): Promise<DataArray> => {
    const requestURL = `${BASE_URL}/${route}`;
    const data = await fetch(requestURL,
        {
            method: 'GET'
        }
    ).then(response => response.json()).then(d => d as DataArray);

    return data;
}

export const queryBackendData3 = async (route: string): Promise<DataArrayExtended> => {
    const requestURL = `${BASE_URL}/${route}`;
    const data = await fetch(requestURL,
        {
            method: 'GET'
        }
    ).then(response => response.json()).then(d => d as DataArrayExtended);

    return data;
}

export const queryBackendStr = async (route: string) => {
    const requestURL = `${BASE_URL}/${route}`;
    const data = await fetch(requestURL,
        {
            method: 'GET'
        }
    ).then(response => response.json()).then(d => d as string);
    return data;
}


export const queryBackendInt = async (route: string) => {
    const requestURL = `${BASE_URL}/${route}`;
    const data = await fetch(requestURL,
        {
            method: 'GET'
        }
    ).then(response => response.json()).then(d => d as number);
    return data;
}

export const queryBackendDisplayData = async (route: string): Promise<NLISubmissionDisplay> => {
    const requestURL = `${BASE_URL}/${route}`;
    const data = await fetch(requestURL,
        {
            method: 'GET'
        }
    ).then(response => response.json()).then(d => d as NLISubmissionDisplay);
    return data;
}


export const queryBackendDisplayDataGraph = async (route:string) => {
    const requestURL = `${BASE_URL}/${route}`;
    const data = await fetch(requestURL,
        {
            method: 'GET'
        }
    ).then(response => response.json()).then(d => [d[0] as NLISubmissionDisplayGraph, d[1], d[2]]);
    return data;
}


export const queryBackendEmbedding = async (route: string): Promise<NLIEmbeddingArray> => {
    const requestURL = `${BASE_URL}/${route}`;
    const formData = new FormData();
    const data = await fetch(requestURL,
        {
            method: 'GET'
        }
    ).then(response => response.json()).then(d => d as NLIEmbeddingArray);

    return data;
}


export default queryBackend;


