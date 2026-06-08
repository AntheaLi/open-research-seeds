# Research Seeds 🌱

**Research Ideas that Can't be Outscaled on.**

Academic ML research is in a difficult moment. The problems that attract the most attention — scaling frontier models, massive RL runs, billion-parameter video generation — are increasingly defined by compute budgets that no university lab can match. Junior PhD students feel this acutely: it's hard to commit years to a direction when an industry lab might ship something similar next quarter with 1,000× your resources.

The ideas here are chosen with that pressure in mind. They are *deliberately unconventional* — grounded in mechanisms from dynamical systems, neuroscience, physics, and optimization rather than the scaling playbook. They're the kind of problems where the advantage is in the *thinking*, not the FLOPS: where a well-designed experiment on a single GPU can produce an insight that no amount of compute would find by brute force. You can take your time with these. No one is about to scoop you.

Each idea comes with a clear intuition, a concrete first experiment, risks, annotated readings, and enough supporting material to get started. They come from problems we found genuinely interesting but won't pursue ourselves.

If you're a junior PhD student looking for a direction, or a senior student with collaborators to find, start here.

---

## How This Works

Each idea lives in its own folder under [`ideas/`](./ideas/) with a standard card: the core insight, what to try first, annotated readings, and any materials (code, slides, figures) we had on hand. Browse the index below, click into anything that resonates.

**If you're working on one of these** — or something adjacent — open the linked Discussion thread. That's how people find each other and avoid duplicating effort.

**If you want to contribute an idea** — see [CONTRIBUTING.md](./CONTRIBUTING.md). The bar is: a real insight, a concrete entry point, and enough clarity that someone could start within a few weeks.

---

## Idea Index

| Idea | One-Line Hook | Background | Difficulty | Contributor |
|------|--------------|------------|------------|-------------|
| [Kuramoto Multimodal Coupling](./ideas/kuramoto-multimodal-coupling/) | Learn cross-modal alignment through oscillatory synchronization, not contrastive loss | dynamical systems + multimodal ML | 3/5 | [Anthea Li](https://github.com/AntheaLi) |
| [Physics from Video via Dynamic Gaussians](./ideas/physics-from-video-gaussians/) | Fit 2D dynamic Gaussians to video as a learned discretization, then run DMD/SINDy to recover governing equations | Gaussian splatting + dynamical systems | 4/5 | [Anthea Li](https://github.com/AntheaLi) |
| [Task-Driven Sensor Design](./ideas/task-driven-sensor-design/) | Learn where to place tactile sensors by watching what humans find easy | robotics + optimization | 4/5 | [Anthea Li](https://github.com/AntheaLi) |

*More ideas welcome via [pull request](./CONTRIBUTING.md).*

---

## Quick Links

- 📂 [Browse all ideas](./ideas/)
- 📝 [Idea card template](./ideas/_template/)
- 🤝 [How to contribute](./CONTRIBUTING.md)
- 💬 [Discussions](../../discussions) — find collaborators, claim ideas, share progress

---

## Why This Exists

Generating research ideas is one of the hardest parts of a PhD, and it's rarely taught. The current landscape makes it harder: most "open problem" lists are either too vague to act on, too coupled to a specific lab's infrastructure, or point toward directions where a well-funded team will outrun you on compute alone. We wanted something different: ideas where the intellectual contribution *is* the contribution, with enough structure to start, enough openness to make your own, and a lightweight way to find others thinking about the same things.

## License

The ideas themselves are freely available — that's the point. Any code or materials in this repo are released under [MIT License](./LICENSE) unless otherwise noted in individual idea folders.
