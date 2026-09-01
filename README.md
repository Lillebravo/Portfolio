# Portfolio

Statisk portfolio byggd med HTML, CSS och JavaScript. Kontaktformular skickas via en Cloudflare Worker till min mejl-adress.

Frontend skickar endast till `https://api.jerrylundahl.com`. Workern validerar origin, indata, spamfaltet och Turnstile-token innan mejlet skickas.

## Frontendstruktur

Portfolions startsida använder native ES modules under `js/`:

- `portfolio-app.js` komponerar sidan och samordnar uppstart samt språkbyte.
- `services/translation-service.js` laddar och applicerar översättningar.
- `components/` innehåller återanvändbara controllers för tema, animationer, navigering, modaler, expanderbara kort, mobil layout och kontaktformuläret.

Gemensamma bilder ligger i `assets/images/` och nedladdningsbara dokument i `assets/documents/`. Bloggen har en egen yta i `blog/` med `index.html`, `styles.css` och `app.js`.

Detta kräver att sidan körs via en HTTP-server, vilket redan gäller i produktion. För lokal utveckling kan du använda `python -m http.server 4173` och öppna `http://localhost:4173`.
