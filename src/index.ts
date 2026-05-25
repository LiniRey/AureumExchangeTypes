/**
 * @aureumtools/exchange-types
 *
 * Type-Definitionen fuer das Aureum-Exchange-Format — das universelle
 * Austauschformat des Aureum-Tool-Oekosystems (Narrator, Prompter und
 * spaetere Tools wie Karten, RPG, Stammbaum, Worldbuilding).
 *
 * Dieses Paket enthaelt ausschliesslich Type-Deklarationen — keine
 * Runtime-Logik, kein Code-Aufruf. Damit ist es in jeder TS/JS-Umgebung
 * (Browser, Node, Electron) ohne Build-Constraints nutzbar.
 *
 * Versionierungs-Policy:
 * - Major-Bump: Breaking-Changes am Format (Reader < dieser Version muss
 *   abgelehnt werden)
 * - Minor-Bump: additive Felder, abwaertskompatibel
 * - Patch-Bump: nur Doc/Type-Verschaerfungen ohne Schema-Aenderung
 */

// ── Format-Konstanten ──────────────────────────────────────────────────

/** Identifier-String im aureum-Header. */
export const AUREUM_FORMAT_NAME = "aureum-exchange" as const;
export type AureumFormatName = typeof AUREUM_FORMAT_NAME;

/** Aktuelle Format-Version, die dieses Paket beschreibt. */
export const AUREUM_FORMAT_VERSION = "1.1" as const;

/** Datei-Endung von Aureum-Exchange-Files. */
export const AUREUM_FILE_EXTENSION = "aureum.json" as const;

/** Major-Version, die Reader akzeptieren sollen (1.x = abwaerts-
 *  kompatible Minor-Bumps). Reader rejecten alles >= 2. */
export const SUPPORTED_AUREUM_MAJOR = 1;

// ── Header ─────────────────────────────────────────────────────────────

/**
 * Pflicht-Header in jedem Aureum-Exchange-File. Erkennungs-Marker
 * fuer Reader, dient gleichzeitig als Versions-Gate.
 */
export interface AureumHeader {
  format: AureumFormatName;
  /** SemVer-String. Major-Komponente entscheidet ueber Kompatibilitaet. */
  version: string;
  /** Welches Tool hat das File geschrieben. Frei wahlbar, z.B. "AureumNarrator". */
  source: string;
  /** ISO-8601-Timestamp des Exports. */
  exportedAt: string;
  /** Vom Nutzer vergebener Projekt-Name. */
  projectName: string;
}

// ── Projekt-Metadaten ──────────────────────────────────────────────────

export type AureumProjectType = "prose" | "poetry";
export type AureumLanguage = "de" | "en";

/**
 * Gemeinsame Projekt-Metadaten — alle Tools lesen diese, jedes kennt nur
 * eine Teilmenge. Felder sind optional, weil verschiedene Tools
 * verschiedene Untermengen ausfuellen.
 */
export interface AureumProjectMeta {
  projectType: AureumProjectType;
  shortDescription?: string;
  longDescription?: string;
  genres?: string[];
  targetAudiences?: string[];
  poetryThemes?: string[];
  defaultPoemForm?: string | null;
  language?: AureumLanguage;
  color?: string;
  icon?: string;
  tags?: string[];
  targetWordCount?: number | null;
  targetChapterCount?: number | null;
  seriesName?: string | null;
  seriesPosition?: number | null;
}

// ── Manuskript ─────────────────────────────────────────────────────────

export interface AureumScene {
  id: string;
  name: string;
  /** Kurze Planungs-Beschreibung (was passiert in der Szene). Wird vom
   *  Prompter als primaere Quelle gelesen. */
  shortDescription?: string;
  /** Volltext-Manuskript (fertig geschriebene Prosa). Wird vom
   *  Prompter ignoriert (kein Prosa-Editor). */
  content?: string;
}

export interface AureumChapter {
  id: string;
  name: string;
  shortDescription?: string;
  content?: string;
  /** Optional: ein leeres Kapitel kann das Feld weglassen. */
  scenes?: AureumScene[];
}

export interface AureumManuscript {
  chapters?: AureumChapter[];
}

// ── Entities ───────────────────────────────────────────────────────────

/** Bekannte Entity-Buckets im Aureum-Oekosystem. Neue Tools koennen
 *  Buckets ergaenzen — Reader, die einen Bucket nicht kennen, sollten
 *  ihn ignorieren statt zu crashen. */
export type AureumEntityBucketKey =
  | "characters"
  | "places"
  | "items"
  | "groups"
  | "creatures"
  | "libraries"
  | "worlds";

/**
 * Minimale Entity-Form. Jedes Tool kann strikter typisieren (z.B. via
 * Casts auf seine Domain-Typen). Profile-Felder sind als
 * `Record<string, unknown>` deklariert, damit das Format auch fuer
 * kuenftige Entity-Subtypen offen bleibt.
 */
export interface AureumEntity {
  id: string;
  name: string;
  /** Entity-Typ-String (z.B. "charakter"). Tool-spezifische Enum-Werte. */
  type: string;
  role?: string;
  shortDescription?: string;
  characterProfile?: Record<string, unknown>;
  placeProfile?: Record<string, unknown>;
  itemProfile?: Record<string, unknown>;
  groupProfile?: Record<string, unknown>;
  creatureProfile?: Record<string, unknown>;
  libraryProfile?: Record<string, unknown>;
  worldProfile?: Record<string, unknown>;
  /** Erlaubt zusaetzliche Tool-spezifische Felder. */
  [extra: string]: unknown;
}

export type AureumEntities = Partial<Record<AureumEntityBucketKey, AureumEntity[]>>;

// ── Planning ───────────────────────────────────────────────────────────

/** Bekannte Plan-Buckets. Reader ignorieren unbekannte Buckets. */
export type AureumPlanBucketKey =
  | "dialogs"
  | "zwiegespraeche"
  | "twists"
  | "cliffhanger"
  | "stimmung"
  | "bildfeld"
  | "klang"
  | "volta"
  | "strophenlogik"
  | "leerstellen"
  | "sprecher"
  | "wirkung"
  | "soziogramme"
  | "rollen"
  | "motive";

/** Minimale Plan-Form. data ist Tool-spezifisch. */
export interface AureumPlan {
  id: string;
  kind?: string;
  name?: string;
  data?: Record<string, unknown>;
}

export type AureumPlanning = Partial<Record<AureumPlanBucketKey, AureumPlan[]>>;

// ── Scene-Entity-Links ─────────────────────────────────────────────────

export interface AureumSceneEntityLink {
  /** Scene-ID (= nodeId, weil Szenen in Narrator-Hierarchie Nodes sind). */
  nodeId: string;
  entityId: string;
  /** Tool-spezifischer Link-Typ-String (z.B. "anwesend", "erwaehnt"). */
  linkType: string;
}

// ── Notes + Comments ───────────────────────────────────────────────────

export interface AureumNote {
  id: string;
  title: string;
  text: string;
  tags?: string[];
  entityIds?: string[];
  chapterIds?: string[];
  sceneIds?: string[];
}

export interface AureumCommentTextPosition {
  id: string;
  commentId: string;
  nodeId: string;
  startOffset: number;
  endOffset: number;
  anchorText: string;
  createdAt?: string;
}

export interface AureumComment {
  id: string;
  /** Beliebige Tool-spezifische Felder. */
  [extra: string]: unknown;
  textPositions?: AureumCommentTextPosition[];
}

// ── Timeline ───────────────────────────────────────────────────────────

export interface AureumTimelinePeriod {
  id: string;
  label: string;
  order: number;
  timeJumpLabel?: string;
  dateHint?: string;
}

/**
 * Timeline-Event. **Format-Version 1.1+** erwartet `sceneIds[]` (Array),
 * weil ein Event semantisch ueber mehrere Szenen reichen kann.
 *
 * Reader-Fallback: Files aus Version 1.0 lieferten `sceneId` (singular).
 * Konsumenten sollten beide Felder lesen koennen: wenn `sceneIds` da
 * ist, nimm das; sonst `sceneId` als Single-Element-Array.
 */
export interface AureumTimelineEvent {
  id: string;
  periodId: string;
  label: string;
  description?: string;
  orderInPeriod: number;
  /** Seit 1.1 kanonisch. */
  sceneIds?: string[];
  /** Legacy aus 1.0 — Reader-Fallback. Neue Exporte sollten nur
   *  `sceneIds[]` schreiben. */
  sceneId?: string;
}

export interface AureumTimelineStrand {
  id: string;
  name: string;
  color?: string;
  description?: string;
  orderIndex?: number;
}

export interface AureumTimelinePlacement {
  id: string;
  strandId: string;
  eventId: string;
  orderInStrand?: number;
}

export interface AureumTimeline {
  periods?: AureumTimelinePeriod[];
  events?: AureumTimelineEvent[];
  strands?: AureumTimelineStrand[];
  placements?: AureumTimelinePlacement[];
  acceptedConflicts?: unknown[];
}

// ── Szene-Tension ─────────────────────────────────────────────────────

export interface AureumSceneTension {
  nodeId: string;
  tensionValue: number;
}

// ── Plot-Modelle ──────────────────────────────────────────────────────

export interface AureumPlotPhase {
  id: string;
  name: string;
  order: number;
  color?: string;
  builtIn?: boolean;
}

export interface AureumPlotModel {
  id: string;
  name: string;
  builtIn?: boolean;
  description?: string;
  phases: AureumPlotPhase[];
}

export interface AureumPlotAssignments {
  activeModelId?: string;
  /** nodeId -> phaseId[] mapping. */
  nodePhases?: Record<string, string[]>;
}

// ── Tracking-Configs ──────────────────────────────────────────────────

export interface AureumTrackingConfig {
  id: string;
  projectId?: string;
  entityId: string;
  terms?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ── Custom-Tags ────────────────────────────────────────────────────────

export interface AureumTagDefinition {
  key: string;
  label?: string;
  color?: string;
  [extra: string]: unknown;
}

// ── User-Databases (Narrator-Datenbanken-Feature) ─────────────────────

/** Generische User-Database-Form. Tool-spezifisch interpretierbar. */
export interface AureumUserDatabase {
  id: string;
  name: string;
  columns?: unknown[];
  rows?: unknown[];
  [extra: string]: unknown;
}

// ── Root-Datei ─────────────────────────────────────────────────────────

/**
 * Wurzel-Objekt einer Aureum-Exchange-Datei. Alle Sektionen sind
 * optional (Producer schreibt nur, was er hat; Reader liest nur, was er
 * versteht und ignoriert den Rest).
 */
export interface AureumExchangeFile {
  aureum: AureumHeader;
  projectMeta?: AureumProjectMeta;
  entities?: AureumEntities;
  planning?: AureumPlanning;
  manuscript?: AureumManuscript;
  sceneEntityLinks?: AureumSceneEntityLink[];
  notes?: AureumNote[];
  comments?: AureumComment[];
  timeline?: AureumTimeline;
  sceneTensions?: AureumSceneTension[];
  plotModels?: AureumPlotModel[];
  plotAssignments?: AureumPlotAssignments;
  trackingConfigs?: AureumTrackingConfig[];
  customTags?: AureumTagDefinition[];
  userDatabases?: AureumUserDatabase[];
}

// ── Helper-Funktion ──────────────────────────────────────────────────

/**
 * Liest die effektiven Scene-IDs eines Timeline-Events — bevorzugt
 * `sceneIds[]` (ab Format-Version 1.1), faellt auf `sceneId` (1.0)
 * zurueck. Liefert immer ein Array (leer falls weder noch).
 */
export function eventSceneIds(event: AureumTimelineEvent): string[] {
  if (event.sceneIds && event.sceneIds.length > 0) return event.sceneIds;
  if (event.sceneId) return [event.sceneId];
  return [];
}

/**
 * SemVer-Check fuer den Format-Header. Akzeptiert alles unter
 * Major-Version 2.
 */
export function isSupportedFormatVersion(version: string): boolean {
  const major = Number.parseInt(version.split(".")[0] ?? "", 10);
  return Number.isFinite(major) && major <= SUPPORTED_AUREUM_MAJOR;
}
