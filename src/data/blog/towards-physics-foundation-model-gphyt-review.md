---
author: Vincenzo Yuto Civale
pubDatetime: 2025-09-21T04:59:04.866Z
modDatetime: 2025-09-21T17:19:20.763Z
title: Towards a Physics Foundation Model
slug: towards-physics-foundation-model-gphyt-review
featured: false
draft: false
tags:
  - Paper-Review
  - Physics-ML
description: The General Physics Transformer introduces in-context learning to physics simulations, allowing a single model to infer underlying dynamics from prior physical states and generalize to new conditions without retraining. 
paperUrl: https://arxiv.org/abs/2509.13805
repoUrl: https://github.com/FloWsnr/General-Physics-Transformer.git
---

## Table of contents

## Architecture

The General Physics Transformer (GP$_{hy}$T) is a hybrid architecture that combines transformer-based deep learning with classical numerical methods to enable generalisable physics simulation. The model's core innovation is its spatiotemporal transformer architecture, which is designed to learn physical dynamics through in-context learning, a process similar to that used by large language models to adapt to new tasks.

![architecture](@/assets/images/2025/towards-physics-foundation-model-gphyt-review/architecture.png)

The architecture comprises two primary components: a neural differentiator and a numerical integrator. The neural differentiator first tokenises multiple time snapshots of physical fields (such as pressure, velocity and temperature) into non-overlapping spatiotemporal 'tubelets', which span both spatial and temporal dimensions. These patches are then processed through a unified spatiotemporal transformer, which applies attention across all time and space dimensions simultaneously rather than using factorised approaches. This unified attention mechanism maximises the model's ability to capture complex, non-separable physical phenomena such as turbulence and shock wave interactions.

To improve the model's capacity to detect sharp gradients and provide local information, the input is supplemented with first-order spatial and temporal derivatives, computed using central differences. The neural differentiator then predicts the **time derivative** (partial derivative with respect to time) of the physical state.

### Numerical Integrator

With the learned time derivative, we can predict the next state of the system, $X_{t_{i+1}}$, using a numerical integration step. The general form of the integration is:

$$
X_{t_{i+1}} = f\big(X_{t_i}, \frac{\partial X}{\partial t}\big|_{t_i}, \Delta t\big)
$$

This is then fed to a **Forward Euler numerical integrator** to compute the next time state. This hybrid approach combines the expressivity of deep learning with the stability of classical numerical methods.

## Dataset and Strategy of Training

The researchers curated a comprehensive dataset comprising over 2.4 million simulation snapshots totalling 1.8 TB of data across eight distinct physical systems. This includes public benchmarks from 'The Well', such as incompressible shear flow, compressible Euler equations and Rayleigh–Bénard convection, as well as custom simulations introducing complex geometries, boundary layer formations, vortex shedding and multi-phase dynamics.
Two critical data augmentation strategies were employed to facilitate in-context learning.
 - **Variable Time Increments**: Simulation trajectories were subsampled using multiple time step sizes (Δt), forcing the model to infer temporal scales from the context rather than relying on fixed intervals.
 - **Per-Dataset Normalisation**: Each dataset is normalised independently, compelling the model to infer absolute magnitudes and spatial scales purely from the input context.

These strategies encourage GP_(hy)T to develop a context-dependent understanding rather than memorising dataset-specific patterns, thus enabling true in-context learning capabilities.

## Performance of Multi-Physics Learning 

GP$_{hy}$T demonstrated superior performance across diverse physical systems, achieving substantial improvements over specialised architectures. Compared to UNet, the model showed a 5× reduction in median mean squared error (MSE), and an impressive 29× reduction compared to the Fourier Neural Operator (FNO) at equivalent model sizes.

![Bar plot](@/assets/images/2025/towards-physics-foundation-model-gphyt-review/bar_plot.png)

The model's effectiveness is particularly evident in challenging scenarios involving discontinuities and chaotic dynamics. While FNO produces overly smoothed predictions and UNet exhibits feature diffusion, GP_$(hy)$T accurately tracks fine-scale vortical structures and convective plumes while maintaining sharp shock fronts.

![Performance](@/assets/images/2025/towards-physics-foundation-model-gphyt-review/performance.png)


## Zero-Shot Generalisation Capabilities

A key breakthrough demonstrated by GP$_{hy}$T is its emergent ability to perform zero-shot generalization to entirely new physical conditions without additional training. When tested on systems with modified boundary conditions that were not encountered during training, such as 'open' boundary conditions for incompressible flow and Euler systems, the model achieved MSE values that were almost identical to those achieved on known boundary conditions.

Even more remarkably, when evaluated on physics that were not present in the training data, such as supersonic flow around obstacles and turbulent radiative layers, the GP$_{hy}$T model successfully captured essential dynamics, such as bow shock formation and turbulent features, despite higher MSE values. This demonstrates the model's ability to extrapolate physical principles and generate plausible outcomes for phenomena it has not encountered before.

![Zero shot](@/assets/images/2025/towards-physics-foundation-model-gphyt-review/zero-shot.png)


## Long-range temporal stability

GP$_{hy}$T ensures stability and physical consistency throughout extended autoregressive rollouts, which is essential for practical applications. In 50-timestep rollouts for Euler shock waves, the model preserved global dynamics and large-scale structures, exhibiting controlled error accumulation.

For most known physical systems, GP$_{hy}$T exhibited near-linear error accumulation over 25 timesteps. Notably, for systems outside the training distribution with modified boundary conditions, error trajectories remained comparable to those in the training set, indicating the successful disentanglement of bulk dynamics from boundary effects.

![Zero shot](@/assets/images/2025/towards-physics-foundation-model-gphyt-review/long_range.png)

## Conclusion and future directions

This work represents a significant step towards realising physics foundation models that could transform computational science and engineering. By showing that transformer-based models can learn generalisable physical principles and adapt to new scenarios through in-context learning, GP$_{hy}$T paves the way for universal physics engines.
The potential impact includes democratising access to high-fidelity simulations, accelerating scientific discovery across multiple domains and reducing the traditionally high computational cost of developing specialised solvers. However, the model currently has several limitations: it is restricted to 2D systems, requires further improvements in long-term stability for practical deployment and covers a limited range of physical phenomena.
Future work will need to address extension to 3D systems, incorporation of broader physics domains beyond fluid dynamics, variable resolution capabilities and enhanced long-term prediction accuracy. Despite these challenges, GP$_{hy}$T demonstrates the feasibility of foundation models for physics and opens promising avenues for AI-driven scientific computation.