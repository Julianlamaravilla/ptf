## ADDED Requirements

### Requirement: Spanish CV download serves a valid readable PDF

When the page language is Spanish, the CV download SHALL serve `resources/cv/Julian_Restrepo_CV_ES.pdf`. That file MUST be a valid binary PDF: it MUST NOT be valid UTF-8 text, MUST contain zero UTF-8 replacement sequences (`U+FFFD` / `EF BF BD`), MUST start with a PDF header whose binary comment is not replacement characters, and MUST contain Flate streams that inflate successfully. A PDF viewer MUST render Spanish text (including accented characters) without garbled glyphs.

#### Scenario: Language is Spanish

- **WHEN** the stored language is `es` and the user clicks Download CV
- **THEN** the browser downloads `Julian_Restrepo_CV_ES.pdf` from `./resources/cv/Julian_Restrepo_CV_ES.pdf`

#### Scenario: Spanish asset is a healthy binary

- **WHEN** `resources/cv/Julian_Restrepo_CV_ES.pdf` is inspected
- **THEN** the file is not valid UTF-8, contains zero `EF BF BD` sequences, and its Flate-compressed streams inflate

#### Scenario: Spanish PDF renders readable text

- **WHEN** a user opens the downloaded Spanish CV
- **THEN** the name, headings, and body are readable and accented characters display correctly

### Requirement: English CV download remains unchanged

When the page language is not Spanish, the CV download SHALL serve `resources/cv/Julian_Restrepo_CV_EN.pdf`. That file MUST remain a valid binary PDF and MUST NOT be modified by this change.

#### Scenario: Language is English

- **WHEN** the stored language is `en` (or unset, defaulting to `en`) and the user clicks Download CV
- **THEN** the browser downloads `Julian_Restrepo_CV_EN.pdf` from `./resources/cv/Julian_Restrepo_CV_EN.pdf`

#### Scenario: English asset is untouched

- **WHEN** this change is applied
- **THEN** `resources/cv/Julian_Restrepo_CV_EN.pdf` has the same bytes as before the change

### Requirement: PDF assets are stored as Git binaries

The repository MUST mark `*.pdf` as binary in `.gitattributes` so Git does not apply text encoding or line-ending conversion to CV PDFs.

#### Scenario: Attributes protect PDFs

- **WHEN** `.gitattributes` is read
- **THEN** it contains a `*.pdf binary` rule
