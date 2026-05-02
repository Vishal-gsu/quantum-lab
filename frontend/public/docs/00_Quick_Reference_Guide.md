# Quick Reference Guide - Quantum Machine Learning

## Your One-Stop Cheat Sheet for QML

Keep this handy while coding! Quick lookup for formulas, commands, and concepts.

---

## Table of Contents
1. [Quantum State Notation](#quantum-state-notation)
2. [Common Quantum Gates](#common-quantum-gates)
3. [Important Formulas](#important-formulas)
4. [Qiskit Commands](#qiskit-commands)
5. [QML Workflow](#qml-workflow)
6. [Troubleshooting](#troubleshooting)

---

## Quantum State Notation

### Single Qubit States

```
|0⟩ = [1, 0]ᵀ    (computational basis)
|1⟩ = [0, 1]ᵀ

|+⟩ = (|0⟩ + |1⟩)/√2 = [1/√2, 1/√2]ᵀ    (Hadamard basis)
|-⟩ = (|0⟩ - |1⟩)/√2 = [1/√2, -1/√2]ᵀ

|i⟩ = (|0⟩ + i|1⟩)/√2     (circular basis)
|-i⟩ = (|0⟩ - i|1⟩)/√2
```

### General Single Qubit

$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$$

**Constraints:**
- $|\alpha|^2 + |\beta|^2 = 1$ (normalization)
- $\alpha, \beta \in \mathbb{C}$ (complex numbers)

### Multi-Qubit States

```
|00⟩ = [1, 0, 0, 0]ᵀ
|01⟩ = [0, 1, 0, 0]ᵀ
|10⟩ = [0, 0, 1, 0]ᵀ
|11⟩ = [0, 0, 0, 1]ᵀ
```

### Bell States (Maximally Entangled)

$$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$
$$|\Phi^-\rangle = \frac{1}{\sqrt{2}}(|00\rangle - |11\rangle)$$
$$|\Psi^+\rangle = \frac{1}{\sqrt{2}}(|01\rangle + |10\rangle)$$
$$|\Psi^-\rangle = \frac{1}{\sqrt{2}}(|01\rangle - |10\rangle)$$

---

## Common Quantum Gates

### Single-Qubit Gates

| Gate | Matrix | Effect | Qiskit |
|------|--------|--------|--------|
| **X** (NOT) | $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ | Bit flip: $\vert 0\rangle \leftrightarrow \vert 1\rangle$ | `qc.x(q)` |
| **Y** | $\begin{bmatrix} 0 & -i \\ i & 0 \end{bmatrix}$ | Bit + phase flip | `qc.y(q)` |
| **Z** | $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$ | Phase flip: $\vert 1\rangle \to -\vert 1\rangle$ | `qc.z(q)` |
| **H** (Hadamard) | $\frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$ | Creates superposition | `qc.h(q)` |
| **S** | $\begin{bmatrix} 1 & 0 \\ 0 & i \end{bmatrix}$ | Phase gate (90°) | `qc.s(q)` |
| **T** | $\begin{bmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{bmatrix}$ | π/8 gate (45°) | `qc.t(q)` |
| **RX(θ)** | $\begin{bmatrix} \cos\frac{\theta}{2} & -i\sin\frac{\theta}{2} \\ -i\sin\frac{\theta}{2} & \cos\frac{\theta}{2} \end{bmatrix}$ | X-axis rotation | `qc.rx(θ, q)` |
| **RY(θ)** | $\begin{bmatrix} \cos\frac{\theta}{2} & -\sin\frac{\theta}{2} \\ \sin\frac{\theta}{2} & \cos\frac{\theta}{2} \end{bmatrix}$ | Y-axis rotation | `qc.ry(θ, q)` |
| **RZ(θ)** | $\begin{bmatrix} e^{-i\theta/2} & 0 \\ 0 & e^{i\theta/2} \end{bmatrix}$ | Z-axis rotation | `qc.rz(θ, q)` |

### Two-Qubit Gates

| Gate | Effect | Circuit | Qiskit |
|------|--------|---------|--------|
| **CNOT** | Flips target if control=1 | `──●──`<br>`  │  `<br>`──⊕──` | `qc.cx(c, t)` |
| **CZ** | Phase flip on $\vert 11\rangle$ | `──●──`<br>`  │  `<br>`──●──` | `qc.cz(c, t)` |
| **SWAP** | Exchanges two qubits | `──×──`<br>`  │  `<br>`──×──` | `qc.swap(a, b)` |

### Three-Qubit Gates

| Gate | Effect | Qiskit |
|------|--------|--------|
| **Toffoli** (CCX) | Flips target if both controls=1 | `qc.ccx(c1, c2, t)` |

---

## Important Formulas

### Probability from Amplitude

$$P(\text{measure } |x\rangle) = |\alpha_x|^2$$

where $\alpha_x$ is amplitude of state $|x\rangle$

### Inner Product (Overlap)

$$\langle\phi|\psi\rangle = \sum_i \phi_i^* \psi_i$$

### Normalization

$$\langle\psi|\psi\rangle = \sum_i |\psi_i|^2 = 1$$

### Tensor Product

$$|a\rangle \otimes |b\rangle = |ab\rangle$$

$$\begin{bmatrix} a_1 \\ a_2 \end{bmatrix} \otimes \begin{bmatrix} b_1 \\ b_2 \end{bmatrix} = \begin{bmatrix} a_1 b_1 \\ a_1 b_2 \\ a_2 b_1 \\ a_2 b_2 \end{bmatrix}$$

### Expectation Value

$$\langle O \rangle = \langle\psi|O|\psi\rangle$$

### Bloch Sphere Representation

$$|\psi\rangle = \cos\frac{\theta}{2}|0\rangle + e^{i\phi}\sin\frac{\theta}{2}|1\rangle$$

---

## Qiskit Commands

### Circuit Creation

```python
from qiskit import QuantumCircuit

# Create circuit
qc = QuantumCircuit(n_qubits, n_classical_bits)

# Alternative: auto-add classical bits
qc = QuantumCircuit(n_qubits)
```

### Adding Gates

```python
# Single-qubit gates
qc.h(0)           # Hadamard on qubit 0
qc.x(1)           # X gate on qubit 1
qc.y(2)           # Y gate
qc.z(3)           # Z gate
qc.s(0)           # S gate
qc.t(1)           # T gate
qc.rx(θ, 0)       # RX rotation
qc.ry(θ, 1)       # RY rotation
qc.rz(θ, 2)       # RZ rotation

# Two-qubit gates
qc.cx(0, 1)       # CNOT (control=0, target=1)
qc.cz(0, 1)       # Controlled-Z
qc.swap(0, 1)     # SWAP

# Three-qubit gates
qc.ccx(0, 1, 2)   # Toffoli

# Barriers (visual separation)
qc.barrier()

# Apply to multiple qubits
qc.h(range(4))    # Hadamard on qubits 0,1,2,3
```

### Measurement

```python
# Measure single qubit
qc.measure(qubit_index, classical_bit_index)

# Measure multiple
qc.measure([0, 1, 2], [0, 1, 2])

# Measure all (auto-adds classical bits)
qc.measure_all()
```

### Parameterized Circuits

```python
from qiskit.circuit import Parameter, ParameterVector

# Single parameter
theta = Parameter('θ')
qc.ry(theta, 0)

# Multiple parameters
params = ParameterVector('θ', length=10)
for i in range(10):
    qc.ry(params[i], i)

# Bind parameters
qc_bound = qc.assign_parameters({theta: 0.5})

# Or dict for multiple
qc_bound = qc.assign_parameters({params[i]: i*0.1 for i in range(10)})
```

### Running Circuits

```python
from qiskit_aer import Aer

# Get simulator
simulator = Aer.get_backend('qasm_simulator')

# Run circuit
job = simulator.run(qc, shots=1000)
result = job.result()
counts = result.get_counts()

# Statevector simulator (no measurement)
simulator = Aer.get_backend('statevector_simulator')
result = simulator.run(qc).result()
statevector = result.get_statevector()

# Unitary simulator (get matrix)
simulator = Aer.get_backend('unitary_simulator')
result = simulator.run(qc).result()
unitary = result.get_unitary()
```

### Visualization

```python
from qiskit.visualization import *

# Circuit
qc.draw()                    # Text
qc.draw('mpl')              # Matplotlib
qc.draw('latex')            # LaTeX

# Results
plot_histogram(counts)

# Quantum states
plot_bloch_multivector(statevector)
plot_state_city(statevector)
plot_state_qsphere(statevector)
```

### Optimization

```python
from qiskit import transpile

# Transpile for backend
optimized_qc = transpile(
    qc, 
    backend=simulator,
    optimization_level=3  # 0-3
)

# Check circuit properties
print(f"Depth: {qc.depth()}")
print(f"Gates: {qc.count_ops()}")
print(f"Qubits: {qc.num_qubits}")
```

---

## QML Workflow

### 1. Data Encoding

```python
# Angle encoding
def angle_encoding(data):
    qc = QuantumCircuit(len(data))
    for i, val in enumerate(data):
        qc.ry(val, i)
    return qc

# ZZ Feature Map
from qiskit.circuit.library import ZZFeatureMap
feature_map = ZZFeatureMap(n_features, reps=2)
```

### 2. Variational Circuit

```python
from qiskit.circuit import ParameterVector

def variational_circuit(n_qubits, n_layers):
    qc = QuantumCircuit(n_qubits)
    params = ParameterVector('θ', n_qubits * n_layers)
    
    idx = 0
    for layer in range(n_layers):
        # Rotation layer
        for i in range(n_qubits):
            qc.ry(params[idx], i)
            idx += 1
        # Entanglement
        for i in range(n_qubits-1):
            qc.cx(i, i+1)
    
    return qc, params
```

### 3. Quantum Kernel

```python
from qiskit_machine_learning.kernels import FidelityQuantumKernel

kernel = FidelityQuantumKernel(feature_map=feature_map)
K_train = kernel.evaluate(X_train)
K_test = kernel.evaluate(X_test, X_train)
```

### 4. Classical Training

```python
from sklearn.svm import SVC

# Train SVM with quantum kernel
svm = SVC(kernel='precomputed')
svm.fit(K_train, y_train)

# Predict
y_pred = svm.predict(K_test)
```

### 5. Complete VQC Template

```python
def train_vqc(X_train, y_train, n_epochs=50):
    # 1. Create circuit
    qc, params = variational_circuit(n_qubits=2, n_layers=2)
    
    # 2. Initialize parameters
    theta = np.random.randn(len(params)) * 0.1
    
    # 3. Training loop
    for epoch in range(n_epochs):
        # Forward pass
        predictions = []
        for x in X_train:
            # Encode + VQC
            pred = run_circuit(qc, params, theta, x)
            predictions.append(pred)
        
        # Compute loss
        loss = compute_loss(y_train, predictions)
        
        # Compute gradients
        grads = compute_gradients(qc, params, theta, X_train, y_train)
        
        # Update
        theta -= learning_rate * grads
    
    return theta
```

---

## Troubleshooting

### Common Errors

#### "Qubit index out of range"
```python
# Wrong: trying to access qubit 3 when only 3 qubits (0,1,2)
qc = QuantumCircuit(3)
qc.h(3)  # ❌ Error!

# Fix:
qc.h(2)  # ✅ Last qubit is index 2
```

#### "Circuit has no measurements"
```python
# For qasm_simulator, need measurements
qc = QuantumCircuit(2)
qc.h(0)
# qc.measure_all() missing!  # ❌

# Fix:
qc.measure_all()  # ✅
```

#### "Parameter not bound"
```python
# Created parameterized circuit but didn't bind
theta = Parameter('θ')
qc.ry(theta, 0)
simulator.run(qc)  # ❌ Error!

# Fix:
qc_bound = qc.assign_parameters({theta: 0.5})  # ✅
simulator.run(qc_bound)
```

#### "Statevector too large"
```python
# Too many qubits for statevector
qc = QuantumCircuit(30)  # 2^30 = 1 billion amplitudes!
statevector = get_statevector(qc)  # ❌ Out of memory

# Fix: Use qasm_simulator instead
simulator = Aer.get_backend('qasm_simulator')  # ✅
```

### Performance Tips

1. **Use transpile for optimization**
   ```python
   qc = transpile(qc, optimization_level=3)
   ```

2. **Batch jobs for multiple circuits**
   ```python
   jobs = [simulator.run(qc) for qc in circuits]
   ```

3. **Use shots wisely**
   ```python
   # More shots = better statistics but slower
   result = simulator.run(qc, shots=1000)  # Good default
   ```

4. **Cache kernel matrices**
   ```python
   # Don't recompute same kernel!
   K_train = kernel.evaluate(X_train)  # Compute once
   # Reuse K_train for training
   ```

---

## Algorithm Quick Reference

### Grover's Search

```python
# For N items, need ~√N iterations
n_iterations = int(π/4 * sqrt(N))

# Circuit:
qc.h(range(n_qubits))           # Superposition
for _ in range(n_iterations):
    oracle(qc, marked_item)      # Mark solution
    diffusion(qc)                # Amplify
qc.measure_all()
```

### Bell State

```python
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0,1], [0,1])
# Measures: 50% |00⟩, 50% |11⟩
```

### Quantum Teleportation

```python
# Teleport qubit 0 to qubit 2
qc = QuantumCircuit(3, 2)
# Create state to teleport
qc.ry(θ, 0)  
# Create Bell pair (1,2)
qc.h(1)
qc.cx(1, 2)
# Alice's operations
qc.cx(0, 1)
qc.h(0)
qc.measure([0,1], [0,1])
# Bob's corrections (conditional on measurements)
# ... state now on qubit 2!
```

---

## Complexity Reference

| Operation | Classical | Quantum |
|-----------|-----------|---------|
| Unstructured search | O(N) | O(√N) |
| Factoring N-bit number | Exponential | O((log N)³) |
| Fourier transform | O(N log N) | O(log² N) |
| Simulating n particles | O(2ⁿ) | O(n²) |

---

## Useful Constants

```python
import numpy as np

PI = np.pi
SQRT2 = np.sqrt(2)

# Common angles
THETA_45 = PI/4
THETA_90 = PI/2
THETA_180 = PI

# Common matrices
PAULI_X = np.array([[0, 1], [1, 0]])
PAULI_Y = np.array([[0, -1j], [1j, 0]])
PAULI_Z = np.array([[1, 0], [0, -1]])
HADAMARD = np.array([[1, 1], [1, -1]]) / SQRT2
```

---

## Learning Path Reminder

```
1. ✅ Understand qubits and superposition
2. ✅ Learn basic gates (H, X, CNOT)
3. ✅ Build simple circuits
4. ✅ Understand entanglement
5. ✅ Implement algorithms (Bell, Grover)
6. ✅ Learn classical ML (if needed)
7. ✅ Understand quantum encoding
8. ✅ Build VQC/QNN
9. ✅ Try quantum kernels
10. ✅ Experiment with real problems
```

---

## Resources

### Documentation
- **Qiskit**: https://qiskit.org/documentation
- **Qiskit Textbook**: https://qiskit.org/textbook
- **API Reference**: https://qiskit.org/documentation/apidoc

### Tutorials
- **IBM Quantum Lab**: https://quantum-computing.ibm.com
- **Qiskit Tutorials**: https://github.com/Qiskit/qiskit-tutorials
- **Qiskit ML**: https://qiskit.org/ecosystem/machine-learning

### Community
- **Qiskit Slack**: qiskit.slack.com
- **Stack Exchange**: quantumcomputing.stackexchange.com
- **GitHub**: github.com/Qiskit

---

## Final Checklist

Before starting a QML project:

- [ ] Understand the classical ML baseline
- [ ] Data is normalized/preprocessed
- [ ] Feature dimensionality is reasonable (< 10 for NISQ)
- [ ] Have clear success metric
- [ ] Chosen appropriate quantum encoding
- [ ] Selected suitable ansatz/circuit depth
- [ ] Planned training strategy (optimizer, learning rate)
- [ ] Ready to iterate and experiment!

---

**Keep this guide handy and happy quantum coding!** 🚀

