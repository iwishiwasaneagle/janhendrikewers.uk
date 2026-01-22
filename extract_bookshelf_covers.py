import csv
import urllib.request
with open("_data/bookshelf.csv", "r") as f:
    data = list(csv.DictReader(f))
ind0 = max(map(lambda r: int(r["cover_path"].split(".")[0]), (filter(lambda r: r["cover_path"], data))))
for i, row in enumerate(filter(lambda r: not r['cover_path'], data)):
    ind = ind0+i+1
    fp = f"{ind}.png"
    print(f"Downloading {row['cover']} to {fp}")
    urllib.request.urlretrieve(row['cover'], f"static/img/bookshelf/{fp}")
    data[ind]["cover_path"] = fp
with open("_data/bookshelf.csv", "w") as f:
    writer = csv.DictWriter(f, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)