from pathlib import Path
import zipfile, json, shutil, hashlib
root=Path('work/android')
out=Path('outputs')
bundle=root/'app/build/outputs/bundle/release/app-release.aab'
with zipfile.ZipFile(bundle) as z:
    assert z.read('base/assets/neon-drop.html')==(out/'neon-drop.html').read_bytes(), 'Embedded game differs'
shutil.copy2(bundle,out/'neon-drop-release.aab')
shutil.copy2(root/'app/build/outputs/apk/release/app-release.apk',out/'neon-drop-release.apk')
readme=root/'README.md'
readme.write_text(readme.read_text().replace('Build Tools 36.0.0','Build Tools 35.0.0'),encoding='utf-8')
with zipfile.ZipFile(out/'neon-drop-android-source.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in root.rglob('*'):
        rel=p.relative_to(root)
        if p.is_file() and not any(n in ('build','.gradle') for n in rel.parts) and p.name!='local.properties':
            z.write(p,str(Path('NeonDrop')/rel))
secret=json.loads(Path('work/signing/signing.json').read_text())
with zipfile.ZipFile(out/'neon-drop-signing-backup.zip','w',zipfile.ZIP_DEFLATED) as z:
    z.write('work/signing/neon-drop-upload.jks','neon-drop-upload.jks')
    z.writestr('PRIVATE-SIGNING-INFO.txt', 'Keep this archive private. Back up for future updates.\nPackage: com.arcana.neondrop\nAlias: neondrop-upload\nStore password: '+secret['storePassword']+'\nKey password: '+secret['storePassword']+'\n')
for name in ['neon-drop-release.aab','neon-drop-release.apk','neon-drop-android-source.zip','neon-drop-signing-backup.zip']:
    p=out/name
    print(name,p.stat().st_size,'bytes')
(out/'Android-SHA256.txt').write_text('\n'.join(hashlib.sha256((out/n).read_bytes()).hexdigest()+'  '+n for n in ['neon-drop-release.aab','neon-drop-release.apk']),encoding='utf-8')
print('Embedded HTML matches latest game exactly.')
