from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import PurePath
# from pydantic_models.example_data_points import ExampleDataResponse
from typing import Callable

import base

app = FastAPI(
    title="Test Python Backend",
    description="""This is a template for a Python backend.
                   It provides acess via REST API.""",
    version="0.1.0",
)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

context_path = PurePath('/', 'api/v1').as_posix()
app.include_router(base.router, prefix=context_path)

def update_schema_name(app: FastAPI, function: Callable, name: str) -> None:
    """
    Updates the Pydantic schema name for a FastAPI function that takes
    in a fastapi.UploadFile = File(...) or bytes = File(...).

    This is a known issue that was reported on FastAPI#1442 in which
    the schema for file upload routes were auto-generated with no
    customization options. This renames the auto-generated schema to
    something more useful and clear.

    Args:
        app: The FastAPI application to modify.
        function: The function object to modify.
        name: The new name of the schema.
    """
    for route in app.routes:
        if route.endpoint is function:
            route.body_field.type_.__name__ = name
            break

update_schema_name(app, base.create_file, "CreateFileSchema")
update_schema_name(app, base.create_upload_file, "CreateUploadSchema")