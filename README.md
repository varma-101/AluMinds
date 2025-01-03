# Aluminium Wire Rod Property Prediction System

## Overview
The particular problem was faced by the NALCO(National Aluminium company Limited) , We tried to tackle this problem in the big stages of Smart India Hackathon 2024 during the Grand Finale and achieved runner up among 130 Teams.
The **Aluminium Wire Rod Property Prediction System** is a modern AI/ML-powered solution designed to predict and optimize the physical properties of Aluminium wire rods, such as **UTS (Ultimate Tensile Strength)**, **Elongation**, and **Conductivity**. The system improves productivity and quality control by analyzing the critical parameters of the casting and rolling processes. 

This project leverages cutting-edge technologies in **machine learning**, **data visualization**, and **web development** to provide actionable insights, streamline workflows, and enhance the manufacturing process.

---

## Features

### Key Features
- **AI/ML-Powered Predictions**: Predicts critical properties such as UTS, elongation, and conductivity.
- **Dynamic Parameter Analysis**: Analyzes parameters like casting temperature, cooling water pressure, and emulsion properties.
- **Visualization**: Intuitive charts and dashboards for real-time monitoring and result visualization.
- **User-Friendly Interface**: React-based UI for easy parameter input and interaction with predictions.
- **Optimization**: Provides parameter recommendations to optimize the manufacturing process.

### Achievements
- Developed and integrated multiple machine learning models for property prediction.
- Built a robust **backend API** for efficient data handling and user authentication.
- Designed an intuitive **frontend** for seamless interaction and visualization.
- Enabled real-time parameter monitoring and feedback.

---

## Project Structure

### Backend (`backend/`)
The backend handles server-side operations, database management, and API integration.

- **Key Files and Directories**:
  - **`app.js`**: Main server file.
  - **`config/`**: Configuration files for database and authentication (`db.js`, `passportConfig.js`).
  - **`controllers/`**: Logic for handling authentication, data display, and predictions.
  - **`middlewares/`**: Custom middleware for validation.
  - **`models/`**: Database models for storing attendance, predictions, and user data.
  - **`routes/`**: API endpoints for authentication, data display, and predictions.

---

### Frontend (`frontend/`)
The frontend provides an interactive and user-friendly interface for system interaction.

- **Key Components**:
  - **Inputs**: Forms for entering and optimizing parameters (`Dashboard.jsx`, `Optimize.jsx`, etc.).
  - **Outputs**: Displays prediction results and their visualizations (`PredictOptimize.jsx`, `Visualization.jsx`).
  - **Realtime Dashboard**: Monitors live parameter changes (`RealtimeDashboard.jsx`).
  - **Charts**: Graphical representations of data trends (`LineGraphs.jsx`).
  - **User Guide**: Step-by-step instructions for using the system (`Guide.jsx`).

---

### Machine Learning Models (`mlmodel/`)
This directory contains machine learning models and APIs for prediction services.

- **Key Files**:
  - **`app.py`**: Flask API serving prediction requests.
  - **Model Files**: Pretrained `.pkl` files for predicting UTS, elongation, and conductivity.

---

## Technologies Used

### Backend
- **Node.js**, **Express.js**: For server-side logic and API handling.
- **MongoDB**: Database for storing user and prediction data.

### Frontend
- **React**, **Vite**: For building a fast, responsive UI.
- **Chart.js**, **CSS3**: For data visualization and styling.

### Machine Learning
- **Python**, **Flask**: For building and serving ML models.
- **Scikit-learn**, **Pandas**, **NumPy**: For data preprocessing and modeling.

---

## How It Works
1. **Input Parameters**: Users provide critical casting and rolling parameters via the frontend interface.
2. **Prediction**: The backend integrates with ML models to predict UTS, elongation, and conductivity.
3. **Visualization**: Predictions and trends are displayed in interactive charts and dashboards.
4. **Optimization**: The system recommends optimized parameter configurations for quality improvement.

---

## Authors
This project was developed by **AluMinds Team** to enhance Aluminium wire rod production using AI/ML technologies.
