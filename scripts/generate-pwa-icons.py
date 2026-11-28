"""Genera public/icon-192.png e icon-512.png (logo de la app: "play" blanco sobre el
degradado morado de la marca, linear-gradient(135deg, #7c3aed, #4f46e5)).

Los iconos son "maskable": el triángulo queda dentro de la zona segura central
(80 % del lado), así Android puede recortarlos en círculo o squircle sin cortarlo.
Uso: python3 scripts/generate-pwa-icons.py  (requiere Pillow)
"""
from pathlib import Path
from PIL import Image, ImageDraw

START, END = (0x7C, 0x3A, 0xED), (0x4F, 0x46, 0xE5)
OUT = Path(__file__).resolve().parent.parent / "public"


def icon(size: int) -> Image.Image:
    scale = 4  # dibujar a mayor tamaño y reducir para suavizar bordes
    s = size * scale
    img = Image.new("RGB", (s, s))
    px = img.load()
    for y in range(s):
        for x in range(s):
            t = (x + y) / (2 * (s - 1))  # 135 grados: de arriba-izquierda a abajo-derecha
            px[x, y] = tuple(round(a + (b - a) * t) for a, b in zip(START, END))
    d = ImageDraw.Draw(img)
    # Triángulo "play" centrado ópticamente, ocupando ~38 % del lado
    h = s * 0.38
    w = h * 0.9
    cx, cy = s / 2 + w * 0.08, s / 2
    d.polygon([(cx - w / 2, cy - h / 2), (cx - w / 2, cy + h / 2), (cx + w / 2, cy)], fill="white")
    return img.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    for size in (192, 512):
        path = OUT / f"icon-{size}.png"
        icon(size).save(path, optimize=True)
        print(f"{path.relative_to(OUT.parent)} ({size}x{size})")
