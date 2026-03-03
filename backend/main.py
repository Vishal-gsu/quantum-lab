import asyncio
import logging
import os

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
import pennylane as qml
from pennylane import numpy as np

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("quantumlab")

# ---------------------------------------------------------------------------
# Rate Limiter
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Quantum Computing Expert API",
    version="2.1.0",
    docs_url="/docs",
    redoc_url=None,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# CORS — restrict to known origins in production
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:8080,https://quantum-lab-production-b7ad.up.railway.app",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ---------------------------------------------------------------------------
# Simulator
# ---------------------------------------------------------------------------
simulator = Aer.get_backend("qasm_simulator")


def get_circuit_text(qc: QuantumCircuit) -> str:
    return str(qc.draw(output="text"))


# ===========================================================================
# Health
# ===========================================================================
@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "online", "message": "Quantum Computing API v2.1 — Ready"}


# ===========================================================================
# Experiment: 1-Bit QRNG
# ===========================================================================
@app.get("/experiment/qrng-1bit")
@limiter.limit("30/minute")
def qrng_1bit(request: Request, shots: int = Query(1024, ge=1, le=10000)):
    logger.info("QRNG-1bit | shots=%d", shots)
    try:
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure(0, 0)
        tqc = transpile(qc, simulator, optimization_level=3)
        job = simulator.run(tqc, shots=shots)
        counts = job.result().get_counts()
        return {
            "counts": counts,
            "chartData": [
                {"name": "0", "value": counts.get("0", 0)},
                {"name": "1", "value": counts.get("1", 0)},
            ],
            "circuit": get_circuit_text(qc),
            "theory": (
                "Uses a Hadamard gate to put a qubit into a 50/50 superposition. "
                "Measurement collapses this state into a random classical bit."
            ),
            "shots": shots,
        }
    except Exception as e:
        logger.exception("QRNG-1bit failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: Quantum Coin Flip
# ===========================================================================
@app.get("/experiment/coin-flip")
@limiter.limit("30/minute")
def coin_flip(request: Request, shots: int = Query(10, ge=1, le=10000)):
    logger.info("Coin-Flip | shots=%d", shots)
    try:
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure(0, 0)
        job = simulator.run(
            transpile(qc, simulator, optimization_level=3), shots=shots
        )
        counts = job.result().get_counts()
        return {
            "counts": counts,
            "chartData": [
                {"name": "Heads", "value": counts.get("0", 0)},
                {"name": "Tails", "value": counts.get("1", 0)},
            ],
            "circuit": get_circuit_text(qc),
            "theory": (
                "Simulates a fair coin by mapping the quantum state |+⟩ "
                "to classical Heads (0) and Tails (1)."
            ),
            "shots": shots,
        }
    except Exception as e:
        logger.exception("Coin-Flip failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: 8-Bit QRNG
# ===========================================================================
@app.get("/experiment/qrng-8bit")
@limiter.limit("20/minute")
def qrng_8bit(request: Request, shots: int = Query(100, ge=1, le=5000)):
    logger.info("QRNG-8bit | shots=%d", shots)
    try:
        n_qubits = 8
        qc = QuantumCircuit(n_qubits, n_qubits)
        for i in range(n_qubits):
            qc.h(i)
        qc.measure(range(n_qubits), range(n_qubits))
        job = simulator.run(
            transpile(qc, simulator, optimization_level=3), shots=shots
        )
        counts = job.result().get_counts()
        hist_data = [
            {"name": str(i), "value": counts.get(format(i, "08b"), 0)}
            for i in range(256)
        ]
        return {
            "chartData": hist_data,
            "circuit": get_circuit_text(qc),
            "theory": (
                "8 qubits are placed in superposition simultaneously, creating "
                "256 possible states. This generates a random number between "
                "0 and 255 in a single clock cycle."
            ),
            "shots": shots,
        }
    except Exception as e:
        logger.exception("QRNG-8bit failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: VQE for H₂  (async — runs heavy computation in a thread)
# ===========================================================================
def _run_vqe(steps: int) -> dict:
    """Pure synchronous VQE computation — run in a thread pool."""
    symbols = ["H", "H"]
    coordinates = np.array([0.0, 0.0, -0.35, 0.0, 0.0, 0.35])
    H, qubits = qml.qchem.molecular_hamiltonian(symbols, coordinates)
    dev = qml.device("default.qubit", wires=qubits)

    @qml.qnode(dev)
    def cost_fn(params):
        qml.BasisState(np.array([1, 1, 0, 0]), wires=range(qubits))
        for i in range(qubits):
            qml.RY(params[i], wires=i)
        qml.DoubleExcitation(params[qubits], wires=[0, 1, 2, 3])
        return qml.expval(H)

    history = []
    params = np.array([0.01, 0.01, 0.01, 0.01, 0.01], requires_grad=True)
    opt = qml.AdamOptimizer(stepsize=0.1)

    energy = None
    for i in range(steps):
        params, energy = opt.step_and_cost(cost_fn, params)
        history.append({"name": f"S{i + 1}", "value": float(energy)})
        logger.debug("VQE step %d/%d  energy=%.6f", i + 1, steps, float(energy))

    return {
        "finalEnergy": float(energy),
        "chartData": history,
        "theory": (
            "VQE is a hybrid algorithm. The quantum computer calculates energy "
            "while a classical optimizer (Adam) updates parameters to find the "
            "minimum energy state."
        ),
        "circuit": "VQE ANSATZ: [Basis Prep] -> [Rotation Layers] -> [Entanglement Layer]",
        "molecule": "H2",
    }


@app.get("/experiment/vqe-h2")
@limiter.limit("5/minute")
async def vqe_h2(request: Request, steps: int = Query(15, ge=1, le=100)):
    logger.info("VQE-H2 | steps=%d", steps)
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, _run_vqe, steps)
        return result
    except Exception as e:
        logger.exception("VQE-H2 failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: Grover's Search (2-qubit, target |11⟩)
# ===========================================================================
@app.get("/experiment/grover")
@limiter.limit("20/minute")
def grover_search(
    request: Request,
    shots: int = Query(1024, ge=1, le=10000),
    iterations: int = Query(1, ge=1, le=5),
):
    logger.info("Grover | shots=%d iterations=%d", shots, iterations)
    try:
        qc = QuantumCircuit(2, 2)

        # Superposition
        qc.h([0, 1])

        for _ in range(iterations):
            # Oracle — marks |11⟩ with a phase flip
            qc.cz(0, 1)

            # Diffusion operator
            qc.h([0, 1])
            qc.x([0, 1])
            qc.cz(0, 1)
            qc.x([0, 1])
            qc.h([0, 1])

        qc.measure([0, 1], [0, 1])

        job = simulator.run(
            transpile(qc, simulator, optimization_level=3), shots=shots
        )
        counts = job.result().get_counts()

        states = ["00", "01", "10", "11"]
        chart_data = [
            {"name": f"|{s}⟩", "value": counts.get(s, 0)} for s in states
        ]

        return {
            "counts": counts,
            "chartData": chart_data,
            "circuit": get_circuit_text(qc),
            "theory": (
                "Grover's algorithm provides a quadratic speedup for unstructured search. "
                "The oracle marks the target state |11⟩ with a phase flip, and the "
                "diffusion operator amplifies its probability amplitude. For N=4 states, "
                "a single iteration achieves ~100% success probability."
            ),
            "shots": shots,
            "targetState": "|11⟩",
            "iterations": iterations,
        }
    except Exception as e:
        logger.exception("Grover failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: Quantum Teleportation (3-qubit Bell protocol)
# ===========================================================================
@app.get("/experiment/teleportation")
@limiter.limit("20/minute")
def teleportation(request: Request, shots: int = Query(1024, ge=1, le=10000)):
    logger.info("Teleportation | shots=%d", shots)
    try:
        qc = QuantumCircuit(3, 3)

        # Step 1: Prepare the state to teleport on q0 (|1⟩)
        qc.x(0)
        qc.barrier()

        # Step 2: Create Bell pair between q1 and q2
        qc.h(1)
        qc.cx(1, 2)
        qc.barrier()

        # Step 3: Alice's Bell measurement on q0, q1
        qc.cx(0, 1)
        qc.h(0)
        qc.barrier()

        # Step 4: Measure Alice's qubits (classical communication)
        qc.measure(0, 0)
        qc.measure(1, 1)

        # Step 5: Bob's corrections (conditioned on classical bits)
        qc.cx(1, 2)
        qc.cz(0, 2)

        # Step 6: Measure Bob's qubit to verify teleportation
        qc.measure(2, 2)

        job = simulator.run(
            transpile(qc, simulator, optimization_level=3), shots=shots
        )
        counts = job.result().get_counts()

        # Analyse Bob's qubit (bit index 2 in the result string)
        bob_0, bob_1 = 0, 0
        for bitstring, count in counts.items():
            # Qiskit bit ordering: bitstring is c2c1c0
            bob_bit = bitstring[0]  # leftmost = c2 (Bob's)
            if bob_bit == "0":
                bob_0 += count
            else:
                bob_1 += count

        chart_data = [
            {"name": "Bob |0⟩", "value": bob_0},
            {"name": "Bob |1⟩", "value": bob_1},
        ]

        return {
            "counts": counts,
            "chartData": chart_data,
            "circuit": get_circuit_text(qc),
            "theory": (
                "Quantum teleportation transfers a quantum state using entanglement "
                "and 2 classical bits — without physically moving the qubit. Alice "
                "prepared |1⟩ and teleported it to Bob. The chart should show Bob's "
                "qubit measured as |1⟩ with ~100% probability, proving successful "
                "teleportation. The no-cloning theorem prevents copying, but "
                "teleportation destroys Alice's original state."
            ),
            "shots": shots,
            "teleportedState": "|1⟩",
        }
    except Exception as e:
        logger.exception("Teleportation failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: VQC Binary Classifier — WIP
# Blocked by PennyLane/autograd tensor shape compatibility issue.
# StronglyEntanglingLayers and manual Rot gates both fail during
# autograd differentiation. Will be fixed in a future PennyLane update.
# ===========================================================================
@app.get("/experiment/vqc")
@limiter.limit("5/minute")
def vqc_placeholder(request: Request):
    raise HTTPException(
        status_code=501,
        detail="VQC Classifier is under development — coming in v2.1",
    )


# ===========================================================================
# Entry point
# ===========================================================================
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
