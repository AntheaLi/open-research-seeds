# Open Research Seeds

**Concrete research ideas, free to good homes.**

This is a curated collection of research ideas — each with a clear intuition, a concrete first experiment, and enough supporting material (slides, code, readings) to get started. They come from problems we found genuinely interesting but won't pursue ourselves.

If you're a junior PhD student looking for a direction, or a senior student with collaborators to find, start here.

---

## Website

This repo can be published directly with GitHub Pages. The public page is
[`index.html`](./index.html); it loads idea metadata from [`seeds.json`](./seeds.json)
and renders the markdown files in each idea folder. The website groups seeds by
topic tabs such as multimodal learning, sensor design, and model architecture.

Recommended GitHub Pages setup:

1. Create a standalone repo, for example `open-research-seeds`.
2. Copy the contents of this folder into that repo.
3. In GitHub repo settings, enable Pages from the `main` branch root.
4. The page will be available at `https://<username>.github.io/open-research-seeds/`.

## How This Works

Each idea lives in its own folder under [`ideas/`](./ideas/) with a standard card: the core insight, what to try first, annotated readings, and any materials (code, slides, figures) we had on hand. Browse the index below, click into anything that resonates.

**If you're working on one of these** — or something adjacent — open the linked Discussion thread. That's how people find each other and avoid duplicating effort.

**If you want to contribute an idea** — see [CONTRIBUTING.md](./CONTRIBUTING.md). The bar is: a real insight, a concrete entry point, and enough clarity that someone could start within a few weeks.

---

## Idea Index

| Idea | One-Line Hook | Background | Contributor |
|------|--------------|------------|-------------|
| [Kuramoto Multimodal Coupling](./ideas/kuramoto-multimodal-coupling/) | Learn cross-modal alignment through oscillatory synchronization, not contrastive loss | dynamical systems + multimodal ML | [Anthea Li](https://github.com/AntheaLi) |
| [Task-Driven Sensor Design](./ideas/task-driven-sensor-design/) | Learn where to place tactile sensors by watching what humans find easy | robotics + optimization | [Anthea Li](https://github.com/AntheaLi) |

*More ideas welcome via [pull request](./CONTRIBUTING.md).*

---

## Quick Links

- 📂 [Browse all ideas](./ideas/)
- 📝 [Idea card template](./ideas/_template/)
- 🧭 [Website metadata](./seeds.json)
- 🤝 [How to contribute](./CONTRIBUTING.md)
- 💬 [Discussions](../../discussions) — find collaborators, claim ideas, share progress

---

## Why This Exists

Generating research ideas is one of the hardest parts of a PhD, and it's rarely taught. Most "open problem" lists are either too vague to act on or too coupled to a specific lab's infrastructure. We wanted something in between: ideas with enough structure to start, enough openness to make your own, and a lightweight way to find others thinking about the same things.

## License

The ideas themselves are freely available — that's the point. Any code or materials in this repo are released under [MIT License](./LICENSE) unless otherwise noted in individual idea folders.
