## Backend 
This README is intended for developers who wish to contribute to the backend or gain a deeper understanding of its functionality. The backend is responsible for managing journals, including their creation, retrieval, updating, and deletion through standard CRUD (Create, Read, Update, Delete) operations. Also included are methods responsible for other functionalities, such as encryption and search.

The backend is built with FastAPI and uses SQLite as the database. Data validation for incoming requests is handled with Pydantic, while SQLAlchemy is used for interacting with the database through Python.

## How to Start Developing
Below are instructions on how to setup the development environment. For those who want to contribute to the project, create a branch from dev/backend.

1. `git clone https://github.com/CSE210Team-06/cse210-fa24-group06.git`

2. `git checkout dev/backend`

3. `cd backend`

4. `pip install -r requirements.txt`

5. `uvicorn main:app --reload`

## Overview of 'backend' Folder
The 'backend' folder contains all directories and scripts needed for backend functionality. The sections below explain the content in a high level. 

## db
The 'db' folder contains python scripts related to the app's database.

'database.py' is responsible for initializing and creating the database.

'models.py' establishes what entities in the database look like, and the relationships between them.

'schemas.py' helps validate requests to and from the database.

## routers

The 'routers' folder contains code handling CRUD method calls to the database.

'create_apis.py' contains methods handling any requests having to do with creating new entities, such as journals.

'read_apis.py' and 'read.py' both contains methods for reading data from the database.

'update_apis.py' contains methods for updating pre-existing entities in the database.

'delete_apis.py' contains methods handling requests having to do with deleting entities.

'search.py' contains methods for finding entries inside journals.

'rag_search.py' contains methods for the RAG (Retrieval Augmented Generation) model.

'get_user.py' contains methods interacting with the database that have to do with users and their information.

## Test Files

Included inside the 'backend' folder are test files for testing the CRUD methods, along with a test database inside the 'test.db' file. These files were implemented using PyTest.
To run all files at once, navigate to the 'backend' folder in the terminal and call the command 'pytest .' To run a specific file, call 'pytest ./{TEST_FILE}'

## journaler.db

This file contains all information stored in the database.

## auth.py

This file contains helper methods for user authorization.

## utils.py

Right now, this file contains mainly methods having to do with encrypting and decypting sensitive user information, like passwords.