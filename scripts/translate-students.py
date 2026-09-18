import sys,pathlib,zipfile,json,concurrent.futures,time,re
root=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'output/translation-runtime'))
import ctranslate2,sentencepiece
strings=json.loads((root/'students/source-strings.json').read_text(encoding='utf-8-sig'))
# Models are sentence translators. Keep paragraph separators and translate one sentence at a time.
def pieces(text):
    return re.split(r'(\n+|(?<=[.!?])\s+(?=[A-Z“"\']))',text)
segments=list(dict.fromkeys(part for text in strings for part in pieces(text) if part.strip()))

def translate(lang,archive):
    folder=root/'output/translation-models'/lang
    sizes={'en_ru-1_9.zip':195746693,'en_zh-1_9.zip':70743021,'en_tr-1_5.zip':124742526}
    size=sizes[archive];chunk=2*1024*1024
    parts=[root/'output/translation-models'/(archive[:-4]+'.part'+str(i)) for i in range((size+chunk-1)//chunk)]
    packed=root/'output/translation-models'/('ready-'+archive)
    standard=root/'output/translation-models'/archive
    folder.mkdir(exist_ok=True)
    if not list(folder.rglob('model.bin')):
        if standard.exists() and standard.stat().st_size==size:
            packed=standard
        elif not packed.exists() or packed.stat().st_size!=size:
            deadline=time.time()+3600
            while not all(p.exists() and p.stat().st_size==min(chunk,size-i*chunk) for i,p in enumerate(parts)):
                if time.time()>deadline:raise TimeoutError('Put the downloaded Argos model archive in output/translation-models: '+archive)
                time.sleep(5)
            with packed.open('wb') as f:
                for part in parts:f.write(part.read_bytes())
        with zipfile.ZipFile(packed) as z:
            for entry in z.namelist():
                if not (folder/entry).resolve().is_relative_to(folder.resolve()):raise ValueError('Unsafe model path')
            z.extractall(folder)
    tokenizer=sentencepiece.SentencePieceProcessor(model_file=str(next(folder.rglob('sentencepiece.model'))))
    translator=ctranslate2.Translator(str(next(folder.rglob('model.bin')).parent),device='cpu',compute_type='int8',inter_threads=1,intra_threads=3)
    output=root/'students/locales'/f'{lang}.json'
    previous=json.loads(output.read_text(encoding='utf-8')) if output.exists() else {}
    cache=root/'output'/f'student-segments-{lang}.json'
    data=json.loads(cache.read_text(encoding='utf-8')) if cache.exists() else {s:previous[s].replace('▁',' ').strip() for s in segments if s in previous and len(pieces(s))==1}
    pending=[s for s in segments if s not in data]
    print(lang,'sentences to translate',len(pending),flush=True)
    for start in range(0,len(pending),24):
        batch=pending[start:start+24]
        result=translator.translate_batch([tokenizer.encode(s,out_type=str) for s in batch],beam_size=2,max_batch_size=24,max_input_length=1024,max_decoding_length=512)
        for source,res in zip(batch,result):data[source]=tokenizer.decode(res.hypotheses[0]).replace('▁',' ').strip()
        cache.write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8')
        if start%240==0:print(lang,start+len(batch),'/',len(pending),flush=True)
    overrides=json.loads((root/'students/translation-overrides.json').read_text(encoding='utf-8-sig'))
    for source,values in overrides.items():data[source]=values[lang]
    translated={s:overrides[s][lang] if s in overrides else ''.join(data.get(p,p) if p.strip() else p for p in pieces(s)) for s in strings}
    output.write_text(json.dumps(translated,ensure_ascii=False),encoding='utf-8')
    print(lang,'DONE',len(translated),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    tasks=[pool.submit(translate,*args) for args in [('ru','en_ru-1_9.zip'),('zh','en_zh-1_9.zip'),('tr','en_tr-1_5.zip')] if len(sys.argv)==1 or args[0] in sys.argv[1:]]
    for task in tasks:task.result()
