import en from './en.js';
export function words(reference,values){const keys=Object.keys(reference);if(keys.length!==values.length)throw Error(`Translation count ${keys.length} / ${values.length}`);return Object.fromEntries(keys.map((k,i)=>[k,values[i]]));}
export function locale(ui,guides,labels,packs,cases){
 const topics={};for(const [id,base] of Object.entries(en.topics)){const p=packs[id];if(!p)throw Error('Missing translated topic '+id);const [title,lead,body,facts,question,choices,explanation]=p;topics[id]={title,lead,body,facts,visuals:base.visuals,check:{question,choices,answer:base.check.answer,explanation}};}
 const resultCases={};for(const [id,base] of Object.entries(en.cases)){if(!cases[id])throw Error('Missing translated case '+id);resultCases[id]={book:base.book,pages:base.pages,...cases[id]};}
 for(const k of Object.keys(en.ui))if(typeof ui[k]!=='string')throw Error('Missing interface translation '+k);
 return {ui,guides,labels,topics,cases:resultCases};
}
export const english=en;
