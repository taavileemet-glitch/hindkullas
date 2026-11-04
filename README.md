# hindkullas.ee

Staatiline leht (GitHub Pages, repo `taavileemet-glitch/hindkullas`): igapäevased hinnad grammides ja troy untsides kulda. Ehitust pole vaja.

- `index.html`, `assets/` — leht, kalkulaator (kliendipoolne JS)
- `data/prices.json` — kõik numbrid koos allika, URL-i ja kuupäevaga
- `scripts/update.py` — uuendab kulla (gold-api.com, võtmeta) ja EUR/USD (EKP) väärtused
- `.github/workflows/update.yml` — igapäevane cron (15:30 UTC), commitib muudatuse

Kohalik test: `python -m http.server 8000`.

## DNS (GitHub Pages)
Settings → Pages: Source = main / root, Custom domain = `hindkullas.ee` (fail `CNAME` on olemas), seejärel "Enforce HTTPS".

Domeeni DNS-is:
| Tüüp | Nimi | Väärtus |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | taavileemet-glitch.github.io |

Eemalda vaid vanad @ ja www A/CNAME kirjed. **MX ja SPF (TXT) kirjeid ära puuduta.**

## Oma domeen
CNAME fail eemaldatud ajutiselt. Lisa pärast DNS-i muutmist fail `CNAME` sisuga: `hindkullas.ee`
