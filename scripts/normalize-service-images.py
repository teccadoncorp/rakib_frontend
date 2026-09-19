from pathlib import Path
from shutil import copy2
from PIL import Image, ImageFilter

DEST = Path(r"c:\Users\Teccadon Corp\Desktop\project\online-shop\frontend\public\assets\images\services")
ASSETS = Path(r"C:\Users\Teccadon Corp\.cursor\projects\c-Users-Teccadon-Corp-Desktop-project-online-shop\assets")
DEST.mkdir(parents=True, exist_ok=True)

BG = (238, 246, 255)  # #eef6ff
CANVAS = (720, 480)
PAD = 0.12

DOWNLOADS = {
    "aeps.png": "aeps.png",
    "mobile-recharge.png": "mobile-recharge.png",
    "msme.png": "msme.png",
    "gst-return.png": "gst-return.png",
    "gst-maintenance.png": "gst-maintenance.png",
    "income-tax-audit.png": "income-tax-audit.png",
}


def find_asset(name: str) -> Path:
    matches = list(ASSETS.glob(f"*{name}"))
    if matches:
        return matches[0]
    raise FileNotFoundError(name)


def corner_luma(img: Image.Image) -> float:
    px = img.convert("RGB")
    w, h = px.size
    samples = [px.getpixel((1, 1)), px.getpixel((w - 2, 1)), px.getpixel((1, h - 2)), px.getpixel((w - 2, h - 2))]
    return sum(sum(c) / 3 for c in samples) / len(samples)


def knock_out(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    luma = corner_luma(rgba)
    pixels = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            brightness = (r + g + b) / 3
            if luma < 50 and brightness < 28:
                pixels[x, y] = (r, g, b, 0)
            elif luma > 230 and brightness > 248 and abs(r - g) < 8 and abs(g - b) < 8:
                pixels[x, y] = (r, g, b, 0)
    return rgba


def fit_on_card(img: Image.Image) -> Image.Image:
    rgba = knock_out(img)
    bbox = rgba.getbbox() or (0, 0, rgba.width, rgba.height)
    subject = rgba.crop(bbox)
    inner_w = int(CANVAS[0] * (1 - PAD * 2))
    inner_h = int(CANVAS[1] * (1 - PAD * 2))
    ratio = min(inner_w / subject.width, inner_h / subject.height)
    new_size = (max(1, int(subject.width * ratio)), max(1, int(subject.height * ratio)))
    subject = subject.resize(new_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", CANVAS, BG)
    x = (CANVAS[0] - subject.width) // 2
    y = (CANVAS[1] - subject.height) // 2
    canvas.paste(subject, (x, y), subject)
    return canvas


for src_name, dest_name in DOWNLOADS.items():
    src = find_asset(src_name)
    dest = DEST / dest_name
    copy2(src, dest)
    print("copied", src.name, "->", dest_name)

for path in sorted(DEST.iterdir()):
    if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue
    if path.name.endswith("-raw.png"):
        continue
    card = fit_on_card(Image.open(path))
    out = path.with_suffix(".jpg")
    card.save(out, "JPEG", quality=90)
    if path.suffix.lower() == ".png" and out != path:
        path.unlink(missing_ok=True)
    print("normalized", out.name, card.size)

print("done")
