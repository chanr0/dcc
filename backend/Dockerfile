FROM ubuntu:20.04

WORKDIR /root
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install -y software-properties.common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update
RUN apt-get install -y curl build-essential python3.8-dev python3.8-venv software-properties-common
RUN ln -s /usr/bin/python3.8 /usr/bin/python
# RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python3.8 -
# RUN curl -sSL https://install.python-poetry.org | python3.8 -
# ENV PATH="${PATH}:/root/.local/bin"

# # RUN apt-get install -y git mysql mysql-client
# RUN apt-get install -y mysql-server
# # RUN apt-get install -y jpeg-dev zlib-dev libjpeg  # For pillow
RUN apt-get install -y libxslt-dev  # For lxml
RUN apt-get install -y musl-dev libffi-dev   # For cryptography

# ADD pyproject.toml .
# ADD poetry.lock .
# # RUN apt-get install -y libmysqlclient-dev
# RUN apt-get install -y git
# RUN CRYPTOGRAPHY_DONT_BUILD_RUST=1 poetry install

COPY ./ /srv/backend-app

WORKDIR /srv/backend-app
RUN apt-get update && apt-get install -y git
# RUN pip3 install setuptools_rust docker-compose
RUN apt-get install -y python3-pip
RUN pip install --upgrade pip
# ENV CRYPTOGRAPHY_DONT_BUILD_RUST=1
# RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
RUN pip install -r requirements.txt

CMD [ "python", "main.py" ]