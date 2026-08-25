# Proyectos Destacados

## Proyecto 1: Adkio

### Descripción
Agente de IA que planifica y lanza campañas en Meta, TikTok y Google Ads desde lenguaje natural, con aprobación humana antes de publicar.

**Caso de Uso:** El usuario describe la campaña en lenguaje natural; Adkio arma audiencia, copy y plataforma, y no publica nada sin un click de aprobación.

### Tipo de Problema Resuelto
- **Categoría:** Problemas Agénticos + Necesidad Directa de Empresas
- **Impacto:** Automatiza la planificación y el lanzamiento de campañas publicitarias, con control humano antes de publicar

### Stack Tecnológico
**Backend:**
- Python 3.11 (FastAPI)
- LiteLLM (abstracción de LLMs)
- Anthropic Models (core del agente)

**Frontend:**
- JavaScript (React.js)
- TypeScript
- Vite
- Tailwind CSS

**Infraestructura y Servicios:**
- Supabase (Postgres)
- Render (deploy frontend + backend)
- Docker
- Meta (`facebook-business`), TikTok REST, Google Ads (`google-ads`)

### Características Técnicas Principales
- **Motor de IA:** loop de tool use vía LiteLLM, streaming SSE
- **Flujo:** lenguaje natural → plan de campaña → checklist → aprobación humana → creación en PAUSED
- **Arquitectura:** API REST FastAPI + SPA React

### Repositorio
- **GitHub:** https://github.com/Andss-ye/Adkio

### Demo/Live
- https://adkio-frontend.onrender.com

---

## Proyecto 2: ERP Kidar (corporativo)

- Construcción del ERP empresarial de Kidar
- No se puede mostrar código público por acuerdos de confidencialidad
- **Stack (tarjeta):** Python, AWS, React, Bedrock

---

## Proyecto 3: Jojun (Backend + CLI)

### Descripción
Portapapeles P2P para la terminal: dos laptops se conectan a la misma sala, una envía un snippet y la otra lo recibe. Sin Discord, USB ni servidor.

Conectas con un nombre de sala, Send en un PC y Receive en el otro. Por debajo usa Hyperswarm (`join` / `paste` / `yank`) sobre Bare + Pear, con instalación y actualizaciones P2P (`pear install`).

### Tipo de Problema Resuelto
- **Categoría:** Necesidad directa (mover un blob entre dos PCs sin chat apps ni USB)
- **Contexto:** Aleph 2026 Pears Track (sponsor Tether)

### Stack Tecnológico
Sacado de `package.json` del repo [Organization-Jojun/joju-cli](https://github.com/Organization-Jojun/joju-cli):

- Bare (`bare-runtime`, `bare-*`) — runtime, no Node.js
- Pear (`pear-runtime`) — app + OTA P2P
- Hyperswarm — topic P2P
- JavaScript (ESM: `bin.mjs`, paparam)
- corestore

### Repositorio
- **GitHub:** https://github.com/Organization-Jojun/joju-cli

### Demo/Live
- CLI; no hay URL pública. Instalación: `pear install` (ver README del repo)

---

## Proyecto 4: Argenta Health Care (Frontend)

### Descripción
Sitio demo de Argenta Health Care, un hospital institucional. La interfaz parece un producto real: home de servicios, directorio médico, sedes, agendamiento, portal del paciente, pagos, telemedicina, bilingüe ES/EN y controles de accesibilidad. Está hecha con Vite y usa datos mock, no un backend clínico.

### Tipo de Problema Resuelto
- **Categoría:** Frontend institucional / UI-UX hospitalario
- **Alcance:** Solo frontend; flujos mock (citas, portal, pagos, HIPAA, ADA)

### Stack Tecnológico
Sacado de `package.json` y `src/` del repo [Julianlamaravilla/ArgentaWebsite](https://github.com/Julianlamaravilla/ArgentaWebsite):

- Vite 6
- JavaScript vanilla (`src/main.js`, `i18n.js`, `pages.js`, etc.; sin React)
- CSS (`src/styles`)
- Cloudflare Workers (host del demo)

### Repositorio
- **GitHub:** https://github.com/Julianlamaravilla/ArgentaWebsite

### Demo/Live
- https://argenta.julianrestrepo012.workers.dev/

---

## Resumen

| Proyecto | Tipo | Stack (tarjeta) | Estado |
|----------|------|-----------------|--------|
| Adkio | Agente IA + Web | Python / FastAPI / React / Anthropic | Público; demo en Render |
| ERP Kidar | Enterprise | Python / AWS / React / Bedrock | Privado (corporativo) |
| Jojun | Backend + CLI P2P | Bare / Pear / Hyperswarm / JavaScript | Público en GitHub |
| Argenta Health Care | Frontend | Vite / JavaScript / CSS / Cloudflare | Público; demo en Workers |
