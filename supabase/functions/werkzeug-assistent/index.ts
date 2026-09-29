import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { KATALOG, katalogText } from "./katalog.ts";
import { anweisung, datenText, GRENZEN, MODI, type Modus } from "./modi.ts";

/* Der KI-Helfer der Ingenieur-Werkzeuge.

   Vier Betriebsarten, eine Funktion:

     werkzeug   Dashboard: aus einer Aufgabenbeschreibung das Werkzeug finden
     deutung    ein Rechenergebnis einordnen
     auswahl    die Wahl des Messprinzips beurteilen
     norm       eine Frage zum Regelwerk beantworten

   Eine Funktion und nicht vier, weil Bremse, Laengengrenze und der Griff nach
   dem Schluessel in allen Faellen dieselben sind. Vier Kopien waeren vier
   Stellen, an denen eine Bremse fehlen kann.

   Warum es diese Funktion ueberhaupt gibt: die Werkzeuge sind statische
   Seiten auf Vercel. Alles, was in ihnen steht, kann jeder Besucher lesen -
   ein Schluessel darin waere ein Schluessel fuer alle, und die Rechnung liefe
   auf ein fremdes Konto. Der Schluessel liegt deshalb in public.app_config,
   das RLS hat und absichtlich keine policy: nur service_role, und das ist
   ausschliesslich hier drin.

     Browser  ->  diese Funktion  ->  api.anthropic.com
                        |
                        +-- Schluessel aus app_config

   Zwei Bremsen, ohne die ein oeffentlicher Endpunkt an einer bezahlten
   Schnittstelle nicht gebaut werden darf:

   1. Laenge. Die freie Frage wird bei 600 Zeichen abgeschnitten, die Daten
      aus dem Werkzeug bei 40 Feldern und 3000 Zeichen, die Antwort bei
      wenigen hundert Token. Ohne das bezahlt man fremde Romane.
   2. Anzahl. public.werkzeuge_ki_bremse zaehlt in der Datenbank und weist
      ab der 61. Anfrage je Stunde ab - dieselbe Groessenordnung wie die
      Bremse vor werkzeuge.anfragen. In der Datenbank und nicht im Speicher
      dieser Funktion, weil sie in mehreren Instanzen laeuft.

   Was hier ausdruecklich NICHT passiert: rechnen. Kv, Spannungsfall und
   Erdungswiderstand kommen aus der Formel im jeweiligen Werkzeug. Ein
   Modell, das eine Zahl nennt, die niemand nachrechnet, ist schlimmer als
   keine Zahl. */

const SB_URL = Deno.env.get("SUPABASE_URL") || "";
const SB_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const MODELL = "claude-sonnet-5";
const MAX_TREFFER = 3;

/* Wie lang die Antwort werden darf. Die Auswahl im Dashboard ist eine kurze
   Liste, eine Deutung sind ein paar Saetze - beides braucht keine 2000
   Token, und jedes Token kostet. */
const MAX_TOKEN: Record<Modus, number> = {
  werkzeug: 400,
  deutung: 500,
  auswahl: 600,
  norm: 600,
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function sbHeaders() {
  return {
    "apikey": SB_SERVICE,
    "Authorization": "Bearer " + SB_SERVICE,
    "Content-Type": "application/json",
  };
}

/* Schluessel aus app_config. Gleiche Form wie loadConfig in
   supabase/functions/*_shared/cron.ts, nur fuer einen Schluessel und ohne
   die Wiederholung: faellt der Griff hier aus, wartet ein Mensch vor dem
   Bildschirm und bekommt lieber sofort eine Meldung als in drei Sekunden
   eine Antwort. Der Wert wird nirgends geloggt. */
async function anthropicKey(): Promise<string> {
  const res = await fetch(
    `${SB_URL}/rest/v1/app_config?select=value&key=eq.anthropic_api_key&limit=1`,
    { headers: sbHeaders() },
  );
  if (!res.ok) return "";
  const rows = await res.json().catch(() => []);
  return rows?.[0]?.value || "";
}

/* Fragt die Bremse und zaehlt die Anfrage dabei mit.

   Drei Ausgaenge und nicht zwei: "die Bremse hat abgewiesen" und "die Bremse
   war nicht erreichbar" sehen von aussen gleich aus, meinen aber Gegenteiliges.
   Beides fuehrt dazu, dass nichts durchgeht - eine Bremse, die im Zweifel
   oeffnet, ist keine -, aber der Besucher bekommt die richtige Meldung und
   im Log steht, was los war. */
type Bremse = "durch" | "zuviel" | "stoerung";

async function darfDurch(zeichen: number): Promise<Bremse> {
  try {
    /* Die Bremse steht in public, ihre Daten in werkzeuge: PostgREST dieses
       Projekts gibt nur public und graphql_public heraus. Siehe
       supabase/migrations/20260916_werkzeug_assistent.sql. */
    const res = await fetch(`${SB_URL}/rest/v1/rpc/werkzeuge_ki_bremse`, {
      method: "POST",
      headers: sbHeaders(),
      body: JSON.stringify({ p_zeichen: zeichen }),
    });
    if (res.ok) return "durch";
    const text = (await res.text()).slice(0, 300);
    if (text.includes("Zu viele Anfragen")) return "zuviel";
    console.error("Bremse nicht erreichbar: HTTP " + res.status + " " + text);
    return "stoerung";
  } catch (e) {
    console.error("Bremse nicht erreichbar: " + String(e).slice(0, 200));
    return "stoerung";
  }
}

/* Die Anweisung fuer das Dashboard. Sie steht hier und nicht in modi.ts,
   weil sie als einzige den Werkzeugkatalog braucht und als einzige JSON
   zurueckverlangt. */
const ANWEISUNG_WERKZEUG = [
  "Du hilfst Ingenieuren aus dem EMSR- und Anlagenbau, aus einer Sammlung",
  "von Berechnungswerkzeugen das passende zu finden.",
  "",
  "Die Werkzeuge, jeweils Kennung | Name | was es tut:",
  katalogText(),
  "",
  "Antworte ausschliesslich mit JSON in dieser Form, ohne Vorrede und ohne",
  "Code-Zaun:",
  '{"treffer":[{"id":"<Kennung>","warum":"<ein Satz>"}]}',
  "",
  "Regeln:",
  "- Hoechstens " + MAX_TREFFER + " Werkzeuge, das passendste zuerst.",
  "- Nur Kennungen aus der Liste oben. Nichts erfinden.",
  "- Passt keines, gib {\"treffer\":[]} zurueck.",
  '- "warum" ist ein kurzer deutscher Satz und sagt, was das Werkzeug fuer',
  "  genau diese Aufgabe liefert. Keine Wiederholung der Kurzbeschreibung.",
  "- Rechne nicht und nenne keine Zahlenergebnisse. Das Rechnen ist Sache",
  "  des Werkzeugs.",
].join("\n");

async function frageModell(
  key: string,
  system: string,
  inhalt: string,
  maxToken: number,
): Promise<string | null> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODELL,
      max_tokens: maxToken,
      system,
      messages: [{ role: "user", content: inhalt }],
    }),
  });
  if (!res.ok) {
    /* Ins Log, nicht in die Antwort: der Besucher kann damit nichts
       anfangen, und wer die Funktion sucht, findet hier den Grund - ein
       zurueckgezogenes Modell meldet sich genauso wie ein leeres Guthaben,
       und beides sieht von aussen nach "geht nicht" aus. */
    console.error("Anthropic: HTTP " + res.status + " " +
                  (await res.text()).slice(0, 300));
    return null;
  }
  const daten = await res.json().catch(() => ({}));
  return String(daten?.content?.[0]?.text || "").trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  if (req.method !== "POST") return json({ fehler: "Nur POST." }, 405);
  if (!SB_URL || !SB_SERVICE) return json({ fehler: "Dienst nicht eingerichtet." }, 500);

  try {
    const body = await req.json().catch(() => ({}));

    /* Ohne Angabe die alte Betriebsart: das Dashboard schickt seit jeher
       nur { frage } und soll nicht brechen. */
    const modus = (String(body?.modus || "werkzeug") as Modus);
    if (!MODI.includes(modus)) return json({ fehler: "Unbekannte Betriebsart." }, 400);

    const werkzeug = String(body?.werkzeug || "").trim().slice(0, GRENZEN.werkzeugName);
    const frage = String(body?.frage || "").trim().slice(0, GRENZEN.frage);
    const daten = datenText(body?.daten);

    /* Etwas muss da sein: eine Frage oder Daten aus dem Werkzeug. Sonst
       waere es eine bezahlte Anfrage ueber nichts. */
    if (!frage && !daten) return json({ fehler: "Keine Angaben zum Auswerten." }, 400);
    if (modus === "werkzeug" && !frage) {
      return json({ fehler: "Bitte die Aufgabe beschreiben." }, 400);
    }

    /* Erst bremsen, dann arbeiten. Andersherum waere die Bremse nur eine
       Buchhaltung ueber bereits bezahlte Anfragen. */
    const bremse = await darfDurch(frage.length + daten.length);
    if (bremse === "zuviel") {
      return json({
        fehler: "Zu viele Anfragen in kurzer Zeit. Bitte später erneut versuchen.",
      }, 429);
    }
    if (bremse === "stoerung") {
      return json({ fehler: "Dienst gerade nicht verfügbar." }, 503);
    }

    const key = await anthropicKey();
    if (!key) return json({ fehler: "Dienst gerade nicht verfügbar." }, 503);

    // ------------------------------------------------ Dashboard: Werkzeugwahl
    if (modus === "werkzeug") {
      const roh = await frageModell(key, ANWEISUNG_WERKZEUG, frage, MAX_TOKEN.werkzeug);
      if (roh === null) return json({ fehler: "Dienst gerade nicht verfügbar." }, 502);

      /* Das Modell soll reines JSON liefern. Falls doch ein Satz davor steht,
         wird das Objekt herausgeschnitten, statt die Antwort wegzuwerfen. */
      const klammer = roh.slice(roh.indexOf("{"), roh.lastIndexOf("}") + 1);
      let geparst: { treffer?: Array<{ id?: string; warum?: string }> } = {};
      try { geparst = JSON.parse(klammer); } catch (_e) { geparst = {}; }

      /* Nur Kennungen, die es wirklich gibt, und jede nur einmal. Der Browser
         zeigt an, was hier herauskommt; eine erfundene Kennung waere dort eine
         Karte, die ins Leere fuehrt. */
      const gesehen = new Set<string>();
      const treffer: Array<{ id: string; warum: string }> = [];
      for (const t of Array.isArray(geparst.treffer) ? geparst.treffer : []) {
        const id = typeof t?.id === "string" ? t.id : "";
        if (!id || gesehen.has(id)) continue;
        if (!KATALOG.some((w) => w.id === id)) continue;
        gesehen.add(id);
        treffer.push({ id, warum: String(t.warum || "").slice(0, 300) });
        if (treffer.length >= MAX_TREFFER) break;
      }
      return json({ treffer });
    }

    // ------------------------------------- Deutung, Auswahl, Norm: freier Text
    const inhalt = [
      daten ? "Angaben und Ergebnisse aus dem Werkzeug:\n" + daten : "",
      frage ? "Frage des Benutzers:\n" + frage : "",
    ].filter(Boolean).join("\n\n");

    const antwort = await frageModell(
      key, anweisung(modus, werkzeug || "unbekannt"), inhalt, MAX_TOKEN[modus]);
    if (antwort === null) return json({ fehler: "Dienst gerade nicht verfügbar." }, 502);
    if (!antwort) return json({ fehler: "Keine Antwort erhalten." }, 502);

    return json({ antwort });
  } catch (_e) {
    /* Die Meldung bleibt allgemein: was hier schiefgeht, geht den Besucher
       nichts an, und Einzelheiten waeren ein Wegweiser. */
    return json({ fehler: "Dienst gerade nicht verfügbar." }, 500);
  }
});
