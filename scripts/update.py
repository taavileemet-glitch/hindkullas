#!/usr/bin/env python3
"""Uuendab data/prices.json kulla (gold-api.com) ja EUR/USD (EKP) väärtused."""
import json, csv, io, pathlib, urllib.request
P = pathlib.Path(__file__).resolve().parent.parent / "data" / "prices.json"
UA = {"User-Agent": "hindkullas.ee-updater"}
def get(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=30) as r: return r.read().decode()
d = json.loads(P.read_text())
g = json.loads(get(d["gold"]["url"]))
ecb = list(csv.DictReader(io.StringIO(get(d["fx"]["url"]))))[-1]
d["gold"].update(usd_per_oz=float(g["price"]), date=g["updatedAt"])
d["fx"].update(usd_per_eur=float(ecb["OBS_VALUE"]), date=ecb["TIME_PERIOD"])
d["updated"] = g["updatedAt"][:10]
P.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
print("kuld", d["gold"]["usd_per_oz"], "USD/oz; EURUSD", d["fx"]["usd_per_eur"])
