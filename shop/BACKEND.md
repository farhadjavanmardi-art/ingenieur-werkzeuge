# Das Backend der Verkaufsseite

Alles liegt im Schema `werkzeuge` der bestehenden Datenbank (Projekt
`xdjtirojdjxqfzpjvdkw`), nicht in einem eigenen Projekt - das freie Kontingent
von zwei Projekten ist belegt. Die Trennung uebernimmt das Schema.

## Wenn sich jemand meldet

Frueher landete eine Anfrage nur in der Tabelle. Wer nicht von selbst nachsah,
erfuhr nie davon - und ein Interessent, der zwei Tage auf Antwort wartet, ist
keiner mehr.

Jetzt loest jede neue Zeile den Trigger `anfrage_melden` aus, und der schickt
die Anfrage auf **zwei** Wegen:

| Weg | wohin | wozu |
|---|---|---|
| Telegram | derselbe Bot wie bei Logic Style | kommt sofort aufs Telefon |
| E-Mail (Resend) | `Farhad.javanmardi@icloud.com` | bleibt als Beleg liegen |

Zwei Wege, damit einer ausfallen darf. Die E-Mail traegt die Adresse des
Interessenten als *Antwort-an*, es laesst sich also direkt aus der
Benachrichtigung antworten.

**Schlaegt der Versand fehl, wird die Anfrage trotzdem gespeichert.** Die
Funktion faengt jeden Fehler ab. Eine verlorene Benachrichtigung ist aergerlich,
eine verlorene Anfrage waere schlimmer.

Die Zugaenge (Telegram-Token, Chat-ID, Resend-Schluessel) stehen in
`public.app_config` und werden nur gelesen. Sie stehen nirgends im Quelltext.

## Anfragen ansehen

Die Tabelle `anfragen` hat **absichtlich keine Leseregel**: wer das Formular
ausfuellt, darf die Anfragen der anderen nicht sehen. Damit kommt aber auch der
Betreiber nicht ueber die normale Schnittstelle heran. Dafuer gibt es zwei
Funktionen, im SQL-Editor von Supabase aufzurufen:

```sql
-- offene Anfragen, neueste zuerst
select * from werkzeuge.anfragen_ansehen();

-- alle, auch die schon erledigten
select * from werkzeuge.anfragen_ansehen(false);

-- eine abhaken, wenn sie beantwortet ist
select werkzeuge.anfrage_erledigt('kunde@firma.de');
```

Beide sind fuer `anon` und `authenticated` gesperrt. Geprueft, nicht
angenommen: als Besucher werden Lesen, Abhaken und der direkte Zugriff auf die
Tabelle alle drei abgewiesen.

## Dass die Datenbank nicht wieder vollaeuft

Sie ist schon einmal vollgelaufen, damals an Bildern. Hier wird ausschliesslich
Text gespeichert; 100.000 Anfragen waeren etwa 30 MB.

Das eigentliche Risiko ist der oeffentliche Einfuege-Endpunkt. Dagegen stehen:

- Laengen- und Formatpruefung auf jedem Feld (Name 120, Firma 160, E-Mail 200,
  Telefon 60, Nachricht 4000 Zeichen)
- eine Bremse, die mehr als 60 Anfragen je Stunde abweist
- `werkzeuge.anfragen_aufraeumen()` zum Loeschen alter erledigter Anfragen
- die Ansicht `werkzeuge.speicher` fuer den Platzverbrauch

Alle drei Schutzstellen sind **ausgeloest** worden, nicht nur nachgelesen:
Ueberlaenge abgewiesen, falsche E-Mail-Form abgewiesen, Bremse bei der 61.
Zeile gegriffen. Der Test lief in einem Block und wurde zurueckgenommen;
danach standen null Zeilen in der Tabelle.

```sql
select * from werkzeuge.speicher;   -- wie voll ist es
```

## Die Tabellen

| Tabelle | wofuer | wer darf lesen |
|---|---|---|
| `plaene` | die Preise, die die Seite anzeigt | alle, solange `aktiv` |
| `anfragen` | wer sich ueber das Formular meldet | niemand ausser dem Betreiber |
| `kunden` | wer gekauft hat | nur der eigene Datensatz |
| `abos` | welches Abo laeuft | nur das eigene, nur lesen |
| `lizenzen` | welcher Schluessel wozu gehoert | nur die eigenen, nur lesen |

In `plaene` steht der Text mit `{anzahl}` statt einer festen Zahl; die Seite
setzt die Anzahl der Werkzeuge aus ihren Daten ein. So gibt es genau eine
Stelle, an der die Zahl gepflegt wird - sie ist schon einmal auseinandergelaufen.
