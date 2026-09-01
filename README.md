# Portfolio

Statisk portfolio byggd med HTML, CSS och JavaScript. Kontaktformular skickas via en Cloudflare Worker till `jerry.lundahl@hotmail.com`.

## Kontaktformular med Cloudflare

### 1. Lagg domanen i Cloudflare

1. Logga in pa samma Cloudflare-konto som ska aga Workern.
2. Valj **Add a domain** och lagg till `jerrylundahl.com` om zonen inte redan finns.
3. Byt domanens nameservers hos registrar till de nameservers Cloudflare visar.
4. Kontrollera att webbplatsens DNS-post ar proxad, det vill saga visar ett orange moln.

Wrangler kan inte skapa `/api/contact`-routen innan zonen finns i kontot. Om du har flera Cloudflare-konton maste `npx wrangler login` goras mot kontot som ager zonen.

### 2. Aktivera Email Service

1. Oppna Cloudflare Dashboard och ga till **Compute > Email Service**.
2. Onboarda domanen `jerrylundahl.com` som avsandardoman och folj DNS-stegen i Cloudflare.
3. Ga till **Email Routing > Destination Addresses**.
4. Lagg till `jerry.lundahl@hotmail.com` och klicka pa verifieringslanken som skickas dit.
5. Kontrollera att `portfolio@jerrylundahl.com` kan anvandas som avsandare for domanen.

Cloudflare kan vilja andra domanens MX-, SPF- och DKIM-poster under onboardingen. Kontrollera befintlig e-postkonfiguration innan du godkanner DNS-andringar.

### 3. Skapa Turnstile-widgeten

1. Ga till **Turnstile** i Cloudflare Dashboard och valj **Add widget**.
2. Lagg till vardnamnen `jerrylundahl.com` och `www.jerrylundahl.com`.
3. Valj **Managed** och skapa widgeten.
4. Kopiera dess publika **Site Key** och ersatt `YOUR_TURNSTILE_SITE_KEY` i `index.html`.
5. Spara dess **Secret Key** till nasta steg. Secret key far aldrig laggas i HTML eller JavaScript som skickas till webblasaren.

### 4. Installera och konfigurera Workern

Kor fran projektets rot:

```powershell
Set-Location worker
npm install
npx wrangler login
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Klistra in Turnstiles Secret Key direkt i terminalprompten. Den lagras krypterat hos Cloudflare och refereras som `env.TURNSTILE_SECRET_KEY` av Workern.

Konfigurationen i `worker/wrangler.jsonc` skapar routes for:

- `https://jerrylundahl.com/api/contact`
- `https://www.jerrylundahl.com/api/contact`

E-postbindingen ar begransad till avsandaren `portfolio@jerrylundahl.com` och mottagaren `jerry.lundahl@hotmail.com`.

### 5. Publicera

```powershell
Set-Location worker
npm run deploy
```

Publicera sedan den uppdaterade statiska webbplatsen pa samma satt som vanligt. DNS-posten for webbplatsen maste vara proxad genom Cloudflare for att Worker-routen ska traffas.

### 6. Testa

1. Oppna den publicerade webbplatsen, fyll i formularet och slutfor Turnstile-kontrollen.
2. Skicka formularet och kontrollera inkorgen samt skrapposten i Hotmail.
3. Vid fel, oppna Workern i Cloudflare Dashboard och kontrollera **Logs**.

Frontend skickar endast till `/api/contact`. Workern validerar origin, indata, spamfaltet och Turnstile-token innan mejlet skickas.
