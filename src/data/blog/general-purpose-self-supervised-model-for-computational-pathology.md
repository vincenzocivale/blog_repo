---
author: Vincenzo Civale Yuto
pubDatetime: 2024-09-25T15:20:35Z
modDatetime: 2025-06-13T16:46:34.155Z
title: UNI, A General-Purpose Self-Supervised Model for Computational Pathology
slug: uni-self-supervised-vision-model-for-computational-pathology
featured: false
draft: false
tags:
  - Computational-Pathology
  - Computer-Vision
  - Paper-Review
description:
  UNI is a general-purpose, self-supervised vision model for computational pathology. It was trained on a diverse dataset of over 100 million tissue patches and demonstrating strong data efficiency, the model outperformed baselines with less labelled data and maintained performance across different image resolutions.

paperUrl: https://arxiv.org/abs/2308.15474
repoUrl: https://github.com/mahmoodlab/UNI
---



## Table of contents


## Introduction  

Computational pathology (CPath) uses artificial intelligence to analyse histopathology images in order to support diagnosis, prognosis, and treatment planning. However, the field faces three main challenges: the diversity and complexity of tasks; the scarcity of annotated datasets; and the requirement for models that can be applied to different tissue types, diseases and laboratory protocols.

Another critical point emerges from the practice of pathologists. Diagnostic reasoning requires inspecting tissue samples at multiple magnifications and using different staining techniques. To train an AI system to replicate this process requires access to large, diverse datasets covering tissue types, pathological states, acquisition modalities, and technical quality. However, publicly available datasets only provide a limited view of this diversity and do not reflect the full complexity of clinical practice.

To address these limitations, researchers have developed **UNI**: a general-purpose, self-supervised vision model for computational pathology. UNI introduces two key innovations: large-scale pre-training using a highly diverse dataset and an architecture that can learn robust morphological representations independently of extensive manual annotation.


## Methodology  

### Dataset curation  

The pre-training dataset, **Mass-100K**, comprises over 100,000 haematoxylin- and eosin-stained whole slide images (WSIs) spanning 20 major tissue types, collected from multiple institutions. Multi-resolution patch extraction produced over 75 million images. Two smaller, nested subsets — Mass-22K and Mass-1K — were also created to investigate scaling effects.  

Preprocessing steps included tissue segmentation, artefact removal and patch selection by clustering, in order to reduce redundancy whilst preserving slide-level diversity. Public cancer datasets, such as TCGA, which are commonly used for evaluation, were deliberately excluded from pretraining to avoid transductive bias.  

### Self-supervised pretraining  

UNI adopts a **ViT-L/16 backbone** trained with a **student–teacher DINOv2 framework**. The student receives masked image crops, while the teacher processes full versions. Learning objectives include aligning the predictions of the two models and reconstructing masked tokens.  

![The self-supervised learning approach used to train UNI that included masked image modelling and knowledge distillation.](@/assets/images/2025/general-purpose-self-supervised-model-for-computational-pathology/training_scheme.png)

The training pipeline incorporates temperature scheduling, codebook regularisation and high-resolution fine-tuning, as well as optimisers such as AdamW. To ensure efficiency, positional embeddings are interpolated for multi-resolution inputs, and attention implementations are optimised for long sequences.  

### Downstream evaluation  

UNI’s learned representations were tested on **33 clinical tasks** covering different levels of diagnostic granularity:  

- Slide-level classification with attention-based multiple instance learning (MIL).  
- Fine-grained hierarchical classification tasks such as OncoTree.  
- Recognition and content-based retrieval at region-of-interest (ROI) level.  
- Dense segmentation of cellular structures using architectures such as Mask2Former.  
- Few-shot learning for new tissue categories or laboratory protocols.  

This evaluation provided a comprehensive assessment of both predictive performance and generalization across institutions, scanners, and preparation conditions.  

## Key Results  

### The role of scale  

Using larger pretraining datasets and running training for longer resulted in richer representations and improved performance. UNI demonstrated more efficient learning by consistently outperforming existing encoders on challenging benchmarks such as OncoTree while requiring fewer training iterations.  

### Data efficiency  

In computational pathology, data annotation often poses the greatest challenge, surpassing even computational issues. UNI addresses this issue by reducing the need for large amounts of labelled data, which is essential for its clinical applicability and dissemination. The model's remarkable labelling efficiency across various tasks highlights its potential as a baseline model in pathology.

- **At the region of interest (ROI) level**: UNI achieves accuracy comparable to models trained with hundreds of labelled examples per class while using fewer than ten. This is a significant achievement given that ROI-level annotation is notoriously time-consuming and resource-intensive.
- **At the whole slide (WSI) level**: UNI can match or exceed the performance of state-of-the-art models with four to eight times fewer annotations. This efficiency in slide-level classification — a task that is clinically relevant — is critical for accelerating the development and implementation of AI systems in pathology.
- **Prototype-based classification**: An innovative feature of UNI is its capacity to perform precise slide-level classifications using class prototypes without the need for further training. This approach simplifies the process and provides interpretable heat maps aligned with relevant diagnostic regions, offering transparency and confidence in the model's predictions.

![Zero-shot performance of UNI.](@/assets/images/2025/general-purpose-self-supervised-model-for-computational-pathology/zero-shot.png)

The efficiency of data usage described in the paper can be explained by three main factors.

The first is the **diversity of the pre-training data**. The Mass-100K dataset comprises over 100 million tissue patches derived from more than 100,000 diagnostic whole slide images (WSIs) covering 20 tissue types. This variety enables UNI to learn histopathological features that can be applied more broadly.

The second factor is the **stability of the student–teacher embeddings**. The DINOv2 self-supervised learning algorithm, which is used during pre-training, produces embeddings that remain consistent and can be adapted to different downstream tasks without the need for extensive fine-tuning.

The third factor is **resolution robustnes**s through positional embedding interpolation. This enables UNI to maintain performance across different image resolutions and learn from multiple magnifications without losing relevant information.

Together, these factors make UNI an effective tool for computational pathology, reducing the need for annotations and supporting the development of AI models for clinical use.

### Resolution robustness  

In computational pathology, diagnostic reasoning requires the ability to consider both low-resolution features, such as tissue architecture, and high-resolution features, such as nuclear atypia. UNI demonstrates consistently high performance and remarkable adaptability across a wide range of image resolutions, from 224 × 224 to 1792 × 1792 pixels. This capability is particularly valuable in clinical settings where imaging conditions can vary and different magnifications are optimal for specific tasks.

The model's attention maps clearly demonstrate this adaptability, as well as UNI's effectiveness in encoding resolution-agnostic features. At low resolutions, such as 224 × 224 pixels, the model can effectively identify global patterns and broader tissue structures, such as invasive tumour cell nests and ductal linings. As the resolution increases, the model's attention shifts to finer details, focusing on epithelial regions and delineating tumour–stroma boundaries more specifically. UNI's ability to encode information in a resolution-agnostic manner means it can be applied under variable imaging conditions without the need for retraining, making it a versatile and robust foundation model for computational pathology.

![This multi-head self-attention visualisation shows how UNI attends to relevant features at different image resolutions.](@/assets/images/2025/general-purpose-self-supervised-model-for-computational-pathology/resolution_analysis.png)




## Conclusions  

UNI is a significant development in computational pathology. It shows that a self-supervised model, when trained on a large, diverse dataset, can act as a general-purpose encoder, supporting a variety of clinical tasks.  

By reducing dependence on extensive annotations while maintaining robustness across tasks, resolutions and acquisition conditions, UNI paves the way for the development of more broadly applicable AI tools in pathology. In practice, this shifts the bottleneck from data labelling to task design, paving the way for the faster and more flexible development of clinically relevant computational pathology systems.  
