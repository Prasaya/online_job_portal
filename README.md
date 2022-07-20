# Introduction

Online Job Portal is a job recommendation system using ontology based recommendation system. It uses user's and job's profile to determine job compatibility. A job seeker can subscribe for new job notifications via email or sms. The application is hosted at [NepalJobs](https://nepaljobs.ml)

# Getting Started

1. Tools required
   - mysql
   - npm
   - yarn
   - python3
   - SPARQL server with [ESCO Ontology](https://ec.europa.eu/esco/portal) loaded into database

2. Setup
  - Mysql: The database structure is stored on config/sqldump.sql and academicdump.sql Run both to generate complete table.
  - Node: 
    - From root directory run
      ```
      yarn install
      ```
    - From src/client run
      ```
      npm install
      ```
  - Python: Create a virtual environment and install dependencies using python/requirements.txt
  - Esco: This application assumes SPARQL query service to be running at `http://localhost:3030/esco/query`. The original implentation used apache fuseki       server with data loaded from [ESCO Portal Download](https://ec.europa.eu/esco/portal/download)

# Build and Test
  - Run: `yarn build` to build both server and client.
  - Run: `yarn start` to start react server and express backend.
  - Inside python/app directory run: `python app.py` to start recommendation service.