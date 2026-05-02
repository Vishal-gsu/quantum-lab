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

## Deployment (Vercel + Render)

Deploy the **FastAPI backend on Render** and the **Vite frontend on Vercel**. Set environment variables after both URLs exist.

### 1. Backend (Render)

1. Push this repo to GitHub (or connect your Git provider).
2. In [Render](https://render.com), create a **Web Service** from the repo (or use **Blueprints** with `render.yaml` at `quantum-lab/`).
3. Set **Root Directory** to `backend`.
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Environment variables:**
   - `CORS_ORIGINS` — your Vercel site origin(s), comma-separated, no path. Example: `https://my-app.vercel.app` (add `http://localhost:5173` during local dev if you want).
   - Optional: `PRODUCTION=true` (disables `/docs`; Render also sets `RENDER` automatically).

Copy the public service URL (for example `https://quantum-lab-api.onrender.com`).

### 2. Frontend (Vercel)

1. In [Vercel](https://vercel.com), **Import** the same repository.
2. Set **Root Directory** to `frontend`.
3. **Framework preset:** Vite (auto-detected).
4. **Environment variable:** `VITE_API_URL` = your Render backend URL **without a trailing slash** (example: `https://quantum-lab-api.onrender.com`).
5. Redeploy after changing env vars. `vercel.json` in `frontend/` rewrites client routes to `index.html` for React Router.

### 3. Wire-up checklist

- [ ] Backend health: open `YOUR_RENDER_URL/health` — you should see JSON `status: online`.
- [ ] CORS: `CORS_ORIGINS` must include exactly the browser origin Vercel uses (production URL and preview URLs if you use them).
- [ ] Frontend: dashboard should show **online** (polls `/` on the API). Experiments and VQE streaming use the same base URL.

### Railway (alternative)

Same backend start command; point `VITE_API_URL` at your Railway URL. Set `CORS_ORIGINS` to your frontend origin(s).

## First 4 Experiments Included:
1. **1-Bit QRNG**: Quantum Random Number Generator (Hadamard gate).
2. **Quantum Coin Flip**: Superposition-based fair coin flip simulation.
3. **8-Bit QRNG**: Multi-qubit superposition (0-255).
4. **VQE Solver**: Variational Quantum Eigensolver for H2 Molecular Ground State Energy.
