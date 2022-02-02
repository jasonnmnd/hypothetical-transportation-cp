# syntax=docker/dockerfile:1

# working image: python 3, change to 3.8?
FROM python:3.7 

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# create a new directory called code
WORKDIR /code

# move requirements into new directory
COPY requirements.txt /code/
COPY entrypoint/entrypoint_local.sh .
COPY entrypoint/entrypoint_dev.sh .
COPY entrypoint/entrypoint_prod.sh .

# CMD ["npm", "run", "build"]

# install requirements
RUN pip install -r requirements.txt

# move entire current directory into new dir
COPY ./hypothetical_transportation /code/