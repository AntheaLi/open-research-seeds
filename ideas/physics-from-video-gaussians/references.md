# Annotated Readings: Learning Physics from Video via Dynamic Gaussians

## Core (read these first)

1. **Brunton, Proctor & Kutz (2016)** — [*Discovering governing equations from data by sparse identification of nonlinear dynamical systems (SINDy)*](https://doi.org/10.1073/pnas.1517384113) — PNAS  
   *The algorithm you'll use for equation discovery. Key idea: given state trajectories and their time derivatives, build a library of candidate nonlinear functions and solve a sparse regression to identify which terms appear in the governing equation. The sparsity prior is what makes this work — most physical laws involve only a few terms. Section 2 gives the full algorithm; the examples in Section 3 (Lorenz, vortex shedding) show what "success" looks like.*

2. **Schmid (2010)** — [*Dynamic mode decomposition of numerical and experimental data*](https://doi.org/10.1017/S0022112010001217) — Journal of Fluid Mechanics  
   *The foundational DMD paper. DMD computes a best-fit linear operator from snapshot data and returns eigenvalues (frequencies, growth rates) and spatial modes. Think of it as a data-driven Fourier decomposition that also captures transient dynamics. The connection to Koopman theory (Section 4) is why the modes are physically meaningful.*

3. **Luiten et al. (2024)** — [*Dynamic 3D Gaussians: Tracking by Persistent Dynamic View Synthesis*](https://arxiv.org/abs/2308.09713) — CVPR  
   *Dynamic Gaussians with persistent identity. Their regularization strategy is what you need: local rigidity loss ensures nearby Gaussians move together (like a rigid body), and a long-range tracking term maintains identity over time. Adapt this to 2D — you don't need multi-view or depth, just the trajectory regularization.*

4. **Kerbl et al. (2023)** — [*3D Gaussian Splatting for Real-Time Radiance Field Rendering*](https://arxiv.org/abs/2308.04079) — SIGGRAPH  
   *The Gaussian splatting paper. Read for the differentiable rasterizer and the adaptive density control (splitting and cloning Gaussians). For the physics application, you'll want to *constrain* adaptive density control — you don't want Gaussians freely splitting during dynamics, since that breaks the "persistent particle" interpretation.*

## Background (fill gaps as needed)

5. **Kutz, Brunton, Brunton & Proctor (2016)** — [*Dynamic Mode Decomposition: Data-Driven Modeling of Complex Systems*](https://doi.org/10.1137/1.9781611974508) — SIAM  
   *The DMD textbook. Chapters 1-3 give you everything needed for implementation. Chapter 7 on extensions (multi-resolution DMD, optimized DMD) is relevant when standard DMD doesn't cleanly separate modes — likely for complex scenes with multiple timescales.*

6. **de Silva et al. (2020)** — [*PySINDy: A Python package for the sparse identification of nonlinear dynamical systems*](https://doi.org/10.21105/joss.02104) — JOSS  
   *The library you'll use. Read the documentation more than the paper — the API for defining custom candidate libraries and choosing sparsification methods (STLSQ, SR3, constrained SR3) is what matters for implementation.*

7. **Demo, Tezzele & Rozza (2018)** — [*PyDMD: Python Dynamic Mode Decomposition*](https://doi.org/10.21105/joss.00530) — JOSS  
   *Same as above — the library documentation is more useful than the paper. Key classes: DMD (standard), BOPDMD (optimized), MrDMD (multi-resolution for multi-timescale dynamics).*

## Adjacent Work (know what exists)

8. **Champion, Lusch, Kutz & Brunton (2019)** — [*Data-driven discovery of coordinates and governing equations*](https://doi.org/10.1073/pnas.1906995116) — PNAS  
   *SINDy-Autoencoders: jointly learn a coordinate system and governing equations. The closest prior work to this idea. The key difference: they use a generic autoencoder for the coordinate discovery, which gives a latent space that's effective for equation fitting but not physically interpretable. Gaussians give you coordinates that are *grounded in the visual scene* — you can point to where each state variable lives in the image. Compare your results against theirs on the same benchmarks.*

9. **Cranmer et al. (2020)** — [*Discovering Symbolic Models from Deep Learning with Inductive Biases*](https://arxiv.org/abs/2006.11287) — NeurIPS  
   *Graph neural networks + symbolic regression for physics discovery. They use a GNN as an intermediate representation between data and equations. The Gaussian approach is an alternative "intermediate representation" that's more visually grounded. The symbolic regression step (using PySR) could complement SINDy for equation discovery.*

10. **Wu et al. (2023)** — [*Neural Scene Flow Fields for Space-Time View Synthesis of Dynamic Scenes*](https://arxiv.org/abs/2011.13084) — CVPR  
    *Scene flow fields from video. Relevant as an alternative to Gaussians for extracting motion fields, but lacks the discrete "particle" structure that makes DMD/SINDy applicable. This contrast helps motivate why Gaussians are the right intermediate representation.*

11. **Brunton, Brunton & Proctor (2022)** — [*Data-Driven Science and Engineering: Machine Learning, Dynamical Systems, and Control*](http://databookuw.com/) — Cambridge University Press  
    *Textbook covering both DMD (Chapters 7-8) and SINDy (Chapter 10) with code examples. Best single reference if you need to build intuition for both methods before implementing the pipeline.*

12. **Kaiser, Kutz & Brunton (2018)** — [*Sparse identification of nonlinear dynamics for model predictive control in the low-data limit*](https://doi.org/10.1098/rspa.2018.0335) — Proc. Royal Society A  
    *SINDy with control inputs. Relevant for the extension where you go beyond passive observation to videos with external forcing (e.g., a hand pushing an object) and want to recover the forced dynamics, not just free dynamics.*
