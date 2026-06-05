# Task-Driven Sensor Design: Learning Electrode Placement from Human Daily Tasks

> **One-sentence hook**: Instead of designing tactile sensors from engineering intuition, learn where to place electrodes by watching which tasks humans find easy and reverse-engineering what sensing makes that possible.

**Contributor**: [Anthea Li](https://github.com/AntheaLi) · MIT CSAIL  

**Background needed**: robotics (grasping basics) + optimization (differentiable programming or Bayesian optimization)  

**Estimated ramp-up**: ~3–4 weeks to first experiment (sensor simulation is the bottleneck)

---

## Intuition

Current tactile sensor design follows an engineer-driven loop: someone hypothesizes an electrode layout based on mechanical intuition, fabricates it, and evaluates on benchmark tasks. This is slow, expensive, and biased toward the tasks the designer happened to think about. The result is sensors that work well for lab demonstrations but poorly across the actual distribution of daily manipulation tasks.

Humans, by contrast, are extraordinary at manipulation. We can tie shoelaces, crack eggs, thread needles, and feel whether a fruit is ripe — all with the same hardware. The key insight is that human tactile sensing isn't uniformly distributed: mechanoreceptor density varies dramatically across the hand (fingertips ~240/cm² vs. palm ~58/cm²), and this distribution was shaped by evolutionary pressure on exactly the tasks that matter for daily life.

The idea: compile a diverse set of human daily manipulation tasks. For each task, capture high-resolution contact data (pressure maps, contact geometry, force distributions) during human performance. Analyze which spatial regions and frequency bands of tactile information are *necessary* for each task — the information-theoretic bottleneck. Then optimize sensor electrode placement to maximize coverage of these critical sensing channels, subject to manufacturing constraints (minimum electrode spacing, wire routing, total electrode count).

The "difficulty" signal adds another layer: tasks that humans find effortlessly easy (picking up a mug) versus tasks that require concentration (threading a needle) reveal the gradient of sensing demands. A sensor layout optimized for this gradient — prioritizing the regions and resolutions needed for the hard tasks without wasting electrodes on what's trivially sensed — would be a fundamentally different design than anything produced by hand.

## Entry Point

**Phase 0 - Learn how the sensors work**: Before writing any code, you need to understand how these sensors work. You can check out the work: [Learning the signatures of the human grasp using a scalable tactile glove](https://www.nature.com/articles/s41586-019-1234-z).

**Phase 1 — Task-Contact Mapping (simulation)**: Before touching real hardware, you can use existing grasping simulators (e.g., Isaac Gym / MuJoCo with contact-rich assets) to generate contact heatmaps across a hand mesh for a diverse task set. Use the ContactDB dataset or DexYCB as a starting point — both provide human grasp contact maps for many objects. Aggregate across tasks to build a "sensing demand map" over the hand surface. 

**Phase 2 — Electrode Placement Optimization**: Formulate sensor placement as a discrete optimization problem. Given N electrodes to place on a hand surface, and a continuous contact importance map from Phase 1, maximize the expected task-relevant information captured, for example, your task can be object recognition from tactile maps. 
Start simple:

- Discretize the hand surface into candidate locations
- Define a sensing model: each electrode senses within a radius with decaying sensitivity
- Objective: maximize coverage of high-importance regions, weighted by task difficulty
- Constraints: minimum spacing between electrodes, maximum total count, manufacturing feasibility zones

This can be solved with greedy submodular optimization (facility location) for a first pass, or differentiable relaxation for a smoother version.

**Alternative to Phase 1 & 2**: You can write a differentiable electrode placement contact simulator. You can take hand meshes like mano hand and think of the hand as a manifold, and write the electrode placement 2D UV coordinates on the manifold. This would allow you to directly optimize the contact map with grasping and manipulation dataset with respect to the task, e.g. object recognition from tactile maps. 

**Phase 3 — Validation**: Compare the optimized layout against (a) uniform grid placement, (b) biomimetic placement (matching human mechanoreceptor density), and (c) expert-designed layouts from existing tactile sensors (e.g., BioTac, GelSight). Evaluate on the same task set: which layout lets a downstream policy best discriminate task-relevant features?

**Success signal**: The optimized layout should outperform uniform placement (obvious) but the interesting question is whether it matches or beats biomimetic placement. If it discovers a distribution that *differs* from human biology in interpretable ways — e.g., because manufacturing constraints create different trade-offs than evolution — that's a strong and publishable result regardless of absolute performance.

## What Could Go Wrong

- Simulation-to-real transfer for contact physics is notoriously difficult. Contact maps in simulation may not reflect real contact distributions. Starting with human-captured data (ContactDB) partially mitigates this.
- The optimization might converge to trivially obvious layouts (put more electrodes on fingertips) unless the task set is diverse enough to create non-trivial trade-offs.
- Manufacturing constraints might dominate the solution — the "optimal" layout might be one you can't actually build. Including manufacturability constraints early is important.
- The downstream evaluation depends on having a good policy that can use tactile input. A weak policy might not discriminate between sensor layouts. Use a simple but well-tuned baseline (e.g., a tactile-conditioned classifier for object properties) rather than end-to-end RL.

## Materials

- 📊 *Slides coming soon*

## Annotated Readings

See [references.md](./references.md) for the full annotated reading list.

Key papers to start with:

1. **Brahmbhatt et al. (2019)** — [*ContactDB: Analyzing and Predicting Grasp Contact via Thermal Imaging*](https://arxiv.org/abs/1904.06830) — The dataset you'd likely start with. Thermal contact maps of human grasps across 50 objects — gives you the empirical "where does contact happen" distribution.

2. **Lambeta et al. (2020)** — [*DIGIT: A Novel Design for a Low-Cost Compact High-Resolution Tactile Sensor with Application to In-Hand Manipulation*](https://arxiv.org/abs/2005.14679) — A state-of-the-art tactile sensor design. Study the engineering trade-offs they made — your optimization should be able to reproduce or improve on their decisions.

3. **Ward-Cherrier et al. (2018)** — [*The TacTip Family: Soft Optical Tactile Sensors with 3D-Printed Biomimetic Morphologies*](https://doi.org/10.1089/soro.2017.0052) — Biomimetic sensor design that explicitly tries to replicate human mechanoreceptor layout. This is your "biomimetic baseline" — does optimization recover something similar, or something better?

4. **Sundaram et al. (2019)** - [*Learning the signatures of the human grasp using a scalable tactile glove*](https://www.nature.com/articles/s41586-019-1234-z) - How the tactile sensors work. 

## Discussion

💬 **Working on this or something related?** Open an issue using the "Working on an Idea" template or join the discussion thread.

---

*Contributed by [Anthea Li](https://github.com/AntheaLi) · June 2026*
