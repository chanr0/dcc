from __future__ import annotations
from typing import List, Dict, Set
from typing_extensions import TypedDict, NotRequired
from pydantic import BaseModel

class DataArray(TypedDict):
    X1: float
    X2: float
    cluster: int

class NLIDataPoint(TypedDict):
    """
    sentence 1: premise
    sentence 2: hypothesis
    gold_label: label of relationship
    suggestionRP: suggested counterfactual by manipulating the premise
    suggestionRP_label: (not sure aboput this one) suggested label from a model?
    suggestionRH: suggested counterfactual by manipulating the hypothesis
    suggestionRHlabel: (not sure aboput this one) suggested label from a model?
    """
    sentence1: str
    sentence2: str
    gold_label: str
    nn_variability: List[float]
    nn_confidence: List[float]
    nn_querying_variability: List[float]
    nn_querying_confidence: List[float]
    nn_premises: List[str]
    nn_hypotheses: List[str]
    nn_labels: List[str]
    nn_querying_premises: List[str]
    nn_querying_hypotheses: List[str]
    suggestionRP: str
    suggestionRP_label: str
    suggestionRH: str
    suggestionRH_label: str


class NLIEmbeddingPoint(TypedDict):
    sentence1: str
    sentence2: str
    gold_label: str
    X1: float
    X2: float


class NLIDataSubmission(TypedDict):
    sentence1: str
    sentence2: str
    gold_label: str
    suggestionRP: str
    suggestionRH: str
    annotator_label: str
    

"""class NLISubmissionDisplayPoint(TypedDict):
    New Hypothesis: str
    Robot Label: str
    Human Label: str
    id: int"""

NLISubmissionDisplayPoint = TypedDict("NLISubmissionDisplayPoint", {"New Premise": str, "New Hypothesis": str, "Robot Label": str, "Human Label": str, "id": int})


class NLISubmissionDisplay(BaseModel):
    __root__: List[NLISubmissionDisplayPoint]


class NLIDataResponse(BaseModel):
    __root__: List[NLIDataPoint]

    class Config:
        schema_extra = {
            "example": [{
                "sentence1": "The girl in yellow shorts has a tennis ball in her left pocket.",
                "sentence2": "A girl with a tennis ball in her bag.",
                "gold_label": "Entailment",
                "nn_variability": [0.1891693464, 0.6868722796000001, 0.8387837231, 0.8662176013, 0.9027104497, 0.9206519604000001, 0.9663407683, 0.8910577774], 
                "nn_confidence": [0.1630983066, 0.3525865073, 0.1975137428, 0.0657538859, 0.0631919326, 0.047550943500000005, 0.0335302409, 0.0590184356],
                "nn_querying_variability": [0.1630983066, 0.0118640707, 0.0434293443, 0.040235334000000005, 0.07767767290000001],
                "nn_querying_confidence": [0.1891693464, 0.0191965831, 0.0550668947, 0.07361882780000001, 0.0758522897],
                "nn_premises": ['A man walking on a tight robe at a carnival.',
 'A man holding on atop of a jumping horse while others stand around watching him in a crowd.',
 'An elderly man holding a pitchfork and doing some yard work.',
 'A person wearing a white shirt and blue shorts with cables attached to him.',
 'A girl playing is a pile of colorful balls.',
 'A dog coming out of a large yellow tube.',
 'A person hoisted up on a wooden stick next to the beach.',
 'A man drives an ATV down a dirt road with a power line behind him.'],
                "nn_hypotheses": ['A man walking on a tight robe at a carnival.',
 'A man holding on atop of a jumping horse while others stand around watching him in a crowd.',
 'An elderly man holding a pitchfork and doing some yard work.',
 'A person wearing a white shirt and blue shorts with cables attached to him.',
 'A girl playing is a pile of colorful balls.',
 'A dog coming out of a large yellow tube.',
 'A person hoisted up on a wooden stick next to the beach.',
 'A man drives an ATV down a dirt road with a power line behind him.'],
                "nn_labels": ['neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral', 'neutral'],
                "nn_querying_premises": ['A man walking on a tight robe at a carnival.',
 'A brunette woman with a black shirt and blue jeans is sitting on a motorcycle, with a few people around her.',
 'A street performer with a white face watches people walk by.',
 'Person in a yellow jacket is climbing up snow covered rocks.',
 'A videographer and female companion stand by a waterway.'],
                "nn_querying_hypotheses": ['A man walking on a tight robe at a carnival.',
 'A brunette woman with a black shirt and blue jeans is sitting on a motorcycle, with a few people around her.',
 'A street performer with a white face watches people walk by.',
 'Person in a yellow jacket is climbing up snow covered rocks.',
 'A videographer and female companion stand by a waterway.'],
                "suggestionRP": "The girl in yellow shorts has no tennis ball.",
                "suggestionRH": "A girl with a tennis ball in her hand.",
                "annotator_label": "contradiction",

            }]
        }


class NLIEmbeddingResponse(BaseModel):
    __root__: List[NLIEmbeddingPoint]

    class Config:
        schema_extra = {
            "example": [{
                "sentence1": "The girl in yellow shorts has a tennis ball in her left pocket.",
                "sentence2": "A girl with a tennis ball in her bag.",
                "gold_label": "Entailment",
                "X1": 2.52,
                "X2": 1.392
            }]
        }


class NLISubmissionDisplayNode(TypedDict):
    id: str
    parents: List[str]

class NLISubmissionDisplayLevel(BaseModel):
    __root__: List[NLISubmissionDisplayNode]

class NLISubmissionDisplayGraph(BaseModel):
    __root__: list



