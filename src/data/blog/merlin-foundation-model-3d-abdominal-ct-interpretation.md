---
author: Vincenzo Yuto Civale
pubDatetime: 2024-01-05T15:20:35Z
modDatetime: 2024-06-13T16:46:34.155Z
title: Merlin, A Foundation Model for 3D Abdominal CT Interpretation Using Vision-Language Pretraining
slug: merlin-foundation-model-3d-abdominal-ct-interpretation
featured: false
draft: false
tags:
  - Radiology
  - Computer-Vision
  - Paper-Review

description: Merlin is a vision-language foundation model designed for 3D Computed Tomography (CT) scans, which processes volumetric data using a dual-encoder architecture.

paperUrl: https://arxiv.org/abs/2406.06512
repoUrl: https://github.com/StanfordMIMI/Merlin.git
---

## Table of contents

## Introduction

Every year, over **85 million** Computed Tomography (CT) scans are performed in the United States alone, with approximately a quarter of them being abdominal scans. This immense volume, coupled with a growing shortage of radiologists, places a significant and increasing burden on healthcare systems. The disparity between imaging demand and clinical capacity motivates the urgent need for advanced Artificial Intelligence (AI) to assist in interpreting these complex imaging studies.

![architecture overview](@/assets/images/2025/merlin-foundation-model-3d-abdominal-ct-interpretation/overview.png)

Previous AI approaches in medical imaging have shown notable limitations. Conventional models are often unimodal, analyzing imaging data in isolation without the rich context provided by other clinical data. Their reliance on supervised training requires costly and time-consuming manual annotations from clinical experts. Moreover, most existing models are designed for 2D images, an inefficient approach for intrinsically volumetric data like CT scans, where information is derived from three-dimensional anatomical relationships.

To overcome these shortcomings, we introduce the **Merlin model**, an innovative foundation model for 3D abdominal CT interpretation. Merlin is a 3D Vision-Language Model (VLM) that uniquely leverages both structured Electronic Health Record (EHR) data and unstructured radiology reports for supervision, eliminating the need for additional manual annotations. This multimodal pre-training strategy allows Merlin to develop a deep and contextual understanding of medical imaging.


## Model Architecture and Training Strategy
The design of Merlin's architecture and training strategy was a strategic effort, co-developed to effectively process complex 3D medical data while remaining computationally efficient.

![architecture](@/assets/images/2025/merlin-foundation-model-3d-abdominal-ct-interpretation/architecture.png)

Merlin is based on a **dual-encoder architecture**, a design that has proven effective for aligning representations from different data modalities.

* **Image Encoder**: The visual component is an **Inflated 3D (I3D) ResNet152**. This architecture is specifically designed to process the entire 3D voxel data of a CT scan at once, allowing it to capture complex spatial and anatomical relationships.
* **Text Encoder**: The language component is the **Clinical Longformer**. This choice is motivated by the verbosity of clinical documentation; 21% of "findings" sections in radiology reports exceed 512 tokens. The Clinical Longformer's ability to handle long text sequences (up to 4,096 tokens) is essential for processing these detailed reports without truncation.

### Training Data and Supervision
The model was pre-trained on a dataset of **15,331 CT scans**, which included over 6 million images, 1.8 million EHR diagnostic codes, and 6 million tokens from radiology reports. Merlin's key innovation is the use of a multi-task learning approach that leverages a dual supervision signal:

* **EHR Supervision**: ICD (International Classification of Diseases) codes from the EHR are mapped to a hierarchical phenotypic structure (PheWAS). These phenotypes are used as **weak supervision labels**, training the model to associate image features with clinical diagnoses via a binary cross-entropy loss function.
* **Report Supervision**: The unstructured radiology reports provide rich natural language supervision through **contrastive learning (InfoNCE loss)**. The training process also employs a "report splitting" technique into anatomical sections (e.g., "liver," "kidneys") to enable more granular learning.


An outstanding achievement of this work is its **computational efficiency**. The entire model training was performed on a **single 48GB A6000 GPU**. This result fundamentally lowers the barrier to entry for academic medical centers and hospitals, enabling them to innovate using their own clinical data.


## Evaluation Tasks and Performance
To validate its capabilities, Merlin was extensively tested on a diverse suite of **6 task types**, comprising 752 individual tasks. The evaluation was designed to assess both the model's "out-of-the-box" generalist capabilities (**zero-shot**) and its adaptability to specialized clinical applications (**fine-tuning**).

| Generalist Capabilities (Zero-Shot) | Specialized Applications (Fine-Tuned) |
| :---------------------------------- | :------------------------------------ |
| Zero-shot Findings Classification   | 5-Year Chronic Disease Prediction     |
| Phenotype Classification            | Radiology Report Generation           |
| Zero-shot Cross-Modal Retrieval     | 3D Semantic Segmentation              |

Ablation studies showed that initializing the image encoder with I3D weights was advantageous. The multi-task learning approach outperformed a staged training strategy. The impact of the "report splitting" technique was task-dependent: it improved zero-shot classification but slightly degraded performance on retrieval tasks that rely on the full text.

![result](@/assets/images/2025/merlin-foundation-model-3d-abdominal-ct-interpretation/result.png)

### 5-Year Chronic Disease Prediction
This task tests the model's ability to opportunistically predict the **5-year onset of 6 chronic diseases** (e.g., chronic kidney disease, osteoporosis, diabetes) in patients who were healthy at the time of their CT scan. On average, Merlin achieved an AUROC of **0.757**, achieving prognostic performance comparable to a standard ImageNet pre-trained model but requiring **10 times less labeled training data**.

### 3D Semantic Segmentation
This task requires the model to accurately identify and delineate **20 different organs** within the CT volume. Merlin's pre-training provided a significant advantage, especially in **low-label scenarios**. With only 10% of labels available, Merlin achieved an **11% superior performance** over the next-best model, particularly on small or complex structures like the duodenum and gallbladder.

### Zero-Shot Performance
A model's ability to perform tasks in a "zero-shot" manner is extremely valuable in a clinical context, as it allows for tackling new tasks without specific training or additional labeled data.

The **zero-shot classification** evaluates Merlin's ability to classify the presence of **31 common imaging findings** using "present" and "absent" text prompts (e.g., 'pleural effusion present' vs 'no pleural effusion'). Merlin significantly **outperformed the BioMedCLIP baseline**, a leading 2D medical VLM.

| Model       | Average F1 Score (Internal) | Average F1 Score (External) |
| :---------- | :-------------------------- | :-------------------------- |
| BioMedCLIP  | 0.285                       | -                           |
| Merlin      | 0.741                       | 0.647                       |

Merlin excels on findings with coarse-grained visual features (e.g., splenomegaly, ascites) and shows lower performance on more subtle findings (e.g., appendicitis).

The **zero-shot cross-modal retrieval** evaluates the model's ability to match a CT image to its corresponding radiology report section. Merlin significantly outperformed all baselines, achieving a **Top-1 Recall of 0.696** in retrieving the correct findings section from a pool of 64 candidates. This excellent performance is a direct result of using the Clinical Longformer, which allows the model to learn a much richer alignment between visual and textual concepts.

## Data Scaling and Efficiency
Understanding the relationship between data, computation, and performance is essential for strategically planning future AI development.

This study empirically derived **power-law relationships** to quantify how model performance improves as the size of the training dataset increases. For instance, the derived power law for zero-shot classification is:
$$F1_{​}=0.458D^{0.0524}$$
where D is the number of CT scan-report pairs used for pre-training. This finding provides quantitative guidance to estimate the amount of data needed to reach a target performance level, enabling more strategic and cost-effective data curation efforts.

A central finding of this research is that the entire Merlin model was developed using a **single GPU**. This result represents a significant step toward **democratizing foundation model training**, making it a feasible endeavor for healthcare systems and academic centers that typically face severe computational limitations.

### Medical Report Generation

For this task, the image features learned by Merlin were linked to the **RadLlama-7B language model** via a simple linear adapter, enabling it to generate draft radiology reports.

![report_generation](@/assets/images/2025/merlin-foundation-model-3d-abdominal-ct-interpretation/report_generation.png)

Quantitatively, Merlin consistently **outperformed the RadFM baseline** on all standard metrics (RadGraph-F1, BERT Score, ROUGE-2, BLEU). A qualitative evaluation by radiologists confirmed that the generated reports have correct anatomical structure and often correctly identify key findings. However, the analysis revealed a concerning tendency toward **false negatives**. For example, in one case, the model failed to report cholelithiasis (gallstones), a finding clearly present in the CT image and noted in the human report.


## Clinical Applications and Impact
Synthesizing the technical findings, Merlin's versatility positions it as a powerful tool for improving diagnostics, prognostics, and clinical workflows.

* **Diagnostic Assistance**: Merlin's ability to classify findings in a zero-shot manner can mitigate the workload of radiologists, acting as a "second reader" to improve efficiency and accuracy.
* **Prognostic Risk Stratification**: The capability to predict the future onset of chronic diseases from a baseline CT scan represents a significant step toward preventive medicine, allowing for opportunistic screening and early interventions.
* **Workflow Optimization**: Automated report generation can function as an AI assistant for radiologists, drafting initial reports that clinicians can review and finalize, accelerating the reporting process.
* **Advancing Medical Research**: As a powerful foundation model, Merlin can be used to analyze large-scale imaging datasets, accelerating the discovery of new biomarkers and understanding of disease progression.

