from PIL import Image
from pathlib import Path
import base64, re

source = Path('outputs/neon-drop-figma-icon-1024.png')
res = Path('work/android/app/src/main/res')
image = Image.open(source).convert('RGBA')
assert image.size == (1024, 1024)

# Remove the Figma artboard background for Android's adaptive foreground layer.
pixels = image.load()
background = pixels[0, 0][:3]
for y in range(image.height):
    for x in range(image.width):
        r, g, b, _ = pixels[x, y]
        distance = abs(r-background[0]) + abs(g-background[1]) + abs(b-background[2])
        alpha = 0 if distance < 18 else min(255, max(0, (distance-12)*18))
        pixels[x, y] = (r, g, b, alpha)

# Keep the artwork in the adaptive-icon safe area while retaining a generous visual scale.
safe = Image.new('RGBA', (1080, 1080))
art = image.resize((840, 840), Image.Resampling.LANCZOS)
safe.alpha_composite(art, ((1080-840)//2, (1080-840)//2))
for density, size in [('mdpi',108),('hdpi',162),('xhdpi',216),('xxhdpi',324),('xxxhdpi',432)]:
    target = res / f'drawable-{density}'
    target.mkdir(parents=True, exist_ok=True)
    safe.resize((size, size), Image.Resampling.LANCZOS).save(target/'icon_foreground.png')

# Use the exact Figma PNG as the browser favicon too.
page = Path('work/page.html')
html = page.read_text(encoding='utf-8')
html = re.sub(r'<link rel="icon"[^>]*>', '', html)
encoded = base64.b64encode(source.read_bytes()).decode()
html = html.replace('</head>', f'<link rel="icon" type="image/png" href="data:image/png;base64,{encoded}"></head>')
page.write_text(html, encoding='utf-8')

gradle = Path('work/android/app/build.gradle')
text = gradle.read_text(encoding='utf-8-sig').replace('versionCode 4', 'versionCode 5').replace("versionName '1.0.3'", "versionName '1.0.4'")
gradle.write_text(text, encoding='utf-8')

readme = Path('work/android/README.md')
text = readme.read_text(encoding='utf-8-sig').replace('version 1.0.3 (4)', 'version 1.0.4 (5)')
readme.write_text(text, encoding='utf-8')

guide = Path('outputs/Android-안내.txt')
text = guide.read_text(encoding='utf-8-sig').replace('1.0.3', '1.0.4').replace('versionCode 4', 'versionCode 5')
guide.write_text(text, encoding='utf-8')
print('Figma icon applied to Android adaptive icon and browser favicon; version 1.0.4 (5).')
