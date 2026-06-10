# Annotated Readings: Kuramoto-Inspired Multimodal Coupling

## Core (read these first)

1. **Miyato et al. (2024)** — [*Artificial Kuramoto Oscillatory Neurons*](https://arxiv.org/abs/2410.13821) — ICLR 2025 Oral  
   *The direct foundation. Read for: the vector-valued Kuramoto formulation on spheres, the symmetry-breaking conditional stimuli $\mathbf{c}_i$, and the Kuramoto-layer + readout-module architecture. Pay close attention to: (a) oscillator dimension sensitivity — $N > 32$ kills binding ability; (b) the energy-based confidence property — low-energy oscillators give correct predictions; (c) test-time compute scaling — more Kuramoto steps improve reasoning without retraining. All three findings should inform the cross-modal design. [Code](https://github.com/autonomousvision/akorn).*

2. **Kuramoto, Y. (1975)** — *Self-entrainment of a population of coupled non-linear oscillators* — International Symposium on Mathematical Problems in Theoretical Physics  
   *The original scalar model. Focus on the order parameter $r = |1/N \Sigma \exp(i\theta_j)|$ and the phase transition at critical coupling $K_c$. AKOrN generalizes this to vector oscillators, but the scalar intuitions still guide the design.*

3. **Acebrón et al. (2005)** — [*The Kuramoto model: A simple paradigm for synchronization phenomena*](https://doi.org/10.1103/RevModPhys.77.137) — Reviews of Modern Physics  
   *The definitive review. The extensions section (Kuramoto-Sakaguchi with phase frustration, Kuramoto on complex networks) is where you'll look when all-to-all cross-modal coupling proves too coarse. The community detection connection in Section VI is relevant — clusters of synchronized oscillators could map to semantic groups across modalities.*

4. **Radford et al. (2021)** — [*CLIP: Learning Transferable Visual Models From Natural Language Supervision*](https://arxiv.org/abs/2103.00020)  
   *Your contrastive baseline. Study the failure modes: CLIP struggles with compositional semantics, fine-grained spatial relations, and partial correspondences. These are exactly the cases where dynamics-based cross-modal coupling might do better.*

5. **Chen et al. (2018)** — [*Neural Ordinary Differential Equations*](https://arxiv.org/abs/1806.07366) — NeurIPS  
   *The adjoint sensitivity method for backpropagating through ODE dynamics. AKOrN uses discrete Kuramoto steps, but if you want continuous-time cross-modal dynamics this is the machinery.*

## Background (fill gaps as needed)

6. **Löwe et al. (2022)** — [*Complex-Valued Autoencoders for Object Discovery*](https://arxiv.org/abs/2204.02075) — TMLR  
   *Co-authored by Sindy Löwe, also a co-author on AKOrN. Uses complex-valued representations where phase encodes object identity — a precursor to AKOrN's oscillatory approach. Single-modality and feed-forward, but the phase-binding intuition directly informs the cross-modal extension.*

7. **Strogatz (2000)** — [*From Kuramoto to Crawford: Exploring the onset of synchronization in populations of coupled oscillators*](https://doi.org/10.1016/S0167-2789(00)00094-4) — Physica D  
   *Gentler mathematical introduction than Acebrón. Good if your ODE background is rusty. The geometric intuition for why synchronization happens is valuable for understanding what the cross-modal coupling is doing.*

8. **Rodrigues et al. (2016)** — [*The Kuramoto model in complex networks*](https://doi.org/10.1016/j.physrep.2015.10.008) — Physics Reports  
   *If you want to make cross-modal coupling topology learnable (not all-to-all), this is the reference. Sections on modular networks map directly to learning which dimensions of different modalities should couple.*

## Adjacent Work (know what exists)

9. **Gong et al. (2023)** — [*ImageBind*](https://arxiv.org/abs/2305.05665) — CVPR  
   *Six-modality alignment via a shared embedding space anchored on image-text pairs. Note the engineering overhead: explicit binding pairs for each modality combination. Kuramoto coupling would let you add modalities without pairwise supervision.*

10. **Sengupta et al. (2022)** — [*Predicting brain synchronization from functional connectivity*](https://doi.org/10.1038/s41467-022-29632-9) — Nature Communications  
    *Establishes that Kuramoto-like dynamics accurately predict real cross-modal synchronization in the brain. Useful as motivation and for potential evaluation: can your learned cross-modal coupling parameters predict neural synchronization patterns?*

11. **Ha et al. (2017)** — [*HyperNetworks*](https://arxiv.org/abs/1609.09106) — ICLR  
    *Relevant if you want input-conditioned cross-modal coupling. A hypernetwork that generates $\mathbf{J}^{\text{cross}}$ conditioned on both modalities' embeddings would let the coupling adapt to each input pair.*
