## Context

The portfolio download button in `js/main.js` already picks a file by language:

- `es` → `./resources/cv/Julian_Restrepo_CV_ES.pdf`
- otherwise → `./resources/cv/Julian_Restrepo_CV_EN.pdf`

The English asset is a valid binary PDF (pypdf, LiberationSans, Flate streams inflate). The Spanish asset is not. In `2c0acd1` (`fix:cv`) it was saved through a UTF-8 text path: 21,758 `U+FFFD` replacement sequences, a text-safe header, and zero inflatable streams. Viewers therefore render garbled glyphs.

A replacement file already exists at the repo root: `Julian_Restrepo_CV_ES (6).pdf`. It matches the English file’s health profile (binary header `%âãÏÓ`, 0 replacement bytes, 12/12 Flate streams inflate, producer `pypdf`).

This change is an asset + Git hygiene fix, not a frontend rewrite.

## Goals / Non-Goals

**Goals:**

- Serve a visually readable Spanish CV from the existing download path
- Keep English download behavior unchanged
- Prevent Git or editors from treating CV PDFs as text
- Prove the new file is binary-healthy before commit
- Land the fix on the remote with an explicit commit and push

**Non-Goals:**

- Changing language detection or the download click handler
- Regenerating the CV from `cv-data/index.html` (different, longer document)
- Adding a PDF generation pipeline
- Restoring the older Spanish PDF from `97d0260` (sane binary, stale content)
- Redesigning CV layout or copy

## Decisions

### 1. Overwrite the canonical filename instead of pointing JS at the new name

- **Choice:** `cp` the verified file onto `resources/cv/Julian_Restrepo_CV_ES.pdf`
- **Why:** The download contract already uses that name. Renaming would require JS changes and leave a dead `_ES.pdf` in place
- **Alternative considered:** Change `main.js` to `Julian_Restrepo_CV_ES (6).pdf`. Rejected: spaces in the filename, leftover corrupt asset, and unnecessary code churn

### 2. Copy as binary; never open the PDF in a text editor

- **Choice:** filesystem copy (`cp`) of the source file
- **Why:** The original bug was a text/UTF-8 rewrite. `cp` preserves bytes
- **Alternative considered:** Re-export through a script or editor save. Rejected: higher chance of repeating the corruption

### 3. Mark `*.pdf` as binary in `.gitattributes`

- **Choice:** add `*.pdf binary` at the repo root
- **Why:** Stops line-ending and encoding filters from mutating PDF bytes on checkout/commit
- **Alternative considered:** Only mark the two CV paths. Rejected: all PDFs in this repo should be binary; the broader rule is simpler

### 4. Delete the root-level source after a successful copy

- **Choice:** remove `Julian_Restrepo_CV_ES (6).pdf` once `resources/cv/Julian_Restrepo_CV_ES.pdf` passes integrity checks
- **Why:** One canonical Spanish asset; avoid committing a duplicate with a download-folder name
- **Alternative considered:** Keep both. Rejected: noise in the repo root

### 5. Validate before commit; commit then push

- **Choice:** integrity script (UTF-8 must fail, `U+FFFD` count = 0, Flate streams inflate) plus a manual ES download check, then one commit and `git push`
- **Why:** The last “fix” committed a broken file. Validation is the gate. User asked for explicit validation, commit, and push tasks
- **Alternative considered:** Commit immediately after `cp`. Rejected: that is how the corrupt file landed

## Risks / Trade-offs

- [Copy treated as text] → Use `cp` only; fail the integrity check if the dest is valid UTF-8 or contains `EF BF BD`
- [Source file missing when applying] → Task 1 verifies `Julian_Restrepo_CV_ES (6).pdf` exists and is healthy before overwrite
- [Content drift vs English CV] → Integrity checks binary health, not copy parity. Visual spot-check of name, accents, and sections is required
- [`.gitattributes` does not rewrite the already-corrupt history] → It only protects future commits; the overwrite replaces the working tree file
- [Push rejected / no remote] → Push is a dedicated task; if it fails, stop and report rather than force-pushing

## Migration Plan

1. Confirm the root source PDF is binary-healthy
2. Overwrite `resources/cv/Julian_Restrepo_CV_ES.pdf`
3. Re-run the same integrity checks on the destination
4. Add `.gitattributes`
5. Delete the root source file
6. Manually download via the ES language path
7. Commit and push

**Rollback:** restore `resources/cv/Julian_Restrepo_CV_ES.pdf` from `2c0acd1` (still broken) or from `97d0260` (old content). Prefer keeping a local copy of the new source until push succeeds.

## Open Questions

- None. Source file, destination path, and download contract are known.
