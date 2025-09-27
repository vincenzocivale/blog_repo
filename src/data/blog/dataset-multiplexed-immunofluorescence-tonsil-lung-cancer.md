---
author: Vincenzo Yuto Civale
pubDatetime: 2024-01-05T15:20:35Z
modDatetime: 2024-06-13T16:46:34.155Z
title: Dataset of Multiplexed Immunofluorescence of Tonsil and Lung Cancer 
slug: dataset-multiplexed-immunofluorescence-tonsil-lung-cancer
featured: false
draft: False
tags:
 - Dataset
 - Immunology
 - Single-Cell
description: A cancer dataset generated with tissue-based cyclic immunofluorescence (t-CyCIF). By combining high-resolution imaging with single-cell data, it reveals the hidden dynamics of tumor ecosystems and the immune microenvironment
paperUrl: https://www.nature.com/articles/s41597-019-0332-y
repoUrl: https://www.synapse.org/Synapse:syn17865732/wiki/592782
---

## Table of Contents

## Introduction

When picturing a tumor, it is easy to imagine a uniform lump of rogue cells. In reality, it is a complex ecosystem where cancer cells interact with immune cells, blood vessels, and supportive structures. Understanding these interactions is crucial, as they often dictate how well treatments, especially immunotherapies, work. Traditional imaging methods, however, fall short in capturing this molecular complexity. A new technique, tissue, based cyclic immunofluorescence (t-CyCIF), is changing that. By producing detailed, multilayered maps of tissue slices, it reveals the hidden dynamics of tumor ecosystems and opens new paths toward more effective cancer therapies.


## Dataset Overview

This table provides a concise overview of the cancer-immune dataset, highlighting the types of tissues included, the main components of the resource, and the detailed single-cell information available. It emphasizes how the dataset captures both the complexity of tumor samples and the structured organization of a healthy immune system, offering researchers a rich foundation for exploring cellular diversity and spatial interactions.

| Aspect              | Description                                                                                                                                                                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tissue Types**    | - **Lung cancer samples (3):** <br>   • Primary tumors <br>   • Metastatic tumors <br>   • Different stages of disease progression <br> - **Healthy tonsil:** <br>   • Serves as a control <br>   • Rich in diverse, well-organized immune cell populations                                                                             |
| **Main Components** | - **High-resolution images:** <br>   • Created using t-CyCIF <br>   • Up to 28 fluorescent markers per tissue slice <br>   • Reveal spatial organization of cancer, immune, and structural cells <br> - **Single-cell data:** <br>   • Hundreds of thousands of segmented cells <br>   • Each cell digitally outlined and characterized |
| **Data per Cell**   | ~60+ quantitative features extracted <br> - **Morphology:** size, shape, nuclear features <br> - **Localization:** exact spatial coordinates within tissue <br> - **Marker intensity:** brightness levels for each of the 28 proteins <br> - Enables identification of cell type and functional state                                 |



## The neighbourhood is what matters, not the cell

In order to gain a comprehensive understanding of the progression and response of cancer to treatment, it is essential that scientists extend their research beyond the malignant cells to the surrounding environment, which is known as the tumour microenvironment. This landscape is a dynamic battlefield where cancer cells and various immune cell populations are locked in a complex interplay. It is imperative to gain insight into the identities, locations and interactions of these cells if cancer therapy is to be advanced.

This comprehensive characterisation of the immune system, which captures its state and architecture, is known as "immunophenotyping". Researchers hypothesise that this approach is pivotal in the identification of novel biomarker signatures that can predict patient response to specific therapeutic interventions. This assertion is particularly salient in the context of immunotherapies, such as checkpoint inhibitors that target PD-1 or CTLA-4. These agents are engineered to modulate the intricate interactions between tumour cells and immune cells, thereby manipulating the immune response to the tumour. Through the meticulous mapping of these cellular neighborhoods, scientists aspire to elucidate the reasons underlying the efficacy of these potent treatments for certain patients while acknowledging the fact that others do not respond positively. This approach enables the identification of those areas of resistance that may prove to be intractable.

"A more profound comprehension of immune cell states, location, interactions, and architecture (i.e. immunophenotypes) holds the potential to furnish novel prognostic and predictive insights for cancer research and treatment."

## Staining, imaging and bleaching reveal dozens of markers

The t-CyCIF method represents a sophisticated solution to a fundamental imaging problem, namely, how to observe multiple proteins within a single tissue sample when a microscope is only capable of discerning a limited number of colours at any given time. The technique builds a "high-plex" image, one with multiple layers of information, by sequentially overlaying a series of basic, four-color images.

The process is iterative. Initially, scientists apply a number of antibodies, each of which has been tagged with a fluorescent dye, to a thin slice of tissue. These antibodies bind to specific proteins, rendering them visible under a special microscope. The process entails the capture of a high-resolution image, which serves to map the location of the initial proteins. Subsequently, a chemical process involving H2O2 and an LED light is employed to "bleach" or inactivate the fluorescent dyes, thereby effectively erasing the image without compromising the integrity of the tissue.

![Overview of data generation. (a) Multiplexed, immunofluorescence images were acquired using the
tissue-based cyclic immunofluorescence (t-CyCIF) method and (b) processed with a series of algorithms and
toolboxes including BaSiC, ASHLAR, ilastik, and histoCAT to obtain single-cell features.](@/assets/images/2025/dataset-multiplexed-immunofluorescence-tonsil-lung-cancer/acquisition_methods.png)

This bleaching process serves to reset the slide, thereby enabling the researchers to apply a new set of fluorescently-labeled antibodies and repeat the entire process. It has been established that, by performing the aforementioned cycle of staining, imaging, and bleaching 11 to 12 times, it is possible to generate a stack of images. The subsequent computational alignment and merging of these images results in the creation of a single, comprehensive map, thereby revealing the location of targets for 27 different antibodies across the entire tissue sample.

## Teaching a computer to "see" a cell is not easy.

After creating a massive, multi-layered digital image containing hundreds of thousands of cells, researchers are faced with another monumental task: teaching a computer to identify the precise boundary of each cell. This process, known as 'segmentation', is essential for extracting quantitative data about the location and expression of each cell's proteins.

![Assessment of segmentation. (a) Representative images of DAPI staining and corresponding
segmentation mask in TONSIL-1 and LUNG-3-PR. (b) Examples of fusion (under-segmentation) and (c)
fission/splitting (over-segmentation)](@/assets/images/2025/dataset-multiplexed-immunofluorescence-tonsil-lung-cancer/segmentation.png)

To accomplish this, the researchers used a program called Ilastik. First, a scientist manually labels small regions of the image, identifying pixels as belonging to a 'nucleus', 'cytoplasm', or 'background'. Crucially, while the scientist is training the programme using only the simple nuclear stain, the algorithm is learning by analysing all 44 channels of data at once. It uses the combined information from every protein marker to make its decision ,  a feat of computation far beyond human capacity. This human-guided training teaches the pixel classification algorithm to recognise these different components across the entire image and generate a probability mask that is used to identify the boundaries of each cell nucleus.

Even with this sophisticated approach, errors are inevitable. The two main types of error are 'fusion' (under-segmentation), where the computer mistakes multiple cells for one large cell, and 'fission' (over-segmentation), where it incorrectly splits one cell into multiple cells. The process achieved an impressive accuracy rate of nearly 90% across different tissue types, but the remaining errors highlight the immense technical challenge of accurately analysing these incredibly complex and dense biological images.

## A 2D image of a 3D world can create scientific puzzles

One of the most counterintuitive findings to emerge from the research was based on a simple physical reality: a tissue slice is not perfectly flat. Although the slices are incredibly thin (only 5 micrometres), they are still three-dimensional structures packed with cells.

When a three-dimensional object such as a cell is projected into a two-dimensional image, signals from different parts of the cell ,  its nucleus, cytoplasm and outer membrane, can overlap and intermingle. Researchers observed this phenomenon directly when they found that the signal from the area they identified as the nucleus also captured signals from proteins located in the cytoplasm and on the cell membrane.

This observation led to a practical solution for a difficult problem. In dense tissue such as that found in tumours and tonsils, attempting to programmatically expand the boundary from the nucleus in order to perfectly capture the cytoplasm often resulted in the accidental inclusion of signals from neighbouring cells. Given the signal overlap, the researchers found that using the more easily defined nuclear mask to measure all protein markers was a reliable and necessary strategy. This pragmatic compromise was crucial in ensuring data accuracy, as it acknowledged the inherent difficulty of translating a 3D biological world into 2D data.