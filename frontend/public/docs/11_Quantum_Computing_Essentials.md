# 1.1 – Quantum Computing Essentials

## A Rigorous Foundation for Quantum Computation

This module builds the formal mathematical framework behind quantum computing — the language every quantum researcher and engineer must speak fluently.

---

## Table of Contents

1. [Qubits and the Bloch Sphere](#qubits-and-the-bloch-sphere)
2. [Dirac Notation](#dirac-notation)
3. [Single-Qubit Gates](#single-qubit-gates)
4. [Multi-Qubit Systems](#multi-qubit-systems)
5. [Entanglement — Bell States and EPR Pairs](#entanglement)
6. [Quantum Measurement — Born Rule, Collapse, Expectation Values](#quantum-measurement)
7. [Two-Qubit Gates](#two-qubit-gates)
8. [Quantum Circuits — Depth, Width, Complexity](#quantum-circuits)
9. [Quantum Interference](#quantum-interference)
10. [The No-Cloning Theorem](#the-no-cloning-theorem)
11. [Introduction to Qiskit](#introduction-to-qiskit)

---

## Qubits and the Bloch Sphere

### The Qubit as a State Vector

A **qubit** is the fundamental unit of quantum information. Unlike a classical bit (0 or 1), a qubit is described by a **state vector** in a two-dimensional complex Hilbert space $\mathcal{H} = \mathbb{C}^2$.

The general single-qubit state is:

$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle, \quad \alpha, \beta \in \mathbb{C}$$

subject to the **normalization constraint**:

$$|\alpha|^2 + |\beta|^2 = 1$$

The quantities $|\alpha|^2$ and $|\beta|^2$ are the probabilities of measuring $|0\rangle$ and $|1\rangle$ respectively — this is **superposition as a probabilistic state vector**.

The computational basis vectors are:

$$|0\rangle = \begin{bmatrix}1 \\ 0\end{bmatrix}, \quad |1\rangle = \begin{bmatrix}0 \\ 1\end{bmatrix}$$

### The Bloch Sphere Representation

Every pure single-qubit state (up to global phase) can be uniquely represented as a point on the surface of a unit sphere in $\mathbb{R}^3$, known as the **Bloch sphere**:

$$|\psi\rangle = \cos\!\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\!\left(\frac{\theta}{2}\right)|1\rangle$$

where:
- $\theta \in [0, \pi]$ is the **polar angle** (latitude)
- $\phi \in [0, 2\pi)$ is the **azimuthal angle** (longitude)

The factor $\theta/2$ (not $\theta$) ensures that antipodal points on the sphere represent orthogonal states — a 360° rotation of a qubit is not the identity, only a 720° rotation is.

```
         |0⟩ (θ=0, North Pole)
          ↑
     z    |
     |    |       |+y⟩ (θ=π/2, φ=π/2)
     |   _|____
     |  /  |  /|
     | /   ● / |  ← |ψ⟩ at (θ, φ)
     |/ ───'──/
     +--------→ y
    /
   /→ x
  |+x⟩ = |+⟩ (θ=π/2, φ=0)

         |1⟩ (θ=π, South Pole)
```

| State | Bloch coordinates |
|-------|------------------|
| $\|0\rangle$ | $(0, 0, 1)$ — North Pole |
| $\|1\rangle$ | $(0, 0, -1)$ — South Pole |
| $\|+\rangle = \frac{1}{\sqrt{2}}(\|0\rangle+\|1\rangle)$ | $(1, 0, 0)$ — $+X$ axis |
| $\|-\rangle = \frac{1}{\sqrt{2}}(\|0\rangle-\|1\rangle)$ | $(-1, 0, 0)$ — $-X$ axis |
| $\|i\rangle = \frac{1}{\sqrt{2}}(\|0\rangle+i\|1\rangle)$ | $(0, 1, 0)$ — $+Y$ axis |
| $\|-i\rangle = \frac{1}{\sqrt{2}}(\|0\rangle-i\|1\rangle)$ | $(0, -1, 0)$ — $-Y$ axis |

> **Key insight:** Quantum gates are **rotations** of the Bloch sphere. The X gate is a 180° rotation around the X axis; H is a 180° rotation around the diagonal X+Z axis.

---

## Dirac Notation

### Bra-Ket Formalism

**Dirac notation** (bra-ket notation) is the universal language of quantum mechanics, invented by Paul Dirac. It is compact, basis-independent, and directly reflects the inner product structure of Hilbert space.

| Symbol | Name | Meaning | Linear algebra |
|--------|------|---------|----------------|
| $\|\psi\rangle$ | **Ket** | Quantum state vector | Column vector |
| $\langle\psi\|$ | **Bra** | Dual of ket | Row vector (conjugate transpose) |
| $\langle\phi\|\psi\rangle$ | **Bracket (inner product)** | Overlap between states | $\phi^\dagger \psi$ (scalar) |
| $\|\psi\rangle\langle\phi\|$ | **Outer product** | Operator/projector | Matrix |

### Inner Product

For two states $|\phi\rangle = \begin{bmatrix}a \\ b\end{bmatrix}$ and $|\psi\rangle = \begin{bmatrix}c \\ d\end{bmatrix}$:

$$\langle\phi|\psi\rangle = a^*c + b^*d$$

**Properties:**
- $\langle\phi|\psi\rangle = \langle\psi|\phi\rangle^*$ (conjugate symmetry)
- $\langle\psi|\psi\rangle \geq 0$, equal to 1 for normalized states
- $\langle 0|1\rangle = 0$ (orthogonality of basis states)

### Orthonormality of Computational Basis

$$\langle 0|0\rangle = 1, \quad \langle 1|1\rangle = 1, \quad \langle 0|1\rangle = \langle 1|0\rangle = 0$$

### Projection and Completeness

The projector onto state $|0\rangle$ is:

$$|0\rangle\langle 0| = \begin{bmatrix}1 \\ 0\end{bmatrix}\begin{bmatrix}1 & 0\end{bmatrix} = \begin{bmatrix}1 & 0 \\ 0 & 0\end{bmatrix}$$

The **completeness relation** (resolution of identity) for any basis $\{|i\rangle\}$:

$$\sum_i |i\rangle\langle i| = I$$

For the computational basis: $|0\rangle\langle 0| + |1\rangle\langle 1| = I$

### Operators in Dirac Notation

An operator $A$ acts on kets: $A|\psi\rangle = |\psi'\rangle$

The **expectation value** of observable $A$ in state $|\psi\rangle$:

$$\langle A \rangle = \langle\psi|A|\psi\rangle$$

A **Hermitian operator** satisfies $A = A^\dagger$ and always has real eigenvalues (observables in QM are Hermitian).

A **unitary operator** satisfies $U^\dagger U = UU^\dagger = I$ (quantum gates are unitary).

---

## Single-Qubit Gates

Single-qubit gates are $2 \times 2$ unitary matrices acting on a single qubit's state vector.

### Pauli Gates

The **Pauli matrices** are the three fundamental single-qubit operators:

$$X = \begin{bmatrix}0 & 1 \\ 1 & 0\end{bmatrix}, \quad Y = \begin{bmatrix}0 & -i \\ i & 0\end{bmatrix}, \quad Z = \begin{bmatrix}1 & 0 \\ 0 & -1\end{bmatrix}$$

**Properties:**
- $X^2 = Y^2 = Z^2 = I$ (self-inverse)
- $XY = iZ$, $YZ = iX$, $ZX = iY$ (anti-commutation relations)
- Eigenvalues: $\pm 1$ for each Pauli gate

**X gate (bit flip):**
$$X|0\rangle = |1\rangle, \quad X|1\rangle = |0\rangle$$

**Y gate:**
$$Y|0\rangle = i|1\rangle, \quad Y|1\rangle = -i|0\rangle$$

**Z gate (phase flip):**
$$Z|0\rangle = |0\rangle, \quad Z|1\rangle = -|1\rangle$$

In terms of Bloch sphere: X is 180° rotation about $\hat{x}$, Y about $\hat{y}$, Z about $\hat{z}$.

### Hadamard Gate

The **Hadamard gate** is the most important single-qubit gate — it creates superposition:

$$H = \frac{1}{\sqrt{2}}\begin{bmatrix}1 & 1 \\ 1 & -1\end{bmatrix}$$

**Actions:**
$$H|0\rangle = |+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}}$$
$$H|1\rangle = |-\rangle = \frac{|0\rangle - |1\rangle}{\sqrt{2}}$$

Note that $H^2 = I$ — applying Hadamard twice returns to the original state.

Geometrically, H is a 180° rotation about the $(\hat{x}+\hat{z})/\sqrt{2}$ axis. It interchanges the $X$ and $Z$ bases: $HXH = Z$ and $HZH = X$.

### Phase Gates (S and T)

**S gate** (phase gate, $\sqrt{Z}$):

$$S = \begin{bmatrix}1 & 0 \\ 0 & i\end{bmatrix}$$

$$S|0\rangle = |0\rangle, \quad S|1\rangle = i|1\rangle$$

Note: $S^2 = Z$.

**T gate** ($\pi/8$ gate, $\sqrt{S}$):

$$T = \begin{bmatrix}1 & 0 \\ 0 & e^{i\pi/4}\end{bmatrix} = \begin{bmatrix}1 & 0 \\ 0 & \frac{1+i}{\sqrt{2}}\end{bmatrix}$$

$$T|0\rangle = |0\rangle, \quad T|1\rangle = e^{i\pi/4}|1\rangle$$

Note: $T^2 = S$, $T^4 = Z$, $T^8 = I$.

The T gate is critical — together with H and CNOT, it forms a **universal gate set**.

### Rotation Gates

General rotations about the three Bloch sphere axes by angle $\theta$:

$$R_x(\theta) = e^{-i\theta X/2} = \cos\!\left(\frac{\theta}{2}\right)I - i\sin\!\left(\frac{\theta}{2}\right)X = \begin{bmatrix}\cos\frac{\theta}{2} & -i\sin\frac{\theta}{2} \\ -i\sin\frac{\theta}{2} & \cos\frac{\theta}{2}\end{bmatrix}$$

$$R_y(\theta) = e^{-i\theta Y/2} = \cos\!\left(\frac{\theta}{2}\right)I - i\sin\!\left(\frac{\theta}{2}\right)Y = \begin{bmatrix}\cos\frac{\theta}{2} & -\sin\frac{\theta}{2} \\ \sin\frac{\theta}{2} & \cos\frac{\theta}{2}\end{bmatrix}$$

$$R_z(\theta) = e^{-i\theta Z/2} = \cos\!\left(\frac{\theta}{2}\right)I - i\sin\!\left(\frac{\theta}{2}\right)Z = \begin{bmatrix}e^{-i\theta/2} & 0 \\ 0 & e^{i\theta/2}\end{bmatrix}$$

**Key identities:**
- $R_x(\pi) = -iX$, $R_y(\pi) = -iY$, $R_z(\pi) = -iZ$ (Pauli gates are $\pi$-rotations up to global phase)
- Any single-qubit unitary can be decomposed as $U = e^{i\alpha} R_z(\beta) R_y(\gamma) R_z(\delta)$ for some angles

### Gate Summary Table

| Gate | Matrix | Bloch rotation | Qiskit |
|------|--------|---------------|--------|
| $X$ | $\begin{bmatrix}0&1\\1&0\end{bmatrix}$ | 180° around $\hat{x}$ | `qc.x(q)` |
| $Y$ | $\begin{bmatrix}0&-i\\i&0\end{bmatrix}$ | 180° around $\hat{y}$ | `qc.y(q)` |
| $Z$ | $\begin{bmatrix}1&0\\0&-1\end{bmatrix}$ | 180° around $\hat{z}$ | `qc.z(q)` |
| $H$ | $\frac{1}{\sqrt{2}}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$ | 180° around $(\hat{x}+\hat{z})/\sqrt{2}$ | `qc.h(q)` |
| $S$ | $\begin{bmatrix}1&0\\0&i\end{bmatrix}$ | 90° around $\hat{z}$ | `qc.s(q)` |
| $T$ | $\begin{bmatrix}1&0\\0&e^{i\pi/4}\end{bmatrix}$ | 45° around $\hat{z}$ | `qc.t(q)` |
| $R_x(\theta)$ | $\begin{bmatrix}\cos\frac{\theta}{2}&-i\sin\frac{\theta}{2}\\-i\sin\frac{\theta}{2}&\cos\frac{\theta}{2}\end{bmatrix}$ | $\theta$ around $\hat{x}$ | `qc.rx(θ, q)` |
| $R_y(\theta)$ | $\begin{bmatrix}\cos\frac{\theta}{2}&-\sin\frac{\theta}{2}\\\sin\frac{\theta}{2}&\cos\frac{\theta}{2}\end{bmatrix}$ | $\theta$ around $\hat{y}$ | `qc.ry(θ, q)` |
| $R_z(\theta)$ | $\begin{bmatrix}e^{-i\theta/2}&0\\0&e^{i\theta/2}\end{bmatrix}$ | $\theta$ around $\hat{z}$ | `qc.rz(θ, q)` |

---

## Multi-Qubit Systems

### Tensor Products and Composite Hilbert Spaces

When we combine $n$ qubits, the state space is the **tensor product** of individual Hilbert spaces:

$$\mathcal{H}_{total} = \mathcal{H}_1 \otimes \mathcal{H}_2 \otimes \cdots \otimes \mathcal{H}_n = \mathbb{C}^{2^n}$$

The dimension grows **exponentially**: $n$ qubits need $2^n$ complex amplitudes to describe fully.

The **tensor product** of two vectors is:

$$\begin{bmatrix}a_1 \\ a_2\end{bmatrix} \otimes \begin{bmatrix}b_1 \\ b_2\end{bmatrix} = \begin{bmatrix}a_1 b_1 \\ a_1 b_2 \\ a_2 b_1 \\ a_2 b_2\end{bmatrix}$$

**Example:**

$$|0\rangle \otimes |1\rangle = |01\rangle = \begin{bmatrix}1\\0\end{bmatrix} \otimes \begin{bmatrix}0\\1\end{bmatrix} = \begin{bmatrix}0\\1\\0\\0\end{bmatrix}$$

### Two-Qubit Computational Basis

The four basis states of a 2-qubit system are:

$$|00\rangle = \begin{bmatrix}1\\0\\0\\0\end{bmatrix}, \quad |01\rangle = \begin{bmatrix}0\\1\\0\\0\end{bmatrix}, \quad |10\rangle = \begin{bmatrix}0\\0\\1\\0\end{bmatrix}, \quad |11\rangle = \begin{bmatrix}0\\0\\0\\1\end{bmatrix}$$

A general 2-qubit state:

$$|\psi\rangle = \alpha_{00}|00\rangle + \alpha_{01}|01\rangle + \alpha_{10}|10\rangle + \alpha_{11}|11\rangle$$

with normalization $\sum_{ij}|\alpha_{ij}|^2 = 1$.

### Tensor Products of Operators

If gate $A$ acts on qubit 1 and gate $B$ on qubit 2, the joint operation is $A \otimes B$:

$$A \otimes B = \begin{bmatrix}a_{11}B & a_{12}B \\ a_{21}B & a_{22}B\end{bmatrix}$$

**Example:** $H \otimes I$ applies Hadamard to qubit 0 only:

$$H \otimes I = \frac{1}{\sqrt{2}}\begin{bmatrix}1 & 0 & 1 & 0 \\ 0 & 1 & 0 & 1 \\ 1 & 0 & -1 & 0 \\ 0 & 1 & 0 & -1\end{bmatrix}$$

### Separable vs. Entangled States

A state is **separable** if it can be written as a product:

$$|\psi\rangle = |\phi_1\rangle \otimes |\phi_2\rangle$$

A state is **entangled** if it cannot be written as such a product.

**Test:** For $|\psi\rangle = \alpha_{00}|00\rangle + \alpha_{01}|01\rangle + \alpha_{10}|10\rangle + \alpha_{11}|11\rangle$, it is separable if and only if:

$$\alpha_{00}\alpha_{11} = \alpha_{01}\alpha_{10}$$

---

## Entanglement

### Bell States (Maximally Entangled States)

The four **Bell states** form an orthonormal basis for the two-qubit Hilbert space. They are the maximally entangled states:

$$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$

$$|\Phi^-\rangle = \frac{1}{\sqrt{2}}(|00\rangle - |11\rangle)$$

$$|\Psi^+\rangle = \frac{1}{\sqrt{2}}(|01\rangle + |10\rangle)$$

$$|\Psi^-\rangle = \frac{1}{\sqrt{2}}(|01\rangle - |10\rangle)$$

**Creating $|\Phi^+\rangle$** (Bell state preparation circuit):

```
Step 1: |00⟩
Step 2: Apply H to qubit 0:  (|00⟩ + |10⟩)/√2
Step 3: Apply CNOT(0→1):     (|00⟩ + |11⟩)/√2 = |Φ⁺⟩

q₀ |0⟩ ──H──●──
            │
q₁ |0⟩ ─────⊕──
```

**Consequence:** If you measure $q_0$ and find $|0\rangle$, then $q_1$ is instantly $|0\rangle$. Measure $|1\rangle$ and $q_1$ is instantly $|1\rangle$. This holds **regardless of the distance** between qubits.

### CNOT Gate (Controlled-NOT)

The CNOT gate is the entangling workhorse:

$$\text{CNOT} = \begin{bmatrix}1&0&0&0\\0&1&0&0\\0&0&0&1\\0&0&1&0\end{bmatrix}$$

It flips the **target qubit** if and only if the **control qubit** is $|1\rangle$:

$$\text{CNOT}|c, t\rangle = |c, c \oplus t\rangle$$

where $\oplus$ is XOR (addition mod 2).

### EPR Pairs

**EPR pairs** (Einstein-Podolsky-Rosen pairs) are any of the four Bell states, referring to the 1935 paper by Einstein, Podolsky, and Rosen that challenged quantum mechanics. They argued such "spooky action at a distance" was impossible — Bell's theorem (1964) and subsequent experiments proved them wrong.

EPR pairs have profound applications:
- **Quantum teleportation** — transfer of quantum states
- **Superdense coding** — sending 2 classical bits per qubit
- **Quantum key distribution** (QKD) — provably secure communication

---

## Quantum Measurement

### The Born Rule

When we measure a quantum state $|\psi\rangle = \sum_i \alpha_i |i\rangle$ in the basis $\{|i\rangle\}$, the **Born rule** gives the probability of outcome $i$:

$$P(i) = |\langle i|\psi\rangle|^2 = |\alpha_i|^2$$

This is the fundamental postulate connecting quantum amplitudes to observable probabilities.

**Example:** For $|\psi\rangle = \frac{1}{\sqrt{3}}|0\rangle + \sqrt{\frac{2}{3}}|1\rangle$:

$$P(0) = \left|\frac{1}{\sqrt{3}}\right|^2 = \frac{1}{3}, \quad P(1) = \left|\sqrt{\frac{2}{3}}\right|^2 = \frac{2}{3}$$

### State Collapse (Wavefunction Collapse)

After measurement producing outcome $i$, the post-measurement state **collapses** to:

$$|\psi'\rangle = \frac{P_i |\psi\rangle}{\sqrt{\langle\psi|P_i|\psi\rangle}}$$

where $P_i = |i\rangle\langle i|$ is the projector onto outcome $i$.

For the computational basis, this simplifies to: measure $|i\rangle$ with probability $|\alpha_i|^2$, and the state collapses to $|i\rangle$ afterwards.

**Critical fact:** Measurement is **irreversible** — it destroys quantum information. You cannot un-measure a qubit.

### Expectation Values

The **expectation value** (average outcome) of observable $O$ in state $|\psi\rangle$:

$$\langle O \rangle = \langle\psi|O|\psi\rangle = \sum_i \lambda_i P(\lambda_i)$$

where $\lambda_i$ are the eigenvalues of $O$ and $P(\lambda_i)$ are their probabilities.

**Example — expectation value of Z:**

$$\langle Z \rangle = \langle\psi|Z|\psi\rangle = |\alpha|^2 - |\beta|^2$$

For the state $|+\rangle = \frac{1}{\sqrt{2}}(|0\rangle + |1\rangle)$:

$$\langle Z \rangle = \frac{1}{2} - \frac{1}{2} = 0$$

(Equal superposition has zero Z-expectation, as expected for a state on the equator of the Bloch sphere.)

### Measuring in Different Bases

To measure in the $X$ basis, apply $H$ first, then measure in the $Z$ (computational) basis:

$$\langle X \rangle = \langle\psi|X|\psi\rangle$$

In quantum computing, we can only directly measure in the $Z$ basis. All other measurements are implemented by rotating first.

---

## Two-Qubit Gates

### CNOT (Controlled-NOT)

Already covered. The CNOT matrix and truth table:

| Input $|ct\rangle$ | Output |
|--------------------|--------|
| $\|00\rangle$ | $\|00\rangle$ |
| $\|01\rangle$ | $\|01\rangle$ |
| $\|10\rangle$ | $\|11\rangle$ |
| $\|11\rangle$ | $\|10\rangle$ |

Circuit notation: `──●──` (control), `──⊕──` (target)

### Controlled-Z (CZ)

Applies a phase flip only to $|11\rangle$:

$$\text{CZ} = \begin{bmatrix}1&0&0&0\\0&1&0&0\\0&0&1&0\\0&0&0&-1\end{bmatrix}$$

$$\text{CZ}|11\rangle = -|11\rangle, \quad \text{all others unchanged}$$

**Key property:** CZ is **symmetric** — either qubit can be the "control". Qiskit: `qc.cz(q0, q1)`

### SWAP Gate

Exchanges the states of two qubits:

$$\text{SWAP} = \begin{bmatrix}1&0&0&0\\0&0&1&0\\0&1&0&0\\0&0&0&1\end{bmatrix}$$

$$\text{SWAP}|ab\rangle = |ba\rangle$$

SWAP can be decomposed into three CNOTs:

$$\text{SWAP} = \text{CNOT}_{01} \cdot \text{CNOT}_{10} \cdot \text{CNOT}_{01}$$

Qiskit: `qc.swap(q0, q1)`

### Toffoli Gate (CCNOT — Controlled-Controlled-NOT)

A 3-qubit gate that flips the target only when **both** controls are $|1\rangle$:

$$\text{Toffoli}|c_1, c_2, t\rangle = |c_1, c_2, t \oplus (c_1 \wedge c_2)\rangle$$

**Truth table (only rows with $c_1=c_2=1$ change):**

| $c_1$ | $c_2$ | $t$ | Output |
|--------|--------|-----|--------|
| 1 | 1 | 0 | 1 1 **1** |
| 1 | 1 | 1 | 1 1 **0** |

The Toffoli gate is **universal for classical reversible computation** — it can simulate any classical logic gate. Qiskit: `qc.ccx(c1, c2, t)`

### Fredkin Gate (CSWAP — Controlled-SWAP)

A 3-qubit gate that **swaps** the two target qubits if the control is $|1\rangle$:

$$\text{Fredkin}|c, a, b\rangle = \begin{cases}|c, a, b\rangle & \text{if } c = 0 \\ |c, b, a\rangle & \text{if } c = 1\end{cases}$$

**Truth table:**

| $c$ | $a$ | $b$ | Out $a$ | Out $b$ |
|-----|-----|-----|---------|---------|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | **1** | **0** |
| 1 | 1 | 0 | **0** | **1** |
| 1 | 1 | 1 | 1 | 1 |

Like Toffoli, the Fredkin gate is **universal for reversible classical computation**. It conserves the number of 1s (Hamming weight), making it useful in quantum algorithms where particle number must be preserved. Qiskit: `qc.cswap(c, a, b)`

---

## Quantum Circuits

### Circuit Diagrams

A **quantum circuit** is read left-to-right, with each horizontal wire representing a qubit, and boxes/symbols representing gates applied over time.

```
       t=0    t=1    t=2    t=3
q₀ |0⟩──H──────●──────────────
                │
q₁ |0⟩─────────⊕────X──────────
                          ↓
                          M── c₀ (classical bit)
```

Conventions:
- **Wire** = qubit evolving in time
- **Box** = single-qubit gate
- **Dot + vertical line** = control
- **Circle with cross (⊕)** = CNOT target
- **Double line** = classical wire
- **Meter symbol (M)** = measurement

### Circuit Complexity Metrics

**Width ($w$):** Number of qubits used.

$$w = \text{number of qubit wires}$$

**Depth ($d$):** The length of the **critical path** — the number of gate layers when gates are parallelized as much as possible. This represents the runtime.

$$d = \text{longest sequential chain of gates}$$

**Gate count ($g$):** Total number of elementary gates (often counted in terms of a universal gate set).

**Example:**
```
q₀ ──H──●────────
         │
q₁ ──H──⊕──H──M──
```
- Width $w = 2$
- Gate count $g = 4$ (two H, one CNOT, one H)
- Depth $d = 3$ (H on q₀ ∥ H on q₁, then CNOT, then H on q₁)

> **Why depth matters:** On real hardware, qubits **decohere** over time (lose their quantum properties). A circuit with large depth is more likely to fail before completion. Minimizing depth is essential for near-term quantum advantage.

### T-count and T-gate Depth

In fault-tolerant quantum computing, **T gates are expensive** (require magic state distillation). Algorithms are analyzed by:
- **T-count:** number of T gates
- **T-depth:** depth counting only T-layer levels

### NISQ Era Constraints

On **NISQ** (Noisy Intermediate-Scale Quantum) devices:
- Limited qubit counts (50–1000 physical qubits)
- Gate fidelities $< 99.9\%$ — errors accumulate
- Coherence times limit circuit depth to $\sim 100$–$1000$ layers
- Connectivity constraints — not all qubit pairs can directly interact

---

## Quantum Interference

### Amplitude Manipulation

In quantum computing, we manipulate **probability amplitudes** (complex numbers), not probabilities. The **interference** between amplitudes is what gives quantum algorithms their power.

Consider two paths to outcome $|x\rangle$ with amplitudes $\alpha_1$ and $\alpha_2$:

$$P(|x\rangle) = |\alpha_1 + \alpha_2|^2$$

- **Constructive interference:** $\alpha_1$ and $\alpha_2$ have the same sign/phase → $|\alpha_1 + \alpha_2|^2 > |\alpha_1|^2 + |\alpha_2|^2$
- **Destructive interference:** $\alpha_1$ and $\alpha_2$ have opposite phase → $|\alpha_1 + \alpha_2|^2 < |\alpha_1|^2 + |\alpha_2|^2$ (can reach 0)

### Concrete Example — Hadamard Then Hadamard

Starting from $|0\rangle$, apply $H$ twice:

$$|0\rangle \xrightarrow{H} \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle \xrightarrow{H} \frac{1}{\sqrt{2}}\left(\frac{|0\rangle+|1\rangle}{\sqrt{2}}\right) + \frac{1}{\sqrt{2}}\left(\frac{|0\rangle-|1\rangle}{\sqrt{2}}\right)$$

$$= \frac{1}{2}(1+1)|0\rangle + \frac{1}{2}(1-1)|1\rangle = |0\rangle$$

The $|1\rangle$ amplitude cancels perfectly (**destructive**) and $|0\rangle$ adds constructively. We recover the original state with 100% probability.

### Interference in Grover's Algorithm

Grover's algorithm uses interference to:
1. Place all $2^n$ states in equal superposition ($P = 1/2^n$ each)
2. Apply an **oracle** that flips the phase of the target state
3. Apply a **diffusion operator** that amplifies the target amplitude via constructive interference and suppresses all others via destructive interference
4. After $O(\sqrt{2^n})$ iterations, measure the target with high probability

The amplitude of the target state after $k$ iterations of Grover:

$$\alpha_k = \sin\!\left((2k+1)\arcsin\!\left(\frac{1}{\sqrt{N}}\right)\right)$$

where $N = 2^n$. The optimal number of iterations is $k \approx \frac{\pi}{4}\sqrt{N}$.

---

## The No-Cloning Theorem

### Statement

> **No-Cloning Theorem (Wootters & Zurek, 1982):** It is impossible to create an identical copy of an arbitrary unknown quantum state.

Formally: there is no unitary operation $U$ such that for **all** $|\psi\rangle$:

$$U(|\psi\rangle \otimes |0\rangle) = |\psi\rangle \otimes |\psi\rangle$$

### Proof

Suppose such $U$ existed. For two arbitrary states $|\psi\rangle$ and $|\phi\rangle$:

$$U(|\psi\rangle|0\rangle) = |\psi\rangle|\psi\rangle$$
$$U(|\phi\rangle|0\rangle) = |\phi\rangle|\phi\rangle$$

Taking the inner product of the left sides and right sides:

$$\langle\psi|\phi\rangle = (\langle\psi|\phi\rangle)^2$$

This equation holds only if $\langle\psi|\phi\rangle = 0$ (orthogonal) or $\langle\psi|\phi\rangle = 1$ (identical states). It fails for arbitrary states — **contradiction**. $\square$

### Why It Matters

The no-cloning theorem has deep implications:

1. **Security:** Quantum states cannot be intercepted and copied without detection — foundation of quantum cryptography (BB84, E91)
2. **Error correction:** Classical error correction copies bits; quantum error correction must use entanglement (e.g., 3-qubit bit-flip code) instead
3. **For genetic algorithms:** In quantum-inspired or hybrid quantum-GA systems, you cannot copy a quantum chromosome state arbitrarily — genetic operators (crossover, mutation) must be designed to respect unitarity

### The No-Deleting Theorem

A complementary result: you also cannot **delete** one copy of a quantum state if another exists. Together with no-cloning, these theorems establish the fundamentally different information-theoretic properties of quantum vs. classical data.

---

## Introduction to Qiskit

### What is Qiskit?

**Qiskit** (Quantum Information Science Kit) is IBM's open-source quantum computing framework written in Python. It provides:
- Circuit construction
- Simulation (statevector, shot-based, noise models)
- Access to real IBM quantum hardware
- QML tools via `qiskit-machine-learning`

### Installation

```bash
pip install qiskit qiskit-aer qiskit-ibm-runtime
```

### Building Your First Circuit

```python
from qiskit import QuantumCircuit

# Create a 2-qubit, 2-classical-bit circuit
qc = QuantumCircuit(2, 2)

# Apply Hadamard to qubit 0 → superposition
qc.h(0)

# Apply CNOT (control=0, target=1) → entanglement
qc.cx(0, 1)

# Measure both qubits
qc.measure([0, 1], [0, 1])

print(qc.draw())
```

```
     ┌───┐     ┌─┐
q_0: ┤ H ├──■──┤M├───
     └───┘┌─┴─┐└╥┘┌─┐
q_1: ─────┤ X ├─╫─┤M├
          └───┘ ║ └╥┘
c: 2/═══════════╩══╩═
                0  1
```

### Statevector Simulator

The **statevector simulator** gives you the exact quantum state — useful for debugging and small circuits ($\leq 30$ qubits):

```python
from qiskit_aer import Aer

# Remove measurements for statevector
qc_no_meas = QuantumCircuit(2)
qc_no_meas.h(0)
qc_no_meas.cx(0, 1)

simulator = Aer.get_backend('statevector_simulator')
result = simulator.run(qc_no_meas).result()
sv = result.get_statevector()

print(sv)
# [0.707+0j, 0+0j, 0+0j, 0.707+0j]
# i.e., (1/√2)|00⟩ + (1/√2)|11⟩ = |Φ⁺⟩
```

### Shot-Based Simulator (QASM)

The **QASM simulator** mimics actual quantum hardware by sampling from the probability distribution:

```python
simulator = Aer.get_backend('qasm_simulator')

# Run 1024 shots (measurements)
job = simulator.run(qc, shots=1024)
result = job.result()
counts = result.get_counts()
print(counts)
# {'00': 516, '11': 508}  — approximately 50/50
```

Each "shot" is an independent measurement. More shots = better statistics.

### Checking Circuit Properties

```python
print(f"Width (qubits):  {qc.num_qubits}")
print(f"Depth:           {qc.depth()}")
print(f"Gate count:      {qc.count_ops()}")
```

### Parameterized Circuits (for QML)

```python
from qiskit.circuit import Parameter, ParameterVector

theta = Parameter('θ')
phi = Parameter('φ')

qc = QuantumCircuit(2)
qc.ry(theta, 0)
qc.ry(phi, 1)
qc.cx(0, 1)

# Bind parameters at training time
bound = qc.assign_parameters({theta: 0.5, phi: 1.2})
```

### From Theory to Experiment — Workflow

```
1. Design → QuantumCircuit
2. Simulate locally → statevector or qasm_simulator
3. Check complexity → .depth(), .count_ops()
4. Optimize → transpile(..., optimization_level=3)
5. Run on hardware → IBM Quantum (quantum.ibm.com)
6. Analyze → plot_histogram, plot_bloch_multivector
```

---

## Key Takeaways

1. **Qubits** are state vectors in $\mathbb{C}^2$; the Bloch sphere provides geometric intuition
2. **Dirac notation** is the universal language — master bra-ket, inner products, and expectation values
3. **Single-qubit gates** are $2\times 2$ unitaries; rotation gates give continuous control
4. **Multi-qubit systems** live in $\mathbb{C}^{2^n}$ — the tensor product grows exponentially
5. **Bell states** and the CNOT gate are the heart of quantum entanglement
6. **Born rule**: $P(i) = |\alpha_i|^2$ — measurement collapses the state irreversibly
7. **Two-qubit gates**: CNOT, CZ, SWAP, Toffoli, and Fredkin each serve distinct roles
8. **Circuit depth** is the time complexity metric — minimize it for NISQ hardware
9. **Interference** amplifies correct answers and cancels wrong ones — the quantum advantage mechanism
10. **No-cloning theorem** forbids copying unknown quantum states — redesign classical ideas accordingly
11. **Qiskit** provides statevector and shot-based simulation — the essential quantum programming tool

---

## What's Next?

Continue to **Part 1.2 – Classical Genetic Algorithms** to learn the evolutionary optimization framework that, combined with quantum computing, gives rise to Quantum Genetic Algorithms (QGAs). 🚀
