from pathlib import Path
from shutil import copy2
from PIL import Image, ImageFilter, ImageEnhance

src_laptop = Path(r"C:\Users\Teccadon Corp\.cursor\projects\c-Users-Teccadon-Corp-Desktop-project-online-shop\assets\hero-laptop-clean.png")
src_phone = Path(r"C:\Users\Teccadon Corp\.cursor\projects\c-Users-Teccadon-Corp-Desktop-project-online-shop\assets\hero-phone-clean.png")
dest_dir = Path(r"c:\Users\Teccadon Corp\Desktop\project\online-shop\frontend\public\assets\images")
dest_dir.mkdir(parents=True, exist_ok=True)


def knock_white(path: Path, dest: Path, threshold: int = 246) -> None:
    img = Image.open(path).convert("RGBA")
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=2))
    rgb = ImageEnhance.Contrast(img.convert("RGB")).enhance(1.06)
    out = rgb.convert("RGBA")
    pixels = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (255, 255, 255, 0)
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    out.save(dest, "PNG")
    print(dest.name, out.size)


knock_white(src_laptop, dest_dir / "hero-laptop.png", 248)
knock_white(src_phone, dest_dir / "hero-phone.png", 248)
copy2(src_laptop, dest_dir / "hero-laptop-source.png")
copy2(src_phone, dest_dir / "hero-phone-source.png")
print("done")
