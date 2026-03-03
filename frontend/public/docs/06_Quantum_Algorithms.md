# Part 6: Quantum Algorithms

## Famous Quantum Algorithms You Should Know

Understanding key quantum algorithms will help you appreciate what's possible and inspire your QML work!

---

## Table of Contents
1. [Deutsch-Jozsa Algorithm](#deutsch-jozsa-algorithm)
2. [Grover's Search Algorithm](#grovers-search-algorithm)
3. [Quantum Fourier Transform](#quantum-fourier-transform)
4. [Shor's Factoring Algorithm](#shors-factoring-algorithm)
5. [Quantum Phase Estimation](#quantum-phase-estimation)
6. [Quantum Simulation](#quantum-simulation)
7. [Algorithms Summary](#algorithms-summary)

---

## Deutsch-Jozsa Algorithm

### The Problem

**Given:** A black-box function $f: \\{0,1\\}^n \to \\{0,1\\}$

**Promise:** $f$ is either:
- **Constant**: All outputs same (all 0 or all 1)
- **Balanced**: Half outputs 0, half outputs 1

**Question:** Which is it?

### Classical Solution

**Need to check:** $2^{n-1} + 1$ inputs in worst case

**Example (n=3):**
```
Try: f(000), f(001), f(010), f(011), f(100)
If all same so far → might still be balanced!
Need one more to be sure.
```

### Quantum Solution

**Queries needed:** Just **1** quantum query! 🎉

**Quantum Speedup:** Exponential! ($2^{n-1}$ vs 1)

---

### How It Works

**Circuit:**
```
|0⟩⊗ⁿ ──H⊗ⁿ──┤      ├──H⊗ⁿ──┤M├
             │  Uf  │
|1⟩ ────H────┤      ├──────────┼──
             └──────┘
```

**Steps:**

1. **Initialize:** $|0\rangle^{\otimes n} |1\rangle$

2. **Apply Hadamard to all:**
   $$\frac{1}{\sqrt{2^n}} \sum_{x} |x\rangle \left(\frac{|0\rangle - |1\rangle}{\sqrt{2}}\right)$$
   (Superposition of ALL inputs!)

3. **Apply oracle $U_f$:**
   $$U_f|x\rangle|y\rangle = |x\rangle|y \oplus f(x)\rangle$$

4. **Apply Hadamard again**

5. **Measure first n qubits:**
   - All zeros → **Constant**
   - Anything else → **Balanced**

---

### Why It Works (Intuition)

**Key Idea:** Quantum interference!

```
Constant function:
All paths interfere constructively → |00...0⟩

Balanced function:  
Paths interfere destructively → other states
```

**This is your first quantum speedup!** 🌟

---

## Grover's Search Algorithm

### The Problem

**Given:** Unsorted database of N items

**Goal:** Find the one item that satisfies a condition

**Visual:**
```
Database: [?, ?, ?, ?, ★, ?, ?, ?]
Find: The ★
```

### Classical Solution

**Best strategy:** Check items one by one

**Time:** O(N) - need to check ~N/2 items on average

**Example:** 1 million items → ~500,000 checks

### Quantum Solution

**Time:** $O(\sqrt{N})$ queries! 

**Example:** 1 million items → ~1,000 quantum queries!

**Speedup:** Quadratic (not exponential, but still amazing!)

---

### How It Works

**Circuit (conceptual):**
```
|0⟩⊗ⁿ ──H⊗ⁿ──┤Grover Operator├──┤Grover Operator├──...──┤M├
             │    (repeat √N    │  times)
             └───────────────────┘
```

**Grover Operator = Oracle + Diffusion**

---

### Grover's Algorithm Steps

**1. Initialization**
```
|ψ⟩ = H⊗ⁿ|0⟩⊗ⁿ = |s⟩ (Equal superposition)
    = 1/√N ∑ₓ |x⟩
```

**2. Oracle (marks the solution)**
```
O|x⟩ = {  -|x⟩  if x is solution
       {   |x⟩  otherwise

Flips phase of solution!
```

**3. Diffusion Operator (amplifies amplitude)**
```
D = 2|s⟩⟨s| - I

Inverts amplitude about average
```

**4. Repeat Grover Operator ~√N times**

**5. Measure → Get solution with high probability!**

---

### Geometric Picture

**Think of it as rotation in 2D space:**

```
    |solution⟩
         ↑
         |  After ~√N rotations
         | /
         |/_____ θ  
         |         
    ─────┴───────→ |other states⟩
Start: |s⟩ (equal superposition)
```

Each Grover iteration rotates by angle $\theta$ toward solution!

**After $\frac{\pi}{4}\sqrt{N}$ iterations:** Aligned with solution ✓

---

### Example: 4-Item Search

**Database:** [A, B, C, D], find C

**Circuit:**
```python
# 2 qubits (2²=4 items)
|00⟩ ──H──H──┤Oracle├──┤Diffusion├──┤M├
|00⟩          (mark C)   (amplify)
```

**Iterations needed:** $\approx \frac{\pi}{4}\sqrt{4} = 1$ iteration

**Result:** Measure 10 (binary for C) with ~100% probability!

---

### Applications

- **Database search**
- **SAT solving** (Boolean satisfiability)
- **Combinatorial optimization**
- **Cryptography** (breaking symmetric encryption)
- **Machine learning** (training speedups)

---

## Quantum Fourier Transform

### Classical Fourier Transform

**Converts:** Time domain ↔ Frequency domain

$$\tilde{x}_k = \frac{1}{\sqrt{N}} \sum_{j=0}^{N-1} x_j e^{2\pi i jk/N}$$

**Classical complexity:** O(N log N) with FFT

### Quantum Fourier Transform (QFT)

**Acts on quantum state:**

$$\text{QFT}|j\rangle = \frac{1}{\sqrt{N}} \sum_{k=0}^{N-1} e^{2\pi i jk/N} |k\rangle$$

**Quantum complexity:** O(log² N) gates! 🚀

**Example (3 qubits, N=8):**
```
|j⟩ = |5⟩ = |101⟩
      ↓ QFT
1/√8 (|0⟩ + ω⁵|1⟩ + ω¹⁰|2⟩ + ... + ω³⁵|7⟩)

Where ω = e^(2πi/8) (8th root of unity)
```

---

### QFT Circuit (3 qubits)

```
|j₀⟩ ──H──●────●──────────╳──────
          │    │          │      
|j₁⟩ ─────R₂───┼──H──●────┼──╳───
               │     │    │  │   
|j₂⟩ ──────────R₃────R₂───H──┼───
                             │   
```

**Gates used:**
- H: Hadamard
- Rₖ: Controlled phase rotation by 2π/2^k
- SWAP: Bit reversal

**Depth:** O(n²) for n qubits
**Gates:** O(n²)

---

### Why QFT Matters

**Not useful alone** (can't extract all amplitudes efficiently)

**But crucial component in:**
1. **Shor's algorithm** (factoring)
2. **Quantum phase estimation**
3. **Quantum algorithms for finding periods**

**Think of it as:** A subroutine in larger algorithms

---

## Shor's Factoring Algorithm

### The Problem

**Given:** Large number N (e.g., 100 digits)

**Goal:** Find prime factors (N = p × q)

**Example:** 
```
N = 15
Factors: 3 × 5
```

**Why important?** RSA encryption relies on this being hard!

---

### Classical Difficulty

**Best classical algorithm:** General Number Field Sieve

**Time:** $\exp(1.9 (\ln N)^{1/3} (\ln \ln N)^{2/3})$

**For 2048-bit number:** Billions of years!

---

### Quantum Solution (Shor's Algorithm)

**Time:** O((log N)² log log N log log log N)

**Polynomial!** 🎉

**For 2048-bit number:** Hours/days (with large quantum computer)

**This broke RSA cryptography** (in principle)!

---

### How Shor's Algorithm Works

**High-level steps:**

```
1. Reduce factoring to PERIOD FINDING
   (Classical reduction)
   
2. Use QUANTUM PERIOD FINDING
   (Quantum part - the speedup!)
   
3. Extract factors from period
   (Classical computation)
```

---

### Period Finding (Quantum Part)

**Goal:** Find period $r$ where $a^r \equiv 1 \pmod{N}$

**Circuit:**
```
|0⟩⊗ⁿ ──H⊗ⁿ──┤  Modular  ├──QFT†──┤M├
             │Exponentiation│
|0⟩⊗ᵐ ───────┤  (Uf)      ├─────────┼──
             └────────────┘
```

**Steps:**

1. **Superposition:** Create $\frac{1}{\sqrt{2^n}}\sum_x |x\rangle|0\rangle$

2. **Modular exponentiation:** $|x\rangle|0\rangle \to |x\rangle|a^x \bmod N\rangle$

3. **QFT on first register**

4. **Measure → extract period r**

5. **Compute factors:** $\gcd(a^{r/2} \pm 1, N)$

---

### Example: Factor 15

**Step 1:** Choose random a = 7 (coprime to 15)

**Step 2:** Find period of $7^x \bmod 15$:
```
7¹ mod 15 = 7
7² mod 15 = 4
7³ mod 15 = 13
7⁴ mod 15 = 1  ← Period r = 4!
```

**Step 3:** Compute factors:
```
gcd(7^(4/2) - 1, 15) = gcd(49-1, 15) = gcd(48, 15) = 3 ✓
gcd(7^(4/2) + 1, 15) = gcd(49+1, 15) = gcd(50, 15) = 5 ✓
```

**15 = 3 × 5** Found! 🎉

---

### Requirements for Shor's Algorithm

**Qubits needed:** ~2 log₂(N)

**For 2048-bit RSA:** ~4096 qubits

**Current devices:** ~100 qubits

**Gap:** Need ~40× more qubits + error correction!

**Status:** Mathematically proven, but not yet practical

---

## Quantum Phase Estimation

### What is QPE?

**Given:** 
- Unitary operator U
- Eigenstate $|u\rangle$ of U ($U|u\rangle = e^{2\pi i \theta}|u\rangle$)

**Goal:** Estimate phase $\theta$

---

### Why Important?

**QPE is the foundation for:**
- Many quantum algorithms
- Quantum chemistry (finding energies)
- Quantum machine learning

**It's like the "matrix diagonalization" of quantum computing!**

---

### QPE Circuit

```
|0⟩ ──H──●──────────────────QFT†──┤M├
         │                         ↓
|0⟩ ──H──┼──●───────────────QFT†──┤M├  → Estimate of θ
         │  │                      ↓
|0⟩ ──H──┼──┼──●──────────────────┤M├
         │  │  │
|u⟩ ─────U──U²─U⁴─... (controlled gates)
```

**Output:** Binary representation of θ

---

### How QPE Works

**1. Prepare superposition**
$$\frac{1}{\sqrt{2^n}} \sum_{j=0}^{2^n-1} |j\rangle |u\rangle$$

**2. Apply controlled-U gates**
$$\frac{1}{\sqrt{2^n}} \sum_{j=0}^{2^n-1} e^{2\pi i \theta j} |j\rangle |u\rangle$$

**3. Apply inverse QFT**

**4. Measure → get $\theta$ with high precision**

**Precision:** n qubits → estimate θ to n bits of precision

---

### Application: Finding Eigenvalues

**Quantum Chemistry Example:**

```
Molecule: H₂ (Hydrogen)
Hamiltonian: H (energy operator)
Problem: Find ground state energy E₀

Solution:
1. Prepare approximate ground state |ψ₀⟩
2. Use QPE to find eigenvalue of e^(-iHt)
3. Extract energy: E₀ = eigenvalue/t
```

**This is the basis of VQE and quantum simulation!**

---

## Quantum Simulation

### The Motivation

**Richard Feynman (1982):**
> "Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical."

**Problem:** Simulating n quantum particles on classical computer:
- State space: $2^n$ dimensions
- 30 particles: 1 billion dimensions!
- 300 particles: More than atoms in universe!

**Solution:** Use quantum computer to simulate quantum systems!

---

### What Can We Simulate?

1. **Molecular dynamics** (drug discovery)
2. **Material properties** (superconductors, batteries)
3. **Chemical reactions** (catalysis)
4. **Quantum field theories** (particle physics)

---

### Time Evolution Simulation

**Goal:** Simulate $|\psi(t)\rangle = e^{-iHt}|\psi(0)\rangle$

Where H is the Hamiltonian (energy operator)

**Challenge:** $e^{-iHt}$ is generally complicated!

---

### Trotter Decomposition

**If** $H = H_1 + H_2 + ... + H_m$

**Then:**
$$e^{-iHt} \approx \left(e^{-iH_1t/n}e^{-iH_2t/n}...e^{-iH_mt/n}\right)^n$$

**Becomes exact as** $n \to \infty$

**Each piece** $e^{-iH_j t/n}$ **is easy to implement!**

---

### Example: Hydrogen Molecule

**Hamiltonian:**
$$H = \sum_i Z_i + \sum_{i<j} XX_{ij} + YY_{ij} + ZZ_{ij}$$

**Circuit:**
```python
# Each term becomes a gate sequence:
for term in H:
    if term == 'Z_i':
        RZ(coeff * t, qubit_i)
    elif term == 'XX_ij':
        # XX interaction
        CNOT(i, j)
        RX(coeff * t, j)
        CNOT(i, j)
    # ... etc
```

**Repeat this sequence many times → simulation!**

---

### Variational Quantum Eigensolver (VQE)

**Hybrid approach to find ground state:**

```
1. Prepare trial state |ψ(θ)⟩ (variational circuit)

2. Measure energy: E(θ) = ⟨ψ(θ)|H|ψ(θ)⟩

3. Classical optimizer: minimize E(θ) by adjusting θ

4. Converge to ground state and ground energy!
```

**Advantages:**
- Shallow circuits (less noise!)
- Near-term quantum computers
- Already used in industry!

---

## Algorithms Summary

### Comparison Table

| Algorithm | Problem | Classical | Quantum | Speedup Type | Practical? |
|-----------|---------|-----------|---------|--------------|------------|
| **Deutsch-Jozsa** | Constant vs Balanced | O(2ⁿ) | O(1) | Exponential | Toy example |
| **Grover** | Unstructured search | O(N) | O(√N) | Quadratic | Promising |
| **Shor** | Factoring | Exponential | Polynomial | Exponential | Future (needs 1000s qubits) |
| **QFT** | Fourier transform | O(N log N) | O(log² N) | Exponential | Subroutine only |
| **QPE** | Phase estimation | Hard/Impossible | O(log 1/ε) | Exponential | Chemistry, ML |
| **VQE** | Ground state | Exponential | Polynomial | Exponential | **Yes! (NISQ)** |
| **QAOA** | Optimization | Exponential | Polynomial* | Unclear | **Yes! (NISQ)** |

*For certain problem classes

---

### Algorithm Categories

#### 1. Speedup Algorithms
- **Grover**: Search
- **Shor**: Factoring
- Speed up classical tasks

#### 2. Quantum Simulation
- **VQE**: Chemistry
- **Time evolution**: Dynamics
- Solve quantum problems

#### 3. Machine Learning
- **QSVM**: Classification
- **VQC**: Neural networks
- Hybrid quantum-classical

---

### When Each Algorithm Helps

```
Problem Type → Best Algorithm

Unstructured Search → Grover
Factoring/Periods → Shor  
Chemistry/Materials → VQE, QPE
Optimization → QAOA, VQE
Phase/Eigenvalue → QPE
ML Classification → QSVM, VQC
ML Optimization → VQE-based
Quantum Data → Direct simulation
```

---

## Key Insights

### Universal Lessons

1. **Superposition + Interference = Speedup**
   - Evaluate many paths simultaneously
   - Interfere to amplify correct answer

2. **Quantum algorithms are probabilistic**
   - Run multiple times
   - Get correct answer with high probability

3. **Not all problems get speedup**
   - Need structure to exploit
   - Grover is best for unstructured search (√N is optimal!)

4. **Hybrid is practical**
   - Quantum for hard parts
   - Classical for optimization/control

---

### The Quantum Advantage Landscape

```
Exponential Speedup:
├─ Shor (proven)
├─ Quantum Simulation (proven for certain systems)
└─ Deutsch-Jozsa (toy problem)

Polynomial Speedup:
├─ Grover (proven optimal)
└─ Some ML algorithms (conjectured)

Unclear/Problem-Dependent:
├─ QAOA (active research)
├─ VQC (depends on data)
└─ Most QML algorithms
```

---

## Key Takeaways 🎯

1. ✅ **Deutsch-Jozsa** shows quantum can be exponentially faster (first example)
2. ✅ **Grover** provides quadratic speedup for search (proven optimal)
3. ✅ **Shor** can break RSA encryption (with large quantum computer)
4. ✅ **QFT** is polynomial speedup but not standalone useful
5. ✅ **QPE** estimates phases - crucial for chemistry and ML
6. ✅ **VQE** and **QAOA** work on **today's noisy quantum computers**
7. ✅ **Quantum simulation** is natural fit for quantum computers

---

## What's Next?

In **Part 7: Programming with Qiskit**, we'll finally write code!
- Installing Qiskit
- Creating quantum circuits
- Running simulations
- Implementing algorithms from this guide

---

## Algorithm Cheat Sheet

```python
# Deutsch-Jozsa (constant vs balanced)
H_all() → Oracle → H_all() → Measure
Result: |00...0⟩ = constant, else balanced

# Grover (search)
H_all() → (Oracle → Diffusion)^√N → Measure
Result: Solution state with high probability

# QFT (frequency analysis)  
H + Controlled-Rotations + SWAP
Used in: Shor, QPE, many others

# Shor (factoring)
Modular_Exp → QFT → Measure → Classical_Post_Process
Result: Factors of N

# QPE (eigenvalues)
Controlled-U^2^k → QFT† → Measure
Result: Phase (eigenvalue) of U

# VQE (ground state)
Ansatz(θ) → Measure → Classical_Optimize(θ) → Repeat
Result: Ground state energy
```

---

**Amazing!** You now understand the major quantum algorithms. Time to code them! 🚀

