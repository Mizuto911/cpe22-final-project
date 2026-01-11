# Vital Sphere : IoT Health & Activity Dashboard for Students


## Project Overview

This project is an **IoT-based Student Health Monitoring System** designed to support real-time wellness assessment through automated data collection, analysis, and visualization. The system integrates a **web-based front end** and a **FastAPI-powered back end**, enabling efficient monitoring, processing, and presentation of student health data.

The project demonstrates the application of:

* Internet of Things (IoT)
* Web technologies
* API-based system architecture
* Python-based backend services


## System Architecture

The system follows a **client–server architecture** composed of:

* **Front End** – Web interface for user interaction and data visualization
* **Back End** – FastAPI service handling data processing and API endpoints
* **Local Development Environment** – Used for deployment, testing, and validation


## Prerequisites

Before running the system, ensure that the following software and tools are **already installed** on the local machine:

* Git
* Node.js
* npm or pnpm
* Python (latest stable version, e.g., Python 3.13)
* Visual Studio Code
* A valid GitHub account

All project-specific libraries and dependencies are installed during setup.


## Repository Setup

1. Open a terminal.

2. Configure Git with your GitHub credentials:

   ```bash
   git config --global user.name "Your GitHub Username"
   git config --global user.email "Your GitHub Email"
   ```

3. Add the project repository:

   ```bash
   git remote add https://github.com/Mizuto911/cpe22-final-project
   ```


## Cloning the Repository

1. Open **Visual Studio Code**.
2. Press `Ctrl + Shift + P` to open the Command Palette.
3. Select **Git: Clone**.
4. Choose **Clone from GitHub**.
5. Select or manually enter the repository name.
6. Choose a local directory for the project.
7. Wait for the cloning process to complete.


## Front-End Deployment

1. Open a terminal in Visual Studio Code.

2. Navigate to the front-end directory:

   ```bash
   cd vital_sphere
   ```

3. Install front-end dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   pnpm install
   ```

4. Run the front-end application:

   ```bash
   npm run dev
   ```

   or

   ```bash
   pnpm dev
   ```

5. Confirm that the application starts successfully in the browser.


## Back-End Deployment

1. In Visual Studio Code, press `Ctrl + Shift + P`.
2. Select **Python: Select Interpreter**.
3. Choose **+ Create Virtual Environment**.
4. Select **venv**.
5. Choose the latest Python version (e.g., Python 3.13).
6. Name the virtual environment (e.g., `.venv`) and confirm.
7. Select **Install project dependencies**.
8. Choose `requirements.txt`.
9. Wait for the dependencies to finish installing.


## Virtual Environment Activation

1. Open a new terminal.

2. Activate the virtual environment:

   ```bash
   .venv\Scripts\activate
   ```

3. Ensure the virtual environment is active before continuing.


## Running the Backend API

1. With the virtual environment activated, navigate to the backend folder:

   ```bash
   cd fastapi
   ```

2. Install FastAPI standard dependencies (if required):

   ```bash
   pip install "fastapi[standard]"
   ```

3. Start the backend server:

   ```bash
   fastapi run api\main.py
   ```

4. Verify that the API runs without errors.



## Verification Checklist (For Grading)

* [ ] Repository successfully cloned
* [ ] Front-end dependencies installed
* [ ] Front-end runs without errors
* [ ] Python virtual environment created and activated
* [ ] Backend dependencies installed
* [ ] FastAPI server runs successfully





