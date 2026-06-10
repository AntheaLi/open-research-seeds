# Self-Supervised Multimodal Learning through Kuramoto-Inspired Coupling

> **One-sentence hook**: Extend AKOrN's oscillatory neurons to cross-modal binding — learning multimodal representations through synchronization dynamics instead of contrastive loss alignment.

**Contributor**: [Anthea Li](https://github.com/AntheaLi) · MIT CSAIL  

**Background needed**: dynamical systems (ODEs, phase oscillators) + multimodal ML (CLIP-level familiarity) + familiarity with [AKOrN](https://takerum.github.io/akorn_project_page/) (Miyato et al., ICLR 2025 Oral)

**Estimated ramp-up**: ~2–3 weeks to first experiment

---

## Intuition

The brain binds vision, audio, and touch into unified percepts through oscillatory synchronization — neurons representing different modalities phase-lock through coupling. Miyato et al. (2024) took this idea seriously for single-modality processing: their [Artificial Kuramoto Oscillatory Neurons (AKOrN)](https://takerum.github.io/akorn_project_page/) replace standard threshold activations with coupled oscillators governed by a generalized Kuramoto model. The results are striking — AKOrN achieves state-of-the-art object discovery without slots, strong adversarial robustness without adversarial training, and near-perfect OOD Sudoku reasoning via test-time compute scaling. These capabilities emerge from the dynamics itself, not from the training objective.

But AKOrN operates within a single modality. The neuroscience motivation it draws from — oscillatory binding — is fundamentally a *cross-modal* mechanism. When you perceive a speaker, visual lip-movement neurons and auditory speech neurons synchronize through inter-area coupling. This is how the brain solves multimodal correspondence, and it's exactly what current contrastive methods like CLIP and ImageBind approximate with static embedding alignment.

The idea is the natural next step: use Kuramoto coupling *between* modality-specific oscillator banks to learn multimodal representations. Each modality gets its own AKOrN-style encoder where intra-modal oscillators learn features through synchronization. Cross-modal coupling terms then bind features across modalities — vision oscillators couple to language oscillators, and the synchronized state *is* the multimodal representation. Semantically corresponding inputs synchronize; non-corresponding inputs don't.

This buys you things contrastive approaches don't: (1) *partial* alignment — two modalities can partially synchronize, matching real situations like a video with background noise where audio and vision are loosely coupled; (2) *temporal dynamics* — the synchronization trajectory carries information about correspondence strength, not just a binary match/no-match; (3) natural scaling to $N$ modalities without pairwise contrastive terms, since Kuramoto coupling handles many-body interactions natively. And unlike building from scratch, AKOrN provides a tested foundation: the intra-modal dynamics already work.

## Entry Point

**Starting from AKOrN**: AKOrN represents activations as multi-dimensional vector oscillators on the unit sphere: each oscillator $\mathbf{x}_i \in \mathbb{R}^N$ with $\|\mathbf{x}_i\|_2 = 1$. The dynamics are:

$$
\dot{\mathbf{x}}_i = \mathbf{\Omega}_i \mathbf{x}_i + \mathrm{Proj}_{\mathbf{x}_i}\!\left(\mathbf{c}_i + \sum_j \mathbf{J}_{ij}\, \mathbf{x}_j\right)
$$

where $\mathbf{\Omega}_i$ is an anti-symmetric natural frequency matrix, $\mathbf{J}_{ij}$ is the coupling matrix, $\mathbf{c}_i$ is a data-dependent symmetry-breaking stimulus (computed from the input), and $\mathrm{Proj}$ keeps oscillators on the sphere. AKOrN stacks these as layers: a Kuramoto layer updates oscillators, then a readout module extracts features to produce the next layer's conditional stimuli $\mathbf{C}$.

**Cross-modal extension**: Give each modality its own AKOrN encoder with intra-modal coupling $\mathbf{J}^{\text{intra}}$ and conditional stimuli $\mathbf{C}$ derived from its input. Then add a cross-modal coupling term that lets oscillators in one modality pull on oscillators in the other:

$$
\dot{\mathbf{x}}_i^{(v)} = \mathbf{\Omega}_i^{(v)} \mathbf{x}_i^{(v)} + \mathrm{Proj}_{\mathbf{x}_i^{(v)}}\!\left(\mathbf{c}_i^{(v)} + \sum_j \mathbf{J}_{ij}^{\text{intra}} \mathbf{x}_j^{(v)} + \sum_k \mathbf{J}_{ik}^{\text{cross}} \mathbf{x}_k^{(l)}\right)
$$

where $\mathbf{x}^{(v)}$ and $\mathbf{x}^{(l)}$ are vision and language oscillators respectively. The cross-modal coupling $\mathbf{J}^{\text{cross}}$ is the key learnable component — it can be dense, low-rank, or input-conditioned via a hypernetwork.

For intuition, the scalar Kuramoto model underlying all of this is:

$$
\frac{d\theta_i}{dt} = \omega_i + \frac{K}{N} \sum_j \sin(\theta_j - \theta_i)
$$

where $\theta_i$ are oscillator phases, $\omega_i$ are natural frequencies, and $K$ is coupling strength. The different Kuramoto variants that may be relevant (forced oscillation, time-delayed coupling, amplitude-phase coupling):

$$
\frac{d\theta_i}{dt} = \omega_i + \sum_{j} K_{ij} \sin(\theta_j - \theta_i) \quad \rightarrow \quad
\begin{aligned}
\frac{d\theta_i}{dt} &= \omega_i + \frac{K}{N} \sum_{j=1}^{N} \sin(h\theta_j - p\theta_i) \\[1ex]
\frac{d\theta}{dt} &= \omega + K \sin(\Omega t - \theta) \\[1ex]
\frac{d\theta_i}{dt} &= \omega_i + \frac{K}{N} \sum_{j=1}^{N} \sin(\theta_j(t - \tau) - \theta_i(t)) \\[1ex]
\frac{dA_i}{dt} &= f(A_i, \theta_k) \\[1ex]
\frac{d\theta_k}{dt} &= \omega_k + K A_i \sin(\theta_i - \theta_k)
\end{aligned}
$$

**Data**: Start with a paired image-text dataset (e.g., CC3M or a subset). Extend to audio-visual (VGGSound) or video-text later.

**Training signal**: Measure cross-modal synchronization after running the coupled dynamics. The scalar order parameter $r = |1/N \sum \exp(i\theta_j)|$ quantifies this for the scalar case; for AKOrN's vector oscillators, use the mean resultant length of oscillator vectors across modalities. For matched pairs, cross-modal $r$ should be high; for mismatched pairs, low. AKOrN's energy provides an additional signal — the energy of the coupled system should be lower for semantically matched pairs, mirroring the energy-based confidence AKOrN already exhibits in reasoning tasks.

**Success signal**: Competitive zero-shot retrieval on Flickr30k or COCO validates the mechanism. The more distinctive test is partial-correspondence settings — noisy captions, loosely-aligned video-audio — where continuous synchronization dynamics should outperform binary contrastive objectives. Also test whether the order parameter trajectory predicts human-annotated semantic similarity scores, and whether test-time extension of Kuramoto steps (which dramatically improved AKOrN's reasoning) improves retrieval on harder examples.

## What Could Go Wrong

- **Oscillator dimension sensitivity**: AKOrN found that $N > 32$ loses the ability to bind features — object discovery and reasoning both degrade sharply. Cross-modal coupling introduces additional degrees of freedom that may make this worse. Start with small oscillator dimensions ($N = 4$–$16$).
- **Intra-modal vs. cross-modal interference**: Oscillators need to balance two coupling signals — binding features within a modality and binding features across modalities. Cross-modal coupling that's too strong early in training could prevent intra-modal features from forming. You may need to schedule cross-modal coupling strength (weak early, stronger later) or alternate intra/cross-modal Kuramoto steps.
- **Synchronization collapse**: If cross-modal coupling is too strong, everything synchronizes trivially and the representation loses discriminative power. If too weak, gradient signal is negligible. AKOrN's energy-based confidence suggests monitoring the energy landscape during training as a diagnostic.
- **Computational cost**: AKOrN already iterates Kuramoto dynamics for multiple steps per layer. Cross-modal coupling roughly doubles the coupling computation per step. Start with a single cross-modal coupling applied after the final AKOrN layer, not at every layer.
- **Generalized synchronization measure**: The scalar order parameter $r$ doesn't directly apply to AKOrN's sphere-valued vector oscillators. You need a synchronization measure for the vector case — mean resultant length, or the energy of the cross-modal coupling terms — and it's not obvious which will give the best gradient signal.

## Materials

- 📊 Slides: [motivation & framework slides](https://docs.google.com/presentation/d/1LqyTUMEEqz7_L5pqlvKz1VhwKqNeN86g/edit?usp=sharing&ouid=116375270758487007474&rtpof=true&sd=true)

## Annotated Readings

See [references.md](./references.md) for the full annotated reading list.

Key papers to start with:

1. **Miyato et al. (2024)** — [*Artificial Kuramoto Oscillatory Neurons*](https://takerum.github.io/akorn_project_page/) (ICLR 2025 Oral) — The direct foundation for this project. Read carefully: the vector-valued Kuramoto formulation on spheres, the symmetry-breaking conditional stimuli, the Kuramoto-layer + readout-module architecture, and especially the finding that oscillator dimension $N > 32$ kills binding ability. The energy-based confidence and test-time compute scaling results suggest mechanisms that should transfer to cross-modal binding. [Code](https://github.com/autonomousvision/akorn).

2. **Kuramoto (1975)** — *Self-entrainment of a population of coupled non-linear oscillators* — The original scalar model. Read for the order parameter formulation and the phase transition at critical coupling — this is the mathematical intuition underlying AKOrN's dynamics.

3. **Radford et al. (2021)** — [*Learning Transferable Visual Models From Natural Language Supervision (CLIP)*](https://arxiv.org/abs/2103.00020) — The contrastive baseline to beat/complement. Study the failure modes: CLIP struggles with compositional semantics, fine-grained spatial relations, and partial correspondences — exactly the cases where dynamics-based coupling might do better.

4. **Sengupta et al. (2022)** — [*Predicting brain synchronization from functional connectivity*](https://doi.org/10.1038/s41467-022-29632-9) — Establishes the empirical connection between Kuramoto dynamics and real cross-modal binding in cortex. Motivates why the extension from single-modality AKOrN to cross-modal coupling is neuroscientifically grounded.

5. **Chen et al. (2018)** — [*Neural Ordinary Differential Equations*](https://arxiv.org/abs/1806.07366) — The adjoint sensitivity method for backpropagating through ODE dynamics. AKOrN uses discrete Kuramoto steps, but if you want continuous-time cross-modal dynamics, this is the machinery.

6. **Gong et al. (2023)** — [*ImageBind*](https://arxiv.org/abs/2305.05665) — Six-modality alignment via shared embeddings. Note the engineering overhead: explicit binding pairs for each modality combination. Kuramoto coupling would let you add modalities without pairwise supervision.

## Discussion

💬 **Working on this or something related?** Open an issue using the "Working on an Idea" template or join the discussion thread.

---

*Contributed by [Anthea Li](https://github.com/AntheaLi) · June 2026*
