export interface NLIDataPoint {
    sentence1: string;
    sentence2: string;
    gold_label: string;
    nn_variability: number[];
    nn_confidence: number[];
    nn_querying_variability: number[];
    nn_querying_confidence: number[];
    nn_premises: string[];
    nn_hypotheses: string[];
    nn_labels: string[];
    nn_querying_premises: string[];
    nn_querying_hypotheses: string[];
    suggestionRP: string;
    suggestionRP_label: string;
    suggestionRH: string;
    suggestionRH_label: string;

}