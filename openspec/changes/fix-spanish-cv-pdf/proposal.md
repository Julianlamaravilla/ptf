## Why

Downloading the Spanish CV serves `resources/cv/Julian_Restrepo_CV_ES.pdf`, but that file was rewritten as UTF-8 text in commit `fix:cv`. Its Flate streams and embedded fonts are destroyed, so the PDF opens looking garbled. A verified replacement already exists at the repo root (`Julian_Restrepo_CV_ES (6).pdf`). We should swap it in now so Spanish visitors get a readable CV.

## What Changes

- Replace the corrupted `resources/cv/Julian_Restrepo_CV_ES.pdf` with the verified binary from `Julian_Restrepo_CV_ES (6).pdf`
- Keep the existing language-aware download in `js/main.js` (no behavior change)
- Mark `*.pdf` as binary in `.gitattributes` so Git does not re-corrupt CV assets
- Remove the temporary source file from the repo root after the copy
- Validate the replacement (binary integrity + in-browser Spanish download)
- Commit the change and push it to the remote

## Capabilities

### New Capabilities

- `cv-download`: Language-aware CV download that serves a valid, readable PDF for Spanish (`_ES`) and English (`_EN`)

### Modified Capabilities

- None. There are no existing specs under `openspec/specs/`.

## Impact

- `resources/cv/Julian_Restrepo_CV_ES.pdf` (replaced binary)
- `Julian_Restrepo_CV_ES (6).pdf` (temporary source; deleted after copy)
- `.gitattributes` (new or updated: `*.pdf binary`)
- `js/main.js` (read-only; download path stays `./resources/cv/Julian_Restrepo_CV_ES.pdf` when language is `es`)
- Git history / remote: one commit and push after validation
