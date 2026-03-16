# 1.2 – Classical Genetic Algorithms — Theory & Implementation

## Evolutionary Optimization from First Principles

Genetic Algorithms (GAs) are population-based optimization methods inspired by natural selection. They are the classical precursor to Quantum Genetic Algorithms and are essential for understanding hybrid quantum-classical optimization.

---

## Table of Contents

1. [Evolutionary Computation Taxonomy](#evolutionary-computation-taxonomy)
2. [The Biological Analogy](#the-biological-analogy)
3. [GA Components](#ga-components)
4. [Representation Schemes](#representation-schemes)
5. [Selection Operators](#selection-operators)
6. [Crossover Operators](#crossover-operators)
7. [Mutation Operators](#mutation-operators)
8. [GA Convergence Theory](#ga-convergence-theory)
9. [Premature Convergence and Diversity](#premature-convergence-and-diversity)
10. [Parameter Tuning](#parameter-tuning)
11. [Constraint Handling](#constraint-handling)

---

## Evolutionary Computation Taxonomy

**Evolutionary Computation (EC)** is a family of population-based metaheuristics that use mechanisms inspired by biological evolution. All members share a common loop: evaluate, select, reproduce, repeat.

### The Family Tree

| Method | Abbreviation | Year | Representation | Key Operators |
|--------|-------------|------|----------------|---------------|
| **Genetic Algorithm** | GA | 1960s (Holland) | Binary / real / permutation | Crossover, mutation, selection |
| **Genetic Programming** | GP | 1992 (Koza) | Tree (programs) | Subtree crossover, mutation |
| **Evolution Strategy** | ES | 1960s (Rechenberg) | Real-valued vectors | Gaussian mutation, self-adaptation |
| **Differential Evolution** | DE | 1995 (Storn & Price) | Real-valued vectors | Differential mutation, crossover |
| **Particle Swarm Optimization** | PSO | 1995 (Kennedy & Eberhart) | Real-valued positions | Velocity update, no crossover |

### Key Distinctions

**Genetic Algorithm (GA):**
- Historically binary; modern variants use any representation
- Emphasizes crossover as primary search operator
- Selection pressure drives improvement

**Evolution Strategy (ES):**
- Works with real-valued parameters and self-adapted strategy parameters
- $(\mu, \lambda)$-ES: select $\mu$ parents, generate $\lambda > \mu$ offspring, keep best $\mu$
- $(\mu + \lambda)$-ES: pool parents and offspring, keep best $\mu$

**Differential Evolution (DE):**
For population member $\mathbf{x}_i$, create mutant vector:
$$\mathbf{v}_i = \mathbf{x}_{r_1} + F \cdot (\mathbf{x}_{r_2} - \mathbf{x}_{r_3})$$
where $r_1, r_2, r_3$ are distinct random indices and $F \in [0, 2]$ is the scale factor. Then apply crossover and selection.

**Particle Swarm Optimization (PSO):**
Each particle has position $\mathbf{x}_i$ and velocity $\mathbf{v}_i$, updated by:
$$\mathbf{v}_i(t+1) = \omega\mathbf{v}_i(t) + c_1 r_1(\mathbf{p}_i - \mathbf{x}_i(t)) + c_2 r_2(\mathbf{g} - \mathbf{x}_i(t))$$
$$\mathbf{x}_i(t+1) = \mathbf{x}_i(t) + \mathbf{v}_i(t+1)$$
where $\mathbf{p}_i$ is the particle's personal best, $\mathbf{g}$ is the global best, $\omega$ is inertia weight, and $c_1, c_2$ are acceleration coefficients.

---

## The Biological Analogy

### From Biology to Algorithm

| Biological Concept | GA Equivalent |
|--------------------|--------------|
| **Population** | Set of candidate solutions |
| **Individual / Organism** | A single candidate solution |
| **Chromosome** | Encoding of a solution (e.g., a bitstring) |
| **Gene** | A single position/element in the chromosome |
| **Allele** | The value at a gene position |
| **Genotype** | The encoded representation |
| **Phenotype** | The decoded, evaluated solution |
| **Fitness** | Quality/objective value of a solution |
| **Selection** | Survival of the fittest |
| **Crossover (recombination)** | Sexual reproduction |
| **Mutation** | Random genetic variation |
| **Generation** | One iteration of the GA loop |

### The Fitness Landscape

The **fitness landscape** is a conceptual surface where:
- Each point represents a possible solution (position in search space)
- Height represents fitness value

**Types of landscapes:**
- **Unimodal:** One global optimum; easy for any optimizer
- **Multimodal:** Multiple local optima; challenging; GAs excel here
- **Rugged:** Many peaks of similar height; very challenging
- **Deceptive:** Local optima are far from global optimum in genotype space

A landscape is **NK landscape** if it has $N$ bits with $K$ epistatic interactions per bit. More epistasis ($K \uparrow$) creates a more rugged landscape.

---

## GA Components

### The Standard GA Loop

```
1. INITIALIZE population P of size N (random or heuristic)
2. EVALUATE fitness f(x) for each x in P
3. REPEAT until termination condition:
   a. SELECT parents from P using selection operator
   b. RECOMBINE parents via crossover → offspring
   c. MUTATE offspring (with probability pm)
   d. EVALUATE fitness of offspring
   e. REPLACE old population with new generation
4. RETURN best individual found
```

### Population Initialization

**Random initialization:**
```python
import numpy as np

def init_population(pop_size, chrom_length):
    """Binary random initialization"""
    return np.random.randint(0, 2, size=(pop_size, chrom_length))
```

**Heuristic initialization:** Seed with known good solutions to warm-start.

**Diversity constraint:** Ensure initial population covers the search space broadly — poor initialization leads to premature convergence.

### Fitness Evaluation

The **fitness function** $f: \mathcal{X} \rightarrow \mathbb{R}$ maps each individual to a scalar quality measure.

For **maximization** problems: higher fitness = better.
For **minimization** problems: common to negate or use $f'(x) = 1/(1 + f(x))$.

The fitness function must be:
- **Computable** in feasible time
- **Discriminatory** — different solutions should have different fitness where possible
- **Aligned** with the true objective

### Fitness Scaling

Raw fitness values may make selection ineffective:
- **Linear scaling:** $f'(x) = af(x) + b$ to spread fitness values
- **Rank-based:** Replace fitness with rank to avoid super-individuals dominating
- **Sigma truncation:** $f'(x) = \max(0, f(x) - (\bar{f} - c\sigma_f))$

---

## Representation Schemes

### 1. Binary Encoding

The classic GA representation. Each chromosome is a bitstring of length $\ell$:

$$\mathbf{x} = (x_1, x_2, \ldots, x_\ell), \quad x_i \in \{0, 1\}$$

**Pros:** Simple, well-understood theoretically (schema theorem applies directly)
**Cons:** Hamming cliffs, unnatural for continuous problems

**Gray coding** eliminates Hamming cliffs: adjacent integers differ by only 1 bit.

Standard: $3 = 011$, Gray: $3 = 010$

For continuous variable $x \in [a, b]$ with $\ell$ bits:
$$x = a + (b - a) \cdot \frac{\sum_{i=0}^{\ell-1} g_i \cdot 2^i}{2^\ell - 1}$$
where $g_i$ are the Gray-decoded bits.

### 2. Real-Valued (Floating-Point) Encoding

Each gene is a real number. Chromosome is a vector $\mathbf{x} \in \mathbb{R}^n$:

$$\mathbf{x} = (x_1, x_2, \ldots, x_n), \quad x_i \in [l_i, u_i]$$

**Pros:** Natural for continuous optimization, no loss of precision
**Cons:** Requires specialized crossover/mutation operators

### 3. Permutation Encoding

Used for ordering/sequencing problems (Travelling Salesman, job scheduling):

$$\mathbf{x} = (\pi_1, \pi_2, \ldots, \pi_n)$$

where $(\pi_1, \ldots, \pi_n)$ is a permutation of $\{1, \ldots, n\}$.

**Requires:** Special crossover (PMX, OX) and mutation (swap, inversion) operators that preserve the permutation property.

### 4. Tree-Based Encoding (Genetic Programming)

Individuals are **parse trees** representing programs, formulas, or decision rules:

```
       (×)
      /   \
    (+)    x₂
   /   \
  x₁    3.14
```

This encodes: $(x_1 + 3.14) \times x_2$

**Crossover:** Swap subtrees between two parent trees
**Mutation:** Replace a subtree with a randomly generated one

---

## Selection Operators

Selection determines which individuals reproduce. It creates **selection pressure** toward higher-fitness individuals.

### 1. Roulette-Wheel Selection (Fitness-Proportionate)

Each individual $i$ is assigned a selection probability proportional to its fitness:

$$P(i) = \frac{f(i)}{\sum_{j=1}^{N} f(j)}$$

A random number $r \in [0, 1)$ selects the individual whose cumulative probability interval contains $r$.

**Advantages:** Simple; individuals always have a chance (no zero probability)
**Disadvantages:** Highly sensitive to scaling — a single super-individual can dominate; poor when fitness values are close together

### 2. Tournament Selection

Pick $k$ individuals uniformly at random; select the best from the $k$-tournament:

```python
def tournament_selection(population, fitness, k=3):
    """Select one individual via k-tournament"""
    candidates = np.random.choice(len(population), k, replace=False)
    winner = candidates[np.argmax(fitness[candidates])]
    return population[winner]
```

**Selection pressure** increases with $k$:
- $k=1$: random selection (no pressure)
- $k=N$: always pick the current best (maximum pressure)

**Advantages:** No need for fitness scaling; adjustable pressure; efficient ($O(k)$)
**Disadvantages:** None of the non-winners survive (unlike roulette)

### 3. Rank-Based Selection

Individuals are sorted by fitness and assigned selection probabilities based on **rank** $r_i$:

$$P(i) = \frac{2r_i}{N(N+1)}$$

(Linear ranking; rank 1 = worst, rank N = best)

**Advantages:** Immune to scaling issues; prevents super-individuals; always gives diversity
**Disadvantages:** Loses fitness magnitude information

### 4. Steady-State Selection

Instead of replacing the entire population each generation:
1. Select 2 parents, produce 1–2 offspring
2. Replace the worst member(s) of the current population with offspring (if better)

**Effect:** More gradual replacement; populations overlap between generations; reduces genetic drift

---

## Crossover Operators

**Crossover** (recombination) combines genetic material from two parent chromosomes to produce offspring. The crossover rate $p_c \in [0.6, 0.9]$ is the probability of applying crossover.

### 1. One-Point Crossover

Select a random crossover point $k$. Offspring receive one segment from each parent:

```
Parent 1:  1 0 1 | 1 0 0 1
Parent 2:  0 1 0 | 0 1 1 0

Child 1:   1 0 1 | 0 1 1 0
Child 2:   0 1 0 | 1 0 0 1
```

**Limitation:** Genes at the ends of the chromosome are always inherited together (no mixing across distant positions).

### 2. Two-Point Crossover

Select two crossover points $k_1 < k_2$. Middle segment swaps:

```
Parent 1:  1 0 | 1 1 0 | 0 1
Parent 2:  0 1 | 0 0 1 | 1 0

Child 1:   1 0 | 0 0 1 | 0 1
Child 2:   0 1 | 1 1 0 | 1 0
```

**Improvement:** Eliminates positional bias; genes can mix from both ends.

### 3. Uniform Crossover

Each gene is independently inherited from either parent with probability 0.5:

```
Parent 1:  1 0 1 1 0 0 1
Parent 2:  0 1 0 0 1 1 0
Mask:      1 0 1 0 1 0 1   (random)

Child 1:   1 1 1 0 1 1 1   (1 from P1, 0 from P2)
Child 2:   0 0 0 1 0 0 0
```

**Advantage:** No positional bias at all; maximum mixing
**Disadvantage:** Can be disruptive — may break good schemata

### 4. Arithmetic Crossover (for real-valued chromosomes)

Offspring are **linear combinations** of parents:

$$\mathbf{c}_1 = \alpha \mathbf{p}_1 + (1-\alpha)\mathbf{p}_2$$
$$\mathbf{c}_2 = (1-\alpha)\mathbf{p}_1 + \alpha \mathbf{p}_2$$

where $\alpha \in [0, 1]$ (often $\alpha = 0.5$ for simple averaging).

**Whole arithmetic crossover:** Apply same $\alpha$ to all genes.
**Local arithmetic crossover:** Choose different $\alpha_i$ per gene.

### 5. PMX — Partially Mapped Crossover (for permutations)

PMX preserves the permutation structure:

```
Parent 1:  1 2 3 | 4 5 6 | 7 8 9
Parent 2:  4 5 2 | 1 8 7 | 6 9 3

Step 1: Copy middle segment from P2 to Child 1
Child 1:   _ _ _ | 1 8 7 | _ _ _

Step 2: Map remaining using the segment mapping
 (4→1, 5→8, 6→7 from corresponding positions)
 P1 position 1: 1 → mapped to 4 (since 1 already in segment) → 4 OK
 ...

Child 1:   3 2 4 | 1 8 7 | 6 9 5
```

PMX guarantees offspring are valid permutations and preserves relative positions of mapped elements.

### 6. OX — Order Crossover (for permutations)

OX preserves the relative **order** of elements:

```
Parent 1:  1 2 3 | 4 5 6 | 7 8 9
Parent 2:  4 5 2   1 8 7   6 9 3

Step 1: Copy middle segment from P1 to Child 1
Child 1:   _ _ _ | 4 5 6 | _ _ _

Step 2: Fill remaining positions in P2 order (starting after cut):
P2 order (after 2nd cut):  6 9 3 4 5 2 1 8 7
Remove already used (4,5,6): 9 3 2 1 8 7

Child 1:   9 3 2 | 4 5 6 | 1 8 7
```

OX is widely used for TSP and scheduling.

---

## Mutation Operators

**Mutation** introduces random changes to maintain diversity and explore new regions. The mutation rate $p_m \in [0.001, 0.1]$ is typically low.

### 1. Bit-Flip Mutation (Binary)

Each bit is independently flipped with probability $p_m$:

```
Before: 1 0 1 1 0 0 1
After:  1 0 0 1 0 1 1  (bits 3 and 6 flipped)
```

Expected number of flips: $\ell \cdot p_m$ (where $\ell$ = chromosome length).
Common setting: $p_m = 1/\ell$ (one flip per chromosome on average).

### 2. Gaussian Mutation (Real-Valued)

Add Gaussian noise to each gene:

$$x_i' = x_i + \mathcal{N}(0, \sigma^2)$$

Afterwards, clip to $[l_i, u_i]$ if needed.

The step size $\sigma$ controls exploration vs. exploitation:
- Large $\sigma$: broad exploration, may miss narrow optima
- Small $\sigma$: fine-tuning, may get stuck

**Self-adaptive mutation** (Evolution Strategy style): evolve $\sigma$ alongside the solution:

$$\sigma' = \sigma \cdot e^{\tau \mathcal{N}(0,1)}$$

where $\tau \propto 1/\sqrt{n}$ is the learning rate.

### 3. Swap Mutation (Permutations)

Randomly choose two positions and swap their values:

```
Before: 3 1 4 1 5 9 2 6
After:  3 9 4 1 5 1 2 6  (positions 2 and 6 swapped)
```

Preserves permutation validity. Simple and effective for TSP.

### 4. Inversion Mutation (Permutations)

Select two positions $i < j$ and reverse the substring between them:

```
Before: 1 2 3 4 5 6 7
Invert [3..6]:
After:  1 2 6 5 4 3 7
```

Inversion preserves adjacency information — useful for route optimization where edge connectivity matters.

### 5. Scramble Mutation (Permutations)

Select a random subset of positions and randomly permute their values:

```
Before: 1 2 3 4 5 6 7
Subset positions {2, 4, 6}: values {2, 4, 6}
Scramble to {6, 2, 4}:
After:  1 6 3 2 5 4 7
```

---

## GA Convergence Theory

### The Schema Theorem

**Holland's Schema Theorem** (1975) is the foundational theoretical result of genetic algorithms.

A **schema** $H$ is a template with fixed bits and wildcards (`*`):

$$H = 1 * 0 * 1$$

This schema matches any bitstring with 1 at position 1, 0 at position 3, and 1 at position 5.

**Defining length** $\delta(H)$: distance between first and last fixed positions.

**Order** $o(H)$: number of fixed bits.

**Fitness of schema:** $\hat{f}(H, t)$ = average fitness of all individuals matching $H$ at generation $t$.

**Schema Theorem:**

$$E[m(H, t+1)] \geq m(H, t) \cdot \frac{\hat{f}(H, t)}{\bar{f}(t)} \cdot \left[1 - p_c \frac{\delta(H)}{\ell - 1} - o(H) p_m\right]$$

where:
- $m(H, t)$ = number of $H$-matching individuals at generation $t$
- $\bar{f}(t)$ = population average fitness
- The bracket term accounts for losses due to crossover and mutation

**Interpretation:** Schemata with **above-average fitness**, **short defining length**, and **low order** receive an **exponentially increasing** number of representatives.

### The Building Blocks Hypothesis

**Holland's building blocks hypothesis:** GAs work by identifying, multiplying, and recombining short, low-order, high-fitness partial solutions called **building blocks** (schemata with $\delta$ small and $o$ small).

The GA's crossover operator is supposed to combine compatible building blocks without disrupting them (if their defining lengths are short).

**Counter-arguments (No Free Lunch, deception):** The building blocks hypothesis doesn't always hold — deceptive problems exist where the building blocks of the local optima mislead the search away from the global optimum.

### The No Free Lunch Theorem

For any two algorithms $A$ and $B$, averaged over **all possible objective functions**:

$$\sum_f d(f|A) = \sum_f d(f|B)$$

No algorithm outperforms any other on all problems. GAs are superior on specific problem classes (multimodal, epistatically complex) but not universally optimal.

---

## Premature Convergence and Diversity

### Premature Convergence

**Premature convergence** occurs when the population converges to a local optimum before the global optimum is found. Causes:
- **Too high selection pressure** — best individuals dominate
- **Too small population** — genetic drift
- **Too low mutation rate** — no exploration after convergence
- **Deceptive fitness landscape** — building blocks mislead

**Detection:** Monitor population **diversity** (average pairwise Hamming distance, fitness standard deviation).

### Genetic Drift

In small populations, alleles can be **fixed** (reach frequency 100%) by random chance — not because they are optimal. This is the genetic drift problem.

**Statistical effect:** In a population of size $N$, a neutral allele has probability $1/N$ of reaching fixation. Small $N$ → rapid, uncontrolled fixation.

**Rule:** Maintain population size $N \gg$ number of distinct schemata you care about.

### Diversity Maintenance Strategies

**1. Niching — Fitness Sharing:**
Penalize similar individuals by dividing fitness by the number of neighbors:

$$f'(i) = \frac{f(i)}{\sum_{j=1}^{N} \text{sh}(d(i,j))}$$

where the sharing function $\text{sh}(d) = \max\!\left(0, 1 - (d/\sigma_{share})^\alpha\right)$ decreases with distance $d$.

**2. Crowding:**
Offspring replace the most similar individual in the population, not the weakest. Maintains multiple niches.

**3. Restricted Tournament Selection:**
When replacing a population member, compare the offspring against the $w$ most similar individuals, and replace the worst of those.

**4. Island Model (Parallel GAs):**
Run multiple sub-populations ("islands") in parallel; periodically **migrate** individuals between islands:

```
Island 1 ←→ Island 2 ←→ Island 3
    ↕                        ↕
Island 4 ←→ Island 5 ←→ Island 6
```

Each island maintains its own diversity; migration injects fresh genetic material.

**5. Explicit Mutation Rate Adaptation:**
Increase $p_m$ when diversity falls below a threshold (diversity-guided mutation).

**6. Restart Strategy:**
When convergence is detected (diversity below threshold), reinitialize a fraction of the population randomly while keeping elite individuals.

---

## Parameter Tuning

### Key Parameters and Their Effects

| Parameter | Typical Range | Too Low | Too High |
|-----------|--------------|---------|---------|
| **Population size $N$** | 50–500 | Genetic drift, premature convergence | Slow per-generation computation |
| **Crossover rate $p_c$** | 0.6–0.9 | No recombination; random walk | Breaks good schemata; instability |
| **Mutation rate $p_m$** | 0.001–0.05 | No exploration; premature convergence | Random walk; destroys good solutions |
| **Tournament size $k$** | 2–7 | Low selection pressure; slow | High pressure; premature convergence |
| **Max generations $G$** | 100–10,000 | Under-converged | Wasted computation |

### Population Size Guidelines

**De Jong's rule:** For binary chromosomes of length $\ell$ on a multimodal function:

$$N \approx 2 \cdot 2^{\ell^{1/2}}$$

**Goldberg's rule:** Population size should scale with the expected number of distinct building blocks:

$$N \propto 2^{k_{max}}$$

where $k_{max}$ is the order of the most complex schema you want to process.

**Practical rule:** Start with $N = 100$ and scale up if premature convergence is observed.

### Mutation Rate Guidelines

**Theoretical optimal (binary):** $p_m = 1/\ell$

**Reasoning:** Ensures on average one bit changes per chromosome per generation — enough to maintain diversity without destroying solutions.

For real-valued chromosomes: start with $p_m = 0.01$ to $0.1$.

### Crossover Rate Guidelines

**Typical:** $p_c \in [0.6, 0.9]$

Higher crossover rates increase exploration but may disrupt good solutions. The optimal crossover rate depends on chromosome length and fitness landscape topology.

### Selecting and Tuning Parameters

**Grid search:** Try all combinations from a predefined parameter grid (expensive).

**Racing algorithms:** Run multiple parameter configurations in parallel; eliminate poor performers early.

**Meta-GA:** Use a GA to optimize the parameters of another GA (but beware of over-fitting).

**Self-adaptive GAs:** Include strategy parameters in the chromosome and let evolution tune them:
$$\text{Chromosome} = [\underbrace{x_1, \ldots, x_n}_{\text{solution}}, \underbrace{p_m, p_c, \sigma}_{\text{strategy params}}]$$

---

## Constraint Handling

Real optimization problems often have constraints. A solution is **feasible** if it satisfies all constraints; **infeasible** otherwise.

### 1. Penalty Functions

The most common approach: modify the objective function to penalize constraint violations:

$$f'(\mathbf{x}) = f(\mathbf{x}) - P \cdot \text{violation}(\mathbf{x})$$

For constraints $g_j(\mathbf{x}) \leq 0$, a common penalty:

$$f'(\mathbf{x}) = f(\mathbf{x}) - P \sum_{j} \max(0, g_j(\mathbf{x}))^2$$

**Static penalty:** Fixed $P$ throughout the run. Simple, but hard to tune — too small and infeasible solutions "win"; too large and the search ignores the objective.

**Dynamic penalty:** $P$ increases over generations:

$$P(t) = (C \cdot t)^\alpha$$

Allows exploration of infeasible regions early, then forces feasibility later.

**Adaptive penalty:** $P$ adjusted based on proportion of feasible solutions in the population.

### 2. Repair Operators

After crossover/mutation, **repair** any infeasible offspring to make them feasible:

```python
def repair_tsp(chromosome):
    """Repair a TSP permutation with duplicate cities"""
    seen = set()
    missing = []
    result = []
    for city in chromosome:
        if city not in seen:
            seen.add(city)
            result.append(city)
        else:
            result.append(None)  # Placeholder
    # Fill placeholders with missing cities
    all_cities = set(range(len(chromosome)))
    missing = list(all_cities - seen)
    for i, gene in enumerate(result):
        if gene is None:
            result[i] = missing.pop()
    return result
```

**Pros:** Always produces feasible offspring; no penalty tuning needed
**Cons:** Problem-specific; may be computationally expensive

### 3. Decoder (Indirect Representation)

Use a **genotype → phenotype mapping** that always produces feasible solutions.

**Example** (knapsack problem): Instead of encoding which items to include, encode a priority ordering. The decoder greedily includes items in priority order until capacity is exceeded:

```
Chromosome (priorities): [3, 1, 4, 1, 5, 9]
Sorted item order: [item_5, item_3, item_1, item_4, ...]
Decoder: greedily pack → always feasible
```

### 4. Feasibility Rules (Deb's Rules)

When comparing individuals for selection:
1. A feasible solution is always preferred over an infeasible one
2. Between two feasible solutions, the one with better objective value wins
3. Between two infeasible solutions, the one with smaller total constraint violation wins

**Advantage:** No penalty parameter needed; simple and effective.

```python
def constraint_tournament(ind1, viol1, fit1, ind2, viol2, fit2):
    """Deb's feasibility-rule tournament"""
    feas1 = viol1 == 0
    feas2 = viol2 == 0
    if feas1 and feas2:
        return ind1 if fit1 >= fit2 else ind2
    elif feas1:
        return ind1  # Feasible beats infeasible
    elif feas2:
        return ind2
    else:
        return ind1 if viol1 <= viol2 else ind2  # Less violation wins
```

---

## Complete GA Implementation (Python)

```python
import numpy as np

class SimpleGA:
    """A complete genetic algorithm for binary optimization."""

    def __init__(self, pop_size=100, chrom_length=20,
                 pc=0.8, pm=0.01, max_gen=200):
        self.pop_size = pop_size
        self.chrom_length = chrom_length
        self.pc = pc           # Crossover probability
        self.pm = pm           # Mutation probability
        self.max_gen = max_gen

    def initialize(self):
        return np.random.randint(0, 2, (self.pop_size, self.chrom_length))

    def fitness(self, population):
        """Example: OneMax — maximize number of 1s"""
        return population.sum(axis=1).astype(float)

    def tournament_select(self, population, fitness, k=3):
        idx = np.random.choice(self.pop_size, k, replace=False)
        winner = idx[np.argmax(fitness[idx])]
        return population[winner].copy()

    def crossover(self, p1, p2):
        if np.random.rand() < self.pc:
            pt = np.random.randint(1, self.chrom_length)
            c1 = np.concatenate([p1[:pt], p2[pt:]])
            c2 = np.concatenate([p2[:pt], p1[pt:]])
            return c1, c2
        return p1.copy(), p2.copy()

    def mutate(self, chromosome):
        mask = np.random.rand(self.chrom_length) < self.pm
        chromosome[mask] ^= 1  # Flip bits
        return chromosome

    def run(self):
        pop = self.initialize()
        best_fitness_history = []

        for gen in range(self.max_gen):
            fit = self.fitness(pop)
            best_fitness_history.append(fit.max())

            # Create new population
            new_pop = []
            while len(new_pop) < self.pop_size:
                p1 = self.tournament_select(pop, fit)
                p2 = self.tournament_select(pop, fit)
                c1, c2 = self.crossover(p1, p2)
                new_pop.append(self.mutate(c1))
                if len(new_pop) < self.pop_size:
                    new_pop.append(self.mutate(c2))

            # Elitist replacement — keep best from old pop
            best_idx = np.argmax(fit)
            pop = np.array(new_pop)
            pop[0] = self.algorithm_best(fit, pop_old=pop)

        return best_fitness_history
```

---

## Key Takeaways

1. **GA taxonomy:** GA, GP, ES, DE, and PSO all solve optimization via population evolution — each with different representation and operators
2. **Biological analogy:** Chromosome = encoding, fitness = objective, selection = survival of the fittest
3. **GA loop:** Initialize → Evaluate → Select → Crossover → Mutate → Repeat
4. **Representation** determines what operators are valid — binary, real-valued, permutation, or tree
5. **Selection operators:** Roulette wheel, tournament (most robust), rank-based, steady-state
6. **Crossover:** One-point, two-point, uniform (binary); arithmetic (real); PMX, OX (permutation)
7. **Mutation:** Bit-flip (binary); Gaussian (real); swap, inversion, scramble (permutation)
8. **Schema theorem:** Short, low-order, above-average schemata grow exponentially — building blocks hypothesis
9. **Diversity maintenance** is essential — niching, crowding, island models, adaptive mutation
10. **Parameter tuning:** $N \approx 50$–500, $p_c \approx 0.7$, $p_m \approx 1/\ell$ are safe starting points
11. **Constraint handling:** Penalty functions (easy, needs tuning), repair (feasible, problem-specific), Deb's rules (clean, no parameters)

---

## What's Next?

With quantum computing (1.1) and classical genetic algorithms (1.2) both firmly understood, you are ready to explore **Quantum Genetic Algorithms (QGAs)** — circuits that encode chromosomes as quantum states, use quantum superposition to maintain exponentially many solutions simultaneously, and leverage interference and entanglement to accelerate the search. 🚀
