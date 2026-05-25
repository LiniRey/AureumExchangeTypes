# @aureumtools/exchange-types

TypeScript type definitions for the **Aureum Exchange Format** — the universal interchange format used by the Aureum tool ecosystem (AureumNarrator, AureumPrompter, and upcoming Karten/RPG/Stammbaum/Worldbuilding tools).

Lightweight, dependency-free, runtime-code-free. Works in any TS/JS environment (browser, Node, Electron).

## Install

```bash
npm install @aureumtools/exchange-types
```

## Use

```typescript
import {
  AureumExchangeFile,
  AureumHeader,
  AUREUM_FORMAT_NAME,
  AUREUM_FORMAT_VERSION,
  eventSceneIds,
  isSupportedFormatVersion,
} from "@aureumtools/exchange-types";

// Reader-Seite:
function parseFile(json: string): AureumExchangeFile | null {
  const data = JSON.parse(json);
  if (data?.aureum?.format !== AUREUM_FORMAT_NAME) return null;
  if (!isSupportedFormatVersion(data.aureum.version)) return null;
  return data as AureumExchangeFile;
}

// Producer-Seite:
const file: AureumExchangeFile = {
  aureum: {
    format: AUREUM_FORMAT_NAME,
    version: AUREUM_FORMAT_VERSION,
    source: "AureumNarrator",
    exportedAt: new Date().toISOString(),
    projectName: "Mein Roman",
  },
  manuscript: { chapters: [/* ... */] },
};
```

## Format-Sektionen

| Sektion | Inhalt |
|---|---|
| `aureum` | Pflicht-Header (format, version, source, exportedAt, projectName) |
| `projectMeta` | Projekt-Metadaten (Typ, Beschreibung, Sprache, Tags, ...) |
| `manuscript` | Kapitel + Szenen mit Kurzbeschreibung / Volltext |
| `entities` | Characters, Places, Items, Groups, Creatures, Libraries, Worlds |
| `planning` | Plan-Buckets (Dialog, Twist, Cliff, Poesie-Plans, ...) |
| `sceneEntityLinks` | M:N Szene ↔ Entity Verknüpfung |
| `notes` / `comments` | Notizen + Kommentare mit Position |
| `timeline` | Perioden + Events + Strands + Placements |
| `sceneTensions` | Spannungswerte pro Szene |
| `plotModels` / `plotAssignments` | Plot-Struktur-Modelle |
| `trackingConfigs` | Auto-Erkennungs-Regeln |
| `customTags` | Tag-Definitionen für Notizen |
| `userDatabases` | Generische User-Datenbanken |

Alle Sektionen sind optional — Producer schreibt nur, was er hat. Reader liest nur, was er versteht, und ignoriert unbekannte Felder.

## Versionierung

Strict SemVer:

- **Major-Bump (2.0, 3.0, ...):** Breaking Changes — Reader < Major muss ablehnen.
- **Minor-Bump (1.1, 1.2, ...):** Additive Felder, abwärtskompatibel — Reader < Minor kennt neue Felder nicht, ignoriert sie.
- **Patch-Bump (1.0.1, ...):** Nur Doku/Type-Verschärfungen, kein Schema-Effekt.

Aktuell: **`1.1`** (Format-Bump 1.0 → 1.1: `AureumTimelineEvent.sceneIds[]` ersetzt `sceneId` als kanonisches Feld — Reader-Fallback via `eventSceneIds()`-Helper).

## Lizenz

MIT
