---
author: Civale Vincenzo Yuto
pubDatetime: 2025-01-28T04:59:04.866Z
modDatetime: 2025-03-12T13:39:20.763Z
title: SubCell, vision foundation models for microscopy capture single-cell biology
slug: subcell-self-supervised-foundation-models-for-cell-biology
featured: false
draft: false
tags:
  - Single-Cell
  - Paper-Review
  - Computer-Vision
  - Proteomics
description: SubCell is a suite of vision foundation models that have been trained using self-supervision on the Human Protein Atlas (HPA) image corpus. The aim is to learn a unified representation of single cells that captures both morphology and protein localisation patterns.

paperUrl: https://www.biorxiv.org/content/10.1101/2024.12.06.627299v1.full.pdf
repoUrl: https://github.com/CellProfiling/SubCellPortable.git
---



## Table of contents

## Introduction

SubCell is a suite of vision foundation models that were trained using self-supervision on the Human Protein Atlas (HPA) image corpus. The aim was to learn a unified representation of the single cell that would capture both morphology and protein localisation patterns. The architectural elements, training strategies, and the main quantitative and qualitative results reported by the authors are described in detail below. 


## Model Architecture

The backbone of SubCell is a Vision Transformer (ViT), which treats the image as a sequence of patches. An attention pooling module is connected to the ViT's output, producing the final representation by assigning weights to the token patches according to their importance in cell characterisation. This pooling mechanism has two practical effects: First, it concentrates information on relevant cell regions, reducing background noise and noise from adjacent cells. Second, it establishes a more direct coupling between internal attention maps and the biological interpretability of features.

The authors report two main configurations resulting from optimising training functions: the first, ViT-ProtS-Pool, focuses on the 'protein-specific' objective with attention pooling, while the second, MAE-CellS-ProtS-Pool, combines the MAE reconstruction module with cell- and protein-specific objectives, again using attention pooling. In practice, the key difference is that the MAE-CellS-ProtS-Pool configuration explicitly incorporates a pixel-level reconstruction path to reinforce low-level structure learning.

## Training Dataset

This training uses HPA images with four immunofluorescent channels: DNA (DAPI), microtubules (MT), the endoplasmic reticulum (ER) and the target protein. The dataset covers 37 human cell lines (from different tissue types), ensuring wide morphological and experimental variability. To encourage the model to concentrate on individual objects, a data augmentation technique has been developed that masks tokens inside pre-calculated cell masks. This enables the model to learn to reconstruct and represent the content of the central cell, rather than characteristics of the background or neighbouring cells.

![Example single-cell images from the Human Protein Atlas dataset, showcasing the wide range of cell morphologies and protein subcellular localizations observed across different human cell types.](@/assets/images/2025/sub_cell/representative_images_sc_HCA_dataset.png)

## Self-Supervised Multi-Task Objectives

SubCell combines three self-supervised objectives within a multi-task framework.

 - **Reconstruction** (MAE-like): The model reconstructs partially masked images to promote the learning of low-level features and spatial continuity.

 - **Cell-specific contrastive**: a contrastive loss that minimises the distance between representations of augmented views of the same cell to increase robustness to imaging variations (e.g. rotations and intensity).

 - **Protein-specific contrastive** : objective minimises the distance between representations of cells stained with the same antibody (i.e. targeting the same proteins), even if they come from different lines or batches. This objective encourages the model to identify generalisable protein localisation patterns.

Integrating these objectives enables the joint learning of morphological signals (thanks to reconstruction and views of the same cell) and protein localisation signals (thanks to the protein-specific loss).

![The first panel reports the best compound mean average precision (mAP), while second panel shows the best MoA (mAP). In both tables, the top-performing metric is highlighted in bold and the second-best in italics.](@/assets/images/2025/sub_cell/training_framework.png)


## Results

The authors focus their analysis on the final two models: ViT-ProtS-Pool (trained with the protein-specific objective and attention pooling only) and MAE-CellS-ProtS-Pool (trained with all three objectives and attention pooling). Attention pooling proves crucial in improving the quality of embeddings and facilitating interpretation through analysis of attention weights, which are highly concentrated within the cell boundary.

The experiments cover various tasks, including protein localisation, cell line classification, correlations with orthogonal data and the prediction of protein-protein interactions.

On standard benchmarks, SubCell models demonstrate superior or competitive performance compared to specialised methods. Notably, both ViT-ProtS-Pool and MAE-CellS-ProtS-Pool outperform the morphology-oriented self-supervised model (DINO4Cells-HPA). ViT-ProtS-Pool outperforms the best-fitting supervised model on the HPAv23 test set. However, the best-fitting model maintains a slight advantage on the Kaggle test set due to specific techniques used to improve rare classes. This is an area in which SubCell was not explicitly optimised. For cell line classification tasks, SubCell achieves a clear advantage over DINO4Cells-HPA, indicating superior morphology encoding.

![The first panel reports the best compound mean average precision (mAP), while second panel shows the best MoA (mAP). In both tables, the top-performing metric is highlighted in bold and the second-best in italics.](@/assets/images/2025/sub_cell/table.png)


## Biological validation and interpretability

Not only did SubCell embeddings correlate with expert annotations, they also correlated with transcriptomic profiles obtained from RNA-seq. This indicates that the model captures relevant phenotypic variations. Attention maps revealed correspondences with recognised biological structures, such as nucleoli and microtubules. This suggests that the model has learned to implicitly segment cellular substructures.

The authors then created the first multiscale map of the proteome using only visual data. This map distinguished major compartments, sub-structures and protein complexes, such as the cytosolic ribosome. Regarding microtubules, SubCell distinguished between continuous and point patterns, identifying subgroups associated with ciliary proteins. Regarding the nuclear envelope, the model distinguished clusters of stable structural proteins from those involved in mRNA export.

![A vision-based multiscale map of protein architecture in U-2 OS cells. (A) UMAP embeddings from the Human Protein Atlas illustrate Leiden subclusters identified at progressively higher resolutions.](@/assets/images/2025/sub_cell/multiscale_resolution.png)

## Conclusion

SubCell signifies a substantial advancement towards establishing a foundational model for cell biology. It integrates a ViT architecture with attention pooling, augmentation targeted at cell masks, and a triad of self-supervised objectives. Collectively, these elements facilitate the acquisition of biologically rich, interpretable, and transferable embeddings. The quantitative results (supervised benchmarks, Mantel statistics, PPI prediction) and zero-shot generalisation on heterogeneous datasets provide concrete evidence of the model's versatility. The proposed applications encompass phenotypic screening, functional annotation of proteins, and data-driven cell mapping.