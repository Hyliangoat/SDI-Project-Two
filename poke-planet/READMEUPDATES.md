# CS 499 Milestone Two Submission

## Original Artifact

The `Original_Artifact` folder contains the unchanged version of Poké Planets created before the CS 499 software design and engineering enhancement.

## Enhanced Artifact

The `Enhanced_Artifact` folder contains the refactored version completed for Milestone Two.

Major enhancements include:

- Replacing module-level mutable battle state with centralized React state
- Implementing a battle reducer and context provider
- Separating battle calculations, actions, and special abilities
- Consolidating local-storage persistence
- Improving campaign and API handling
- Adding automated unit tests
- Correcting defects and removing unused code

## Running the Enhanced Artifact

```bash
cd Enhanced_Artifact/poke-planets-enhanced
npm install
npm run dev