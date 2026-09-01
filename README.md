# Portfolio

Statisk portfolio byggd med HTML, CSS och JavaScript. Kontaktformular skickas via en Cloudflare Worker till min mejl-adress.

Frontend skickar endast till `https://api.jerrylundahl.com`. Workern validerar origin, indata, spamfaltet och Turnstile-token innan mejlet skickas.
