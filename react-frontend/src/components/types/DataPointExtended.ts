export interface DataPointExtended {
    guid: string;
    sentence1: string;
    sentence2: string;
    gold_label: string;
    prediction: string;
    confidence: number;
    variability: number;
}
