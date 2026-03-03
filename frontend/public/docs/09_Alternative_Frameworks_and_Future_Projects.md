# Part 9: Alternative Frameworks & Future Projects

## Expand Your Quantum Toolkit

Beyond Qiskit, there are several powerful quantum ML frameworks. Learn them all to choose the best tool for each project!

---

## Table of Contents
1. [Framework Comparison](#framework-comparison)
2. [PennyLane - Quantum ML Focused](#pennylane)
3. [PyTorch + Quantum Integration](#pytorch-quantum)
4. [TensorFlow Quantum](#tensorflow-quantum)
5. [Google Cirq](#google-cirq)
6. [Microsoft Q#](#microsoft-q)
7. [Project Adaptation Guide](#project-adaptation-guide)
8. [Future Project Ideas](#future-project-ideas)

---

## Framework Comparison

### Quick Overview

| Framework | Best For | Integration | Difficulty | Industry Use |
|-----------|----------|-------------|------------|--------------|
| **Qiskit** | IBM hardware, research | Scikit-learn | Medium | IBM, Academia |
| **PennyLane** | ML integration, autodiff | PyTorch, TF, JAX | Easy | Xanadu, Research |
| **TensorFlow Quantum** | TF pipelines, scaling | TensorFlow/Keras | Medium | Google Research |
| **Cirq** | Google hardware, low-level | TensorFlow | Hard | Google |
| **Q#** | Microsoft Azure, .NET | .NET ecosystem | Medium | Microsoft Azure |
| **PyTorch Quantum** | PyTorch users | Native PyTorch | Easy | Research |

### When to Use Each

```python
# Choose based on your goal:

if need_ibm_hardware or research_focus:
    use_qiskit()
    
elif pytorch_user and want_easy_gradients:
    use_pennylane()
    
elif tensorflow_pipeline:
    use_tensorflow_quantum()
    
elif google_hardware or custom_gates:
    use_cirq()
    
elif microsoft_azure or csharp_developer:
    use_qsharp()
```

---

## PennyLane

### Why PennyLane?

**PennyLane** is designed specifically for **quantum machine learning** with:
- ✅ **Automatic differentiation** (like PyTorch)
- ✅ **Multiple backend support** (IBM, Google, Rigetti, simulators)
- ✅ **Native PyTorch/TensorFlow integration**
- ✅ **Cleaner syntax for QML**

### Installation

```bash
pip install pennylane
pip install pennylane-qiskit  # For IBM hardware
pip install torch  # For PyTorch integration
```

---

### Your First PennyLane Circuit

```python
import pennylane as qml
import numpy as np

# Create a device (simulator)
dev = qml.device('default.qubit', wires=2)

# Define quantum circuit as a function
@qml.qnode(dev)
def circuit(params):
    qml.RY(params[0], wires=0)
    qml.RY(params[1], wires=1)
    qml.CNOT(wires=[0, 1])
    return qml.expval(qml.PauliZ(0))

# Run circuit
params = np.array([0.5, 1.0])
result = circuit(params)
print(f"Expectation value: {result}")

# Draw circuit
print(qml.draw(circuit)(params))
```

**Output:**
```
0: ──RY(0.50)──╭●──┤  <Z>
1: ──RY(1.00)──╰X──┤     
```

---

### PennyLane Variational Classifier

```python
"""
Complete variational classifier in PennyLane
Much cleaner than Qiskit for ML!
"""

import pennylane as qml
import numpy as np
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split

# 1. PREPARE DATA
X, y = make_moons(n_samples=100, noise=0.1, random_state=42)
y = y * 2 - 1  # Convert to -1, +1
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

# 2. CREATE QUANTUM DEVICE
n_qubits = 2
dev = qml.device('default.qubit', wires=n_qubits)

# 3. DEFINE QUANTUM CIRCUIT
@qml.qnode(dev)
def quantum_circuit(weights, x):
    """
    Variational quantum circuit
    
    Args:
        weights: Trainable parameters
        x: Input data
    """
    # Data encoding
    for i in range(n_qubits):
        qml.RY(x[i], wires=i)
    
    # Variational layers
    n_layers = 2
    for layer in range(n_layers):
        # Rotation layer
        for i in range(n_qubits):
            qml.RY(weights[layer, i, 0], wires=i)
            qml.RZ(weights[layer, i, 1], wires=i)
        
        # Entanglement layer
        for i in range(n_qubits - 1):
            qml.CNOT(wires=[i, i+1])
    
    # Measurement
    return qml.expval(qml.PauliZ(0))

# 4. DEFINE COST FUNCTION
def cost_function(weights, X, y):
    """Mean squared error loss"""
    predictions = np.array([quantum_circuit(weights, x) for x in X])
    return np.mean((y - predictions) ** 2)

# 5. TRAINING
print("Training PennyLane VQC...")

# Initialize weights
n_layers = 2
weights = np.random.randn(n_layers, n_qubits, 2, requires_grad=True)

# Optimizer (PennyLane has built-in optimizers!)
opt = qml.GradientDescentOptimizer(stepsize=0.1)

# Training loop
n_epochs = 50
for epoch in range(n_epochs):
    # Update weights (automatic differentiation!)
    weights, cost = opt.step_and_cost(
        lambda w: cost_function(w, X_train, y_train),
        weights
    )
    
    if (epoch + 1) % 10 == 0:
        print(f"Epoch {epoch+1}, Cost: {cost:.4f}")

# 6. EVALUATE
train_pred = np.sign([quantum_circuit(weights, x) for x in X_train])
test_pred = np.sign([quantum_circuit(weights, x) for x in X_test])

train_acc = np.mean(train_pred == y_train)
test_acc = np.mean(test_pred == y_test)

print(f"\nTraining Accuracy: {train_acc:.3f}")
print(f"Test Accuracy: {test_acc:.3f}")
```

**Key Advantages:**
- ✅ **Automatic differentiation** - no manual gradient calculation!
- ✅ **Cleaner syntax** - less boilerplate code
- ✅ **Built-in optimizers** - Adam, SGD, etc.
- ✅ **Easy debugging** - familiar Python decorators

---

### PennyLane with PyTorch

```python
"""
Integrate PennyLane with PyTorch for hybrid models
"""

import pennylane as qml
import torch
import torch.nn as nn

# Define quantum device
n_qubits = 4
dev = qml.device('default.qubit', wires=n_qubits)

# Create quantum layer
@qml.qnode(dev, interface='torch')
def quantum_layer(inputs, weights):
    # Encode inputs
    for i in range(n_qubits):
        qml.RY(inputs[i], wires=i)
    
    # Variational circuit
    for i in range(n_qubits):
        qml.RY(weights[i], wires=i)
    
    for i in range(n_qubits - 1):
        qml.CNOT(wires=[i, i+1])
    
    # Return expectation values
    return [qml.expval(qml.PauliZ(i)) for i in range(n_qubits)]

# Hybrid Quantum-Classical Neural Network
class HybridQNN(nn.Module):
    def __init__(self):
        super().__init__()
        
        # Classical preprocessing
        self.fc1 = nn.Linear(8, 4)
        
        # Quantum layer parameters
        self.q_params = nn.parameter.Parameter(torch.randn(n_qubits))
        
        # Classical postprocessing
        self.fc2 = nn.Linear(4, 2)
    
    def forward(self, x):
        # Classical layer
        x = torch.relu(self.fc1(x))
        
        # Quantum layer
        q_out = torch.stack([
            torch.tensor(quantum_layer(x[i], self.q_params)) 
            for i in range(x.shape[0])
        ])
        
        # Classical output
        out = self.fc2(q_out)
        return out

# Create model
model = HybridQNN()

# Standard PyTorch training!
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

print("Hybrid Quantum-Classical model created!")
print(model)

# Train as you would any PyTorch model
# for epoch in range(epochs):
#     optimizer.zero_grad()
#     output = model(data)
#     loss = criterion(output, labels)
#     loss.backward()  # Backprop through quantum circuit!
#     optimizer.step()
```

**This is POWERFUL!** You can:
- ✅ Mix quantum and classical layers
- ✅ Use PyTorch's full ecosystem (data loaders, etc.)
- ✅ Backpropagate through quantum circuits!
- ✅ Use pre-trained classical models + quantum

---

### PennyLane Quantum Kernels

```python
import pennylane as qml
from pennylane import numpy as np

n_qubits = 2
dev = qml.device('default.qubit', wires=n_qubits)

@qml.qnode(dev)
def quantum_kernel(x1, x2):
    """Quantum kernel using ZZ feature map"""
    # Encode x1
    for i in range(n_qubits):
        qml.Hadamard(wires=i)
        qml.RZ(2 * x1[i], wires=i)
    
    for i in range(n_qubits - 1):
        qml.CNOT(wires=[i, i+1])
        qml.RZ(2 * (np.pi - x1[i]) * (np.pi - x1[i+1]), wires=i+1)
        qml.CNOT(wires=[i, i+1])
    
    # Inverse encode x2
    for i in range(n_qubits - 1):
        qml.CNOT(wires=[i, i+1])
        qml.RZ(-2 * (np.pi - x2[i]) * (np.pi - x2[i+1]), wires=i+1)
        qml.CNOT(wires=[i, i+1])
    
    for i in range(n_qubits):
        qml.RZ(-2 * x2[i], wires=i)
        qml.Hadamard(wires=i)
    
    # Return probability of |00⟩
    return qml.probs(wires=range(n_qubits))[0]

# Use with sklearn
from sklearn.svm import SVC

def compute_kernel_matrix(X):
    n = len(X)
    K = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            K[i, j] = quantum_kernel(X[i], X[j])
    return K

# X_train, y_train = your data
# K = compute_kernel_matrix(X_train)
# svm = SVC(kernel='precomputed')
# svm.fit(K, y_train)
```

---

## PyTorch Quantum

### TorchQuantum Library

```bash
pip install torchquantum
```

```python
"""
TorchQuantum - PyTorch-native quantum computing
"""

import torch
import torchquantum as tq
import torchquantum.functional as tqf

# Create quantum device
qdev = tq.QuantumDevice(n_wires=2)

# Quantum operations
tqf.hadamard(qdev, wires=0)
tqf.cnot(qdev, wires=[0, 1])

# Get statevector
print(qdev.states)

# Parameterized circuit
class QuantumNet(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.n_wires = 4
        self.q_device = tq.QuantumDevice(n_wires=self.n_wires)
        
        # Quantum gates with trainable parameters
        self.rx_gates = torch.nn.ModuleList([
            tq.RX(has_params=True, trainable=True)
            for _ in range(self.n_wires)
        ])
        
    def forward(self, x):
        self.q_device.reset_states(bsz=x.shape[0])
        
        # Apply gates
        for i, gate in enumerate(self.rx_gates):
            gate(self.q_device, wires=i)
        
        # Measure
        return tq.measure.expval(self.q_device, observable=tq.PauliZ(wires=0))

# Use like any PyTorch model!
model = QuantumNet()
optimizer = torch.optim.Adam(model.parameters())
```

---

## TensorFlow Quantum

### Google's TFQ

```bash
pip install tensorflow
pip install tensorflow-quantum
```

```python
"""
TensorFlow Quantum - Quantum ML with TensorFlow
"""

import tensorflow as tf
import tensorflow_quantum as tfq
import cirq
import sympy
import numpy as np

# 1. CREATE QUANTUM CIRCUIT (uses Cirq)
qubits = cirq.GridQubit.rect(1, 2)

# Parameterized circuit
def create_quantum_model():
    """Creates a quantum circuit for ML"""
    # Symbols for parameters
    params = sympy.symbols('theta0:4')
    
    circuit = cirq.Circuit()
    
    # Feature encoding + variational layers
    circuit.append(cirq.ry(params[0])(qubits[0]))
    circuit.append(cirq.ry(params[1])(qubits[1]))
    circuit.append(cirq.CNOT(qubits[0], qubits[1]))
    circuit.append(cirq.ry(params[2])(qubits[0]))
    circuit.append(cirq.ry(params[3])(qubits[1]))
    
    return circuit

circuit = create_quantum_model()
print(circuit)

# 2. CONVERT TO TFQ LAYER
# Define observables to measure
readout_operators = [cirq.Z(qubits[0])]

# Create quantum layer
quantum_layer = tfq.layers.PQC(
    create_quantum_model(),
    readout_operators
)

# 3. HYBRID MODEL
model = tf.keras.Sequential([
    tf.keras.layers.Dense(4, activation='relu'),
    quantum_layer,
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# 4. COMPILE AND TRAIN (standard TensorFlow!)
model.compile(
    optimizer=tf.keras.optimizers.Adam(0.01),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# model.fit(X_train, y_train, epochs=10)
```

---

## Google Cirq

### Low-Level Control

```python
"""
Cirq - Google's quantum framework
More control, steeper learning curve
"""

import cirq
import numpy as np

# Create qubits
qubits = cirq.LineQubit.range(3)

# Build circuit
circuit = cirq.Circuit()

# Hadamard on all
circuit.append(cirq.H(q) for q in qubits)

# Parameterized rotations
theta = cirq.Symbol('theta')
circuit.append(cirq.ry(theta)(qubits[0]))

# CNOT chain
circuit.append(cirq.CNOT(qubits[i], qubits[i+1]) 
              for i in range(len(qubits)-1))

# Measure
circuit.append(cirq.measure(*qubits, key='result'))

print(circuit)

# Simulate
simulator = cirq.Simulator()

# Resolve parameters
resolver = cirq.ParamResolver({'theta': np.pi/4})

# Run
result = simulator.run(circuit, resolver, repetitions=1000)
print(result.histogram(key='result'))
```

---

## Microsoft Q#

### Quantum Development Kit

```csharp
// Q# quantum operation
namespace QuantumApp {
    open Microsoft.Quantum.Canon;
    open Microsoft.Quantum.Intrinsic;
    
    @EntryPoint()
    operation HelloQuantum() : Result {
        // Allocate qubit
        use qubit = Qubit();
        
        // Apply Hadamard
        H(qubit);
        
        // Measure
        let result = M(qubit);
        
        // Reset
        Reset(qubit);
        
        return result;
    }
}
```

**Python Integration:**
```python
import qsharp
from QuantumApp import HelloQuantum

# Call Q# from Python
result = HelloQuantum.simulate()
print(f"Result: {result}")
```

---

## Project Adaptation Guide

### How to Adapt Your Project PDF Concepts

Based on typical QML projects, here's how to apply concepts to different domains:

---

### 1. Classification Projects → Multiple Domains

**Original**: Iris flower classification

**Adaptations**:

```python
# Medical Diagnosis
X = patient_data  # [age, blood_pressure, cholesterol, ...]
y = disease_labels  # [healthy, disease_A, disease_B]

# Financial Fraud Detection  
X = transaction_features  # [amount, location, time, merchant_type]
y = fraud_labels  # [legitimate, fraud]

# Image Classification (small scale)
X = image_features  # HOG, SIFT, or small pixel patches
y = image_labels  # [cat, dog, bird]

# Text Sentiment
X = text_embeddings  # word2vec or BERT embeddings (reduced dim)
y = sentiment  # [positive, negative, neutral]

# Same quantum kernel/VQC approach!
def adapt_classification(X, y, encoding='angle'):
    if encoding == 'angle':
        feature_map = angle_encoding
    elif encoding == 'amplitude':
        feature_map = amplitude_encoding
    
    # Rest is identical!
    train_quantum_classifier(X, y, feature_map)
```

---

### 2. Optimization Projects → Real Applications

**Original**: Portfolio optimization with QAOA

**Adaptations**:

```python
# Supply Chain Optimization
def supply_chain_qaoa(warehouses, costs, constraints):
    """
    Minimize shipping costs while meeting demand
    """
    # Encode as QAOA problem
    # Each qubit = route selection
    pass

# Scheduling Problem
def employee_scheduling(employees, shifts, preferences):
    """
    Optimize work schedules
    """
    # Constraints: max hours, preferences, coverage
    pass

# Route Planning
def delivery_routing(locations, distances, vehicles):
    """
    Traveling salesman variant
    """
    # Minimize total distance
    pass

# Network Design
def network_topology(nodes, bandwidth, latency):
    """
    Optimal network connections
    """
    pass
```

---

### 3. Regression Projects → Predictions

**Original**: House price prediction

**Adaptations**:

```python
# Stock Price Forecasting
X = market_indicators  # [volume, momentum, volatility, ...]
y = next_day_price

# Weather Prediction
X = atmospheric_data  # [temperature, pressure, humidity, wind]
y = rainfall_amount

# Energy Consumption
X = usage_patterns  # [time, day, season, occupancy]
y = power_demand

# Quantum Regression Template
def quantum_regression(X, y, n_qubits=4):
    qc = create_vqc(n_qubits, n_layers=3)
    train_for_regression(qc, X, y, loss='mse')
    return qc
```

---

### 4. Feature Engineering → Different Data Types

```python
# Time Series Data
def encode_time_series(series, window_size=10):
    """Encode temporal data"""
    # Option 1: Sliding windows
    windows = create_windows(series, window_size)
    # Encode each window
    encoded = [angle_encoding(w) for w in windows]
    
    # Option 2: Frequency domain (QFT)
    fft_features = np.fft.fft(series)
    encoded = amplitude_encoding(fft_features)
    
    return encoded

# Graph Data
def encode_graph(adjacency_matrix):
    """Encode network/graph structure"""
    # Option 1: Graph Laplacian eigenvalues
    eigenvalues = graph_laplacian_spectrum(adjacency_matrix)
    
    # Option 2: Node embeddings
    embeddings = node2vec(adjacency_matrix)
    
    return angle_encoding(embeddings)

# Image Patches
def encode_image_patch(patch):
    """Encode small image regions"""
    # Flatten and normalize
    flattened = patch.flatten() / 255.0
    
    # Reduce dimensionality if needed
    from sklearn.decomposition import PCA
    pca = PCA(n_components=8)
    reduced = pca.fit_transform(flattened.reshape(1, -1))
    
    return amplitude_encoding(reduced[0])
```

---

### 5. Hybrid Architecture Patterns

```python
# Pattern 1: Classical Preprocessing + Quantum Core + Classical Postprocessing
class HybridModel1:
    def __init__(self):
        self.classical_encoder = NeuralNetwork(input_dim, output_dim=n_qubits)
        self.quantum_layer = VQC(n_qubits)
        self.classical_decoder = NeuralNetwork(n_qubits, output_dim)
    
    def forward(self, x):
        x = self.classical_encoder(x)  # Reduce dimensions
        x = self.quantum_layer(x)      # Quantum processing
        x = self.classical_decoder(x)  # Final prediction
        return x

# Pattern 2: Ensemble (Multiple Quantum Circuits)
class QuantumEnsemble:
    def __init__(self, n_circuits=5):
        self.circuits = [VQC(n_qubits) for _ in range(n_circuits)]
    
    def predict(self, x):
        predictions = [circuit(x) for circuit in self.circuits]
        return np.mean(predictions)  # Aggregate

# Pattern 3: Quantum Feature Extraction
class QuantumFeatureExtractor:
    def __init__(self):
        self.q_encoder = QuantumKernel()
        self.classical_model = RandomForest()
    
    def fit(self, X, y):
        # Extract quantum features
        Q_features = self.q_encoder.transform(X)
        # Train classical model on quantum features
        self.classical_model.fit(Q_features, y)
```

---

## Future Project Ideas

### Beginner Level

1. **Quantum Random Number Generator**
   - Use superposition for true randomness
   - Applications: Gaming, cryptography

2. **Quantum Coin Flip Game**
   - Interactive demonstration
   - Educational tool

3. **Bell State Analyzer**
   - Detect entanglement in states
   - Quantum communication basics

---

### Intermediate Level

4. **Quantum Sentiment Analysis**
   ```python
   # Analyze product reviews
   X = review_embeddings  # Word vectors
   y = sentiment_scores
   model = QuantumSVM(kernel='quantum')
   ```

5. **Stock Portfolio Optimizer**
   ```python
   # Asset allocation with QAOA
   returns = historical_returns
   covariance = risk_matrix
   optimal_portfolio = qaoa_optimize(returns, covariance)
   ```

6. **Image Classifier (Fashion MNIST)**
   ```python
   # Quantum CNN layers
   model = HybridCNN(
       classical_conv_layers=2,
       quantum_layers=1,
       classical_dense_layers=2
   )
   ```

7. **Fraud Detection System**
   ```python
   # Credit card transactions
   X = transaction_features
   y = fraud_labels
   detector = QuantumAnomalyDetector()
   ```

---

### Advanced Level

8. **Quantum Reinforcement Learning**
   ```python
   # Game playing with quantum Q-learning
   class QuantumQLearning:
       def __init__(self):
           self.q_circuit = VQC(n_qubits=8)
       
       def choose_action(self, state):
           q_values = self.q_circuit(state)
           return argmax(q_values)
   ```

9. **Drug Discovery Simulator**
   ```python
   # Molecular property prediction
   molecule_graphs = load_molecules()
   properties = quantum_molecular_simulator(molecule_graphs)
   ```

10. **Quantum GAN**
    ```python
    # Generate synthetic data
    class QuantumGAN:
        def __init__(self):
            self.generator = QuantumCircuit(latent_dim)
            self.discriminator = ClassicalNN()
    ```

11. **Climate Pattern Prediction**
    ```python
    # Time series forecasting
    climate_data = load_climate_history()
    future_patterns = quantum_time_series_forecast(climate_data)
    ```

12. **Protein Folding Prediction**
    ```python
    # Quantum simulation of proteins
    sequence = "ACDEFGHIKLMNPQRSTVWY"
    structure = quantum_protein_folder(sequence)
    ```

---

## Cross-Framework Code Translation

### Same Circuit, Different Framework

**Qiskit:**
```python
from qiskit import QuantumCircuit
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
```

**PennyLane:**
```python
import pennylane as qml
dev = qml.device('default.qubit', wires=2)

@qml.qnode(dev)
def circuit():
    qml.Hadamard(wires=0)
    qml.CNOT(wires=[0, 1])
    return qml.state()
```

**Cirq:**
```python
import cirq
qubits = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
    cirq.H(qubits[0]),
    cirq.CNOT(qubits[0], qubits[1])
)
```

**TorchQuantum:**
```python
import torchquantum as tq
import torchquantum.functional as tqf

qdev = tq.QuantumDevice(n_wires=2)
tqf.hadamard(qdev, wires=0)
tqf.cnot(qdev, wires=[0, 1])
```

---

## Migration Guide

### Moving from Qiskit to PennyLane

```python
# QISKIT VERSION
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter

theta = Parameter('θ')
qc = QuantumCircuit(1)
qc.ry(theta, 0)
qc_bound = qc.assign_parameters({theta: 0.5})

# PENNYLANE VERSION
import pennylane as qml

dev = qml.device('default.qubit', wires=1)

@qml.qnode(dev)
def circuit(theta):
    qml.RY(theta, wires=0)
    return qml.expval(qml.PauliZ(0))

result = circuit(0.5)
```

### Key Differences

| Aspect | Qiskit | PennyLane |
|--------|--------|-----------|
| **Circuit definition** | Object-oriented | Functional (decorator) |
| **Parameters** | Parameter objects | Function arguments |
| **Execution** | Job submission | Function call |
| **Gradients** | Manual/parameter shift | Automatic |
| **Backend** | IBM, Aer | Multiple (adaptable) |
| **ML integration** | Custom | Native PyTorch/TF |

---

## Best Practices for Production

### 1. Framework Selection

```python
def choose_framework(requirements):
    """
    Guide for production quantum ML
    """
    if requirements['hardware'] == 'IBM':
        return 'qiskit'
    
    if requirements['ml_framework'] == 'pytorch':
        return 'pennylane'  # or torchquantum
    
    if requirements['ml_framework'] == 'tensorflow':
        return 'tensorflow_quantum'
    
    if requirements['custom_gates']:
        return 'cirq'
    
    if requirements['enterprise'] == '.NET':
        return 'qsharp'
```

### 2. Performance Optimization

```python
# Use JAX for fastest autodiff
import pennylane as qml
import jax

dev = qml.device('default.qubit.jax', wires=4)

@qml.qnode(dev, interface='jax')
def fast_circuit(params):
    # JAX compilation makes this MUCH faster
    for i in range(4):
        qml.RY(params[i], wires=i)
    return qml.expval(qml.PauliZ(0))

# JIT compile
fast_circuit_jit = jax.jit(fast_circuit)
```

### 3. Error Handling

```python
def robust_quantum_pipeline(data):
    """Production-ready QML pipeline"""
    try:
        # Try quantum first
        result = quantum_model.predict(data)
    except QuantumCircuitError:
        # Fallback to classical
        logger.warning("Quantum circuit failed, using classical fallback")
        result = classical_model.predict(data)
    
    return result
```

---

## Key Takeaways 🎯

1. ✅ **PennyLane** = Best for PyTorch/TF integration and autodiff
2. ✅ **TensorFlow Quantum** = Best for TF pipelines
3. ✅ **Cirq** = Best for low-level control and Google hardware
4. ✅ **Q#** = Best for enterprise/.NET environments
5. ✅ **Qiskit** = Best for IBM hardware and research
6. ✅ Projects are **highly adaptable** across domains
7. ✅ Choose framework based on **ecosystem**, not features

---

## Resources by Framework

### PennyLane
- **Docs**: https://pennylane.ai
- **Tutorials**: https://pennylane.ai/qml
- **Papers**: Xanadu AI research

### TensorFlow Quantum
- **Docs**: https://www.tensorflow.org/quantum
- **Tutorials**: TFQ guides
- **Book**: "Programming Quantum Computers" O'Reilly

### Cirq
- **Docs**: https://quantumai.google/cirq
- **Examples**: Google Quantum AI
- **Hardware**: Google Quantum Engine

### Q#
- **Docs**: https://docs.microsoft.com/quantum
- **Samples**: Microsoft Quantum Development Kit
- **Azure**: Azure Quantum

---

**Now you have the complete toolkit! Choose the right framework for each project and build amazing quantum applications!** 🚀

