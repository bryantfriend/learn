from pathlib import Path
import subprocess,json,base64
root=Path('D:/learn')
def api(endpoint,data):
 p=subprocess.run(['gh','api',endpoint,'--input','-'],input=json.dumps(data),text=True,capture_output=True)
 if p.returncode:raise RuntimeError(p.stderr)
 return json.loads(p.stdout)
files=sorted((root/'study-guides/assets/illustrated').glob('*.webp'))+sorted((root/'study-guides/assets/illustrated/thumbs').glob('*.webp'))
entries=[]
for i,p in enumerate(files):
 blob=api('repos/bryantfriend/learn/git/blobs',{'content':base64.b64encode(p.read_bytes()).decode(),'encoding':'base64'})
 entries.append({'path':p.relative_to(root).as_posix(),'mode':'100644','type':'blob','sha':blob['sha']})
 if (i+1)%10==0:print(f'Uploaded {i+1}/{len(files)} optimized images',flush=True)
text=['study-guides/study-image.js','study-guides/app.js','study-guides/illustrated-infographics.js','study-guides/index.html','scripts/build-class-study-sites.py','tests/study-image-browser.cjs']
text += [f'study-guides/{s}/index.html' for s in ['7a-global-perspectives','7b-global-perspectives','8-global-perspectives','7a-geography','7b-geography']]
for path in text:entries.append({'path':path,'mode':'100644','type':'blob','content':(root/path).read_text(encoding='utf-8')})
tree=api('repos/bryantfriend/learn/git/trees',{'base_tree':'1eacc770f800fcf9d3b883016410a5d581c5eec5','tree':entries})
print(json.dumps({'tree_sha':tree['sha'],'files':len(entries)}),flush=True)
