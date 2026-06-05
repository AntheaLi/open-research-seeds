# Contributing a Research Seed

We welcome ideas from senior PhD students, postdocs, and researchers. The goal is a curated collection — not everything gets merged, but the bar is approachable.

## What Makes a Good Seed

A good research seed has three things:

1. **A real insight** — not "someone should work on X" but "here's *why* X should work, and here's the mechanism." The reader should finish the intuition section thinking "oh, that's clever."

2. **A concrete entry point** — the minimal first experiment. What do you train, on what data, and what do you measure? If you see result Y, you're on the right track. A junior student should be able to start within a few weeks of reading this.

3. **Honest background requirements** — what does someone need to know to attempt this? Be specific ("comfortable with ODEs and has trained a contrastive model before") not vague ("strong math background").

Ideas you're actively pursuing don't belong here. Ideas you've *tried* and abandoned with a note about what went wrong are especially welcome.

## How to Submit

### Option A: Pull Request (preferred)

1. Fork this repo
2. Copy `ideas/_template/` to `ideas/your-idea-name/`
3. Fill in the template — see existing ideas for calibration
4. Add any materials (slides, code, figures) to your idea folder
5. Add an entry to `seeds.json` so the website can render the idea under the right topic
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
## Discussion
```

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

## Updating the Website

The GitHub Pages site reads from `seeds.json`. After adding a new idea folder,
add one metadata entry:

```json
{
  "slug": "your-idea-name",
  "topic": "model-architecture",
  "title": "Your Idea Title",
  "hook": "One sentence that makes the idea legible and interesting.",
  "background": "required background",
  "rampUp": "2-3 weeks",
  "contributor": "Your Name",
  "affiliation": "Your Affiliation",
  "tags": ["area", "method"],
  "readme": "ideas/your-idea-name/README.md",
  "references": "ideas/your-idea-name/references.md"
}
```

Keep the `slug` identical to the folder name so deep links work. The `topic`
must match one of the topic slugs in the top-level `topics` list in
`seeds.json` such as `multimodal-learning`, `sensor-design`, or
`model-architecture`.

## Review Process

A small group of maintainers reviews submissions. We're checking for:

- **Clarity**: Could a second-year PhD student understand what to do?
- **Novelty**: Is this a genuine insight, not a minor variation on existing work?
- **Honesty**: Are the difficulty and background requirements accurately stated?

We're *not* checking for guaranteed feasibility — these are seeds, not sure bets. An idea that might not work but would be interesting either way is fine.

## Code of Conduct

Be constructive in discussions and PR reviews. The point is to help junior researchers, not to gatekeep. If an idea submission needs work, say specifically what would improve it.
