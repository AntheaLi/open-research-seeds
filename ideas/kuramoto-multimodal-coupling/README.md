# Self-Supervised Multimodal Learning through Kuramoto-Inspired Coupling

> **One-sentence hook**: Learn cross-modal representations through oscillatory synchronization dynamics — the way the brain binds vision, audio, and touch — instead of contrastive loss alignment.

**Contributor**: [Anthea Li](https://github.com/AntheaLi) · MIT CSAIL  

**Background needed**: dynamical systems (ODEs, phase oscillators) + multimodal ML (CLIP-level familiarity)

**Estimated ramp-up**: ~2–3 weeks to first experiment

---

## Intuition

Nearly all current multimodal representation learning works by aligning static embeddings: CLIP pulls image-text pairs together in a shared space via contrastive loss, ImageBind extends this across six modalities, and so on. These approaches learn *that* modalities should be aligned but encode nothing about the *process* by which alignment emerges. The training objective is a proxy for correspondence, not a model of it.

The brain does something fundamentally different. Cross-modal binding — the process by which you perceive a speaker's lip movements, voice, and facial expressions as a unified percept — is mediated by oscillatory synchronization. Neurons representing different modalities fire at different base frequencies, and binding occurs when they phase-lock through coupling. The Kuramoto model is the canonical mathematical description of this: a system of coupled oscillators that spontaneously synchronize above a critical coupling strength.

The idea is to take this literally. Map each modality's embeddings to the phase (or phase + amplitude) of a bank of learnable oscillators. Connect modalities through Kuramoto-like coupling terms. Let the system evolve under the ODE dynamics. The synchronized state *is* the multimodal representation. Instead of learning a loss that says "these should be close," you learn coupling parameters such that semantically corresponding inputs naturally synchronize, and non-corresponding inputs don't.

This buys you several things that contrastive approaches don't: (1) a natural model of *partial* alignment — two modalities can be partially synchronized, which maps to real-world situations like a video with background noise where audio and vision are loosely but not tightly coupled; (2) temporal dynamics — the synchronization process itself carries information about how strongly modalities agree, not just whether they do; (3) a principled way to handle more than two modalities without the combinatorial explosion of pairwise contrastive terms, since Kuramoto coupling scales naturally to $N$ oscillators.

## Entry Point

**Setup**: Take a standard vision-language backbone (e.g., ViT + text transformer) and attach a phase-mapping head to each encoder — a small MLP that maps each modality's embedding to oscillator phases (a vector in $[0, 2\pi)^d$ where $d$ is the number of oscillators per modality).

**Dynamics**: Implement the Kuramoto model as a differentiable ODE layer (using `torchdiffeq` or a simple Euler discretization):

$$
\frac{d\theta_i}{dt} = \omega_i + \frac{K}{N} \sum_j \sin(\theta_j - \theta_i)
$$

where $\theta_i$ are oscillator phases, $\omega_i$ are natural frequencies (learnable), and $K$ is coupling strength. Run this for $T$ steps on paired multimodal inputs. The coupling matrix $K$ can be made input-dependent (conditioned on both modalities' embeddings) for richer dynamics.

Writing out the different kinds of kuramoto model: 

$$
\frac{d\theta_i}{dt} = \omega_i + \sum_{j} K_{ij} \sin(\theta_j - \theta_i) \quad \rightarrow \quad \begin{aligned} \frac{d\theta_i}{dt} &= \omega_i + \frac{K}{N} \sum_{j=1}^{N} \sin(h\theta_j - p\theta_i) \\ \frac{d\theta}{dt} &= \omega + K \sin(\Omega t - \theta) \\ \frac{d\theta_i}{dt} &= \omega_i + \frac{K}{N} \sum_{j=1}^{N} \sin(\theta_j(t - \tau) - \theta_i(t)) \\ \frac{dA_i}{dt} &= f(A_i, \theta_k) \\ \frac{d\theta_k}{dt} &= \omega_k + K A_i \sin(\theta_i - \theta_k) \end{aligned}
$$

**Data**: Start with a paired image-text dataset (e.g., CC3M or a subset). Straightforward to extend to audio-visual (VGGSound) or video-text later.

**Training signal**: After running the ODE for T steps, measure the *order parameter* $r = |1/N \sum \exp(i\theta_j)|$ — a scalar in $[0,1]$ measuring synchronization. For matched pairs, $r$ should be high; for mismatched pairs, low. This gives you a contrastive-like objective but one that emerges from the dynamics rather than being imposed.

**Success signal**: If the synchronized representations (oscillator states at time $T$) achieve competitive zero-shot retrieval performance on Flickr30k or COCO, even if slightly below CLIP, the mechanism is validated. The more interesting signal is whether partial-synchronization states carry useful information — e.g., can you predict annotation agreement scores or semantic similarity gradients from the order parameter trajectory?

## What Could Go Wrong

- The Kuramoto ODE might be too simple — real neural synchronization involves amplitude dynamics, delays, and noise, not just phase coupling. You may need to extend to Kuramoto-Sakaguchi or Stuart-Landau oscillators fairly early.
- Differentiating through ODE dynamics for many steps is expensive and can have vanishing gradients. Adjoint methods help but add complexity.
- The mapping from continuous embeddings to oscillator phases might lose information. The phase-mapping head design is probably critical and under-constrained.
- It's possible that the dynamics converge too fast (everything synchronizes trivially) or too slowly (gradient signal is weak). The coupling strength $K$ and integration time $T$ will need careful tuning.

## Materials

- 📊 Slides: [motivation & framework slides](https://docs.google.com/presentation/d/1LqyTUMEEqz7_L5pqlvKz1VhwKqNeN86g/edit?usp=sharing&ouid=116375270758487007474&rtpof=true&sd=true)

## Annotated Readings

See [references.md](./references.md) for the full annotated reading list.

Key papers to start with:

1. **Miyato et al. (2024)** - [*Artificial Kuramoto Oscillatory Neurons*](https://takerum.github.io/akorn_project_page/) - dynamical alternative to traditional threshold units that binds neurons through synchronization dynamics to enhance performance across diverse tasks, demonstrating the value of foundational dynamical representations.

2. **Kuramoto (1975)** — *Self-entrainment of a population of coupled non-linear oscillators* — The original Kuramoto model. Read for the order parameter formulation and the phase transition at critical coupling — this is the core mathematical tool.

3. **Sengupta et al. (2022)** — [*Predicting brain synchronization from functional connectivity*](https://doi.org/10.1038/s41467-022-29632-9) — Establishes the empirical connection between Kuramoto dynamics and real cross-modal binding in cortex.

4. **Radford et al. (2021)** — [*Learning Transferable Visual Models From Natural Language Supervision (CLIP)*](https://arxiv.org/abs/2103.00020) — The baseline to beat/complement. Understand what static contrastive alignment gives you and where it falls short (hard negatives, partial correspondence).

5. **Chen et al. (2018)** — [*Neural Ordinary Differential Equations*](https://arxiv.org/abs/1806.07366) — The technical backbone for making ODE dynamics differentiable. The adjoint method section is what you need for efficient backprop through the Kuramoto dynamics.

6. **Gong et al. (2023)** — [*ImageBind*](https://arxiv.org/abs/2305.05665) — Multi-modal extension of CLIP to six modalities. Note how they handle the combinatorial problem of pairwise alignment — Kuramoto coupling would give a more principled solution.

## Discussion

💬 **Working on this or something related?** Open an issue using the "Working on an Idea" template or join the discussion thread.

---

*Contributed by [Anthea Li](https://github.com/AntheaLi) · June 2026*
