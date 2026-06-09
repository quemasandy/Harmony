# Research & Architecture Decisions

**Branch**: `004-chord-substitutions` | **Feature**: Chord Substitutions — Tritone Substitution

## 1. Tritone Substitution: Mathematical Foundation

**Decision**: The substitute chord root is computed by applying a diminished fifth interval (`d5` = 6 semitones) from the original root using the existing `Interval.apply()` method. The substitute is always a dominant 7th chord.

**Rationale**: 
The tritone substitution works because dominant 7th chords a tritone apart share the same guide tones (3rd and 7th), just swapped:
- G7: notes are G, B, D, F → 3rd = B, 7th = F
- Db7: notes are Db, F, Ab, Cb → 3rd = F, 7th = Cb
- B and Cb are enharmonically equivalent (both pitch class 11)
- F is literally the same note in both chords

The `Interval` entity already supports `d5` (diminished fifth), and `Interval.apply()` correctly computes the target letter and accidental. For G → d5 → Db, this produces the correct letter (D) with flat accidental.

**Alternatives considered**:
- Semitone arithmetic on pitch class (add 6 mod 12, then reverse-lookup a note name): Rejected because it loses enharmonic spelling information. `Interval.apply()` preserves correct letter assignment.
- Hardcoded tritone-sub lookup table: Rejected as unnecessary given the existing interval infrastructure.

## 2. Enharmonic Equivalence via PitchClass

**Decision**: The shared tritone detection uses `PitchClass.equals()` to compare notes between the original and substitute chords, rather than `Note.equals()`.

**Rationale**:
`Note.equals()` compares letter + accidental literally: `B.equals(Cb)` → `false`. But `B.pitchClass().equals(Cb.pitchClass())` → `true` (both are pitch class 11). The explanation must report both spellings while acknowledging they are enharmonically equivalent.

The explanation structure carries two `NotePair` entries for the shared tritone:
- Each pair has `originalNote` (from the original chord) and `substituteNote` (from the substitute chord)
- Each pair has `isEnharmonicEquivalent: boolean` (true if the notes have the same pitch class but different spelling) and `isLiterallyIdentical: boolean` (true if `Note.equals()` returns true)

**Alternatives considered**:
- Comparing only pitch classes and losing the spelling information: Rejected because the spec requires the explanation to carry the full enharmonic spelling for educational value.

## 3. Resolution Detection Strategy

**Decision**: F4 determines whether a chord "resolves" by reading two adjacent entries from the `chordAnalysis` array in the `HarmonicAnalysis` result. Specifically:
1. Is `chordAnalysis[index]` a diatonic V7? (symbol === `'V7'`)
2. Is `chordAnalysis[index + 1]` a diatonic I/Imaj7/i/i7? (symbol matches one of `'I'`, `'Imaj7'`, `'i'`, `'i7'`)

If both conditions are true, the chord is a resolving dominant. The resolution target is `analysis.key.tonic`.

**Rationale**:
This composes directly on F2's output without re-deriving any functional analysis. F4 reads labels, not raw chords. A trailing V7 naturally yields "not applicable" because `chordAnalysis[index + 1]` is `undefined`, and `undefined` is not a diatonic I/i — no special-casing needed.

**Alternatives considered**:
- Having F2 pre-compute a `resolves: boolean` flag per chord: Over-engineering — F2 doesn't currently model resolution as a per-chord property, and adding it would expand F2's scope beyond what's needed. Reading two adjacent labels is trivial and correct.
- Accepting Key as a separate parameter: Rejected in favor of adding `key` to `HarmonicAnalysis` (see plan.md architectural decision).

## 4. Result Type: Discriminated Union

**Decision**: The substitution function returns a discriminated union `SubstitutionResult`:
```
| { applicable: true, substitution: Substitution }
| { applicable: false, reason: string }
```

**Rationale**:
This follows the same pattern as F2's `ChordAnalysisResult` discriminated union (`{ diatonic: true, romanNumeral }` | `{ diatonic: false }`). It makes the "not applicable" case an explicit, first-class value — not null, not an exception, not a silent no-op. The `reason` string provides a human-readable explanation for why the substitution doesn't apply (e.g., "Chord is not dominant 7th quality" or "Chord does not resolve (V7 not followed by I/i)").

**Alternatives considered**:
- Throwing an exception for non-applicable cases: Rejected — non-applicability is a valid domain outcome, not an error. Exceptions are reserved for invariant violations (e.g., invalid index).
- Returning `null`: Rejected — violates the "explicit over inferred" constitution principle.

## 5. music21 Oracle Integration

**Decision**: Write a `music21-tritone-sub-oracle.py` script that, given a chord symbol and key, computes:
1. The tritone substitute chord (dominant 7th a tritone away)
2. The shared tritone notes (3rd and 7th of both chords)
3. Enharmonic equivalence verification

The oracle script outputs JSON and is invoked from `TritoneSubOracle.test.ts` via `execSync`, following the established pattern from `TensionsOracle.test.ts`.

**Rationale**: Aligns with Principle VIII. The oracle provides ground-truth validation that our interval arithmetic and enharmonic handling are correct, without being a runtime dependency.

## 6. Modification to HarmonicAnalysis Interface

**Decision**: Add `readonly key: Key` to the `HarmonicAnalysis` interface in `Progression.ts`. Update `Progression.analyze()` to include `key: this.key` in the frozen return object.

**Rationale**: The key is already available on the `Progression` instance. Including it in the analysis result makes it self-contained — consumers like F4 don't need to track the key separately. This is an additive, backwards-compatible change. All existing tests and consumers continue to work.

**Impact**: Minimal. Only `Progression.ts` needs a two-line change (add field to interface + include in return).
