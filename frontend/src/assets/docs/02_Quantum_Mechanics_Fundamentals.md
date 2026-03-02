# Part 2: Quantum Mechanics Fundamentals

## Mathematical Foundations for Quantum Computing

Now that you understand the basic concepts, let's learn the mathematics that makes quantum computing work!

---

## Table of Contents
1. [Complex Numbers (A Quick Refresher)](#complex-numbers)
2. [Quantum State Vectors](#quantum-state-vectors)
3. [The Bloch Sphere](#the-bloch-sphere)
4. [Probability Amplitudes](#probability-amplitudes)
5. [Multiple Qubits](#multiple-qubits)
6. [Bra-Ket Notation in Detail](#bra-ket-notation-in-detail)

---

## Complex Numbers

### Why Do We Need Complex Numbers?

Quantum mechanics requires complex numbers! Don't panic - we'll keep it simple.

### What is a Complex Number?

A complex number has a **real part** and an **imaginary part**:

$$z = a + bi$$

Where:
- $a$ = real part
- $b$ = imaginary part  
- $i = \sqrt{-1}$ (imaginary unit where $i^2 = -1$)

### Examples

```
3 + 4i
5 - 2i
0 + 7i  (purely imaginary)
6 + 0i  (purely real)
```

### Complex Number Operations

#### Addition/Subtraction
$$(a + bi) + (c + di) = (a + c) + (b + d)i$$

**Example:** $(3 + 4i) + (1 + 2i) = 4 + 6i$

#### Multiplication
$$(a + bi) \times (c + di) = (ac - bd) + (ad + bc)i$$

**Example:** $(2 + 3i) \times (1 + 4i) = (2 - 12) + (8 + 3)i = -10 + 11i$

#### Complex Conjugate
$$\overline{a + bi} = a - bi$$

**Example:** $\overline{3 + 4i} = 3 - 4i$

#### Magnitude (Modulus)
$$|a + bi| = \sqrt{a^2 + b^2}$$

**Example:** $|3 + 4i| = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = 5$

### Why Complex Numbers in Quantum Computing?

1. **Probability amplitudes** are complex numbers
2. **Interference** requires wave-like behavior (phases)
3. **Quantum gates** are represented by complex matrices

---

## Quantum State Vectors

### Single Qubit State

A qubit is represented as a **vector** in a 2-dimensional complex space:

$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$$

Where $\alpha, \beta$ are **complex numbers** called **probability amplitudes**.

### Column Vector Representation

$$|0\rangle = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \quad |1\rangle = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

So:
$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle = \begin{bmatrix} \alpha \\ \beta \end{bmatrix}$$

### Normalization Condition

The probabilities must sum to 1:

$$|\alpha|^2 + |\beta|^2 = 1$$

This is called **normalization**.

### Example States

#### Equal Superposition
$$|+\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle = \begin{bmatrix} \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} \end{bmatrix}$$

- Probability of measuring $|0\rangle$: $\left|\frac{1}{\sqrt{2}}\right|^2 = \frac{1}{2}$ (50%)
- Probability of measuring $|1\rangle$: $\left|\frac{1}{\sqrt{2}}\right|^2 = \frac{1}{2}$ (50%)

#### Another Superposition
$$|\psi\rangle = \frac{1}{2}|0\rangle + \frac{\sqrt{3}}{2}|1\rangle$$

- Probability of $|0\rangle$: $\left|\frac{1}{2}\right|^2 = \frac{1}{4}$ (25%)
- Probability of $|1\rangle$: $\left|\frac{\sqrt{3}}{2}\right|^2 = \frac{3}{4}$ (75%)

Check: $\frac{1}{4} + \frac{3}{4} = 1$ ✓

---

## The Bloch Sphere

### Visualizing a Qubit

The **Bloch sphere** is a 3D representation of a single qubit state.

```
         |0⟩ (North Pole)
          ●
          |
          |
    ------+------ 
         /|\
        / | \
       /  |  \
      /   ●   \  |ψ⟩
     /    |    \
    --------------
          |
          ●
         |1⟩ (South Pole)
```

### Bloch Sphere Representation

Any qubit state can be written as:

$$|\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle$$

Where:
- $\theta$ = polar angle (0 to π)
- $\phi$ = azimuthal angle (0 to 2π)

### Key Points on the Bloch Sphere

| State | Position | Angles |
|-------|----------|--------|
| $\|0\rangle$ | North Pole | $\theta = 0$ |
| $\|1\rangle$ | South Pole | $\theta = \pi$ |
| $\|+\rangle = \frac{1}{\sqrt{2}}(\|0\rangle + \|1\rangle)$ | +X axis | $\theta = \frac{\pi}{2}, \phi = 0$ |
| $\|-\rangle = \frac{1}{\sqrt{2}}(\|0\rangle - \|1\rangle)$ | -X axis | $\theta = \frac{\pi}{2}, \phi = \pi$ |
| $\|i\rangle = \frac{1}{\sqrt{2}}(\|0\rangle + i\|1\rangle)$ | +Y axis | $\theta = \frac{\pi}{2}, \phi = \frac{\pi}{2}$ |
| $\|-i\rangle = \frac{1}{\sqrt{2}}(\|0\rangle - i\|1\rangle)$ | -Y axis | $\theta = \frac{\pi}{2}, \phi = \frac{3\pi}{2}$ |

### Why the Bloch Sphere Matters

1. **Geometric intuition** for quantum operations
2. **Quantum gates** are rotations on the sphere
3. **Easy visualization** of single-qubit states

### Limitation
⚠️ **Important:** The Bloch sphere only works for **single qubits**. Multiple qubits need higher dimensions!

---

## Probability Amplitudes

### What Are They?

**Probability amplitudes** are complex numbers that encode:
1. **Magnitude** → Probability of measurement outcome
2. **Phase** → How quantum states interfere

### From Amplitude to Probability

$$\text{Probability} = |\text{Amplitude}|^2$$

### Example

If $|\psi\rangle = \frac{1 + i}{2}|0\rangle + \frac{1 - i}{2}|1\rangle$

**For |0⟩:**
$$\text{Amplitude} = \frac{1 + i}{2}$$
$$\left|\frac{1 + i}{2}\right|^2 = \left(\frac{\sqrt{1^2 + 1^2}}{2}\right)^2 = \left(\frac{\sqrt{2}}{2}\right)^2 = \frac{1}{2}$$

**For |1⟩:**
$$\text{Amplitude} = \frac{1 - i}{2}$$
$$\left|\frac{1 - i}{2}\right|^2 = \frac{1}{2}$$

So: 50% chance of measuring 0, 50% chance of measuring 1.

### Global vs Relative Phase

#### Global Phase (Doesn't Matter)
$$|\psi\rangle \text{ and } e^{i\theta}|\psi\rangle$$

These are **physically identical** - global phase has no observable effect.

**Example:**
$$|\psi\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle$$
$$e^{i\pi/4}|\psi\rangle = \frac{e^{i\pi/4}}{\sqrt{2}}|0\rangle + \frac{e^{i\pi/4}}{\sqrt{2}}|1\rangle$$

Same measurements, same behavior!

#### Relative Phase (VERY Important!)
$$\frac{1}{\sqrt{2}}(|0\rangle + |1\rangle) \neq \frac{1}{\sqrt{2}}(|0\rangle - |1\rangle)$$

These are **different states**! The relative phase between $|0\rangle$ and $|1\rangle$ matters for interference.

---

## Multiple Qubits

### Two-Qubit States

A 2-qubit system has **4 basis states**:
$$|00\rangle, |01\rangle, |10\rangle, |11\rangle$$

**General state:**
$$|\psi\rangle = \alpha_{00}|00\rangle + \alpha_{01}|01\rangle + \alpha_{10}|10\rangle + \alpha_{11}|11\rangle$$

Where: $|\alpha_{00}|^2 + |\alpha_{01}|^2 + |\alpha_{10}|^2 + |\alpha_{11}|^2 = 1$

### Vector Representation

$$|00\rangle = \begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix}, \quad
|01\rangle = \begin{bmatrix} 0 \\ 1 \\ 0 \\ 0 \end{bmatrix}, \quad
|10\rangle = \begin{bmatrix} 0 \\ 0 \\ 1 \\ 0 \end{bmatrix}, \quad
|11\rangle = \begin{bmatrix} 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$

### Tensor Product (⊗)

To combine individual qubit states:

$$|0\rangle \otimes |1\rangle = |01\rangle$$

**Example:**
$$|+\rangle \otimes |0\rangle = \frac{1}{\sqrt{2}}(|0\rangle + |1\rangle) \otimes |0\rangle$$
$$= \frac{1}{\sqrt{2}}(|00\rangle + |10\rangle)$$

### Computational Formula
$$\begin{bmatrix} a \\ b \end{bmatrix} \otimes \begin{bmatrix} c \\ d \end{bmatrix} = \begin{bmatrix} ac \\ ad \\ bc \\ bd \end{bmatrix}$$

**Example:**
$$|0\rangle \otimes |1\rangle = \begin{bmatrix} 1 \\ 0 \end{bmatrix} \otimes \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \\ 0 \\ 0 \end{bmatrix} = |01\rangle$$

### Separable vs Entangled States

#### Separable State
Can be written as a tensor product:
$$|\psi\rangle = |0\rangle \otimes |+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |01\rangle)$$

#### Entangled State
**Cannot** be written as a tensor product:
$$|\psi\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$

This is the famous **Bell state** - maximally entangled!

### N-Qubit Systems

| Qubits | Basis States | Vector Size |
|--------|--------------|-------------|
| 1 | 2 | 2 |
| 2 | 4 | 4 |
| 3 | 8 | 8 |
| n | $2^n$ | $2^n$ |

**Example 3-qubit state:**
$$|\psi\rangle = \alpha_{000}|000\rangle + \alpha_{001}|001\rangle + ... + \alpha_{111}|111\rangle$$

(8 complex amplitudes needed!)

---

## Bra-Ket Notation in Detail

### Ket: $|\psi\rangle$
A **column vector** representing a quantum state:
$$|\psi\rangle = \begin{bmatrix} \alpha \\ \beta \end{bmatrix}$$

### Bra: $\langle\psi|$
A **row vector** (complex conjugate transpose of ket):
$$\langle\psi| = \begin{bmatrix} \alpha^* & \beta^* \end{bmatrix}$$

Where $*$ denotes complex conjugate.

### Inner Product: $\langle\phi|\psi\rangle$

Measures "overlap" between states:

$$\langle\phi|\psi\rangle = \begin{bmatrix} \phi_0^* & \phi_1^* \end{bmatrix} \begin{bmatrix} \psi_0 \\ \psi_1 \end{bmatrix} = \phi_0^*\psi_0 + \phi_1^*\psi_1$$

**Result:** A complex number

### Examples

#### Orthogonal States
$$\langle 0|1\rangle = \begin{bmatrix} 1 & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = 0$$

$|0\rangle$ and $|1\rangle$ are **orthogonal** (perpendicular).

#### Normalization
$$\langle\psi|\psi\rangle = |\alpha|^2 + |\beta|^2 = 1$$

For a normalized state.

#### Probability of Measurement
If system is in state $|\psi\rangle$, probability of measuring it in state $|\phi\rangle$ is:

$$P = |\langle\phi|\psi\rangle|^2$$

### Outer Product: $|\psi\rangle\langle\phi|$

Creates a **matrix** (operator):

$$|\psi\rangle\langle\phi| = \begin{bmatrix} \psi_0 \\ \psi_1 \end{bmatrix} \begin{bmatrix} \phi_0^* & \phi_1^* \end{bmatrix} = \begin{bmatrix} \psi_0\phi_0^* & \psi_0\phi_1^* \\ \psi_1\phi_0^* & \psi_1\phi_1^* \end{bmatrix}$$

**Used for:** Projection operators, density matrices

---

## Common Quantum States (Reference)

### Computational Basis
$$|0\rangle = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \quad |1\rangle = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

### Hadamard Basis
$$|+\rangle = \frac{1}{\sqrt{2}}(|0\rangle + |1\rangle) = \begin{bmatrix} \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} \end{bmatrix}$$

$$|-\rangle = \frac{1}{\sqrt{2}}(|0\rangle - |1\rangle) = \begin{bmatrix} \frac{1}{\sqrt{2}} \\ -\frac{1}{\sqrt{2}} \end{bmatrix}$$

### Circular Basis
$$|i\rangle = \frac{1}{\sqrt{2}}(|0\rangle + i|1\rangle) = \begin{bmatrix} \frac{1}{\sqrt{2}} \\ \frac{i}{\sqrt{2}} \end{bmatrix}$$

$$|-i\rangle = \frac{1}{\sqrt{2}}(|0\rangle - i|1\rangle) = \begin{bmatrix} \frac{1}{\sqrt{2}} \\ -\frac{i}{\sqrt{2}} \end{bmatrix}$$

### Bell States (Entangled)
$$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$
$$|\Phi^-\rangle = \frac{1}{\sqrt{2}}(|00\rangle - |11\rangle)$$
$$|\Psi^+\rangle = \frac{1}{\sqrt{2}}(|01\rangle + |10\rangle)$$
$$|\Psi^-\rangle = \frac{1}{\sqrt{2}}(|01\rangle - |10\rangle)$$

---

## Practice Problems

### Problem 1: Normalization
Is this a valid quantum state? $|\psi\rangle = \frac{1}{2}|0\rangle + \frac{1}{2}|1\rangle$

<details>
<summary>Solution</summary>

Check: $|\frac{1}{2}|^2 + |\frac{1}{2}|^2 = \frac{1}{4} + \frac{1}{4} = \frac{1}{2} \neq 1$

**No!** Not normalized. Should be $|\psi\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle$
</details>

### Problem 2: Measurement Probability
For $|\psi\rangle = \frac{2}{3}|0\rangle + \frac{\sqrt{5}}{3}|1\rangle$, what's the probability of measuring 1?

<details>
<summary>Solution</summary>

$$P(1) = \left|\frac{\sqrt{5}}{3}\right|^2 = \frac{5}{9} \approx 0.556$$

About 55.6% chance.
</details>

### Problem 3: Inner Product
Calculate $\langle +|0\rangle$

<details>
<summary>Solution</summary>

$$\langle +| = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \end{bmatrix}$$
$$|0\rangle = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$
$$\langle +|0\rangle = \frac{1}{\sqrt{2}}(1 \cdot 1 + 1 \cdot 0) = \frac{1}{\sqrt{2}}$$

Probability: $\left|\frac{1}{\sqrt{2}}\right|^2 = \frac{1}{2}$ (50%)
</details>

### Problem 4: Tensor Product
Calculate $|1\rangle \otimes |+\rangle$

<details>
<summary>Solution</summary>

$$|1\rangle \otimes |+\rangle = |1\rangle \otimes \frac{1}{\sqrt{2}}(|0\rangle + |1\rangle)$$
$$= \frac{1}{\sqrt{2}}(|10\rangle + |11\rangle)$$
$$= \frac{1}{\sqrt{2}}\begin{bmatrix} 0 \\ 0 \\ 1 \\ 1 \end{bmatrix}$$
</details>

---

## Key Takeaways 🎯

1. ✅ Quantum states are **complex vectors** with normalization constraint
2. ✅ **Probability amplitudes** are complex; probabilities are their squared magnitudes
3. ✅ **Bloch sphere** visualizes single-qubit states geometrically
4. ✅ **Relative phase** matters; **global phase** doesn't
5. ✅ Multiple qubits use **tensor products** to combine states
6. ✅ **Bra-ket notation** is compact mathematical language for quantum states
7. ✅ **Entangled states** cannot be factored into tensor products

---

## What's Next?

In **Part 3: Quantum Gates & Circuits**, we'll learn:
- How to manipulate qubits with quantum gates
- Building quantum circuits
- Common gates (X, Y, Z, H, CNOT)
- Universal gate sets

---

## Quick Reference

### Must Remember Formulas

| Concept | Formula |
|---------|---------|
| **Qubit state** | $\|\psi\rangle = \alpha\|0\rangle + \beta\|1\rangle$ |
| **Normalization** | $\|\alpha\|^2 + \|\beta\|^2 = 1$ |
| **Probability** | $P = \|\text{amplitude}\|^2$ |
| **Inner product** | $\langle\phi\|\psi\rangle = \phi_0^*\psi_0 + \phi_1^*\psi_1$ |
| **Tensor product** | $\|a\rangle \otimes \|b\rangle = \|ab\rangle$ |
| **Bloch sphere** | $\|\psi\rangle = \cos(\theta/2)\|0\rangle + e^{i\phi}\sin(\theta/2)\|1\rangle$ |

---

**Keep going!** The math might seem heavy, but with practice it becomes second nature. Move to Part 3 when ready! 🚀

