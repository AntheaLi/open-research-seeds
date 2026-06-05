# Contributing a Research Seed

We welcome ideas from senior PhD students, postdocs, and researchers. The goal is a curated collection — not everything gets merged, but the bar is approachable.

## What Makes a Good Seed

A good research seed has four things:

1. **A real insight** — not "someone should work on X" but "here's *why* X should work, and here's the mechanism." The reader should finish the intuition section thinking "oh, that's clever."

2. **A concrete entry point** — the minimal first experiment. What do you train, on what data, and what do you measure? If you see result Y, you're on the right track. A junior student should be able to start within a few weeks of reading this.

3. **Honest background requirements** — what does someone need to know to attempt this? Be specific ("comfortable with ODEs and has trained a contrastive model before") not vague ("strong math background").

4. **Scoop-resistant by design** — the idea should live in a space where the advantage is in the thinking, not in the compute. If a well-funded lab could trivially subsume it by scaling up a standard recipe, it doesn't belong here. The best seeds draw on unconventional mechanisms — from neuroscience, physics, dynamical systems, optimization theory — that reward careful design over brute force.

Ideas you're actively pursuing don't belong here. Ideas you've *tried* and abandoned with a note about what went wrong are especially welcome.

## How to Submit

### Option A: Pull Request (preferred)

1. Fork this repo
2. Copy `ideas/_template/` to `ideas/your-idea-name/`
3. Fill in the template — see existing ideas for calibration
4. Add any materials (slides, code, figures) to your idea folder
5. Add a row to the index table in the root `README.md`
6. Open a pull request

Your PR description should include a one-paragraph summary of the idea. We'll review for clarity and quality, possibly suggest edits, and merge once it's ready.

### Option B: Discussion First

If you'd rather float the idea before writing it up fully, open a thread in the [Idea Proposals](../../discussions/categories/idea-proposals) discussion category. If it gets positive reception, you or someone else can formalize it into a PR.

## Idea Card Template

Every idea follows the same structure — see [`ideas/_template/README.md`](./ideas/_template/README.md) for the full template. The key sections:

```
# Title
> One-sentence hook

## Intuition
## Entry Point
## Materials (if any)
## Annotated Readings
## Estimated Background
## Suggested Difficulty
## Discussion
```

Use difficulty levels 1-5, where 1 is the easiest entry point and 5 is the hardest.

## Adding Materials

Put all supporting files in your idea's folder:

```
ideas/your-idea-name/
├── README.md            ← the idea card (required)
├── references.md        ← annotated readings (recommended)
├── slides.pdf           ← if you have them
├── figures/             ← diagrams, illustrations
│   └── overview.png
└── code/                ← starter code, demos
    └── demo.py
```

Keep files reasonable in size. For large datasets or model checkpoints, link externally rather than committing them.

## Review Process

A small group of maintainers reviews submissions. We're checking for:

- **Clarity**: Could a second-year PhD student understand what to do?
- **Novelty**: Is this a genuine insight, not a minor variation on existing work?
- **Honesty**: Are the difficulty and background requirements accurately stated?

We're *not* checking for guaranteed feasibility — these are seeds, not sure bets. An idea that might not work but would be interesting either way is fine.

## Code of Conduct

Be constructive in discussions and PR reviews. The point is to help junior researchers, not to gatekeep. If an idea submission needs work, say specifically what would improve it.
