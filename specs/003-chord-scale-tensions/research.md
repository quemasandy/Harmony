# Research & Architecture Decisions

**Branch**: `003-chord-scale-tensions` | **Feature**: Chord Scale Tensions Analysis

## 1. Domain Extraction of Tensions vs. Avoid Notes

**Decision**: The calculation of tensions will follow strict interval-based logic relative to the root and chord tones, without relying on hardcoded diatonic mappings.

**Rationale**: 
The specification defines an avoid note as "any scale degree that is a minor second (one semitone) above any chord tone." By adhering to this algorithmic definition, the system remains purely mathematical and inherently supports non-diatonic chords as long as a scale is provided.

**Mathematical Logic**:
1. Identify all Notes in the provided `Chord`.
2. Extract the `PitchClass` for each chord tone.
3. Iterate through all Notes in the provided `Scale/Mode`.
4. If a scale note's `PitchClass` is already in the chord, ignore it.
5. If the scale note is NOT in the chord:
   - Check its interval against EVERY chord tone.
   - If the interval is a minor second (1 semitone) above any chord tone, classify it as an **Avoid Note**.
   - Otherwise, classify it as an **Available Tension**.

## 2. Dealing with 7ths on Triads

**Decision**: As clarified in the specification, if a triad is provided (e.g., C major) and the scale contains a 7th (e.g., B), the 7th will be classified as an **Available Tension**.

**Rationale**: Triads inherently lack the 7th. A 7th is a valid, consonant extension over a triad (usually adding color without clashing, unless it's a minor 2nd above the root, but even then standard theory applies). The algorithm natively supports this if we just treat the 7th like any other non-chord tone.

## 3. Scale Length Constraint

**Decision**: Validate that the input scale has exactly 7 notes.

**Rationale**: The MVP specification explicitly requires throwing an error if the scale contains fewer or more than 7 notes to avoid naming ambiguities (like assigning "9" or "11" in a pentatonic context).

## 4. Incompatible Chord-Scale Pairings

**Decision**: Pre-validate the chord and scale pairing. If a chord contains a note that is explicitly contradicted by the scale (e.g., chord has E natural, scale has Eb), an error is thrown.

**Rationale**: Strict validation prevents the generation of musically nonsensical voicings. The mathematical model needs a coherent base to work from.

## 5. music21 Oracle Integration

**Decision**: We will write a specific `music21` python script to generate expected tensions for a matrix of known chord/scale pairs, and use this to drive our `TensionsOracle.test.ts`.

**Rationale**: Aligns with Principle VIII of the Harmony Constitution. The oracle defines the absolute truth for music theory.
