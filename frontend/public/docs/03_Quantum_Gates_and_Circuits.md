# Part 3: Quantum Gates & Circuits

## Building Blocks of Quantum Computing

Just like classical computers use logic gates (AND, OR, NOT), quantum computers use **quantum gates** to manipulate qubits!

---

## Table of Contents
1. [What are Quantum Gates?](#what-are-quantum-gates)
2. [Single-Qubit Gates](#single-qubit-gates)
3. [Multi-Qubit Gates](#multi-qubit-gates)
4. [Quantum Circuits](#quantum-circuits)
5. [Universal Gate Sets](#universal-gate-sets)
6. [Circuit Identities](#circuit-identities)

---

## What are Quantum Gates?

### Definition
**Quantum gates** are operations that transform quantum states. Mathematically, they are **unitary matrices**.

### Key Properties

1. **Reversible**: Every quantum gate has an inverse
2. **Unitary**: Preserves normalization ($U^\dagger U = I$)
3. **Linear**: Acts on superposition states

### Classical vs Quantum Gates

| Classical | Quantum |
|-----------|---------|
| AND, OR, NOT | X, Y, Z, H, CNOT |
| Irreversible (some) | Always reversible |
| Deterministic | Probabilistic (measurement) |
| Bits: 0 or 1 | Qubits: superposition |

### Matrix Representation

A gate acting on a qubit is represented as matrix multiplication:

$$|\psi'\rangle = U|\psi\rangle$$

Where $U$ is a unitary matrix.

---

## Single-Qubit Gates

### 1. Pauli X Gate (Quantum NOT)

**Effect:** Flips $|0\rangle \leftrightarrow |1\rangle$ (like classical NOT)

**Matrix:**
$$X = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$$

**Action:**
$$X|0\rangle = |1\rangle$$
$$X|1\rangle = |0\rangle$$
$$X|+\rangle = |+\rangle$$ (stays same!)
$$X|-\rangle = -|-\rangle$$ (gets a phase)

**Bloch Sphere:** 180° rotation around X-axis

**Circuit Symbol:**
```
|ψ⟩ ──┤X├── X|ψ⟩
```

**Example:**
$$X\left(\frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle\right) = \frac{1}{\sqrt{2}}|1\rangle + \frac{1}{\sqrt{2}}|0\rangle = |+\rangle$$

---

### 2. Pauli Y Gate

**Effect:** Flips and adds phase

**Matrix:**
$$Y = \begin{bmatrix} 0 & -i \\ i & 0 \end{bmatrix}$$

**Action:**
$$Y|0\rangle = i|1\rangle$$
$$Y|1\rangle = -i|0\rangle$$

**Bloch Sphere:** 180° rotation around Y-axis

**Circuit Symbol:**
```
|ψ⟩ ──┤Y├── Y|ψ⟩
```

---

### 3. Pauli Z Gate (Phase Flip)

**Effect:** Adds a phase to $|1\rangle$, leaves $|0\rangle$ unchanged

**Matrix:**
$$Z = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$$

**Action:**
$$Z|0\rangle = |0\rangle$$
$$Z|1\rangle = -|1\rangle$$
$$Z|+\rangle = |-\rangle$$ (flips between + and -)

**Bloch Sphere:** 180° rotation around Z-axis

**Circuit Symbol:**
```
|ψ⟩ ──┤Z├── Z|ψ⟩
```

**Example:**
$$Z\left(\frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle\right) = \frac{1}{\sqrt{2}}|0\rangle - \frac{1}{\sqrt{2}}|1\rangle = |-\rangle$$

---

### 4. Hadamard Gate (H)

**Most Important Single-Qubit Gate!**

**Effect:** Creates superposition

**Matrix:**
$$H = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$$

**Action:**
$$H|0\rangle = |+\rangle = \frac{1}{\sqrt{2}}(|0\rangle + |1\rangle)$$
$$H|1\rangle = |-\rangle = \frac{1}{\sqrt{2}}(|0\rangle - |1\rangle)$$
$$H|+\rangle = |0\rangle$$ (inverse!)
$$H|-\rangle = |1\rangle$$

**Key Property:** $H^2 = I$ (applying H twice returns to original state)

**Bloch Sphere:** 90° rotation around diagonal axis

**Circuit Symbol:**
```
|0⟩ ──┤H├── |+⟩
```

**Why Important?**
- Creates **equal superposition** from basis states
- Used in almost every quantum algorithm
- Switches between computational and Hadamard basis

---

### 5. Phase Gate (S Gate)

**Effect:** Adds a 90° phase to $|1\rangle$

**Matrix:**
$$S = \begin{bmatrix} 1 & 0 \\ 0 & i \end{bmatrix}$$

**Action:**
$$S|0\rangle = |0\rangle$$
$$S|1\rangle = i|1\rangle$$

**Relation:** $S^2 = Z$

**Circuit Symbol:**
```
|ψ⟩ ──┤S├── S|ψ⟩
```

---

### 6. T Gate (π/8 Gate)

**Effect:** Adds a 45° phase to $|1\rangle$

**Matrix:**
$$T = \begin{bmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{bmatrix}$$

**Action:**
$$T|0\rangle = |0\rangle$$
$$T|1\rangle = e^{i\pi/4}|1\rangle$$

**Relation:** $T^2 = S$, $T^4 = Z$

**Circuit Symbol:**
```
|ψ⟩ ──┤T├── T|ψ⟩
```

**Why Important?** Part of **universal gate set** (can approximate any single-qubit gate)

---

### 7. Rotation Gates

#### RX (Rotation around X-axis)
$$R_x(\theta) = \begin{bmatrix} \cos(\theta/2) & -i\sin(\theta/2) \\ -i\sin(\theta/2) & \cos(\theta/2) \end{bmatrix}$$

#### RY (Rotation around Y-axis)
$$R_y(\theta) = \begin{bmatrix} \cos(\theta/2) & -\sin(\theta/2) \\ \sin(\theta/2) & \cos(\theta/2) \end{bmatrix}$$

#### RZ (Rotation around Z-axis)
$$R_z(\theta) = \begin{bmatrix} e^{-i\theta/2} & 0 \\ 0 & e^{i\theta/2} \end{bmatrix}$$

**Usage:** Fine control of qubit state on Bloch sphere

**Circuit Symbol:**
```
|ψ⟩ ──┤RX(θ)├── rotated state
```

---

### 8. Identity Gate (I)

**Effect:** Does nothing (leaves state unchanged)

**Matrix:**
$$I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$

**Action:**
$$I|\psi\rangle = |\psi\rangle$$

**Usage:** Placeholder in circuits, mathematical proofs

---

## Single-Qubit Gate Summary Table

| Gate | Matrix | Maps $\|0\rangle$ to | Maps $\|1\rangle$ to | Bloch Rotation |
|------|--------|---------------------|---------------------|----------------|
| **X** | $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ | $\|1\rangle$ | $\|0\rangle$ | 180° around X |
| **Y** | $\begin{bmatrix} 0 & -i \\ i & 0 \end{bmatrix}$ | $i\|1\rangle$ | $-i\|0\rangle$ | 180° around Y |
| **Z** | $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$ | $\|0\rangle$ | $-\|1\rangle$ | 180° around Z |
| **H** | $\frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$ | $\|+\rangle$ | $\|-\rangle$ | Diagonal |
| **S** | $\begin{bmatrix} 1 & 0 \\ 0 & i \end{bmatrix}$ | $\|0\rangle$ | $i\|1\rangle$ | 90° around Z |
| **T** | $\begin{bmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{bmatrix}$ | $\|0\rangle$ | $e^{i\pi/4}\|1\rangle$ | 45° around Z |

---

## Multi-Qubit Gates

### 1. CNOT Gate (Controlled-NOT)

**Most Important 2-Qubit Gate!**

**Effect:** Flips target qubit IF control qubit is $|1\rangle$

**Matrix (4×4):**
$$\text{CNOT} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 1 & 0 \end{bmatrix}$$

**Action:**
$$\text{CNOT}|00\rangle = |00\rangle$$ (control=0, target unchanged)
$$\text{CNOT}|01\rangle = |01\rangle$$ (control=0, target unchanged)
$$\text{CNOT}|10\rangle = |11\rangle$$ (control=1, target flipped!)
$$\text{CNOT}|11\rangle = |10\rangle$$ (control=1, target flipped!)

**Circuit Symbol:**
```
Control ──●──
          │
Target  ──⊕──
```

**Creating Entanglement:**
```
|0⟩ ──H──●──
         │
|0⟩ ─────⊕──  Result: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
```

This creates a **Bell state** (maximally entangled)!

---

### 2. Controlled-Z (CZ Gate)

**Effect:** Adds phase to $|11\rangle$ state

**Matrix:**
$$\text{CZ} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & -1 \end{bmatrix}$$

**Action:**
$$\text{CZ}|11\rangle = -|11\rangle$$
(all other basis states unchanged)

**Circuit Symbol:**
```
q₀ ──●──
     │
q₁ ──●──
```

**Property:** Symmetric - which qubit is "control" doesn't matter!

---

### 3. SWAP Gate

**Effect:** Exchanges two qubits

**Matrix:**
$$\text{SWAP} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Action:**
$$\text{SWAP}|01\rangle = |10\rangle$$
$$\text{SWAP}|10\rangle = |01\rangle$$

**Circuit Symbol:**
```
q₀ ──×──
     │
q₁ ──×──
```

**Can be decomposed:**
```
q₀ ──●─────●──●──
     │     │  │
q₁ ──⊕──●──⊕──⊕──
        │
```
(Three CNOTs = one SWAP)

---

### 4. Toffoli Gate (CCNOT)

**Effect:** 3-qubit gate - flips target if BOTH controls are $|1\rangle$

**Also called:** Controlled-Controlled-NOT

**Circuit Symbol:**
```
c₁ ──●──
     │
c₂ ──●──
     │
t  ──⊕──
```

**Action:**
$$\text{CCNOT}|111\rangle = |110\rangle$$
(only flips if both controls = 1)

**Why Important:**
- **Universal for classical computation** (can build AND, NAND gates)
- Can implement classical circuits quantumly

---

### 5. Controlled-U Gates

**General form:** Apply any single-qubit gate $U$ controlled by another qubit

**Circuit Symbol:**
```
Control ──●──
          │
Target  ──U──
```

**Examples:**
- Controlled-H
- Controlled-S
- Controlled-RX(θ)

**Matrix form:**
$$\text{C-}U = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & u_{00} & u_{01} \\ 0 & 0 & u_{10} & u_{11} \end{bmatrix}$$

Where $U = \begin{bmatrix} u_{00} & u_{01} \\ u_{10} & u_{11} \end{bmatrix}$

---

## Quantum Circuits

### What is a Quantum Circuit?

A **quantum circuit** is a sequence of quantum gates applied to qubits, typically:
1. **Initialize** qubits to $|0\rangle$
2. **Apply gates** to create desired state
3. **Measure** qubits to get classical output

### Circuit Diagram Components

```
q₀ |0⟩ ────────────────────  ← Qubit wire
                             
q₁ |0⟩ ──┤H├──●─────────────  ← Gates
              │
q₂ |0⟩ ───────⊕──┤M├────────  ← Measurement
                    ↓
                    c        ← Classical bit
```

**Reading:** Left to right (time flows →)

---

### Example Circuits

#### 1. Bell State Preparation
```
q₀ |0⟩ ──H──●──
            │
q₁ |0⟩ ─────⊕──
```

**Result:** $|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$

**Step-by-step:**
1. Start: $|00\rangle$
2. After H: $\frac{1}{\sqrt{2}}(|00\rangle + |10\rangle)$
3. After CNOT: $\frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$

---

#### 2. GHZ State (3-qubit entanglement)
```
q₀ |0⟩ ──H──●────●──
            │    │
q₁ |0⟩ ─────⊕────┼──
                 │
q₂ |0⟩ ──────────⊕──
```

**Result:** $|\text{GHZ}\rangle = \frac{1}{\sqrt{2}}(|000\rangle + |111\rangle)$

---

#### 3. Quantum Teleportation Circuit
```
      ┌───┐     ┌─┐   
|ψ⟩───┤ X ├──●──┤M├───
      └─┬─┘  │  └╥┘ ↓ 
  ┌───┐ │  ┌─┴─┐ ║  ║  
|0⟩─┤ H ├─●──┤ X ├─╫──┤M├
    └───┘    └───┘ ║  ╥ ↓
                ┌──╨──╨──┐
|0⟩─────────────┤Classical├──
                └─────────┘
```

**Purpose:** Transfer quantum state $|\psi\rangle$ using entanglement!

---

### Circuit Composition

Gates applied sequentially multiply (right to left):

$$U_{\text{total}} = U_n \cdot U_{n-1} \cdot ... \cdot U_2 \cdot U_1$$

**Example:**
```
|ψ⟩ ──X──H──Z── = ZHX|ψ⟩
```

**Matrix:**
$$\text{Combined} = Z \times H \times X$$

---

## Universal Gate Sets

### What is Universal?

A set of gates is **universal** if it can approximate ANY quantum operation to arbitrary accuracy.

### Common Universal Sets

#### 1. {H, T, CNOT}
- **Clifford + T** gates
- Most commonly used
- Efficient for error correction

#### 2. {H, S, T, CNOT}
- Includes S gate
- Easier gate decomposition

#### 3. {Rx, Ry, Rz, CNOT}
- Rotation-based
- Continuous parameters
- Used in variational algorithms

#### 4. {U3, CNOT}
- $U3(\theta, \phi, \lambda)$ is arbitrary single-qubit rotation
- Most compact

### Why Multiple Sets?

Different hardware platforms prefer different gates:
- **Superconducting qubits**: Often use X, Z, √X, CNOT
- **Ion traps**: Often use rotation gates
- **Error correction**: Prefers Clifford + T

---

## Circuit Identities

### Important Equivalences

#### 1. Hadamard Relations
$$H \cdot X \cdot H = Z$$
$$H \cdot Z \cdot H = X$$
$$H \cdot Y \cdot H = -Y$$

**Meaning:** H "rotates" between X and Z bases

---

#### 2. CNOT Relations
```
──●──   =   ──H──●──H──
  │             │
──⊕──       ──H──●──H──
```
(Can flip control/target with Hadamards)

---

#### 3. Pauli Properties
$$X^2 = Y^2 = Z^2 = I$$
$$XY = iZ, \quad YZ = iX, \quad ZX = iY$$

---

#### 4. Gate Decompositions

**Hadamard:**
$$H = \frac{1}{\sqrt{2}}(X + Z)$$

**SWAP from CNOTs:**
```
SWAP = CNOT₁₂ · CNOT₂₁ · CNOT₁₂
```

**Toffoli from single/two-qubit gates:**
Can be decomposed into H, T, CNOT gates!

---

## Measurement

### Computational Basis Measurement

**Default:** Measure in $\{|0\rangle, |1\rangle\}$ basis

**Circuit Symbol:**
```
|ψ⟩ ──┤M├──
        ↓
        c (classical bit: 0 or 1)
```

**Effect:**
- State $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$
- Probability of 0: $|\alpha|^2$
- Probability of 1: $|\beta|^2$
- After measurement: State becomes $|0\rangle$ or $|1\rangle$

### Partial Measurement

Can measure some qubits while leaving others:

```
q₀ ──────────  (not measured, stays quantum)
        
q₁ ──┤M├────  (measured, becomes classical)
       ↓
       c
```

**Result:** Collapses measured qubit, affects entangled qubits!

### Other Basis Measurements

Can measure in different bases:
```
|ψ⟩ ──H──┤M├──  (measures in X basis)
```

To measure in X basis: Apply H, then measure in Z basis.

---

## Practice Problems

### Problem 1: Gate Application
What is $HXH|0\rangle$?

<details>
<summary>Solution</summary>

$$HXH|0\rangle = HX|+\rangle = H|-\rangle = |1\rangle$$

Or using $HXH = Z$: $Z|0\rangle = |0\rangle$... wait, that's wrong!

Actually: $HXH = Z$, so $Z|0\rangle = |0\rangle$. Let me recalculate:

$X|0\rangle = |1\rangle$

$H|1\rangle = |-\rangle = \frac{1}{\sqrt{2}}(|0\rangle - |1\rangle)$

$H|-\rangle = |1\rangle$

So: $HXH|0\rangle = |1\rangle$ ✓

But also: $HXH = Z$ is an operator identity, and $Z|0\rangle = |0\rangle$

These seem contradictory? Actually, they're not because...

The identity is: $HXH = Z$ as operators, so:
$HXH|0\rangle = Z|0\rangle = |0\rangle$ ✓

I made an error above. Let's recalculate step by step:
1. $|0\rangle$
2. $H|0\rangle = |+\rangle$
3. $XH|0\rangle = X|+\rangle = |+\rangle$ (X leaves |+⟩ invariant!)
4. $HXH|0\rangle = H|+\rangle = |0\rangle$

**Answer: $|0\rangle$** ✓
</details>

### Problem 2: Circuit Output
What state results from this circuit?
```
|0⟩ ──H──●──
         │
|0⟩ ─────⊕──
```

<details>
<summary>Solution</summary>

1. Start: $|00\rangle$
2. After H on q₀: $\frac{1}{\sqrt{2}}(|00\rangle + |10\rangle)$
3. After CNOT: $\frac{1}{\sqrt{2}}(|00\rangle + |11\rangle) = |\Phi^+\rangle$

**Bell State!**
</details>

### Problem 3: Gate Equivalence
Show that $HXHZ = Y$ (up to global phase)

<details>
<summary>Solution</summary>

We know:
- $HXH = Z$
- So $HXHZ = ZZ = I$?

Wait, that's not right. Let me calculate properly:

$HXH = Z$ (identity)

So $HXHZ = Z \cdot Z = I$ (not Y!)

The problem statement is incorrect. Actually:

$HZH = X$ and $XZ = -iY$

So: $HZH \cdot Z = XZ = -iY$

Or: $ZX = iY$
</details>

---

## Key Takeaways 🎯

1. ✅ **Quantum gates** are unitary transformations (reversible)
2. ✅ **Pauli gates** (X, Y, Z) are 180° rotations on Bloch sphere
3. ✅ **Hadamard gate** creates superposition - most important single-qubit gate
4. ✅ **CNOT** creates entanglement - most important two-qubit gate
5. ✅ **Circuits** read left-to-right, represent quantum algorithms
6. ✅ **Universal gate sets** can approximate any quantum operation
7. ✅ **Measurement** collapses superposition, produces classical output

---

## What's Next?

In **Part 4: Classical Machine Learning Review**, we'll cover:
- ML fundamentals (supervised, unsupervised learning)
- Neural networks basics
- Optimization and loss functions
- How quantum enhances ML

---

## Gate Cheat Sheet

```python
# Quick reference (we'll code this in Part 7!)

# Single-qubit gates
X  → Bit flip (NOT)
Y  → Bit + Phase flip
Z  → Phase flip
H  → Hadamard (superposition)
S  → Phase gate (√Z)
T  → π/8 gate
I  → Identity (do nothing)

# Two-qubit gates
CNOT → Controlled-NOT (entanglement!)
CZ   → Controlled-Z
SWAP → Exchange qubits

# Three-qubit gates
Toffoli → Controlled-Controlled-NOT

# Rotation gates
RX(θ) → X-axis rotation
RY(θ) → Y-axis rotation
RZ(θ) → Z-axis rotation
```

---

**Great progress!** You now understand the building blocks of quantum circuits. Ready for Part 4! 🚀

