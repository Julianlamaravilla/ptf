## 1. Pre-flight validation

- [x] 1.1 Confirm `Julian_Restrepo_CV_ES (6).pdf` exists at the repo root
- [x] 1.2 Run binary integrity checks on the source: not valid UTF-8, zero `EF BF BD` bytes, PDF header binary comment is not replacement characters, Flate streams inflate
- [x] 1.3 Record the SHA-256 of `resources/cv/Julian_Restrepo_CV_EN.pdf` so it can be compared after the copy

## 2. Replace the Spanish CV asset

- [x] 2.1 Copy `Julian_Restrepo_CV_ES (6).pdf` onto `resources/cv/Julian_Restrepo_CV_ES.pdf` with `cp` (binary copy, no text rewrite)
- [x] 2.2 Add `*.pdf binary` to `.gitattributes` at the repo root
- [x] 2.3 Delete `Julian_Restrepo_CV_ES (6).pdf` from the repo root after the destination passes integrity checks
- [x] 2.4 Leave `js/main.js` unchanged; confirm it still maps `es` → `Julian_Restrepo_CV_ES.pdf`

## 3. Post-change validation

- [x] 3.1 Re-run the same binary integrity checks on `resources/cv/Julian_Restrepo_CV_ES.pdf` and fail if any check does not pass
- [x] 3.2 Confirm `resources/cv/Julian_Restrepo_CV_EN.pdf` SHA-256 matches the pre-flight value
- [x] 3.3 Confirm `.gitattributes` contains `*.pdf binary`
- [x] 3.4 In the browser, set language to Spanish, click Download CV, and confirm the file is `Julian_Restrepo_CV_ES.pdf` and opens with readable text and correct accents
- [x] 3.5 In the browser, set language to English, click Download CV, and confirm the file is `Julian_Restrepo_CV_EN.pdf` and still looks correct

## 4. Commit and push

- [x] 4.1 Stage only the intended files: `resources/cv/Julian_Restrepo_CV_ES.pdf`, `.gitattributes`, and the deletion of `Julian_Restrepo_CV_ES (6).pdf` if it was tracked
- [x] 4.2 Commit with a message that explains the Spanish CV binary was restored and PDFs are now marked binary
- [x] 4.3 Push the commit to the tracked remote branch (no force push)
