---
author: Vincenzo Yuto Civale
pubDatetime: 2025-10-08T04:59:04.866Z
modDatetime: 2025-10-08T17:19:20.763Z
title: Model Decides How to Tokenize, Adaptive DNA Sequence Tokenization with MxDNA
slug: model-decides-how-to-tokenize-adaptive-dna-sequence-tokenization-with-mxdna
featured: false
draft: false
tags:

description: The MxDNA framework enables foundation models to autonomously learn DNA tokenization strategies, addressing the limitations of NLP-derived methods by explicitly modeling discontinuous, overlapping, and ambiguous biological units. 
paperUrl: https://arxiv.org/abs/2412.13716
repoUrl: https://github.com/qiaoqiaoLF/MxDNA.git
---

## Table of contents


## Introduction

Foundation models are transforming computational biology, particularly through their ability to process genomic sequences as if they were a “language” of life. However, the analogy between natural language and DNA breaks down at a fundamental level.

Unlike human language, which has clear delimiters such as spaces and punctuation and well-defined grammatical rules, DNA is a continuous string of nucleotides (A, T, C, G) with no obvious boundaries or known syntax. Applying NLP tokenization schemes directly to genomics often leads to representations that fail to capture the biological semantics encoded in the sequence.

![Figure 1: Comparison of existing tokenization methods (left) versus the proposed adaptive approach (right). Current methods directly apply NLP techniques to genomic sequences, while ideal genomic tokenization should capture meaningful, discontinuous, overlapping, and ambiguous properties of biological sequences.](@/assets/images/2025/model-decides-how-to-tokenize-adaptive-dna-sequence-tokenization-with-mxdna/1.png)

This challenge motivates **MxDNA**, a framework that enables models to **learn their own tokenization strategy** through gradient descent rather than relying on heuristics borrowed from natural language processing. MxDNA introduces a neural mechanism capable of discovering biologically meaningful sequence units that are **discontinuous, overlapping, ambiguous, and context-dependent**, properties that are essential for accurately modeling genomic structure and function.

## The Challenge of DNA Tokenization

Existing genomic foundation models such as DNABERT, Nucleotide Transformer, and HyenaDNA rely on tokenization methods originally designed for text. These methods show several limitations when applied to DNA sequences.

**Single-nucleotide tokenization** provides maximum resolution but results in very long sequences, making training computationally expensive.
**K-mer tokenization** divides DNA into fixed-length subsequences. However, non-overlapping k-mers risk breaking meaningful biological motifs across token boundaries, while overlapping k-mers introduce redundancy and can cause **information leakage** between training and test samples.
**Byte-Pair Encoding (BPE)** merges frequent subsequences to reduce vocabulary size, but its purely statistical nature ignores biological function and often produces tokens that do not correspond to meaningful genomic elements.

Meaningful genomic segments exhibit properties that fixed segmentation schemes cannot capture adequately:

* **Discontinuous:** functional elements can consist of non-contiguous regions, such as enhancers regulating distant promoters.
* **Overlapping:** multiple functional units can share the same nucleotides.
* **Ambiguous:** the same segment may serve different roles depending on the biological context.
* **Context-dependent:** the meaning of a sequence depends on its surrounding genomic environment.

An effective tokenizer for genomics must therefore **learn to adapt its segmentation dynamically**, reflecting these structural and functional properties instead of enforcing them a priori.


## The MxDNA Framework

MxDNA treats tokenization as a learnable component of the model architecture. Rather than applying static segmentation rules before training, it introduces a two-phase neural mechanism that learns to identify and assemble genomic fragments into biologically meaningful tokens.

![Figure 2: MxDNA architecture showing the overall pipeline (top) and detailed view of the Learnt Tokenization Module with its two main components: Basic Units Recognition and Basic Units Assembly.](@/assets/images/2025/model-decides-how-to-tokenize-adaptive-dna-sequence-tokenization-with-mxdna/2.png)

### Basic Units Recognition

The first phase identifies variable-length “basic units,” which act as the elementary building blocks from which larger tokens are composed.

**Basic Units Scoring**
At each nucleotide position, a linear gating mechanism estimates the probability that a segment of length *l* (typically 1–10 nucleotides) represents a meaningful unit. To encourage robustness and model biological ambiguity, *multiplicative jitter noise* sampled uniformly from ([1 - \epsilon, 1 + \epsilon]) perturbs these probabilities during training:

$$
\text{score}_{i,l}= \sigma(\text{Linear}(\text{features}_i)) \cdot \mathcal{U}(1-\epsilon, 1+\epsilon)
$$

**Non-Maximum Suppression (NMS)**
Applied along the sequence to remove redundant proposals, keeping only the most confident candidates. This process is analogous to object detection post-processing, where overlapping detections are pruned.

**Mixture of Convolution Experts (MoCE)**
Each expert processes basic units of a specific length (for example 3-mers or 5-mers). The model combines their outputs to obtain embeddings that capture features at multiple scales:

$$
\text{embedding}*i = \sum*{l} \text{score}_{i,l} \cdot \text{ConvExpert}_l(\text{sequence}_i)
$$

This stage can be interpreted as the model’s attempt to **discover fundamental motifs** in genomic sequences, learning directly from data which segment lengths and patterns are most informative.


### Basic Units Assembly

The second phase assembles these recognized units into high-level tokens that capture complex and potentially long-range biological relationships.

**Distal Relation Estimation**
For each basic unit, MxDNA learns both *offsets* and *modulation factors* that determine where to sample from and how strongly to weight other distant units. This allows the model to represent relationships between non-contiguous regions, directly supporting **discontinuity** and **overlap**.

**Deformable Convolution**
The final token embedding is obtained using a one-dimensional deformable convolution:

$$
\text{token}_i = \sum_{k} w_k \cdot \Delta m_{i,k} \cdot \text{basic\_unit}_{i+k+\Delta p_{i,k}}
$$


Here, $\Delta p_{i,k}$ are learned offsets that allow adaptive sampling across the sequence, while $\Delta m_{i,k}$ are modulation factors that determine the contribution of each sampled unit. This mechanism captures context-dependent dependencies that fixed convolution kernels cannot, effectively modeling genomic phenomena such as distal enhancer-promoter interactions or motif reuse.

Through these two phases, MxDNA learns a **dynamic and context-aware tokenization strategy** that reflects the discontinuous, overlapping, and ambiguous nature of genomic information.


## Experimental Results and Analysis

MxDNA was pretrained exclusively on the **Human Reference Genome**, yet it outperformed all competing models that were trained on much larger and more diverse datasets. Its effectiveness was evaluated on two benchmark suites.

### **Genomic Benchmarks (8 Tasks)**

| Model     | Average Accuracy (%) |
| --------- | -------------------- |
| **MxDNA** | **89.13 ± 0.13**     |
| DNABERT2  | 88.29 ± 0.19         |
| NTv2      | 88.13 ± 0.03         |
| DNABERT   | 87.50 ± 0.13         |
| HyenaDNA  | 87.17 ± 0.15         |

MxDNA achieved the highest performance on five out of eight tasks and ranked among the top two in seven.

### Nucleotide Transformer Benchmarks (18 Tasks)

| Model     | Average Performance (MCC/F1/Accuracy) |
| --------- | ------------------------------------- |
| **MxDNA** | **78.14 ± 0.12**                      |
| DNABERT2  | 76.66 ± 0.20                          |
| HyenaDNA  | 75.96 ± 0.20                          |
| NTv2      | 70.70 ± 0.12                          |
| DNABERT   | 68.61 ± 0.16                          |

MxDNA established a new state of the art, particularly excelling in histone marker prediction tasks. The results highlight the efficiency of its learned tokenization, which captures relevant biological structures even when trained on limited data.

### Ablation Studies

Two complementary analyses confirmed the source of these performance gains.

**Learned vs. Fixed Tokenization**
Using identical model backbones, MxDNA’s learned tokenization consistently outperformed rule-based strategies, including single-nucleotide, k-mer, and BPE tokenization.

**Component Contribution**
Incrementally adding MxDNA’s architectural elements demonstrated that the *Mixture of Convolution Experts* provided the largest performance boost, while *deformable convolution* and *jitter noise* further enhanced robustness and generalization. These findings validate the decision to explicitly model discontinuity, overlap, and ambiguity.


## Tokenization Behavior Analysis

![Figure 3: Token length distributions comparing BPE (top) with its bell-shaped, frequency-biased distribution versus MxDNA (bottom) showing more uniform distributions that vary across different functional genomic datasets.](@/assets/images/2025/model-decides-how-to-tokenize-adaptive-dna-sequence-tokenization-with-mxdna/3.png)

Beyond numerical benchmarks, MxDNA’s tokenization exhibits several biologically relevant behaviors.

**Sample-Level Ambiguity**
When processing the same sequence multiple times, MxDNA may produce slightly different tokenizations. This controlled variability reflects its ability to model biological ambiguity rather than instability.

**Adaptive Token Length Distribution**
Compared to BPE’s fixed bell-shaped distribution, MxDNA adapts its token lengths depending on the dataset. Histone marker datasets favor shorter motifs, while promoter or enhancer datasets lead to longer tokens, demonstrating task-dependent segmentation.

**Functional Embedding Clusters**
t-SNE projections of pretrained token embeddings reveal distinct clusters corresponding to genomic functions such as promoters, enhancers, and splice sites. Remarkably, these clusters emerge during self-supervised pretraining without any fine-tuning, indicating that MxDNA learns inherently functional representations.

![Figure 4: Example showing MxDNA's adaptive tokenization across two forward passes (left) demonstrating discontinuous, overlapping, and ambiguous properties, compared to traditional rule-based methods (right).](@/assets/images/2025/model-decides-how-to-tokenize-adaptive-dna-sequence-tokenization-with-mxdna/4.png)


## Significance, Limitations, and Future Directions

MxDNA represents a shift from static, rule-based tokenization to a **learnable and biologically informed approach**. By explicitly incorporating discontinuity, overlap, and ambiguity as design principles, it achieves both superior performance and more interpretable genomic representations.

### Key Limitations

While promising, the framework has two main limitations.
First, the biological interpretability of learned tokens is still indirect, since they have not yet been systematically mapped to known motifs or regulatory elements.
Second, the quadratic complexity of the transformer backbone limits scalability to long-range genomic tasks, such as modeling chromosomal interactions.

### Future Work

Future research will focus on integrating MxDNA with efficient transformer variants that use sub-quadratic attention mechanisms, enabling its application to longer genomic contexts. Another important direction is the development of interpretability tools that can associate learned tokens with known biological structures. Extending the framework to proteins and RNA will also test whether similar tokenization principles apply across molecular sequence types.





