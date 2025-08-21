# Generative Sentry Art (Sentry Hackweek 2025)

> _What if AI enters the generative art cycle one step earlier and creates the code that will create
> the art?_

## Philosophy

Generative art is traditionally created by humans writing code that "lives on its own" - where a
human being writes the "AI" that will create what the code makes them create. This project explores
what happens when Large Language Models (LLMs) enter this creative cycle one step earlier,
generating the very code that creates the art.

By using real Sentry data from spans and errors, this collection of generative art pieces creates
visual representations that change and evolve based on the underlying data patterns. This opens
profound philosophical questions about art, creativity, and AI collaboration in the creative
process.

## Concept

This explorative art project transforms Sentry telemetry data into living, breathing visual
experiences:

- **Error patterns** become color palettes and movement rhythms
- **Span durations** influence geometric complexity and animation timing
- **Performance metrics** drive particle systems and atmospheric effects
- **Spans** generate architectural structures and cityscapes

Each art piece is both a visualization of your application's health and an autonomous generative
system that creates beauty from the chaos of software systems.

## Tech Stack

- **React+** with TypeScript
- **Three.js** with **@react-three/fiber** for 3D graphics
- **@react-three/drei** for Three.js utilities and helpers
- **CSS Modules** for component-scoped styling

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd generative-sentry

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Run development server with hot reload
npm run dev
```

## Project Structure

```
src/
├── components/        # Reusable 3D and UI components
│   ├── AlphabetSoup/  # Letter-based particle system
│   ├── BuildingCity/  # Procedural city generator
│   ├── FloatingPlanet/# Planetary environment system
│   └── ...
├── sections/          # Main art piece compositions
├── data/              # Sample Sentry data and generators
├── shaders/           # Custom GLSL shaders
├── utils/             # Color palettes and data utilities
└── types/             # TypeScript definitions
```

## Data Integration

The project includes sample Sentry data generators that simulate real telemetry:

- **Span Data**: Duration, operation names, trace relationships
- **Error Envelopes**: Exception details, stack traces, user context

To integrate with real Sentry data, replace the sample generators in `src/data/` with your actual
Sentry API integration.

## Artistic Vision

Each piece explores different aspects of the software-as-art metaphor:

1. **Chaos Theory**: Small changes in data create dramatic visual shifts
2. **Emergence**: Complex beauty arising from simple data patterns
3. **Temporality**: Art that exists in time, evolving with your application
4. **Symbiosis**: The relationship between system health and aesthetic beauty

## License

This project is released under the MIT License. Art is meant to be shared.

---

_"In the dance between human creativity and artificial intelligence, we find new forms of beauty
emerging from the most unexpected places - the errors, the delays, the digital heartbeat of our
applications."_
