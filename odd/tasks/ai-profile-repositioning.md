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
- [ ] T2 CVs EN/ES + PDFs via headless Chrome (route: inline)

## Checks
- EN/ES toggle swaps all sections; no console errors
- PDFs are 1 page each

## Progress
