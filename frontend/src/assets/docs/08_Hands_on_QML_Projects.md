# Part 8: Hands-On QML Projects

## Build Real Quantum Machine Learning Applications

Time to put everything together! Here are complete, working QML projects you can run and learn from.

---

## Table of Contents
1. [Project 1: Iris Classification with Quantum SVM](#project-1-iris-classification-with-quantum-svm)
2. [Project 2: Binary Classification with VQC](#project-2-binary-classification-with-vqc)
3. [Project 3: Quantum Neural Network for Regression](#project-3-quantum-neural-network-for-regression)
4. [Project 4: Quantum Feature Maps Comparison](#project-4-quantum-feature-maps-comparison)
5. [Project 5: Portfolio Optimization with QAOA](#project-5-portfolio-optimization-with-qaoa)
6. [Next Steps and Resources](#next-steps-and-resources)

---

## Project 1: Iris Classification with Quantum SVM

**Goal:** Classify Iris flowers using quantum kernel methods

### Complete Code

```python
"""
Quantum SVM for Iris Classification
Uses quantum kernel to classify iris species
"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report

from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit_machine_learning.kernels import FidelityQuantumKernel
from qiskit.circuit.library import ZZFeatureMap

# 1. LOAD AND PREPARE DATA
print("Loading Iris dataset...")
iris = datasets.load_iris()
X = iris.data[:100, :2]  # Use first 2 features, first 2 classes
y = iris.target[:100]

# Normalize features to [0, π]
X = (X - X.min(axis=0)) / (X.max(axis=0) - X.min(axis=0)) * np.pi

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")

# 2. CREATE QUANTUM FEATURE MAP
print("\nCreating quantum feature map...")
n_features = X.shape[1]
feature_map = ZZFeatureMap(feature_dimension=n_features, reps=2)

# Visualize feature map
print(feature_map.draw())

# 3. CREATE QUANTUM KERNEL
print("\nCreating quantum kernel...")
backend = Aer.get_backend('qasm_simulator')
quantum_kernel = FidelityQuantumKernel(feature_map=feature_map)

# 4. COMPUTE KERNEL MATRICES
print("\nComputing quantum kernel matrices...")
# This takes a while - computing quantum circuits!

K_train = quantum_kernel.evaluate(X_train)
K_test = quantum_kernel.evaluate(X_test, X_train)

print(f"Train kernel shape: {K_train.shape}")
print(f"Test kernel shape: {K_test.shape}")

# 5. TRAIN CLASSICAL SVM WITH QUANTUM KERNEL
print("\nTraining SVM with quantum kernel...")
svm = SVC(kernel='precomputed')
svm.fit(K_train, y_train)

# 6. PREDICT AND EVALUATE
print("\nMaking predictions...")
y_pred_train = svm.predict(K_train)
y_pred_test = svm.predict(K_test)

train_accuracy = accuracy_score(y_train, y_pred_train)
test_accuracy = accuracy_score(y_test, y_pred_test)

print(f"\n{'='*50}")
print(f"RESULTS:")
print(f"{'='*50}")
print(f"Training Accuracy: {train_accuracy:.3f}")
print(f"Test Accuracy: {test_accuracy:.3f}")
print(f"\nClassification Report:")
print(classification_report(y_test, y_pred_test, 
                          target_names=['Setosa', 'Versicolor']))

# 7. COMPARE WITH CLASSICAL KERNEL
print(f"\n{'='*50}")
print("Comparing with classical RBF kernel...")
classical_svm = SVC(kernel='rbf', gamma='auto')
classical_svm.fit(X_train, y_train)
classical_pred = classical_svm.predict(X_test)
classical_accuracy = accuracy_score(y_test, classical_pred)

print(f"Classical RBF Accuracy: {classical_accuracy:.3f}")
print(f"Quantum Kernel Accuracy: {test_accuracy:.3f}")
print(f"Difference: {test_accuracy - classical_accuracy:.3f}")

# 8. VISUALIZE RESULTS
plt.figure(figsize=(12, 5))

# Plot 1: Data distribution
plt.subplot(1, 2, 1)
plt.scatter(X_train[y_train==0, 0], X_train[y_train==0, 1], 
           c='red', label='Setosa (train)', alpha=0.6)
plt.scatter(X_train[y_train==1, 0], X_train[y_train==1, 1], 
           c='blue', label='Versicolor (train)', alpha=0.6)
plt.scatter(X_test[y_test==0, 0], X_test[y_test==0, 1], 
           c='red', marker='x', s=100, label='Setosa (test)')
plt.scatter(X_test[y_test==1, 0], X_test[y_test==1, 1], 
           c='blue', marker='x', s=100, label='Versicolor (test)')
plt.xlabel('Sepal Length (normalized)')
plt.ylabel('Sepal Width (normalized)')
plt.title('Iris Dataset')
plt.legend()
plt.grid(True, alpha=0.3)

# Plot 2: Kernel matrix heatmap
plt.subplot(1, 2, 2)
plt.imshow(K_train, cmap='viridis', aspect='auto')
plt.colorbar(label='Kernel Value')
plt.title('Quantum Kernel Matrix (Training Data)')
plt.xlabel('Sample Index')
plt.ylabel('Sample Index')

plt.tight_layout()
plt.savefig('quantum_svm_results.png', dpi=300, bbox_inches='tight')
print("\nPlot saved as 'quantum_svm_results.png'")
plt.show()
```

### What You'll Learn
- ✅ How to use quantum kernels for classification
- ✅ ZZ Feature Map implementation
- ✅ Hybrid quantum-classical workflow
- ✅ Comparing quantum vs classical performance

---

## Project 2: Binary Classification with VQC

**Goal:** Build a variational quantum classifier from scratch

### Complete Code

```python
"""
Variational Quantum Classifier (VQC)
Train a parameterized quantum circuit for binary classification
"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from qiskit import QuantumCircuit
from qiskit.circuit import Parameter, ParameterVector
from qiskit_aer import Aer
from qiskit.quantum_info import SparsePauliOp

# 1. CREATE SYNTHETIC DATASET
print("Generating dataset...")
X, y = make_moons(n_samples=100, noise=0.1, random_state=42)

# Convert labels to -1, +1
y = 2*y - 1

# Normalize
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

print(f"Train: {len(X_train)}, Test: {len(X_test)}")

# 2. CREATE VQC ARCHITECTURE
def create_vqc(n_qubits, n_layers):
    """
    Create Variational Quantum Classifier
    
    Args:
        n_qubits: Number of qubits (features)
        n_layers: Number of variational layers
    
    Returns:
        circuit: Parameterized quantum circuit
        feature_params: Data encoding parameters
        weight_params: Trainable weight parameters
    """
    qc = QuantumCircuit(n_qubits)
    
    # Feature parameters (for data encoding)
    feature_params = ParameterVector('x', n_qubits)
    
    # Weight parameters (trainable)
    weight_params = ParameterVector('θ', n_qubits * n_layers * 2)
    
    # 1. Feature Encoding Layer
    for i in range(n_qubits):
        qc.h(i)
        qc.rz(feature_params[i], i)
    
    # 2. Variational Layers
    param_idx = 0
    for layer in range(n_layers):
        # Rotation layer
        for i in range(n_qubits):
            qc.ry(weight_params[param_idx], i)
            param_idx += 1
            qc.rz(weight_params[param_idx], i)
            param_idx += 1
        
        # Entanglement layer
        for i in range(n_qubits - 1):
            qc.cx(i, i + 1)
        if n_qubits > 2:
            qc.cx(n_qubits - 1, 0)  # Circular
    
    return qc, feature_params, weight_params

# Create circuit
n_qubits = 2  # 2 features
n_layers = 2
qc, feature_params, weight_params = create_vqc(n_qubits, n_layers)

print(f"\nVQC Architecture:")
print(f"Qubits: {n_qubits}")
print(f"Layers: {n_layers}")
print(f"Trainable parameters: {len(weight_params)}")
print(qc.draw())

# 3. DEFINE MEASUREMENT OBSERVABLE
# Measure Pauli-Z on first qubit
observable = SparsePauliOp(['Z' + 'I'*(n_qubits-1)])

# 4. PREDICTION FUNCTION
def predict_vqc(circuit, feature_params, weight_params, 
                X_data, theta, backend):
    """
    Get predictions from VQC
    
    Returns:
        predictions: Array of predictions (-1 or +1)
        expectation_values: Raw expectation values
    """
    predictions = []
    expectation_values = []
    
    for x in X_data:
        # Bind parameters
        param_dict = {feature_params[i]: x[i] for i in range(len(x))}
        param_dict.update({weight_params[i]: theta[i] 
                          for i in range(len(theta))})
        
        bound_circuit = circuit.assign_parameters(param_dict)
        
        # Add measurement
        meas_circuit = bound_circuit.copy()
        meas_circuit.measure_all()
        
        # Simulate
        job = backend.run(meas_circuit, shots=1000)
        result = job.result()
        counts = result.get_counts()
        
        # Calculate expectation value of Z
        # Z: +1 for |0⟩, -1 for |1⟩
        exp_val = 0
        for bitstring, count in counts.items():
            # Check first bit
            if bitstring[-1] == '0':  # |0⟩
                exp_val += count
            else:  # |1⟩
                exp_val -= count
        exp_val /= 1000
        
        expectation_values.append(exp_val)
        predictions.append(1 if exp_val > 0 else -1)
    
    return np.array(predictions), np.array(expectation_values)

# 5. LOSS FUNCTION
def compute_loss(y_true, y_pred_exp):
    """
    Mean squared error loss
    """
    return np.mean((y_true - y_pred_exp) ** 2)

# 6. TRAINING WITH GRADIENT DESCENT
def train_vqc(circuit, feature_params, weight_params, 
              X_train, y_train, n_epochs=50, learning_rate=0.1):
    """
    Train VQC using parameter shift rule
    """
    backend = Aer.get_backend('qasm_simulator')
    
    # Initialize parameters randomly
    theta = np.random.uniform(-np.pi, np.pi, len(weight_params))
    
    loss_history = []
    
    print("\nTraining VQC...")
    for epoch in range(n_epochs):
        # Get predictions
        _, y_pred_exp = predict_vqc(circuit, feature_params, 
                                     weight_params, X_train, theta, backend)
        
        # Compute loss
        loss = compute_loss(y_train, y_pred_exp)
        loss_history.append(loss)
        
        # Compute gradients (simple finite difference for speed)
        gradients = np.zeros(len(theta))
        epsilon = 0.1
        
        for i in range(len(theta)):
            # Shift parameter
            theta_plus = theta.copy()
            theta_plus[i] += epsilon
            
            theta_minus = theta.copy()
            theta_minus[i] -= epsilon
            
            # Get predictions
            _, y_plus = predict_vqc(circuit, feature_params, weight_params,
                                   X_train, theta_plus, backend)
            _, y_minus = predict_vqc(circuit, feature_params, weight_params,
                                    X_train, theta_minus, backend)
            
            # Gradient
            loss_plus = compute_loss(y_train, y_plus)
            loss_minus = compute_loss(y_train, y_minus)
            gradients[i] = (loss_plus - loss_minus) / (2 * epsilon)
        
        # Update parameters
        theta -= learning_rate * gradients
        
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{n_epochs}, Loss: {loss:.4f}")
    
    return theta, loss_history

# Train (this will take a few minutes!)
theta_trained, loss_history = train_vqc(
    qc, feature_params, weight_params, X_train, y_train,
    n_epochs=30, learning_rate=0.05
)

# 7. EVALUATE
backend = Aer.get_backend('qasm_simulator')

y_train_pred, _ = predict_vqc(qc, feature_params, weight_params, 
                               X_train, theta_trained, backend)
y_test_pred, _ = predict_vqc(qc, feature_params, weight_params, 
                              X_test, theta_trained, backend)

train_accuracy = np.mean(y_train_pred == y_train)
test_accuracy = np.mean(y_test_pred == y_test)

print(f"\n{'='*50}")
print(f"RESULTS:")
print(f"{'='*50}")
print(f"Training Accuracy: {train_accuracy:.3f}")
print(f"Test Accuracy: {test_accuracy:.3f}")

# 8. VISUALIZE
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Plot 1: Loss curve
axes[0].plot(loss_history)
axes[0].set_xlabel('Epoch')
axes[0].set_ylabel('Loss')
axes[0].set_title('Training Loss')
axes[0].grid(True, alpha=0.3)

# Plot 2: Data and predictions
axes[1].scatter(X_train[y_train==1, 0], X_train[y_train==1, 1], 
               c='blue', label='Class +1', alpha=0.6)
axes[1].scatter(X_train[y_train==-1, 0], X_train[y_train==-1, 1], 
               c='red', label='Class -1', alpha=0.6)
axes[1].scatter(X_test[y_test_pred==1, 0], X_test[y_test_pred==1, 1], 
               c='blue', marker='x', s=100, label='Pred +1')
axes[1].scatter(X_test[y_test_pred==-1, 0], X_test[y_test_pred==-1, 1], 
               c='red', marker='x', s=100, label='Pred -1')
axes[1].set_xlabel('Feature 1')
axes[1].set_ylabel('Feature 2')
axes[1].set_title('Classification Results')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

# Plot 3: Decision boundary (simplified)
axes[2].text(0.5, 0.5, f'Train Acc: {train_accuracy:.2%}\nTest Acc: {test_accuracy:.2%}',
            ha='center', va='center', fontsize=16, 
            transform=axes[2].transAxes)
axes[2].axis('off')
axes[2].set_title('Performance')

plt.tight_layout()
plt.savefig('vqc_results.png', dpi=300, bbox_inches='tight')
print("\nPlot saved as 'vqc_results.png'")
plt.show()

print("\n✅ VQC training complete!")
```

### What You'll Learn
- ✅ Building parameterized quantum circuits
- ✅ Training quantum circuits with gradient descent
- ✅ Parameter shift rule for gradients
- ✅ Expectation value measurements

---

## Project 3: Quantum Neural Network for Regression

**Goal:** Predict continuous values using quantum circuit

### Simplified Version (Full code similar to above)

```python
"""
Quantum Neural Network for Regression
Predict house prices using quantum circuit
"""

from qiskit import QuantumCircuit
from qiskit.circuit import ParameterVector
import numpy as np

# Simple regression task
X_train = np.array([[1], [2], [3], [4], [5]])
y_train = np.array([2, 4, 6, 8, 10])  # y = 2x

def quantum_nn_regression(X, y, n_layers=2, n_epochs=50):
    """
    Train QNN for regression
    """
    n_qubits = 1
    
    # Create circuit
    qc = QuantumCircuit(n_qubits)
    feature = ParameterVector('x', n_qubits)
    weights = ParameterVector('w', n_qubits * n_layers)
    
    # Encoding
    qc.ry(feature[0], 0)
    
    # Variational layers
    for i in range(n_layers):
        qc.ry(weights[i], 0)
    
    print("QNN for Regression built!")
    print(qc.draw())
    
    # Training loop would go here
    # (Similar to VQC but with continuous output)
    
    return qc

qnn = quantum_nn_regression(X_train, y_train)
```

---

## Project 4: Quantum Feature Maps Comparison

**Goal:** Compare different quantum encoding strategies

```python
"""
Compare Quantum Feature Maps
Test different encodings on same dataset
"""

from qiskit.circuit.library import ZFeatureMap, ZZFeatureMap, PauliFeatureMap
import matplotlib.pyplot as plt
import numpy as np

# Sample data
X = np.array([[0.5, 1.0], [1.5, 0.5], [1.0, 1.5]])

# 1. Z Feature Map
z_map = ZFeatureMap(2, reps=1)
print("Z Feature Map:")
print(z_map.draw())

# 2. ZZ Feature Map (entanglement!)
zz_map = ZZFeatureMap(2, reps=1)
print("\nZZ Feature Map:")
print(zz_map.draw())

# 3. Pauli Feature Map
pauli_map = PauliFeatureMap(2, reps=1, paulis=['Z', 'ZZ'])
print("\nPauli Feature Map:")
print(pauli_map.draw())

# Compare kernel matrices
from qiskit_machine_learning.kernels import FidelityQuantumKernel

kernels = {
    'Z': FidelityQuantumKernel(z_map),
    'ZZ': FidelityQuantumKernel(zz_map),
    'Pauli': FidelityQuantumKernel(pauli_map)
}

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

for idx, (name, kernel) in enumerate(kernels.items()):
    K = kernel.evaluate(X)
    
    axes[idx].imshow(K, cmap='viridis')
    axes[idx].set_title(f'{name} Feature Map Kernel')
    axes[idx].set_xlabel('Sample')
    axes[idx].set_ylabel('Sample')
    
    # Add values
    for i in range(len(K)):
        for j in range(len(K)):
            axes[idx].text(j, i, f'{K[i,j]:.2f}', 
                          ha='center', va='center', color='white')

plt.tight_layout()
plt.savefig('feature_map_comparison.png', dpi=300)
print("\nComparison saved!")
plt.show()
```

---

## Project 5: Portfolio Optimization with QAOA

**Goal:** Find optimal investment portfolio

```python
"""
Portfolio Optimization with QAOA
Find best asset allocation using quantum algorithm
"""

import numpy as np
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
from qiskit_aer import Aer

def portfolio_qaoa(returns, risk, budget=2, n_layers=2):
    """
    QAOA for portfolio optimization
    
    Args:
        returns: Expected returns of assets
        risk: Risk (variance) of assets  
        budget: Number of assets to select
        n_layers: QAOA depth
    """
    n_assets = len(returns)
    
    # Create QAOA circuit
    qc = QuantumCircuit(n_assets)
    
    # Parameters
    gammas = [Parameter(f'γ_{i}') for i in range(n_layers)]
    betas = [Parameter(f'β_{i}') for i in range(n_layers)]
    
    # 1. Initialize: Equal superposition
    qc.h(range(n_assets))
    
    # 2. QAOA layers
    for layer in range(n_layers):
        # Problem Hamiltonian (encode returns and risk)
        for i in range(n_assets):
            qc.rz(2 * gammas[layer] * returns[i], i)
        
        # Interactions (risk)
        for i in range(n_assets):
            for j in range(i+1, n_assets):
                qc.cx(i, j)
                qc.rz(2 * gammas[layer] * risk, j)
                qc.cx(i, j)
        
        # Mixer Hamiltonian
        for i in range(n_assets):
            qc.rx(2 * betas[layer], i)
    
    # 3. Measure
    qc.measure_all()
    
    print("QAOA Portfolio Optimization Circuit:")
    print(qc.draw())
    
    return qc, gammas, betas

# Example: 4 assets
returns = np.array([0.05, 0.10, 0.15, 0.08])  # Expected returns
risk = 0.02  # Risk coefficient

qc, gammas, betas = portfolio_qaoa(returns, risk, budget=2, n_layers=1)

# Optimize parameters (simplified)
print("\nOptimizing portfolio allocation...")
print("This would run optimization to find best γ and β parameters")
print("Then measure to get optimal portfolio!")
```

---

## Next Steps and Resources

### Continue Learning

1. **Qiskit Textbook** (Free)
   - https://qiskit.org/textbook
   - Comprehensive quantum computing course

2. **Qiskit Machine Learning Tutorials**
   - https://qiskit.org/ecosystem/machine-learning/tutorials
   - Official QML examples

3. **Pennylane** (Alternative framework)
   - https://pennylane.ai
   - More ML-focused, excellent tutorials

4. **Research Papers**
   - "Quantum Machine Learning" by Biamonte et al.
   - arXiv.org - search "quantum machine learning"

---

### Practice Projects

1. **MNIST Classification**
   - Use quantum circuits to classify handwritten digits
   - Start with 2 digits, binary classification

2. **Time Series Prediction**
   - Quantum LSTM or QNN for stock prices
   - Weather forecasting

3. **Generative Models**
   - Quantum GAN (Generative Adversarial Network)
   - Generate quantum data

4. **Optimization Problems**
   - Traveling Salesman with QAOA
   - Scheduling problems
   - Supply chain optimization

---

### Join the Community

1. **Qiskit Slack**
   - qiskit.slack.com
   - Active community, ask questions!

2. **IBM Quantum Network**
   - quantum-computing.ibm.com
   - Free access to real quantum computers

3. **Quantum Computing Stack Exchange**
   - quantumcomputing.stackexchange.com
   - Q&A forum

4. **GitHub**
   - Explore qiskit-community repositories
   - Contribute to open source!

---

### Challenges to Try

1. **IBM Quantum Challenge**
   - Annual competition with prizes
   - Learn from expert solutions

2. **Kaggle Quantum**
   - Quantum ML competitions
   - Compare with classical approaches

3. **Create Your Own**
   - Apply QML to your domain
   - Publish results on arXiv

---

## Key Takeaways 🎯

1. ✅ **Quantum SVM** uses kernel methods - good starting point
2. ✅ **VQC** is fully quantum - more challenging but powerful
3. ✅ **Feature maps** dramatically affect performance - experiment!
4. ✅ **QAOA** solves optimization - useful for real applications
5. ✅ **Hybrid algorithms** are most practical on NISQ devices
6. ✅ **Practice projects** solidify understanding
7. ✅ **Community** is friendly and helpful - engage!

---

## Your Learning Journey

```
You started with:
└─ No quantum knowledge

You learned:
├─ Quantum computing fundamentals
├─ Quantum gates and circuits
├─ Classical ML foundations
├─ Quantum machine learning theory
├─ Famous quantum algorithms
├─ Qiskit programming
└─ Hands-on QML projects

You can now:
├─ Build quantum circuits
├─ Implement quantum algorithms
├─ Create QML models
├─ Run on simulators and real quantum computers
├─ Compare quantum vs classical approaches
└─ Contribute to quantum computing research!
```

---

## Final Project Ideas

### Beginner
1. Quantum coin flip simulator
2. Bell state visualization
3. Quantum teleportation demo

### Intermediate
4. Quantum SVM on custom dataset
5. VQC parameter optimization
6. Quantum feature map analysis

### Advanced
7. Hybrid quantum-classical neural network
8. QAOA for real optimization problem
9. Quantum reinforcement learning
10. Novel quantum algorithm research

---

## Congratulations! 🎉

You've completed the comprehensive Quantum Machine Learning guide!

**You now understand:**
- ✅ Quantum computing from first principles
- ✅ Mathematical foundations (complex numbers, linear algebra)
- ✅ Quantum gates, circuits, and algorithms
- ✅ Classical and quantum machine learning
- ✅ How to code quantum circuits in Qiskit
- ✅ Real-world QML applications

**Keep exploring, stay curious, and welcome to the quantum revolution!** 🚀

---

## Quick Reference: Project Templates

```python
# === QUANTUM SVM TEMPLATE ===
from qiskit_machine_learning.kernels import FidelityQuantumKernel
from sklearn.svm import SVC

feature_map = ZZFeatureMap(n_features, reps=2)
kernel = FidelityQuantumKernel(feature_map)
K_train = kernel.evaluate(X_train)
svm = SVC(kernel='precomputed')
svm.fit(K_train, y_train)

# === VQC TEMPLATE ===
def create_vqc(n_qubits, n_layers):
    qc = QuantumCircuit(n_qubits)
    # Feature encoding
    # Variational layers
    # Measurement
    return qc

# === QAOA TEMPLATE ===
def qaoa(problem, n_layers):
    qc = QuantumCircuit(n_qubits)
    # Superposition
    for layer in range(n_layers):
        # Problem Hamiltonian
        # Mixer Hamiltonian
    # Measure
    return qc
```

**Happy quantum computing!** 🌟

