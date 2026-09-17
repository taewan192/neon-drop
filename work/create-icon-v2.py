from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import base64,re,shutil
out=Path('outputs');res=Path('work/android/app/src/main/res');S=1536
fg=Image.new('RGBA',(S,S));d=ImageDraw.Draw(fg)
# Four bright interlocking tetrominoes form a compact, recognizable skyline.
cells=[(1,0,'#FFD65A'),(2,0,'#FFD65A'),(1,1,'#FFD65A'),(2,1,'#FFD65A'),
       (0,2,'#52DFC8'),(1,2,'#52DFC8'),(2,2,'#52DFC8'),(3,2,'#52DFC8'),
       (0,3,'#659CFF'),(0,4,'#659CFF'),(1,4,'#659CFF'),(2,4,'#659CFF'),
       (1,3,'#B78AFF'),(2,3,'#B78AFF'),(3,3,'#B78AFF'),(3,4,'#B78AFF')]
size=145;step=161;left=(S-(3*step+size))//2;top=(S-(4*step+size))//2
for x,y,color in cells:
    px=left+x*step;py=top+y*step
    d.rounded_rectangle((px,py,px+size,py+size),radius=24,fill=color)
    d.rounded_rectangle((px+13,py+11,px+size-13,py+20),radius=4,fill=(255,255,255,135))
bg=Image.new('RGBA',(S,S),'#090C13');glow=Image.new('RGBA',(S,S));gd=ImageDraw.Draw(glow);gd.ellipse((300,300,1236,1236),fill=(41,119,170,45));bg=Image.alpha_composite(bg,glow.filter(ImageFilter.GaussianBlur(130)))
full=Image.alpha_composite(bg,fg)
for n in (512,1024):
    full.resize((n,n),Image.Resampling.LANCZOS).convert('RGB').save(out/f'neon-drop-icon-v2-{n}.png')
    shutil.copy2(out/f'neon-drop-icon-v2-{n}.png',out/f'neon-drop-icon-{n}.png')
for density,n in [('mdpi',108),('hdpi',162),('xhdpi',216),('xxhdpi',324),('xxxhdpi',432)]:
    fg.resize((n,n),Image.Resampling.LANCZOS).save(res/f'drawable-{density}/icon_foreground.png')
page=Path('work/page.html');html=page.read_text(encoding='utf-8');html=re.sub(r'<link rel="icon"[^>]*>','',html)
png=base64.b64encode((out/'neon-drop-icon-512.png').read_bytes()).decode();html=html.replace('</head>',f'<link rel="icon" type="image/png" href="data:image/png;base64,{png}"></head>');page.write_text(html,encoding='utf-8')
p=Path('work/android/app/build.gradle');p.write_text(p.read_text(encoding='utf-8-sig').replace('versionCode 3','versionCode 4').replace("versionName '1.0.2'","versionName '1.0.3'"),encoding='utf-8')
p=Path('work/android/README.md');p.write_text(p.read_text(encoding='utf-8-sig').replace('version 1.0.2 (3)','version 1.0.3 (4)'),encoding='utf-8')
p=out/'Android-안내.txt';p.write_text(p.read_text(encoding='utf-8-sig').replace('1.0.2','1.0.3').replace('versionCode 3','versionCode 4'),encoding='utf-8')
print('New stacked-block PNG icon applied; version 1.0.3 (4).')
