import asyncio
import logging
import os

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
from qiskit_aer.noise import NoiseModel, depolarizing_error
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
# Disable Swagger docs in production — no need to expose API schema publicly
_is_production = bool(os.environ.get("RAILWAY_ENVIRONMENT"))
app = FastAPI(
    title="Quantum Computing Expert API",
    version="2.1.0",
    docs_url=None if _is_production else "/docs",
    redoc_url=None,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# CORS — restrict to known origins in production
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:8080",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ---------------------------------------------------------------------------
# Simulator + Noise Model
# ---------------------------------------------------------------------------
simulator = Aer.get_backend("qasm_simulator")


def _get_noise_model() -> NoiseModel:
    """Realistic NISQ noise: depolarizing errors on all gates."""
    noise_model = NoiseModel()
    noise_model.add_all_qubit_quantum_error(
        depolarizing_error(0.01, 1),  # 1% per single-qubit gate
        ["h", "x", "rx", "ry", "rz"],
    )
    noise_model.add_all_qubit_quantum_error(
        depolarizing_error(0.02, 2),  # 2% per two-qubit gate
        ["cx", "cz"],
    )
    return noise_model


def _run_circuit(qc: QuantumCircuit, shots: int, noise: bool) -> dict:
    """Run a transpiled circuit, optionally with noise."""
    tqc = transpile(qc, simulator, optimization_level=3)
    kwargs = {"shots": shots}
    if noise:
        kwargs["noise_model"] = _get_noise_model()
    job = simulator.run(tqc, **kwargs)
    return job.result().get_counts()


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
def qrng_1bit(request: Request, shots: int = Query(1024, ge=1, le=10000), noise: bool = Query(False)):
    logger.info("QRNG-1bit | shots=%d noise=%s", shots, noise)
    try:
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure(0, 0)
        counts = _run_circuit(qc, shots, noise)
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
            ) + (" [NOISE ON] Depolarizing noise slightly biases the distribution." if noise else ""),
            "shots": shots,
            "noise": noise,
        }
    except Exception as e:
        logger.exception("QRNG-1bit failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: Quantum Coin Flip
# ===========================================================================
@app.get("/experiment/coin-flip")
@limiter.limit("30/minute")
def coin_flip(request: Request, shots: int = Query(10, ge=1, le=10000), noise: bool = Query(False)):
    logger.info("Coin-Flip | shots=%d noise=%s", shots, noise)
    try:
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure(0, 0)
        counts = _run_circuit(qc, shots, noise)
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
            ) + (" [NOISE ON] Gate errors introduce slight bias — like a real imperfect coin." if noise else ""),
            "shots": shots,
            "noise": noise,
        }
    except Exception as e:
        logger.exception("Coin-Flip failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: 8-Bit QRNG
# ===========================================================================
@app.get("/experiment/qrng-8bit")
@limiter.limit("20/minute")
def qrng_8bit(request: Request, shots: int = Query(100, ge=1, le=5000), noise: bool = Query(False)):
    logger.info("QRNG-8bit | shots=%d noise=%s", shots, noise)
    try:
        n_qubits = 8
        qc = QuantumCircuit(n_qubits, n_qubits)
        for i in range(n_qubits):
            qc.h(i)
        qc.measure(range(n_qubits), range(n_qubits))
        counts = _run_circuit(qc, shots, noise)
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
            ) + (" [NOISE ON] Depolarizing errors across 8 qubits create visible non-uniformity in the distribution." if noise else ""),
            "shots": shots,
            "noise": noise,
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


def _vqe_stream_generator(steps: int):
    """Generator that yields SSE events for each VQE optimization step."""
    import json

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
        e_val = float(energy)
        history.append({"name": f"S{i + 1}", "value": e_val})
        yield f"data: {json.dumps({'epoch': i + 1, 'total': steps, 'loss': e_val, 'progress': (i + 1) / steps})}\n\n"

    result = {
        "finalEnergy": float(energy),
        "chartData": history,
        "theory": (
            "The Variational Quantum Eigensolver (VQE) computes the ground-state "
            "energy of H\u2082 by iteratively optimising a parameterised quantum circuit. "
            "Each step adjusts gate angles to minimise \u27e8\u03c8|H|\u03c8\u27e9."
        ),
        "circuit": "VQE: [BasisState] \u2192 [RY Rotations] \u2192 [DoubleExcitation] \u2192 \u27e8H\u27e9",
        "molecule": "H\u2082 (0.7 \u00c5)",
    }
    yield f"data: {json.dumps({'done': True, 'result': result})}\n\n"


@app.get("/experiment/vqe-h2/stream")
@limiter.limit("5/minute")
def vqe_stream(request: Request, steps: int = Query(15, ge=1, le=100)):
    logger.info("VQE stream | steps=%d", steps)
    return StreamingResponse(
        _vqe_stream_generator(steps),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

# ===========================================================================
# Experiment: Grover's Search (2-qubit, target |11⟩)
# ===========================================================================
@app.get("/experiment/grover")
@limiter.limit("20/minute")
def grover_search(
    request: Request,
    shots: int = Query(1024, ge=1, le=10000),
    iterations: int = Query(1, ge=1, le=5),
    noise: bool = Query(False),
):
    logger.info("Grover | shots=%d iterations=%d noise=%s", shots, iterations, noise)
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
        counts = _run_circuit(qc, shots, noise)

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
            ) + (" [NOISE ON] Gate errors reduce the search success probability — demonstrating why error correction matters." if noise else ""),
            "shots": shots,
            "targetState": "|11⟩",
            "iterations": iterations,
            "noise": noise,
        }
    except Exception as e:
        logger.exception("Grover failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: Quantum Teleportation (3-qubit Bell protocol)
# ===========================================================================
@app.get("/experiment/teleportation")
@limiter.limit("20/minute")
def teleportation(request: Request, shots: int = Query(1024, ge=1, le=10000), noise: bool = Query(False)):
    logger.info("Teleportation | shots=%d noise=%s", shots, noise)
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
        counts = _run_circuit(qc, shots, noise)

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
            ) + (" [NOISE ON] Gate errors corrupt the Bell pair, reducing teleportation fidelity." if noise else ""),
            "shots": shots,
            "teleportedState": "|1⟩",
            "noise": noise,
        }
    except Exception as e:
        logger.exception("Teleportation failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: VQC Binary Classifier (async — heavy PennyLane computation)
# Uses scalar loss accumulation to avoid autograd shape bug.
# ===========================================================================
def _run_vqc(epochs: int) -> dict:
    """Variational Quantum Classifier on make_moons dataset."""
    import numpy as std_np

    # Dataset — standard numpy for data prep
    from sklearn.datasets import make_moons
    X_raw, y_raw = make_moons(n_samples=60, noise=0.15, random_state=42)
    X_np = (X_raw - X_raw.min(axis=0)) / (X_raw.max(axis=0) - X_raw.min(axis=0)) * std_np.pi

    n_qubits, n_layers = 2, 2
    n_params = n_layers * n_qubits * 3  # 12 total
    dev = qml.device("default.qubit", wires=n_qubits)

    @qml.qnode(dev, interface="autograd")
    def circuit(w, x):
        for i in range(n_qubits):
            qml.RX(x[i], wires=i)
        idx = 0
        for _ in range(n_layers):
            for i in range(n_qubits):
                qml.Rot(w[idx], w[idx + 1], w[idx + 2], wires=i)
                idx += 3
            qml.CNOT(wires=[0, 1])
        return qml.expval(qml.PauliZ(0))

    # Scalar loss accumulation — avoids np.array([circuit(...)]) autograd bug
    def cost_fn(w):
        loss = 0.0
        for i in range(len(y_raw)):
            x_i = np.array(X_np[i], requires_grad=False)
            pred = circuit(w, x_i)
            prob = (1.0 - pred) / 2.0
            prob = prob * 0.9998 + 0.0001  # numerically stable clamp
            loss = loss - (y_raw[i] * np.log(prob) + (1.0 - y_raw[i]) * np.log(1.0 - prob))
        return loss / len(y_raw)

    # Init flat 1D params
    std_np.random.seed(42)
    w = np.array(std_np.random.uniform(-0.5, 0.5, size=n_params), requires_grad=True)
    opt = qml.GradientDescentOptimizer(stepsize=0.4)

    history = []
    for epoch in range(epochs):
        w, loss_val = opt.step_and_cost(cost_fn, w)
        history.append({"name": f"E{epoch + 1}", "value": float(loss_val)})
        logger.debug("VQC epoch %d/%d  loss=%.4f", epoch + 1, epochs, float(loss_val))

    # Final accuracy
    correct = 0
    for i in range(len(y_raw)):
        x_i = np.array(X_np[i], requires_grad=False)
        pred = float(circuit(w, x_i))
        if (pred < 0) == (y_raw[i] == 1):
            correct += 1
    accuracy = correct / len(y_raw)

    return {
        "finalAccuracy": accuracy,
        "chartData": history,
        "theory": (
            "A Variational Quantum Classifier (VQC) is the quantum analogue of a "
            "neural network. Classical data is encoded into quantum states via angle "
            "encoding (RX gates), then processed through parameterized entangling "
            "layers (Rot + CNOT). The PauliZ measurement maps to class probabilities, "
            "and a classical optimizer tunes the gate parameters to minimise "
            "binary cross-entropy loss."
        ),
        "circuit": "VQC: [Angle Encoding RX] → [Rot + CNOT ×2 layers] → [⟨Z⟩ Measurement]",
        "dataset": "make_moons (60 pts, 2D)",
    }


@app.get("/experiment/vqc")
@limiter.limit("5/minute")
async def vqc_classifier(request: Request, steps: int = Query(15, ge=1, le=50)):
    logger.info("VQC | epochs=%d", steps)
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, _run_vqc, steps)
        return result
    except Exception as e:
        logger.exception("VQC failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: VQE Bond-Distance Sweep (H₂ Potential Energy Surface)
# ===========================================================================
def _run_vqe_sweep(steps_per_point: int) -> dict:
    """Sweep H₂ bond distance to compute potential energy surface."""
    import numpy as std_np

    distances = std_np.arange(0.3, 2.6, 0.2)  # 12 points
    energies = []

    for d in distances:
        coordinates = np.array([0.0, 0.0, -d / 2, 0.0, 0.0, d / 2])
        H, qubits = qml.qchem.molecular_hamiltonian(["H", "H"], coordinates)
        dev = qml.device("default.qubit", wires=qubits)

        @qml.qnode(dev)
        def cost_fn(params):
            qml.BasisState(np.array([1, 1, 0, 0]), wires=range(qubits))
            for i in range(qubits):
                qml.RY(params[i], wires=i)
            qml.DoubleExcitation(params[qubits], wires=[0, 1, 2, 3])
            return qml.expval(H)

        params = np.array([0.01] * (qubits + 1), requires_grad=True)
        opt = qml.AdamOptimizer(stepsize=0.1)

        energy = None
        for _ in range(steps_per_point):
            params, energy = opt.step_and_cost(cost_fn, params)

        energies.append(float(energy))
        logger.debug("VQE-sweep d=%.2f  E=%.6f", d, float(energy))

    min_idx = int(std_np.argmin(energies))
    eq_dist = float(distances[min_idx])
    eq_energy = energies[min_idx]

    chart_data = [
        {"name": f"{d:.1f}", "value": e}
        for d, e in zip(distances, energies)
    ]

    return {
        "chartData": chart_data,
        "equilibriumDistance": eq_dist,
        "equilibriumEnergy": eq_energy,
        "theory": (
            "The potential energy surface (PES) shows how the H₂ ground-state "
            "energy varies with bond distance. The minimum corresponds to the "
            f"equilibrium bond length ({eq_dist:.1f} Å). At shorter distances "
            "nuclear repulsion dominates; at longer distances the bond dissociates."
        ),
        "circuit": "VQE PES: [BasisState] → [RY Rotations] → [DoubleExcitation] → ⟨H⟩ @ each distance",
        "molecule": "H₂ PES",
    }


@app.get("/experiment/vqe-sweep")
@limiter.limit("3/minute")
async def vqe_sweep(request: Request, steps: int = Query(8, ge=1, le=30)):
    logger.info("VQE-sweep | steps_per_point=%d", steps)
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, _run_vqe_sweep, steps)
        return result
    except Exception as e:
        logger.exception("VQE-sweep failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Experiment: Barren Plateaus Demonstration
# ===========================================================================
def _run_barren_plateaus() -> dict:
    """Demonstrate vanishing gradients in deep quantum circuits."""
    import numpy as std_np

    n_qubits = 4
    dev = qml.device("default.qubit", wires=n_qubits)
    samples_per_depth = 30

    results = []
    depths = [1, 2, 4, 8, 12, 16, 20]

    for depth in depths:
        grads = []
        for _ in range(samples_per_depth):
            # Random parameters for this circuit
            n_params = depth * n_qubits
            params = np.array(
                std_np.random.uniform(0, 2 * std_np.pi, size=n_params),
                requires_grad=True,
            )

            @qml.qnode(dev)
            def circuit(w):
                for layer in range(depth):
                    for q in range(n_qubits):
                        qml.RY(w[layer * n_qubits + q], wires=q)
                    for q in range(n_qubits - 1):
                        qml.CNOT(wires=[q, q + 1])
                return qml.expval(qml.PauliZ(0))

            grad_fn = qml.grad(circuit)
            g = grad_fn(params)
            grads.append(float(g[0]) ** 2)

        var = float(std_np.mean(grads))
        results.append({"name": f"L={depth}", "value": var})
        logger.debug("Barren depth=%d  var=%.6f", depth, var)

    return {
        "chartData": results,
        "theory": (
            "Barren plateaus occur when variational quantum circuits become "
            "too deep — the gradient variance decreases exponentially with "
            "circuit depth. This means the optimizer receives vanishingly small "
            "signals and cannot learn. The chart shows gradient variance dropping "
            "from ~0.1 (shallow, L=1) to near-zero (deep, L=20). This is a "
            "fundamental challenge in QML research, limiting scalability of "
            "variational algorithms."
        ),
        "circuit": "Test Circuit: [RY(θ) ×n_qubits × depth layers] → [CNOT chain] → ⟨Z₀⟩",
    }


@app.get("/experiment/barren-plateaus")
@limiter.limit("5/minute")
async def barren_plateaus(request: Request):
    logger.info("Barren Plateaus demo")
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, _run_barren_plateaus)
        return result
    except Exception as e:
        logger.exception("Barren Plateaus failed")
        raise HTTPException(status_code=500, detail=str(e))


# ===========================================================================
# Entry point
# ===========================================================================
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
