# Annotated Readings: Task-Driven Sensor Design

## Core (read these first)

1. **Brahmbhatt et al. (2019)** — [*ContactDB: Analyzing and Predicting Grasp Contact via Thermal Imaging*](https://arxiv.org/abs/1904.06830) — CVPR  
   *Human contact maps for 50 household objects captured via thermal imaging. This is your empirical grounding — the "where does contact actually happen" data. Pay attention to the per-object heatmaps and how they vary: some objects have concentrated contact (e.g., tool handles), others are distributed (e.g., bowls). This variance is what makes the optimization non-trivial.*

2. **Chao et al. (2021)** — [*DexYCB: A Benchmark for Capturing Hand Grasping of Objects*](https://arxiv.org/abs/2104.04631) — CVPR  
   *Complements ContactDB with full hand-object meshes during grasping. Useful for Phase 1 if you want 3D contact geometry (not just 2D heatmaps). The multi-view capture setup also suggests how you might collect richer contact data for a larger task set.*

3. **Krause & Golovin (2014)** — [*Submodular Function Maximization*](https://doi.org/10.1017/CBO9781139177801.004)  
   *The electrode placement objective is naturally submodular (adding an electrode has diminishing returns on information coverage). This chapter gives you the greedy algorithm with (1-1/e) approximation guarantee — your first-pass optimizer. Read sections on constrained submodular optimization for handling manufacturing constraints.*

## Background (fill gaps as needed)

4. **Johansson & Flanagan (2009)** — [*Coding and use of tactile signals from the fingertips in object manipulation tasks*](https://doi.org/10.1038/nrn2621) — Nature Reviews Neuroscience  
   *The neuroscience of human tactile sensing for manipulation. Key takeaway: mechanoreceptor types (SA-I, RA-I, SA-II, RA-II) have different spatial and temporal resolution, and the brain uses task-dependent weighting across types. Your sensor optimization should ideally capture this multi-resolution structure, not just spatial placement.*

5. **Lambeta et al. (2020)** — [*DIGIT: A Novel Design for a Low-Cost Compact High-Resolution Tactile Sensor*](https://arxiv.org/abs/2005.14679) — ICRA  
   *State-of-the-art vision-based tactile sensor. Understand the design choices: GelSight-type optical sensing, compact form factor, trade-off between resolution and coverage. Your optimization framework should be able to express these trade-offs as constraints.*

6. **Ward-Cherrier et al. (2018)** — [*The TacTip Family: Soft Optical Tactile Sensors with 3D-Printed Biomimetic Morphologies*](https://doi.org/10.1089/soro.2017.0052) — Soft Robotics  
   *Biomimetic approach: papillae layout designed to mimic human skin structure. This is the most direct comparison — does your task-driven optimization recover a similar layout, or does it find something that departs from biology in useful ways?*

## Adjacent Work (know what exists)

7. **Bai et al. (2023)** — [*RobotSweater: Scalable, Generalizable, and Customizable Machine-Knitted Tactile Skins*](https://arxiv.org/abs/2303.02862) — IROS  
   *Customizable tactile skin that can cover large areas. Relevant because it makes the "where to place sensors" question more practically important — if you can cover arbitrary surface regions, the layout decision matters more than in fixed-geometry sensors.*

8. **Sundaram et al. (2019)** — [*Learning the signatures of the human grasp using a scalable tactile glove*](https://doi.org/10.1038/s41586-019-1234-z) — Nature  
   *548-sensor glove capturing human grasping patterns. Key data source: they show that grasp signatures are sparse and structured — most of the task-relevant information is concentrated in a small number of sensor clusters. This directly supports the idea that intelligent placement can capture most information with far fewer sensors.*

9. **Calli et al. (2015)** — [*Benchmarking in Manipulation Research: The YCB Object and Model Set*](https://arxiv.org/abs/1502.03143) — RAM  
   *The standard object set for manipulation benchmarks. Use this (or a subset) to define your task distribution — it's diverse enough to create non-trivial sensor placement trade-offs and widely adopted enough that results are comparable.*

10. **Saal et al. (2017)** — [*Simulating tactile signals from the whole hand with applications to neural decoding*](https://doi.org/10.1073/pnas.1704856114) — PNAS  
    *Computational model of mechanoreceptor responses across the full hand. If you want to go beyond binary "contact/no contact" and model what each electrode would actually sense (pressure amplitude, vibration frequency), this paper provides the biophysical model to build on.*
