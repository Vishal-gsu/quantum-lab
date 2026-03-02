# Quantum Computing Project - Web App

A professional, fully operational Quantum Computing laboratory for experiments and learning.

## Features
- **Interactive Experiments**: Run true quantum random number generators and VQE solvers.
- **Study Materials**: Comprehensive curriculum on Quantum Computing and Machine Learning.
- **Animated UI**: Smooth transitions and modern dark-themed aesthetics.
- **FastAPI Backend**: Powered by Qiskit and PennyLane simulators.
- **React Frontend**: Built with Vite, Tailwind CSS, and Framer Motion.

## How to Run Locally

### 1. Backend (FastAPI)
```bash
cd backend
# Create virtual env if needed
python -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
python main.py
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Deployment on Railway

### Backend
1. Link your GitHub repository to Railway.
2. Railway will automatically detect the Python environment.
3. Ensure you have a `requirements.txt` file.
4. Set the start command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend
1. Create a new service on Railway linked to the same repo.
2. Set the root directory to `web_app/frontend`.
3. Railway will build and deploy the Vite app.
4. Set the `VITE_API_URL` to your backend's URL.

## First 4 Experiments Included:
1. **1-Bit QRNG**: Quantum Random Number Generator (Hadamard gate).
2. **Quantum Coin Flip**: Superposition-based fair coin flip simulation.
3. **8-Bit QRNG**: Multi-qubit superposition (0-255).
4. **VQE Solver**: Variational Quantum Eigensolver for H2 Molecular Ground State Energy.
