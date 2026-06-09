# Feature Specification: Chord Substitutions — Tritone Substitution

**Feature Branch**: `004-chord-substitutions`

**Created**: 2026-06-08

**Status**: Draft

**Input**: User description: "F4 — Chord substitutions. First capability: tritone substitution. A substitution takes a chord within its functional context and returns an immutable Substitution value object containing the substitute chord and the explanation of why the substitution is valid."

## Clarifications

### Session 2026-06-08

- Q: Which resolution patterns qualify a dominant chord for tritone substitution? → A: Only V7→I or V7→i (dominant resolving down a fifth to tonic). Secondary dominants, deceptive cadences, and other resolutions do not qualify.
- Q: What inputs does the substitution API receive? → A: A chord index and the already-computed `HarmonicAnalysis` from F2. Resolution is derived from the existing analysis, not from raw chord/key/next-chord inputs.
- Q: How should a V7 as the last chord in a progression (no next chord) be handled? → A: It is not a special edge case. Since F4 consumes F2's functional analysis per chord, a dominant without a resolving tonic is already, by construction, "a dominant that doesn't resolve" — same "not applicable" path as any other non-substitutable chord. F4 never inspects adjacent chords itself.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Apply Tritone Substitution to a Resolving Dominant (Priority: P1)

As a musician analyzing a chord progression, I want to request a tritone substitution for a dominant 7th chord that resolves to a tonal center, so I can obtain the substitute chord and understand why the substitution works.

**Why this priority**: This is the core capability — producing a valid tritone substitution for the canonical case (e.g., G7 → Db7 resolving to C). Without this, the feature delivers zero value.

**Independent Test**: Can be tested by providing a dominant 7th chord (e.g., G7) within a functional context that shows it resolves (e.g., V7 in the key of C), and verifying the system returns Db7 as the substitute with the correct explanation.

**Acceptance Scenarios**:

1. **Given** a G7 chord analyzed as V7 in C Major, **When** a tritone substitution is requested, **Then** the system returns a Substitution containing Db7 as the substitute chord.
2. **Given** the same substitution result, **When** the explanation is inspected, **Then** it contains the shared tritone (B/F enharmonically equivalent to Cb/F in Db7) and the common resolution target (C).
3. **Given** a Bb7 chord analyzed as V7 in Eb Major, **When** a tritone substitution is requested, **Then** the system returns E7 as the substitute chord with a correct explanation.

---

### User Story 2 — Reject Tritone Substitution for Non-Resolving or Non-Dominant Chords (Priority: P1)

As a musician, I want the system to explicitly tell me when a tritone substitution is not applicable, so I don't mistakenly apply the technique to chords where it is theoretically invalid.

**Why this priority**: Equal priority with the happy path — without explicit rejection, the system could silently fail or produce misleading results for non-dominant or non-resolving chords, violating the "explicit over inferred" principle.

**Independent Test**: Can be tested by providing a non-dominant chord (e.g., Cmaj7, Dm7) or a dominant chord without a resolving context, and verifying the system returns an explicit "not applicable" outcome.

**Acceptance Scenarios**:

1. **Given** a Cmaj7 chord (major-seventh quality, not dominant), **When** a tritone substitution is requested, **Then** the system explicitly reports "not applicable" with the reason (chord is not dominant 7th quality).
2. **Given** a Dm7 chord (minor-seventh quality), **When** a tritone substitution is requested, **Then** the system explicitly reports "not applicable" with the reason (chord is not dominant 7th quality).
3. **Given** a dominant 7th chord that does not resolve within its functional context, **When** a tritone substitution is requested, **Then** the system explicitly reports "not applicable" with the reason (chord does not resolve).

---

### User Story 3 — Enharmonic Correctness of the Shared Tritone Explanation (Priority: P2)

As a music theory student, I want the tritone substitution explanation to correctly handle enharmonic equivalence, so the explanation is theoretically precise even when the 3rd and 7th are spelled differently between the original and substitute chords.

**Why this priority**: This is a correctness refinement of the explanation. The substitution itself works without it, but without enharmonic awareness the explanation would be inaccurate or misleading for certain chords (e.g., claiming B = Cb without acknowledging enharmonic equivalence).

**Independent Test**: Can be tested by inspecting the explanation for G7 → Db7 and verifying that B (3rd of G7) and Cb (7th of Db7) are identified as enharmonically equivalent, not literally equal.

**Acceptance Scenarios**:

1. **Given** a G7 → Db7 tritone substitution, **When** the shared tritone is inspected, **Then** B (3rd of G7) and Cb (7th of Db7) are reported as enharmonically equivalent (same pitch class, different spelling).
2. **Given** a G7 → Db7 tritone substitution, **When** the shared tritone is inspected, **Then** F (7th of G7) and F (3rd of Db7) are reported as literally identical.

---

### Edge Cases

- What happens when the input chord quality is not dominant 7th (e.g., major, minor, diminished, augmented, half-diminished)? The system returns an explicit "not applicable" result indicating chord quality is not dominant 7th.
- What happens when a dominant 7th does not resolve (including a V7 as the last chord in a progression)? This is not a special case — F4 consumes F2's per-chord analysis and sees it as a non-resolving dominant, yielding the same "not applicable" result. F4 never inspects adjacent chords itself.
- What happens when enharmonically equivalent notes are involved in the tritone? The system detects enharmonic equivalence via pitch class comparison, not by literal note spelling.
- What happens when the substitute chord root requires an accidental (e.g., Db, Gb)? The system correctly spells the substitute root using standard note-letter and accidental conventions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST accept a chord index and the already-computed `HarmonicAnalysis` result from F2 (which contains the chords, their roman numeral analysis, and the key context) and determine whether a tritone substitution is applicable for the chord at that index.
- **FR-002**: When the input chord is a dominant 7th that resolves within its functional context, the system MUST return an immutable `Substitution` value object containing: (a) the substitute chord (dominant 7th rooted a tritone away), and (b) a structured explanation.
- **FR-003**: The substitute chord MUST be a dominant 7th chord rooted exactly 6 semitones (a tritone) away from the original chord's root.
- **FR-004**: When the input chord is NOT a dominant 7th, the system MUST return an explicit "not applicable" outcome stating the chord quality disqualifies it. The system MUST NOT silently ignore or return null.
- **FR-005**: When the input chord IS a dominant 7th but is NOT analyzed as a resolving V7→I/i in the `HarmonicAnalysis`, the system MUST return an explicit "not applicable" outcome stating the chord does not resolve. This includes trailing dominants with no next chord — F4 treats them identically to any other non-resolving dominant via the same code path. The system MUST NOT silently ignore or return null.
- **FR-006**: The explanation within the Substitution MUST include the shared tritone: the pair of notes formed by the 3rd and 7th of the original dominant, which become the 7th and 3rd of the substitute.
- **FR-007**: The explanation MUST include the common resolution target: the tonal center that both the original and substitute chords resolve toward.
- **FR-008**: The shared tritone detection MUST use enharmonic equivalence (pitch class comparison), NOT literal note-spelling equality. Notes with different spellings but the same pitch class (e.g., B and Cb) MUST be recognized as enharmonically equivalent.
- **FR-009**: The `Substitution` value object MUST be deeply immutable.
- **FR-010**: The feature MUST compose on the harmonic-function capability built in F2 (Chord Progression Harmonic Analysis). The determination of whether a dominant chord resolves MUST use functional context, not just chord quality alone. A chord is considered "resolving" only when it is analyzed as V7 and is followed by I (major) or i (minor) — i.e., the dominant resolves down a fifth to the tonic. Secondary dominants, deceptive cadences, and other resolutions do not qualify.
- **FR-011**: All domain entities introduced by this feature MUST be pure domain objects with no framework dependencies.
- **FR-012**: All invalid or non-applicable inputs MUST fail fast or report explicitly on construction or computation.
- **FR-013**: The root of the substitute chord MUST be spelled as the functional flat-second (bII) of the resolution target's root (calculated as a minor second above the target root), avoiding heuristic-based spelling like minimum accidentals.

### Key Entities

- **Substitution**: An immutable Value Object containing the substitute chord and the structured explanation of why the substitution is valid.
- **SubstitutionExplanation**: A structured component of the Substitution containing the shared tritone (pair of enharmonically equivalent notes) and the common resolution target.
- **SubstitutionNotApplicable**: An explicit result representing that a substitution cannot be applied, carrying a reason.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tritone substitutions generated by the system match the substitute chord that a music21 oracle computes for the same input chord and key context.
- **SC-002**: 100% of non-dominant or non-resolving chord inputs produce an explicit "not applicable" result — never null, never an exception, never a silent no-op.
- **SC-003**: 100% of shared tritone explanations correctly identify enharmonically equivalent note pairs via pitch class, verified against a music21 oracle.
- **SC-004**: The Substitution value object is verified as deeply immutable in 100% of architecture/unit tests.
- **SC-005**: Zero framework dependencies are introduced in the domain layer, verified by dependency architecture checks.

## Assumptions

- The harmonic-function analysis from F2 (Chord Progression Harmonic Analysis) is fully functional and can be composed upon to determine whether a dominant chord resolves within a progression context.
- The existing `Note`, `Chord`, `Interval`, `PitchClass`, `Key`, and `Progression` entities provide sufficient infrastructure (especially `PitchClass.equals()` for enharmonic equivalence and `Chord` quality detection).
- The term "resolving dominant" refers to a dominant 7th chord analyzed as V7 that is immediately followed by I (major) or i (minor) — the dominant resolving down a fifth to tonic. No other resolution pattern (deceptive cadence, secondary dominant, etc.) qualifies for tritone substitution.
- Tritone substitution applies only to dominant 7th quality (`dominant-seventh`), not to other chord qualities that happen to contain a tritone interval.
- The substitute chord root is determined by transposing the original root up a tritone (6 semitones), using the existing `Interval.apply()` mechanism with correct letter/accidental spelling.
- This feature covers only tritone substitution as the first substitution type; other substitution types (e.g., diatonic, chromatic mediant) are out of scope.
