# Feature: AI profile repositioning

## Objective
Reposition portfolio and CVs from "Java Software Engineer" to "Software Engineer · AI Engineering & Backend Systems", using the user's AI/agent experience doc as source.

## Scope
- `index.html`, `js/translations.js` (EN/ES copy)
- `cv-data/index-en.html`, `cv-data/index.html` + regenerated PDFs in `files/` and `resources/cv/`

## Constraints
- Do not dump the whole source doc; no inflated claims ("~12 months" removed).
- Keep Harvard CV style, 1 Letter page.

## Tasks
- [x] T1 Portfolio copy: hero, about, skills, 5 experience cards, IMA project card, remove ERP/Argenta cards, contact (route: inline; parent already holds full context)
- [x] T2 CVs EN/ES + PDFs via headless Chrome (route: inline)

## Checks
- EN/ES toggle swaps all sections; no console errors
- PDFs are 1 page each

## Progress
- T1 a551b6a: portfolio copy; EN/ES verified in headless Chrome, no JS errors
- T2: CV HTML + PDFs regenerated via headless Chrome; both 1 page (styles tightened: 9.6pt, 0.6in side margins)

## Next step
User review; push/PR is the user's decision.
