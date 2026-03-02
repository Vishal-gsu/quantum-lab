from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import qiskit
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
import pennylane as qml
from pennylane import numpy as np
import traceback

app = FastAPI(title="Quantum Computing Expert API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = Aer.get_backend('qasm_simulator')

def get_circuit_text(qc):
    return str(qc.draw(output='text'))

@app.get("/experiment/qrng-1bit")
def qrng_1bit(shots: int = Query(1024, ge=1, le=10000)):
    try:
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure(0, 0)
        tqc = transpile(qc, simulator, optimization_level=3)
        job = simulator.run(tqc, shots=shots)
        counts = job.result().get_counts()
        return {
            "counts": counts,
            "chartData": [{"name": "0", "value": counts.get('0', 0)}, {"name": "1", "value": counts.get('1', 0)}],
            "circuit": get_circuit_text(qc),
            "theory": "Uses a Hadamard gate to put a qubit into a 50/50 superposition. Measurement collapses this state into a random classical bit.",
            "shots": shots
        }
    except Exception as e: return {"error": str(e)}

@app.get("/experiment/coin-flip")
def coin_flip(shots: int = Query(10, ge=1, le=10000)):
    try:
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure(0, 0)
        job = simulator.run(transpile(qc, simulator, optimization_level=3), shots=shots)
        counts = job.result().get_counts()
        return {
            "counts": counts,
            "chartData": [{"name": "Heads", "value": counts.get('0', 0)}, {"name": "Tails", "value": counts.get('1', 0)}],
            "circuit": get_circuit_text(qc),
            "theory": "Simulates a fair coin by mapping the quantum state |+⟩ to classical Heads (0) and Tails (1).",
            "shots": shots
        }
    except Exception as e: return {"error": str(e)}

@app.get("/experiment/qrng-8bit")
def qrng_8bit(shots: int = Query(100, ge=1, le=5000)):
    try:
        n_qubits = 8
        qc = QuantumCircuit(n_qubits, n_qubits)
        for i in range(n_qubits): qc.h(i)
        qc.measure(range(n_qubits), range(n_qubits))
        job = simulator.run(transpile(qc, simulator, optimization_level=3), shots=shots)
        counts = job.result().get_counts()
        # Ensure we show all 256 possible outcomes for a professional look
        hist_data = [{"name": str(i), "value": counts.get(format(i, '08b'), 0)} for i in range(256)]
        return {
            "chartData": hist_data,
            "circuit": get_circuit_text(qc),
            "theory": "8 qubits are placed in superposition simultaneously, creating 256 possible states. This generates a random number between 0 and 255 in a single clock cycle.",
            "shots": shots
        }
    except Exception as e: return {"error": str(e)}

@app.get("/experiment/vqe-h2")
def vqe_h2(steps: int = Query(15, ge=1, le=100)):
    try:
        symbols = ["H", "H"]
        coordinates = np.array([0.0, 0.0, -0.35, 0.0, 0.0, 0.35])
        H, qubits = qml.qchem.molecular_hamiltonian(symbols, coordinates)
        dev = qml.device("default.qubit", wires=qubits)
        @qml.qnode(dev)
        def cost_fn(params):
            qml.BasisState(np.array([1, 1, 0, 0]), wires=range(qubits))
            for i in range(qubits): qml.RY(params[i], wires=i)
            qml.DoubleExcitation(params[qubits], wires=[0, 1, 2, 3])
            return qml.expval(H)
        
        history = []
        params = np.array([0.01, 0.01, 0.01, 0.01, 0.01], requires_grad=True)
        opt = qml.AdamOptimizer(stepsize=0.1) 
        
        for i in range(steps):
            params, energy = opt.step_and_cost(cost_fn, params)
            history.append({"name": f"S{i+1}", "value": float(energy)})
            
        return {
            "finalEnergy": float(energy),
            "chartData": history,
            "theory": "VQE is a hybrid algorithm. The quantum computer calculates energy while a classical optimizer (Adam) updates parameters to find the minimum energy state.",
            "circuit": "VQE ANSATZ: [Basis Prep] -> [Rotation Layers] -> [Entanglement Layer]",
            "molecule": "H2"
        }
    except Exception as e: return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
