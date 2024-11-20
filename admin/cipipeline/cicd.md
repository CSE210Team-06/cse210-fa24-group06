# Pipeline Status Report

## Overview

This document provides an update on the current status of the pipeline, detailing what is currently functional, what is planned, and what is in progress. The goal is to improve the overall pipeline efficiency by implementing additional features such as unit tests, automated builds, and cloud deployment.

## Current Functionality

### Frontend

- **Code Formatting:** The frontend code is formatted using **Prettier**, ensuring consistent code style across all components.
- **Code Linting:** **ESLint** is used for linting the frontend code to maintain high code quality and detect potential issues early.

### Backend

- **Code Formatting:** **Black** is used for formatting the backend Python code, adhering to PEP 8 guidelines.
- **Code Linting:** **Flake8** is used for linting the Python code, ensuring it follows best practices and catches potential errors.
- **Documentation Generation:** **Pdoc** is used to automatically generate documentation for the backend codebase, providing detailed information about classes and functions.

## In Progress / Planned Features

### Frontend

- **Documentation Generation:** **JSdocs** is used to generate documentation for frontend components, helping developers understand the codebase and API usage. While we have integrated a pipeline that utilizes JSDocs successfully, we cannot consider this finished because our workflows are currently not authorized to update our repo directly, so the dev would have to run the npm command manually to add new documentation to the repo.
- **Unit Tests for Features and Components:** We are in the process of writing unit tests for individual features and components to ensure robustness and prevent regressions.
- **Automated Building and Packaging:** Plans are underway to set up an automated build system, streamlining the deployment pipeline.
- **Executable Installer Creation:** The goal is to generate an installer that can package the app and allow users to easily install and run it on their systems.

### Backend

- **Unit Tests for Features and Components:** Unit tests are being written to verify the functionality of the backend, ensuring each feature works as expected.
- **Automated Building:** We are setting up automated builds to speed up the process of generating new versions of the backend and reducing the potential for human error.
- **Cloud Deployment:** The backend is being prepared for deployment to a cloud service, which will allow for scalable and resilient hosting.

## Diagram

Below is a visual representation of the pipeline, showing the various components and their current state.

![Pipeline Diagram](/admin/cipipeline/cicd.png)

---

## Conclusion

This pipeline is steadily moving toward full automation and robust testing. The next steps involve finalizing unit tests, setting up the automated build process, and moving toward deployment to cloud services. Once the plans are fully implemented, the pipeline will be more efficient, ensuring smooth development, testing, and deployment workflows.

