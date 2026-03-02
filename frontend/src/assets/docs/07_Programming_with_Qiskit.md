# Part 7: Programming with Qiskit

## From Theory to Code - Your First Quantum Programs!

Now the fun begins! Let's write actual quantum code using IBM's Qiskit framework.

---

## Table of Contents
1. [Setting Up Qiskit](#setting-up-qiskit)
2. [Your First Quantum Circuit](#your-first-quantum-circuit)
3. [Basic Gates in Code](#basic-gates-in-code)
4. [Measuring and Running Circuits](#measuring-and-running-circuits)
5. [Implementing Algorithms](#implementing-algorithms)
6. [Quantum Machine Learning with Qiskit](#quantum-machine-learning-with-qiskit)
7. [Visualization Tools](#visualization-tools)

---

## Setting Up Qiskit

### Installation

```bash
# Create virtual environment (recommended)
python -m venv quantum_env
source quantum_env/bin/activate  # On Windows: quantum_env\Scripts\activate

# Install Qiskit
pip install qiskit
pip install qiskit-aer  # Simulator
pip install qiskit-ibm-runtime  # For real quantum computers
pip install qiskit-machine-learning  # For ML

# Additional helpful packages
pip install matplotlib  # Visualization
pip install pylatexenc  # Better circuit drawing
pip install jupyter  # For notebooks
```

### Verify Installation

```python
import qiskit
print(qiskit.__version__)  # Should show version (e.g., 1.0.0)

# Check available backends
from qiskit_aer import Aer
print(Aer.backends())
```

---

## Your First Quantum Circuit

### Creating a Simple Circuit

```python
from qiskit import QuantumCircuit

# Create a quantum circuit with 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# All qubits start in |0⟩ state
print(qc)
```

**Output:**
```
     
q_0: 
     
q_1: 
     
c: 2/
     
```

### Adding Gates

```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# Apply Hadamard gate to qubit 0
qc.h(0)

# Apply CNOT gate (control=0, target=1)
qc.cx(0, 1)

# Measure both qubits
qc.measure([0, 1], [0, 1])

# Draw the circuit
print(qc.draw())
```

**Output:**
```
     ┌───┐     ┌─┐   
q_0: ┤ H ├──■──┤M├───
     └───┘┌─┴─┐└╥┘┌─┐
q_1: ─────┤ X ├─╫─┤M├
          └───┘ ║ └╥┘
c: 2/═══════════╩══╩═
                0  1 
```

**This is a Bell State circuit!** Creates entanglement.

---

## Basic Gates in Code

### Single-Qubit Gates

```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(1)

# Pauli Gates
qc.x(0)  # X gate (NOT)
qc.y(0)  # Y gate
qc.z(0)  # Z gate

# Hadamard
qc.h(0)  # Create superposition

# Phase Gates
qc.s(0)  # S gate (phase π/2)
qc.t(0)  # T gate (phase π/4)

# Rotation Gates (angle in radians)
import math
qc.rx(math.pi/4, 0)  # Rotate around X
qc.ry(math.pi/3, 0)  # Rotate around Y
qc.rz(math.pi/2, 0)  # Rotate around Z

# Identity
qc.id(0)  # Do nothing

print(qc.draw())
```

---

### Two-Qubit Gates

```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(2)

# CNOT (Controlled-NOT)
qc.cx(0, 1)  # control=0, target=1

# Controlled-Z
qc.cz(0, 1)

# SWAP
qc.swap(0, 1)

# Controlled gates (general)
qc.ch(0, 1)  # Controlled-Hadamard
qc.cy(0, 1)  # Controlled-Y

# Controlled rotation
qc.crx(math.pi/4, 0, 1)  # Controlled-RX

print(qc.draw())
```

---

### Three-Qubit Gates

```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(3)

# Toffoli (CCNOT) - controlled-controlled-NOT
qc.ccx(0, 1, 2)  # controls: 0,1  target: 2

# Fredkin (CSWAP) - controlled-SWAP
qc.cswap(0, 1, 2)  # control: 0  swap: 1,2

print(qc.draw())
```

---

## Measuring and Running Circuits

### Adding Measurements

```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)  # 2 qubits, 2 classical bits

# Build circuit
qc.h(0)
qc.cx(0, 1)

# Measure qubit 0 to classical bit 0
qc.measure(0, 0)

# Measure qubit 1 to classical bit 1
qc.measure(1, 1)

# Or measure all at once
# qc.measure_all()  # Automatically adds classical bits if needed
```

---

### Running on Simulator

```python
from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

# Create Bell state circuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

# Get simulator
simulator = Aer.get_backend('qasm_simulator')

# Run the circuit
job = simulator.run(qc, shots=1000)  # Run 1000 times
result = job.result()

# Get counts
counts = result.get_counts(qc)
print("Results:", counts)

# Visualize
plot_histogram(counts)
plt.show()
```

**Expected Output:**
```
Results: {'00': 497, '11': 503}
```
(Approximately 50/50 due to entanglement!)

---

### Statevector Simulation

```python
from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit.visualization import plot_bloch_multivector

# Create circuit (NO measurement!)
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)

# Use statevector simulator
simulator = Aer.get_backend('statevector_simulator')
result = simulator.run(qc).result()
statevector = result.get_statevector()

print("Statevector:", statevector)
# Output: [0.707+0j, 0+0j, 0+0j, 0.707+0j]
# This is: (1/√2)|00⟩ + (1/√2)|11⟩

# Visualize on Bloch sphere
plot_bloch_multivector(statevector)
plt.show()
```

---

## Implementing Algorithms

### 1. Deutsch-Jozsa Algorithm

```python
from qiskit import QuantumCircuit
from qiskit_aer import Aer

def deutsch_jozsa(oracle_type='balanced', n=3):
    """
    oracle_type: 'constant' or 'balanced'
    n: number of qubits
    """
    # Create circuit with n+1 qubits
    qc = QuantumCircuit(n+1, n)
    
    # Initialize last qubit to |1⟩
    qc.x(n)
    
    # Apply Hadamard to all qubits
    qc.h(range(n+1))
    qc.barrier()
    
    # Oracle
    if oracle_type == 'balanced':
        # Balanced oracle: flip based on first qubit
        qc.cx(0, n)
    # else: constant oracle does nothing
    
    qc.barrier()
    
    # Apply Hadamard to first n qubits
    qc.h(range(n))
    qc.barrier()
    
    # Measure first n qubits
    qc.measure(range(n), range(n))
    
    return qc

# Test
qc = deutsch_jozsa('balanced', n=3)
print(qc.draw())

# Run
simulator = Aer.get_backend('qasm_simulator')
result = simulator.run(qc, shots=1).result()
counts = result.get_counts()

print("Result:", counts)
# Balanced: NOT all zeros
# Constant: All zeros
```

---

### 2. Grover's Algorithm

```python
from qiskit import QuantumCircuit
from qiskit_aer import Aer
import math

def grover_oracle(qc, marked_state):
    """Oracle that marks the target state"""
    # Convert marked state to binary
    n = qc.num_qubits
    
    # Flip qubits that are 0 in target
    for i, bit in enumerate(reversed(marked_state)):
        if bit == '0':
            qc.x(i)
    
    # Multi-controlled Z
    qc.h(n-1)
    qc.mcx(list(range(n-1)), n-1)  # Multi-controlled-X
    qc.h(n-1)
    
    # Flip back
    for i, bit in enumerate(reversed(marked_state)):
        if bit == '0':
            qc.x(i)

def grover_diffusion(qc):
    """Diffusion operator (inversion about average)"""
    n = qc.num_qubits
    
    # Apply H to all
    qc.h(range(n))
    
    # Apply X to all
    qc.x(range(n))
    
    # Multi-controlled Z
    qc.h(n-1)
    qc.mcx(list(range(n-1)), n-1)
    qc.h(n-1)
    
    # Apply X to all
    qc.x(range(n))
    
    # Apply H to all
    qc.h(range(n))

def grover_algorithm(marked_state, n_qubits=3):
    """Complete Grover's algorithm"""
    qc = QuantumCircuit(n_qubits, n_qubits)
    
    # Initialize: superposition
    qc.h(range(n_qubits))
    
    # Calculate optimal iterations
    n_iterations = int(math.pi/4 * math.sqrt(2**n_qubits))
    
    for _ in range(n_iterations):
        # Oracle
        grover_oracle(qc, marked_state)
        qc.barrier()
        
        # Diffusion
        grover_diffusion(qc)
        qc.barrier()
    
    # Measure
    qc.measure(range(n_qubits), range(n_qubits))
    
    return qc

# Search for |101⟩ among 8 states
qc = grover_algorithm('101', n_qubits=3)

# Run
simulator = Aer.get_backend('qasm_simulator')
result = simulator.run(qc, shots=1000).result()
counts = result.get_counts()

print("Search results:", counts)
# Should find '101' with high probability!
```

---

### 3. Quantum Fourier Transform

```python
from qiskit import QuantumCircuit
import math

def qft(n):
    """Create QFT circuit for n qubits"""
    qc = QuantumCircuit(n)
    
    for j in range(n):
        # Hadamard
        qc.h(j)
        
        # Controlled rotations
        for k in range(j+1, n):
            qc.cp(2*math.pi/2**(k-j+1), k, j)
    
    # Swap qubits (bit reversal)
    for i in range(n//2):
        qc.swap(i, n-i-1)
    
    return qc

# Create 3-qubit QFT
qc = qft(3)
print(qc.draw())

# Test on |5⟩ = |101⟩
test_circuit = QuantumCircuit(3)
test_circuit.x(0)  # |1⟩
test_circuit.x(2)  # |1⟩
test_circuit.compose(qc, inplace=True)

# Simulate
from qiskit_aer import Aer
simulator = Aer.get_backend('statevector_simulator')
result = simulator.run(test_circuit).result()
statevector = result.get_statevector()
print("QFT output:", statevector)
```

---

### 4. Bell States

```python
from qiskit import QuantumCircuit

def create_bell_state(state_type='phi_plus'):
    """
    Create different Bell states
    phi_plus:  (|00⟩ + |11⟩)/√2
    phi_minus: (|00⟩ - |11⟩)/√2
    psi_plus:  (|01⟩ + |10⟩)/√2
    psi_minus: (|01⟩ - |10⟩)/√2
    """
    qc = QuantumCircuit(2, 2)
    
    # Base: Phi+
    qc.h(0)
    qc.cx(0, 1)
    
    # Modify for other states
    if state_type == 'phi_minus':
        qc.z(0)
    elif state_type == 'psi_plus':
        qc.x(0)
    elif state_type == 'psi_minus':
        qc.x(0)
        qc.z(0)
    
    qc.measure([0,1], [0,1])
    return qc

# Test all Bell states
for bell_type in ['phi_plus', 'phi_minus', 'psi_plus', 'psi_minus']:
    qc = create_bell_state(bell_type)
    print(f"\n{bell_type}:")
    print(qc.draw())
```

---

## Quantum Machine Learning with Qiskit

### 1. Data Encoding

```python
from qiskit import QuantumCircuit
import numpy as np

def angle_encoding(data):
    """Encode classical data using rotation gates"""
    n_qubits = len(data)
    qc = QuantumCircuit(n_qubits)
    
    for i, value in enumerate(data):
        qc.ry(value, i)  # Encode as rotation angle
    
    return qc

# Example: encode [0.5, 1.0, 1.5]
data = [0.5, 1.0, 1.5]
qc = angle_encoding(data)
print(qc.draw())
```

---

### 2. ZZ Feature Map

```python
from qiskit import QuantumCircuit
import numpy as np

def zz_feature_map(data, reps=2):
    """ZZ Feature Map for quantum ML"""
    n_qubits = len(data)
    qc = QuantumCircuit(n_qubits)
    
    for _ in range(reps):
        # Hadamard layer
        qc.h(range(n_qubits))
        
        # Encoding layer
        for i, value in enumerate(data):
            qc.rz(2*value, i)
        
        # Entangling layer
        for i in range(n_qubits-1):
            qc.cx(i, i+1)
            qc.rz(2*(np.pi - data[i])*(np.pi - data[i+1]), i+1)
            qc.cx(i, i+1)
    
    return qc

# Example
data = np.array([0.5, 1.0])
qc = zz_feature_map(data, reps=1)
print(qc.draw())
```

---

### 3. Variational Quantum Circuit

```python
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter

def variational_circuit(n_qubits, n_layers=2):
    """Create parameterized variational circuit"""
    qc = QuantumCircuit(n_qubits)
    
    # Create parameters
    params = []
    for layer in range(n_layers):
        layer_params = [Parameter(f'θ_{layer}_{i}') for i in range(n_qubits)]
        params.extend(layer_params)
        
        # Rotation layer
        for i in range(n_qubits):
            qc.ry(layer_params[i], i)
        
        # Entanglement layer
        for i in range(n_qubits-1):
            qc.cx(i, i+1)
    
    return qc, params

# Create VQC
qc, params = variational_circuit(3, n_layers=2)
print(qc.draw())
print(f"Parameters: {[p.name for p in params]}")
```

---

### 4. Complete VQC Training Loop

```python
from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit.circuit import Parameter
import numpy as np

def create_vqc(n_features):
    """Create Variational Quantum Classifier"""
    qc = QuantumCircuit(n_features)
    
    # Feature map
    for i in range(n_features):
        qc.h(i)
        qc.rz(Parameter(f'x_{i}'), i)
    
    # Variational layer
    params = []
    for i in range(n_features):
        param = Parameter(f'θ_{i}')
        params.append(param)
        qc.ry(param, i)
    
    # Entanglement
    for i in range(n_features-1):
        qc.cx(i, i+1)
    
    return qc, params

def predict(circuit, params, theta, x_data):
    """Get prediction from VQC"""
    # Bind parameters
    param_dict = {}
    for i, val in enumerate(x_data):
        param_dict[f'x_{i}'] = val
    for i, val in enumerate(theta):
        param_dict[f'θ_{i}'] = val
    
    bound_circuit = circuit.assign_parameters(param_dict)
    
    # Add measurement
    bound_circuit.measure_all()
    
    # Run
    simulator = Aer.get_backend('qasm_simulator')
    result = simulator.run(bound_circuit, shots=1000).result()
    counts = result.get_counts()
    
    # Extract prediction (probability of |0...0⟩)
    prob_zero = counts.get('0'*len(x_data), 0) / 1000
    return prob_zero

# Example usage
qc, params = create_vqc(n_features=2)

# Random initial parameters
theta = np.random.random(2) * np.pi

# Predict for data point [0.5, 1.0]
prediction = predict(qc, params, theta, [0.5, 1.0])
print(f"Prediction: {prediction}")
```

---

### 5. Quantum Kernel (QSVM)

```python
from qiskit import QuantumCircuit
from qiskit_aer import Aer
import numpy as np

def quantum_kernel(x1, x2):
    """Compute quantum kernel K(x1, x2)"""
    n_qubits = len(x1)
    qc = QuantumCircuit(n_qubits, n_qubits)
    
    # Feature map for x1
    for i, val in enumerate(x1):
        qc.h(i)
        qc.rz(2*val, i)
    for i in range(n_qubits-1):
        qc.cx(i, i+1)
    
    # Inverse feature map for x2
    for i in range(n_qubits-1):
        qc.cx(i, i+1)
    for i, val in enumerate(reversed(x2)):
        idx = n_qubits - 1 - i
        qc.rz(-2*val, idx)
        qc.h(idx)
    
    # Measure
    qc.measure(range(n_qubits), range(n_qubits))
    
    # Run
    simulator = Aer.get_backend('qasm_simulator')
    result = simulator.run(qc, shots=1000).result()
    counts = result.get_counts()
    
    # Kernel value = probability of measuring |00...0⟩
    all_zeros = '0' * n_qubits
    kernel_value = counts.get(all_zeros, 0) / 1000
    
    return kernel_value

# Compute kernel matrix for dataset
X = np.array([[0.1, 0.2], [0.3, 0.4], [0.5, 0.6]])
n_samples = len(X)

K = np.zeros((n_samples, n_samples))
for i in range(n_samples):
    for j in range(n_samples):
        K[i, j] = quantum_kernel(X[i], X[j])

print("Quantum Kernel Matrix:")
print(K)
```

---

## Visualization Tools

### 1. Circuit Visualization

```python
from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)

# Text drawing
print(qc.draw())

# Matplotlib (prettier)
qc.draw('mpl')  # Returns matplotlib figure

# LaTeX (publication quality)
qc.draw('latex')

# Interactive (in Jupyter)
qc.draw('mpl', interactive=True)
```

---

### 2. Histogram

```python
from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0,1], [0,1])

simulator = Aer.get_backend('qasm_simulator')
result = simulator.run(qc, shots=1000).result()
counts = result.get_counts()

plot_histogram(counts)
plt.show()
```

---

### 3. Bloch Sphere

```python
from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit.visualization import plot_bloch_multivector
import matplotlib.pyplot as plt

qc = QuantumCircuit(1)
qc.h(0)  # Create |+⟩ state

simulator = Aer.get_backend('statevector_simulator')
result = simulator.run(qc).result()
statevector = result.get_statevector()

plot_bloch_multivector(statevector)
plt.show()
```

---

### 4. State City Plot

```python
from qiskit.visualization import plot_state_city
import matplotlib.pyplot as plt

# Shows probability amplitudes as 3D bars
plot_state_city(statevector)
plt.show()
```

---

### 5. Q-Sphere

```python
from qiskit.visualization import plot_state_qsphere
import matplotlib.pyplot as plt

# Sphere showing all basis states
plot_state_qsphere(statevector)
plt.show()
```

---

## Running on Real Quantum Computer (IBM Quantum)

### Setup IBM Quantum Account

```python
from qiskit_ibm_runtime import QiskitRuntimeService

# Save your IBM Quantum credentials (once)
QiskitRuntimeService.save_account(
    channel='ibm_quantum',
    token='YOUR_IBM_QUANTUM_TOKEN',  # Get from https://quantum.ibm.com
    overwrite=True
)

# Load service
service = QiskitRuntimeService(channel='ibm_quantum')

# See available backends
backends = service.backends()
for backend in backends:
    print(f"{backend.name}: {backend.num_qubits} qubits")
```

---

### Submit Job to Real Device

```python
from qiskit import QuantumCircuit, transpile
from qiskit_ibm_runtime import QiskitRuntimeService

# Create circuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0,1], [0,1])

# Get service and backend
service = QiskitRuntimeService(channel='ibm_quantum')
backend = service.least_busy(operational=True, simulator=False)

print(f"Running on: {backend.name}")

# Transpile for backend
transpiled_qc = transpile(qc, backend)

# Submit job
job = backend.run(transpiled_qc, shots=1000)

# Get job ID (save this!)
print(f"Job ID: {job.job_id()}")

# Wait for result
result = job.result()
counts = result.get_counts()

print("Results from real quantum computer:", counts)
```

---

### Retrieve Old Job

```python
# If you saved job_id, retrieve result later
job = service.job('YOUR_JOB_ID')
result = job.result()
counts = result.get_counts()
```

---

## Best Practices

### 1. Circuit Optimization

```python
from qiskit import transpile

# Optimize circuit for specific backend
optimized_qc = transpile(
    qc, 
    backend,
    optimization_level=3  # 0-3, higher = more optimization
)

print(f"Original depth: {qc.depth()}")
print(f"Optimized depth: {optimized_qc.depth()}")
```

---

### 2. Error Mitigation

```python
# Use multiple shots for better statistics
result = backend.run(qc, shots=10000)

# Measurement error mitigation (on real devices)
from qiskit.providers.aer.noise import NoiseModel

# Build noise model from real device
noise_model = NoiseModel.from_backend(backend)

# Simulate with noise
noisy_simulator = Aer.get_backend('qasm_simulator')
result = noisy_simulator.run(
    qc, 
    noise_model=noise_model,
    shots=1000
).result()
```

---

### 3. Parameterized Circuits

```python
from qiskit.circuit import Parameter

# Define parameters
theta = Parameter('θ')
phi = Parameter('φ')

qc = QuantumCircuit(1)
qc.rx(theta, 0)
qc.ry(phi, 0)

# Bind later
bound_qc = qc.assign_parameters({theta: 0.5, phi: 1.0})
```

---

## Debugging Tips

### 1. Check Statevector

```python
# See exact quantum state (small circuits only)
simulator = Aer.get_backend('statevector_simulator')
statevector = simulator.run(qc).result().get_statevector()
print(statevector)
```

### 2. Verify Unitary

```python
# Get unitary matrix of circuit
simulator = Aer.get_backend('unitary_simulator')
unitary = simulator.run(qc).result().get_unitary()
print(unitary)
```

### 3. Decompose Gates

```python
# See how high-level gates are implemented
decomposed_qc = qc.decompose()
print(decomposed_qc.draw())
```

---

## Common Errors and Solutions

### Error: "Circuit too deep"
**Solution:** Use `transpile` with optimization, or redesign algorithm

### Error: "Not enough qubits"
**Solution:** Use simulator, or find backend with more qubits

### Error: "Job failed"
**Solution:** Check job.error_message(), may need to retry

### Error: "Statevector too large"
**Solution:** Use qasm_simulator instead (measurement-based)

---

## Key Takeaways 🎯

1. ✅ **Qiskit** is IBM's open-source quantum computing framework
2. ✅ **QuantumCircuit** is the core object for building circuits
3. ✅ Gates are added with methods: `.h()`, `.cx()`, `.ry()`, etc.
4. ✅ **Simulators** run circuits without real quantum hardware
5. ✅ **Transpile** optimizes circuits for specific backends
6. ✅ **Variational circuits** have trainable parameters
7. ✅ Can run on **real IBM quantum computers** for free!

---

## What's Next?

In **Part 8: Hands-on QML Projects**, we'll build:
- Complete quantum classifier
- Quantum feature maps for real data
- Hybrid quantum-classical neural network
- Portfolio optimization with QAOA

---

## Quick Reference: Common Commands

```python
# === Circuit Creation ===
qc = QuantumCircuit(n_qubits, n_classical)

# === Gates ===
qc.h(qubit)              # Hadamard
qc.x(qubit)              # Pauli-X
qc.y(qubit)              # Pauli-Y
qc.z(qubit)              # Pauli-Z
qc.cx(control, target)   # CNOT
qc.ry(angle, qubit)      # Y-rotation
qc.measure(qubit, cbit)  # Measurement

# === Simulation ===
from qiskit_aer import Aer
simulator = Aer.get_backend('qasm_simulator')
job = simulator.run(qc, shots=1000)
result = job.result()
counts = result.get_counts()

# === Visualization ===
qc.draw()                           # Circuit
plot_histogram(counts)              # Results
plot_bloch_multivector(statevector) # Bloch sphere

# === Optimization ===
from qiskit import transpile
optimized = transpile(qc, backend, optimization_level=3)
```

---

**Excellent!** You can now code quantum circuits. Let's build real projects! 🚀

