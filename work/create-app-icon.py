from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import base64

out=Path('outputs'); res=Path('work/android/app/src/main/res')
S=1536
fg=Image.new('RGBA',(S,S)); d=ImageDraw.Draw(fg)
# Centered S tetromino; artwork remains inside the adaptive icon safe zone.
unit=225; gap=24; left=(S-(3*unit+2*gap))//2; top=440
for col,row in [(1,0),(2,0),(0,1),(1,1)]:
    x=left+col*(unit+gap); y=top+row*(unit+gap)
    d.rounded_rectangle((x,y,x+unit,y+unit),radius=40,fill='#B78AFF',outline='#D6BDFF',width=5)
    d.rounded_rectangle((x+22,y+18,x+unit-22,y+29),radius=5,fill='#EAD8FF')
d.rounded_rectangle((560,974,976,1000),radius=13,fill='#53DECC')
bg=Image.new('RGBA',(S,S),'#090C13')
glow=Image.new('RGBA',(S,S)); gd=ImageDraw.Draw(glow);gd.ellipse((360,380,1176,1110),fill=(121,77,214,35));glow=glow.filter(ImageFilter.GaussianBlur(100));bg=Image.alpha_composite(bg,glow)
full=Image.alpha_composite(bg,fg)
full.resize((1024,1024),Image.Resampling.LANCZOS).convert('RGB').save(out/'neon-drop-icon-1024.png')
full.resize((512,512),Image.Resampling.LANCZOS).convert('RGB').save(out/'neon-drop-icon-512.png')
for density,size in [('mdpi',108),('hdpi',162),('xhdpi',216),('xxhdpi',324),('xxxhdpi',432)]:
    target=res/('drawable-'+density);target.mkdir(parents=True,exist_ok=True)
    fg.resize((size,size),Image.Resampling.LANCZOS).save(target/'icon_foreground.png')
old=res/'drawable/icon_foreground.xml'
if old.exists(): old.unlink()
page=Path('work/page.html'); html=page.read_text(encoding='utf-8')
png=base64.b64encode((out/'neon-drop-icon-512.png').read_bytes()).decode()
html=html.replace('</head>',f'<link rel="icon" type="image/png" href="data:image/png;base64,{png}"></head>')
page.write_text(html,encoding='utf-8')
gradle=Path('work/android/app/build.gradle');gradle.write_text(gradle.read_text(encoding='utf-8-sig').replace('versionCode 2','versionCode 3').replace("versionName '1.0.1'","versionName '1.0.2'"),encoding='utf-8')
readme=Path('work/android/README.md');readme.write_text(readme.read_text(encoding='utf-8-sig').replace('version 1.0.1 (2)','version 1.0.2 (3)'),encoding='utf-8')
print('PNG icons generated; Android density assets and browser favicon applied.')
