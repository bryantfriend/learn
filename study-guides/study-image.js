// Resolve against this module, independently of the current class URL or <base>.
export function studyImage(id,attrs={}){
 const image=document.createElement('img');
 for(const [name,value] of Object.entries(attrs))image.setAttribute(name,String(value));
 image.loading='eager';
 image.decoding='async';
 const source=new URL(`./assets/illustrated/${id}.webp`,import.meta.url);
 let retries=0;
 image.addEventListener('error',()=>{
  if(retries>=2)return;
  retries++;
  // A fresh URL also recovers a temporarily cached failed response.
  const retry=new URL(source);retry.searchParams.set('retry',String(retries));
  setTimeout(()=>{if(image.isConnected)image.src=retry.href;},retries*400);
 });
 image.src=source.href;
 return image;
}
