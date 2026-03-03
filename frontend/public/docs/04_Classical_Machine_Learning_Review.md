# Part 4: Classical Machine Learning Review

## Before Quantum ML, Understand Classical ML

To appreciate Quantum Machine Learning, you need a solid foundation in classical ML. This is your comprehensive review!

---

## Table of Contents
1. [What is Machine Learning?](#what-is-machine-learning)
2. [Types of Machine Learning](#types-of-machine-learning)
3. [Supervised Learning](#supervised-learning)
4. [Unsupervised Learning](#unsupervised-learning)
5. [Neural Networks](#neural-networks)
6. [Training Process](#training-process)
7. [Common Algorithms](#common-algorithms)
8. [Why Quantum Can Help](#why-quantum-can-help)

---

## What is Machine Learning?

### Definition
**Machine Learning** is teaching computers to learn patterns from data without being explicitly programmed.

### Traditional Programming vs ML

```
Traditional Programming:
Input + Rules → Output
(explicit instructions)

Machine Learning:
Input + Output → Rules
(learn from examples)
```

### Example

**Traditional:**
```python
def is_spam(email):
    if "free money" in email or "click here" in email:
        return True
    return False
```

**Machine Learning:**
```python
# Train model on 10,000 labeled emails
model = learn_from_examples(emails, labels)
# Model discovers patterns automatically!
```

---

## Types of Machine Learning

### 1. Supervised Learning
- **Have:** Labeled data (inputs + correct outputs)
- **Goal:** Learn mapping from inputs to outputs
- **Examples:** Classification, Regression

### 2. Unsupervised Learning
- **Have:** Unlabeled data (only inputs)
- **Goal:** Find hidden patterns/structure
- **Examples:** Clustering, Dimensionality Reduction

### 3. Reinforcement Learning
- **Have:** Environment with rewards/penalties
- **Goal:** Learn best actions to maximize rewards
- **Examples:** Game playing, Robotics

### Quick Comparison

| Type | Data | Goal | Example Task |
|------|------|------|-------------|
| **Supervised** | X, Y (labeled) | Predict Y from X | Spam detection |
| **Unsupervised** | X only | Find patterns | Customer segmentation |
| **Reinforcement** | Environment | Maximize reward | Chess AI |

---

## Supervised Learning

### Classification

**Goal:** Predict discrete categories/classes

**Example Problems:**
- Email: Spam or Not Spam
- Image: Cat, Dog, or Bird
- Medical: Disease or Healthy

#### Binary Classification
Two classes (0/1, Yes/No)

**Example:** Is this email spam?
```
Input: Email text
Output: 0 (not spam) or 1 (spam)
```

#### Multi-class Classification
More than two classes

**Example:** What digit is this?
```
Input: Image of handwritten digit
Output: 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9
```

---

### Regression

**Goal:** Predict continuous numerical values

**Example Problems:**
- House price prediction
- Temperature forecasting
- Stock price prediction

**Example:** Predict house price
```
Input: [Size, Location, # Bedrooms, Age]
Output: $350,000 (continuous value)
```

---

### Key Concepts

#### Features (X)
Input variables that describe data

```
Email features: [word_count, has_links, sender_score, ...]
Image features: [pixel_values, edges, colors, ...]
```

#### Labels (Y)
Correct outputs for training

```
Email labels: [spam, not_spam, spam, ...]
```

#### Training Set
Data used to learn patterns

```
Training data: {(X₁, Y₁), (X₂, Y₂), ..., (Xₙ, Yₙ)}
```

#### Test Set
New data to evaluate performance

```
Test data: {(X_test₁, Y_test₁), ...}
```

**Important:** Never train on test data! (That's cheating)

---

## Unsupervised Learning

### Clustering

**Goal:** Group similar data points together

**Example:** Customer segmentation
```
Input: Customer purchase history
Output: Cluster 1 (budget shoppers)
        Cluster 2 (luxury buyers)
        Cluster 3 (tech enthusiasts)
```

#### K-Means Clustering

**Algorithm:**
1. Choose K cluster centers randomly
2. Assign each point to nearest center
3. Move centers to average of assigned points
4. Repeat 2-3 until convergence

**Visual:**
```
Before:           After:
  • •  •            ◉ ◉  ●
    •             ◉   ● ●
  • •              ◉ ◉  ●

Three clusters identified!
```

---

### Dimensionality Reduction

**Goal:** Reduce number of features while preserving information

**Why?**
- Compress data
- Visualize high-dimensional data
- Remove noise

#### Principal Component Analysis (PCA)

**Idea:** Find directions of maximum variance

```
Original: 100 features
After PCA: 10 features (keeping 95% of information)
```

**Example:**
```
Image: 1000 pixel values → 50 principal components
```

**Benefit:** Faster training, less memory, easier visualization

---

## Neural Networks

### What is a Neural Network?

A computational model inspired by biological neurons, consisting of:
- **Input layer**: Receives features
- **Hidden layers**: Process information
- **Output layer**: Produces predictions

### Simple Neural Network Structure

```
Input    Hidden    Output
Layer    Layer     Layer
        
X₁ ○─────●─────○
          ╲     ╱
X₂ ○──────●───○ Ŷ
         ╱     ╲
X₃ ○────●──────○

Features → Processing → Prediction
```

---

### Perceptron (Simplest Unit)

**Single artificial neuron:**

```
Inputs: x₁, x₂, x₃
Weights: w₁, w₂, w₃
Bias: b

Output: y = activation(w₁x₁ + w₂x₂ + w₃x₃ + b)
```

**Mathematical Formula:**
$$y = f\left(\sum_{i=1}^{n} w_i x_i + b\right)$$

Where $f$ is an **activation function**.

---

### Activation Functions

Transform the weighted sum (introduce non-linearity)

#### 1. Sigmoid
$$\sigma(x) = \frac{1}{1 + e^{-x}}$$

- **Range:** (0, 1)
- **Use:** Binary classification output
- **Shape:** S-curve

```
  1 |     ___
    |   _/
0.5 | _/
    |/
  0 +----------
```

#### 2. ReLU (Rectified Linear Unit)
$$\text{ReLU}(x) = \max(0, x)$$

- **Range:** [0, ∞)
- **Use:** Hidden layers (most popular!)
- **Shape:** Hockey stick

```
    |    /
    |   /
    |  /
  0 |_/________
    0
```

#### 3. Tanh (Hyperbolic Tangent)
$$\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$$

- **Range:** (-1, 1)
- **Use:** Hidden layers
- **Shape:** S-curve (centered at 0)

```
  1 |     ___
    |   _/
  0 |--/-------
    |_/
 -1 |
```

#### 4. Softmax (for multi-class)
$$\text{softmax}(x_i) = \frac{e^{x_i}}{\sum_j e^{x_j}}$$

- **Range:** (0, 1), sums to 1
- **Use:** Multi-class classification output
- **Returns:** Probability distribution

---

### Deep Neural Networks

**Multiple hidden layers:**

```
Input → Hidden₁ → Hidden₂ → Hidden₃ → Output

More layers = "Deeper" learning
```

**Why Deep?**
- Learn hierarchical features
- Handle complex patterns
- Better performance (with enough data)

**Example (Image Recognition):**
```
Layer 1: Detects edges
Layer 2: Detects shapes
Layer 3: Detects objects
Layer 4: Recognizes scenes
```

---

## Training Process

### 1. Forward Propagation

**Pass input through network:**

```
Input X → Layer 1 → Layer 2 → ... → Output Ŷ
```

**For each layer:**
$$a^{[l]} = f\left(W^{[l]} a^{[l-1]} + b^{[l]}\right)$$

Where:
- $a^{[l]}$ = activation of layer $l$
- $W^{[l]}$ = weights
- $b^{[l]}$ = biases
- $f$ = activation function

---

### 2. Loss Function

**Measures prediction error:**

$$\text{Loss} = \text{How wrong is Ŷ compared to Y?}$$

#### Mean Squared Error (Regression)
$$\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$$

#### Cross-Entropy (Classification)
$$\text{CE} = -\sum_{i=1}^{n} y_i \log(\hat{y}_i)$$

**Goal:** Minimize loss!

---

### 3. Backpropagation

**Calculate gradients (how to adjust weights):**

```
Output → Layer N → ... → Layer 2 → Layer 1 → Input
  ↓        ↓               ↓         ↓
Gradient flows backward!
```

**Uses chain rule:**
$$\frac{\partial \text{Loss}}{\partial w} = \frac{\partial \text{Loss}}{\partial a} \cdot \frac{\partial a}{\partial w}$$

---

### 4. Gradient Descent

**Update weights to reduce loss:**

$$w_{\text{new}} = w_{\text{old}} - \eta \frac{\partial \text{Loss}}{\partial w}$$

Where $\eta$ = **learning rate** (step size)

**Visual:**
```
Loss
 │    
 │  ●  Start (high loss)
 │   ╲
 │    ●  Step
 │     ╲
 │      ● Step
 │       ╲
 └────────●─── Minimum! (low loss)
          Weights
```

#### Variants

| Method | Description | Speed |
|--------|-------------|-------|
| **Batch GD** | Use all data per update | Slow but accurate |
| **Stochastic GD** | Use 1 sample per update | Fast but noisy |
| **Mini-batch GD** | Use small batch (e.g., 32) | Best of both! ✓ |

#### Advanced Optimizers
- **Adam**: Adaptive learning rate (most popular)
- **RMSprop**: Good for RNNs
- **SGD with Momentum**: Faster convergence

---

### Training Loop (Pseudocode)

```python
for epoch in range(num_epochs):
    for batch in training_data:
        # 1. Forward propagation
        predictions = model(batch.X)
        
        # 2. Compute loss
        loss = loss_function(predictions, batch.Y)
        
        # 3. Backpropagation
        gradients = compute_gradients(loss)
        
        # 4. Update weights
        weights = weights - learning_rate * gradients
    
    # Evaluate on validation set
    eval_model(validation_data)
```

---

## Common Algorithms

### 1. Linear Regression

**Simplest regression:**
$$\hat{y} = w_1 x_1 + w_2 x_2 + ... + w_n x_n + b$$

**Use:** Predict continuous values
**Example:** House price = 1000×size + 50000×location + ...

---

### 2. Logistic Regression

**Binary classification:**
$$\hat{y} = \sigma(w^T x + b)$$

Where $\sigma$ = sigmoid function

**Use:** Yes/No predictions
**Example:** Will customer buy? (Yes/No)

---

### 3. Decision Trees

**Tree-like model:**
```
Is size > 1500?
    /        \
  Yes        No
   /           \
Price > $300K  Price < $200K
```

**Pros:** Interpretable, handles non-linear
**Cons:** Can overfit

---

### 4. Random Forest

**Ensemble of decision trees:**
```
Tree1 → Prediction1
Tree2 → Prediction2    → Average → Final Prediction
Tree3 → Prediction3
...
```

**Pros:** Very accurate, robust
**Cons:** Slower, less interpretable

---

### 5. Support Vector Machines (SVM)

**Finds best decision boundary:**
```
Class A  |  Class B
  ●  ●   |   ○  ○
    ●    |     ○
  ●      |  ○
---------|----------  ← Maximum margin hyperplane
```

**Use:** Classification with clear separation
**Kernel trick:** Handle non-linear boundaries

---

### 6. K-Nearest Neighbors (KNN)

**Classifies based on nearest neighbors:**
```
New point: ?
Neighbors: ● ● ● ○ ○

Majority vote: 3 blue, 2 red → Classify as blue!
```

**Pros:** Simple, no training
**Cons:** Slow prediction, needs good features

---

### 7. Convolutional Neural Networks (CNN)

**For images:**
```
Input Image → Conv Layers → Pooling → Flatten → Dense → Output
```

**Special feature:** Learns spatial patterns
**Use:** Image classification, object detection

---

### 8. Recurrent Neural Networks (RNN)

**For sequences:**
```
Input: word₁ → word₂ → word₃ → ...
        ↓       ↓       ↓
      Hidden state (memory)
```

**Use:** Text, time series, speech
**Variants:** LSTM, GRU (handle long sequences)

---

## Key ML Concepts

### Overfitting vs Underfitting

#### Underfitting (High Bias)
```
Data:  ● ●     ○ ○
         ●   ○
Model: ────────────  (too simple)

Model too simple, doesn't capture patterns
```

#### Good Fit
```
Data:  ● ●     ○ ○
         ●   ○
Model:   --╮  ╭--    (just right)

Captures patterns without noise
```

#### Overfitting (High Variance)
```
Data:  ● ●     ○ ○
         ●   ○
Model: ─●─●─●─○─○─○  (too complex)

Memorizes training data, poor on new data
```

---

### Regularization

**Techniques to prevent overfitting:**

#### L1 Regularization (Lasso)
$$\text{Loss} = \text{MSE} + \lambda \sum |w_i|$$

- Encourages sparse weights (many zeros)
- Feature selection

#### L2 Regularization (Ridge)
$$\text{Loss} = \text{MSE} + \lambda \sum w_i^2$$

- Encourages small weights
- More common

#### Dropout (Neural Networks)
Randomly turn off neurons during training
```
Training:  ●─●─●─●  → Some neurons off: ●─○─●─○
Testing:   ●─●─●─●  → All neurons on
```

---

### Cross-Validation

**Better performance estimation:**

```
Dataset split into K folds:

Fold1 | Fold2 | Fold3 | Fold4 | Fold5

Round 1: Test   Train   Train   Train   Train
Round 2: Train  Test    Train   Train   Train
Round 3: Train  Train   Test    Train   Train
Round 4: Train  Train   Train   Test    Train
Round 5: Train  Train   Train   Train   Test

Average performance across all rounds
```

**Benefit:** Uses all data for both training and testing!

---

### Evaluation Metrics

#### For Classification

**Confusion Matrix:**
```
                Predicted
              Positive  Negative
Actual Pos      TP        FN
       Neg      FP        TN
```

**Metrics:**
- **Accuracy**: $(TP + TN) / \text{Total}$
- **Precision**: $TP / (TP + FP)$ (how many predicted positive are correct?)
- **Recall**: $TP / (TP + FN)$ (how many actual positive found?)
- **F1-Score**: $2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$

#### For Regression

- **MAE** (Mean Absolute Error): $\frac{1}{n}\sum |y_i - \hat{y}_i|$
- **MSE** (Mean Squared Error): $\frac{1}{n}\sum (y_i - \hat{y}_i)^2$
- **RMSE** (Root MSE): $\sqrt{\text{MSE}}$
- **R² Score**: Explained variance (1.0 = perfect)

---

## Why Quantum Can Help

### Classical ML Limitations

1. **Computational Complexity**
   - Training deep networks: hours to days
   - Large datasets: memory bottleneck
   - Optimization: stuck in local minima

2. **Feature Space**
   - High dimensions: curse of dimensionality
   - Complex patterns: need deep networks
   - Kernel methods: expensive computations

3. **Data Efficiency**
   - Need lots of labeled data
   - Transfer learning helps but limited

---

### Quantum Advantages

#### 1. Quantum Feature Maps
```
Classical: x → φ(x) (polynomial features)
Quantum:   x → |ψ(x)⟩ (exponential feature space!)
```

**Benefit:** Access to exponentially large feature space

#### 2. Quantum Parallelism
```
Classical: Process one input at a time
Quantum:   Process superposition of ALL inputs!
```

**Benefit:** Potential speedup in certain algorithms

#### 3. Quantum Kernel Methods
```
Calculate similarity: ⟨ψ(x₁)|ψ(x₂)⟩
```

**Benefit:** Efficient computation of complex kernels

#### 4. Optimization
```
Quantum algorithms: QAOA, VQE
Better explore solution space
```

**Benefit:** Escape local minima, find better solutions

---

### Where Quantum Helps Most

| Problem Type | Quantum Advantage | Status |
|--------------|-------------------|--------|
| **Linear Algebra** | HHL algorithm | Theoretical, limited practical use |
| **Optimization** | QAOA, annealing | Promising, active research |
| **Kernel Methods** | Quantum kernels | Demonstrated advantages |
| **Feature Maps** | Quantum encoding | Exponential space |
| **Sampling** | Quantum sampling | Proven speedup |

---

## Classical vs Quantum ML (Preview)

### Classical Neural Network
```python
# Input: Vector [x₁, x₂, ..., xₙ]
# Process: Matrix multiplications + activations
# Output: Prediction

model = Sequential([
    Dense(64, activation='relu'),
    Dense(32, activation='relu'),
    Dense(10, activation='softmax')
])
```

### Quantum Neural Network (Variational Circuit)
```python
# Input: Quantum state |ψ(x)⟩
# Process: Parameterized quantum gates
# Output: Measurement → Prediction

circuit = QuantumCircuit(4)
# Encode data
circuit.h(range(4))
# Variational layers (trainable!)
circuit.ry(params[0], 0)
circuit.cnot(0, 1)
# Measure
circuit.measure_all()
```

---

## Key Takeaways 🎯

1. ✅ **ML learns patterns** from data without explicit programming
2. ✅ **Supervised learning** uses labeled data for prediction
3. ✅ **Neural networks** are powerful function approximators
4. ✅ **Training** involves forward prop, loss, backprop, gradient descent
5. ✅ **Overfitting** is a key challenge - use regularization
6. ✅ **Quantum ML** can provide advantages in feature spaces, optimization, and kernels
7. ✅ Understanding classical ML is **essential** for quantum ML!

---

## What's Next?

In **Part 5: Quantum Machine Learning Intro**, we'll explore:
- How to encode classical data into quantum states
- Variational quantum circuits
- Quantum kernels
- Hybrid quantum-classical algorithms

---

## ML Workflow Summary

```
1. Problem Definition
   ↓
2. Data Collection & Preparation
   ↓
3. Feature Engineering
   ↓
4. Model Selection
   ↓
5. Training (Forward → Loss → Backward → Update)
   ↓
6. Evaluation (Test set)
   ↓
7. Hyperparameter Tuning
   ↓
8. Deployment
```

**Remember:** Garbage in, garbage out! Data quality matters most.

---

**Excellent!** You now have the classical ML foundation needed for quantum ML. On to Part 5! 🚀

