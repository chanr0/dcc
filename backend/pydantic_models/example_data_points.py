from __future__ import annotations

from typing import List, TypedDict

from pydantic import BaseModel


class DataPoint(TypedDict):
    X1: float
    X2: float
    cluster: int


class ExampleDataResponse(BaseModel):
    __root__: List[DataPoint]

    class Config:
        schema_extra = {
            "example": [
                {"X1": 0.7259144318009806, "X2": 0.6956366918575212, "cluster": 1},
                {"X1": 0.06477029320317351, "X2": 0.6431397771638389, "cluster": 0},
                {"X1": 0.6616657850166069, "X2": 0.7704235200854092, "cluster": 1},
                {"X1": 0.8734582814268944, "X2": 0.45563940738781517, "cluster": 0},
                {"X1": 0.5659110175854882, "X2": 0.9090551671240439, "cluster": 1},
            ]
        }


