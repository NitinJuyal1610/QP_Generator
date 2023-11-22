# Question Paper Generator Challenge

> ## Installation & Running Locally

```sh

# Install Dependencies
$ npm install

# Rename .env.example to .env 
# Fill in the Credentials

# Run PostgreSQL DB on Docker
$ npm run docker:db

# DB migration
$ npx prisma migrate dev --name "init"

# Run the Application
$ npm run dev



```

> ## Techstack
- Express.js
- Typescript
- PostgreSQL
- Prisma (ORM)
- Docker Compose
- SQL

> ## API Endpoint

# Question Paper Generator API

This API allows you to manage and generate question papers for different subjects and difficulty levels.

## Table of Contents

- [Add Question](#add-question)
- [Generate Paper](#generate-paper)

## Add Question

### Endpoint

`POST /api/questions/`

### Description

This endpoint allows you to add a new question to the question store.

### Request

- **Method:** POST
- **Body:**
  - Mode: formdata
    - Key: `file`
    - Type: file
    - Value: Select a JSON file containing question details (provided in demo.json)
  - (One can also add question through body in json form)


## Generate Paper

### Endpoint

`GET /api/questions`

### Description

This endpoint generates a question paper based on the specified criteria, such as total marks, basis for distribution, and distribution percentages.

### Request

- **Method:** GET
- **Parameters:**
  - `totalMarks` (integer): Total marks for the question paper.
  - `basis` (string): Basis for distribution (e.g., "difficulty, topic").
  - `distribution` (object): Distribution percentages for each basis type level.
    - Example:
      For Difficulty
      ```json
      {
        "Easy": 0,
        "Medium": 80,
        "Hard": 20
      }
      
      ```


## Approach 

- Fetching Random suffled questions from postgres db using raw SQL query
- Using Dynamic programming to efficiently calculate questions combination with sum equal to required weightage (if exists)
- Throw Error if provided distribution is not possible from the set of questions 


