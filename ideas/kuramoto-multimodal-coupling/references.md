# Annotated Readings: Kuramoto-Inspired Multimodal Coupling

## Core (read these first)

1. **Kuramoto, Y. (1975)** — *Self-entrainment of a population of coupled non-linear oscillators* — International Symposium on Mathematical Problems in Theoretical Physics  
   *The foundational paper. Focus on: the order parameter r = |1/N Σ exp(iθ_j)| as a measure of collective synchronization, and the phase transition at critical coupling K_c. This is the quantity you'll use as your training signal.*

2. **Acebrón et al. (2005)** — [*The Kuramoto model: A simple paradigm for synchronization phenomena*](https://doi.org/10.1103/RevModPhys.77.137) — Reviews of Modern Physics  
   *The definitive review. Sections on extensions (Kuramoto-Sakaguchi with phase frustration, Kuramoto on complex networks) are where you'll look when the vanilla model proves too simple. The community detection connection in Section VI is relevant — clusters of synchronized oscillators could map to semantic clusters in multimodal space.*

3. **Radford et al. (2021)** — [*CLIP: Learning Transferable Visual Models From Natural Language Supervision*](https://arxiv.org/abs/2103.00020)  
   *Your contrastive baseline. Study the failure modes: CLIP struggles with compositional semantics, fine-grained spatial relations, and partial correspondences between modalities. These are exactly the cases where a dynamics-based coupling might do better.*

4. **Chen et al. (2018)** — [*Neural Ordinary Differential Equations*](https://arxiv.org/abs/1806.07366) — NeurIPS  
   *The technical machinery for backpropagating through ODE dynamics. The adjoint sensitivity method (Section 2.2) is what makes the Kuramoto layer trainable end-to-end without storing all intermediate states.*

## Background (fill gaps as needed)

5. **Strogatz (2000)** — [*From Kuramoto to Crawford: Exploring the onset of synchronization in populations of coupled oscillators*](https://doi.org/10.1016/S0167-2789(00)00094-4) — Physica D  
   *Gentler introduction to the mathematics than Acebrón. Good if your ODE background is rusty. The geometric intuition for why synchronization happens is valuable for building intuition about what the model is doing.*

6. **Rodrigues et al. (2016)** — [*The Kuramoto model in complex networks*](https://doi.org/10.1016/j.physrep.2015.10.008) — Physics Reports  
   *If you want to make the coupling topology learnable (not all-to-all), this is the reference. Sections on modular networks map directly to the idea of learning which dimensions of different modalities should couple.*

7. **Gong et al. (2023)** — [*ImageBind*](https://arxiv.org/abs/2305.05665) — CVPR  
   *Six-modality alignment via a shared embedding space anchored on image-text pairs. Notice the engineering overhead: they need explicit binding pairs for each modality combination. Kuramoto coupling would let you add modalities without pairwise supervision.*

## Adjacent Work (know what exists)

8. **Löwe et al. (2022)** — [*Complex-Valued Autoencoders for Object Discovery*](https://arxiv.org/abs/2204.02075) — TMLR  
   *Uses complex-valued representations where the phase encodes object identity. Related in spirit — they use phase to bind, but in a single-modality, feed-forward setting. The Kuramoto approach adds explicit dynamics and cross-modal coupling.*

9. **Sengupta et al. (2022)** — [*Predicting brain synchronization from functional connectivity*](https://doi.org/10.1038/s41467-022-29632-9) — Nature Communications  
   *Establishes that Kuramoto-like dynamics accurately predict real cross-modal synchronization patterns in the brain. Useful both as motivation and for potential evaluation: can your learned coupling parameters predict neural synchronization patterns?*

10. **Ha et al. (2017)** — [*HyperNetworks*](https://arxiv.org/abs/1609.09106) — ICLR  
    *Relevant if you want to make coupling parameters input-dependent. A hypernetwork that generates coupling strengths conditioned on both modalities' embeddings would let the dynamics adapt to each input pair.*
