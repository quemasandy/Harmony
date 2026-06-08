# Phase 0: Research & Decisions

## Key Unknowns Resolved

### Diatonicity in Minor Keys
- **Decision**: Diatonic analysis in minor mode will use the Harmonic Minor scale by default.
- **Rationale**: The user explicitly specified "Diatonicidad en modo menor referida al menor armónico" so that the V chord is dominant and the ii chord is half-diminished, which is essential for accurate ii-V-i detection in jazz and tonal music.

### Pattern Detection Strategy
- **Decision**: Sliding window to detect ii-V-I.
- **Rationale**: Accurately reports all instances, including overlapping patterns (e.g. pivot chords), as clarified.

### Roman Numeral Notation
- **Decision**: Use standard music theory casing (Uppercase for Major/Dominant, lowercase for minor, ° for diminished, ø for half-diminished).
- **Rationale**: User explicitly required the Roman Numeral to reflect chord quality as carrier of meaning, not just cosmetic.
