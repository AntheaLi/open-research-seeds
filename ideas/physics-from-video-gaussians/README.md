# Learning Physics from Video via Dynamic Gaussians and Sparse Dynamics Identification

> **One-sentence hook**: Use 2D dynamic Gaussians as a learned spatial discretization of video, then apply classical dynamics identification (DMD / SINDy) to the Gaussian trajectories to recover governing equations — bridging video pixels to interpretable physics without end-to-end neural ODEs.

**Contributor**: [Anthea Li](https://github.com/AntheaLi) · MIT CSAIL  

**Background needed**: Gaussian splatting (2D/3D) + dynamical systems (DMD, Koopman theory, or SINDy basics)  

**Estimated ramp-up**: ~2–3 weeks to first experiment (pyDMD and PySINDy handle the heavy lifting)

---

## Intuition

Learning physics from video is a problem people have attacked with increasingly powerful neural networks — visual dynamics models, latent neural ODEs, video prediction transformers. But these approaches learn dynamics in representations that are optimized for reconstruction, not for physical interpretability. You get a model that predicts the next frame, but you can't extract the governing equations from it.

The core bottleneck isn't modeling capacity — it's the *state representation*. Classical physics discovery tools like Dynamic Mode Decomposition (DMD) and SINDy are remarkably effective at identifying governing equations, but they need the right input: a set of state variables tracked over time. Pixels aren't that. You need something closer to particles, or at minimum, a spatial discretization where each element has a meaningful trajectory.

2D dynamic Gaussians give you exactly this. Fit a set of Gaussians to a video sequence, where each Gaussian has a learnable position, rotation, scale, and appearance that evolve over time. Add position and rotation regularization so that Gaussians move smoothly and don't arbitrarily jump or merge — this encourages them to *track* physical entities rather than just reconstruct pixels frame-by-frame. What you get out is a set of spatial primitives, each with a trajectory (x, y, θ, σ over time), that together tile the scene.

Now you're in classical territory. Stack the Gaussian state trajectories into a matrix and run DMD: you get a spectral decomposition of the dynamics — DMD modes are spatial patterns, DMD eigenvalues are temporal frequencies and growth/decay rates. This is essentially a Koopman operator approximation learned *through* a differentiable rendering layer. Alternatively, run SINDy-style sparse regression on the trajectories: you get explicit symbolic equations governing each Gaussian's motion, drawn from a library of candidate functions (polynomial, trigonometric, etc.).

The pipeline is: **Video → 2D Dynamic Gaussians → Gaussian State Trajectories → DMD Spectral Basis / SINDy Sparse Equations**. Each piece is well-understood; the contribution is the bridge — using Gaussians as the learned discretization that makes classical identification tools work on raw video.

## Entry Point

**Phase 1 — Dynamic Gaussian Fitting**: Take a simple physics video (pendulum, bouncing ball, two-body spring system — things with known ground-truth equations). Fit 2D dynamic Gaussians to the frames using a differentiable renderer. Key implementation detail: regularize position trajectories for smoothness (L2 on acceleration) and penalize Gaussian splitting/merging so each Gaussian maintains identity across frames. Start with ~50–200 Gaussians depending on scene complexity.

- Use an existing 2D Gaussian splatting codebase (adapt from 3DGS by dropping the z-dimension, or use a lightweight custom implementation — 2D Gaussians are just differentiable ellipses with alpha compositing)
- Training: per-frame reconstruction loss + trajectory smoothness regularization + optional rotation consistency term

**Phase 2 — Dynamics Extraction**: Extract the state matrix: each row is a Gaussian's state (x, y, θ, σ_x, σ_y) at one timestep, each column is a time step. Then:

- **DMD path**: Use [pyDMD](https://github.com/mathLab/PyDMD) to decompose into modes and eigenvalues. Visualize the DMD modes overlaid on the video — do they correspond to physical motion patterns (oscillation, rotation, translation)?
- **SINDy path**: Use [PySINDy](https://github.com/dynamicslab/pysindy) to fit sparse symbolic equations to the trajectories. Define a candidate library (polynomials up to degree 3, sin/cos, products). Do the recovered equations match the known physics?

**Phase 3 — Validation on Known Systems**: Start with systems where you know the ground truth:
- Simple pendulum → should recover θ̈ ≈ -(g/L)sin(θ)
- Spring-mass → should recover ẍ ≈ -(k/m)x
- Two-body problem → should recover coupled oscillator equations

**Success signal**: If SINDy recovers symbolic equations that are structurally correct (right functional form, reasonable coefficients) for at least the simple cases, the pipeline is validated. If DMD eigenvalues match the known oscillation frequencies, that's a strong secondary signal. The exciting next step would be applying this to videos of systems with *unknown* governing equations (e.g., complex fluid flows, deformable objects) and checking if the discovered dynamics are physically plausible or predictive.

## What Could Go Wrong

- **Gaussians might not decompose physically**: A Gaussian might cover half of two different objects, or one object might be split across many Gaussians with correlated trajectories. The regularization design is the make-or-break factor. Too little regularization → rendering artifacts, not physical entities. Too much → Gaussians are too rigid to capture deformation.
- **DMD assumes linearity**: Standard DMD finds a best-fit linear operator. Nonlinear dynamics (which most interesting physics is) need extended DMD (EDMD) with a lifted state space, or kernel DMD. This is straightforward with pyDMD but adds a representation choice.
- **SINDy needs the right candidate library**: If the true dynamics involve terms not in your library (e.g., contact forces, friction), SINDy will fit the wrong equation. Starting with known-physics videos lets you validate the library choice before going to unknown systems.
- **Occlusion breaks Gaussian tracking**: If objects overlap in 2D, Gaussians may lose identity. For the initial experiments, choose videos with minimal occlusion. Longer-term, explicit occlusion handling or lifting to 3D Gaussians would be needed.
- **Scale ambiguity**: 2D Gaussians don't have metric scale. The recovered "equations" will have coefficients in pixel-space units. This is fine for structural identification (is it a harmonic oscillator?) but not for quantitative coefficient recovery without calibration.

## Materials

- 📊 *Slides coming soon*
- 💻 Key libraries: [pyDMD](https://github.com/mathLab/PyDMD), [PySINDy](https://github.com/dynamicslab/pysindy), [diff-gaussian-rasterization](https://github.com/graphdeco-inria/diff-gaussian-rasterization)

## Annotated Readings

See [references.md](./references.md) for the full annotated reading list.

Key papers to start with:

1. **Brunton et al. (2016)** — [*Discovering governing equations from data by sparse identification of nonlinear dynamical systems*](https://doi.org/10.1073/pnas.1517384113) — The SINDy paper. Read for the core algorithm: sparse regression over a library of candidate nonlinear functions. Section 2 is all you need to implement the dynamics identification step.

2. **Schmid (2010)** — [*Dynamic mode decomposition of numerical and experimental data*](https://doi.org/10.1017/S0022112010001217) — The foundational DMD paper. Focus on the connection between DMD modes and Koopman eigenfunctions — this is why DMD gives you physically interpretable spatial modes even from data-driven decomposition.

3. **Luiten et al. (2024)** — [*Dynamic 3D Gaussians: Tracking by Persistent Dynamic View Synthesis*](https://arxiv.org/abs/2308.09713) — Dynamic 3D Gaussians with trajectory regularization. Your 2D version simplifies this significantly (no multi-view, no depth), but the regularization strategy — smooth trajectories, persistent identity — transfers directly.

4. **Kerbl et al. (2023)** — [*3D Gaussian Splatting for Real-Time Radiance Field Rendering*](https://arxiv.org/abs/2308.04079) — The 3DGS paper. Read for the differentiable rasterization pipeline that you'll adapt to 2D. The key insight for your purposes: Gaussians are a *differentiable spatial discretization* with learnable parameters, which is exactly the property you exploit.

5. **Champion et al. (2019)** — [*Data-driven discovery of coordinates and governing equations*](https://doi.org/10.1073/pnas.1906995116) — SINDy with autoencoders: learns coordinates and equations simultaneously. The closest existing work to this idea, but they use a generic autoencoder for coordinates rather than physically-grounded Gaussians. The comparison is: does the Gaussian discretization give you better equations than a learned latent space?

## Discussion

💬 **Working on this or something related?** Open an issue using the "Working on an Idea" template or join the discussion thread.

---

*Contributed by [Anthea Li](https://github.com/AntheaLi) · June 2026*
