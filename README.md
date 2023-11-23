# Northcoders News API

### Hosted Version
https://nc-news-a8e3.onrender.com/api

### Project Outline
This project is a news outlet where you can create delete and update a plethora of things including but not limited to comments, articles and topics. We have created an API that can access news data programatically

### Setup Instructions
To clone you will need to go onto github and click the clone link which is come up and then paste that link into VS Code and hit enter. Once that is done you will need to run npm install to get all the packages from the package.json file.

First thing you need to do after that is run the command npm run setup-dbs so your databases are ready to be seeded. next you will need to create two files .env.test env.development and set an evironment variable PGDATABASE=nc_news or PGDATABASE=nc_news_test in both with the database names referred to in setup.sql

Then you can run npm test to test the files and it will seed the data automatically before each test

### Requirements
Node: v20.9.0
Postgres 15