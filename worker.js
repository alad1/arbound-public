const destination='commercial@arboundgroup.com';
const sender='Arbound Website <contact@alerts.arboundgroup.com>';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function readJson(request){
  const reader=request.body?.getReader();
  if(!reader)throw Error('missing body');
  const decoder=new TextDecoder();let n=0,s='';
  while(true){const {done,value}=await reader.read();if(done)break;n+=value.byteLength;if(n>16000){await reader.cancel();throw Error('too large');}s+=decoder.decode(value,{stream:true});}
  return JSON.parse(s+decoder.decode());
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname!=='/api/contact')return env.ASSETS.fetch(request);
    const ready=Boolean(env.RESEND_API_KEY&&env.CONTACT_LIMIT);
    if(request.method==='GET')return json({available:ready});
    if(request.method!=='POST')return json({ok:false},405);
    if(!ready)return json({ok:false},503);
    if(!['https://arboundgroup.com','https://www.arboundgroup.com'].includes(request.headers.get('Origin')))return json({ok:false},403);
    if(!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type')||''))return json({ok:false},415);
    try{
      const ip=request.headers.get('CF-Connecting-IP')||'unknown';
      const limit=await env.CONTACT_LIMIT.limit({key:'arbound-contact:'+ip});
      if(!limit.success)return json({ok:false},429);
      const data=await readJson(request);
      const pick=(k,max)=>{const v=data?.[k];return typeof v==='string'&&v.length<=max?v.trim():'';};
      const name=pick('name',100),email=pick('email',254),company=pick('company',150),type=pick('type',80),message=pick('message',3000);
      if(data?.website)return json({ok:false},400);
      if(!name||!message||!email||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)||!['Product information','Business / purchasing','Other'].includes(type))return json({ok:false},400);
      const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:sender,to:[destination],reply_to:email,subject:'Arbound website inquiry: '+type,text:['Name: '+name,'Email: '+email,'Company: '+(company||'Not provided'),'Inquiry: '+type,'','Message:',message].join('\n')})});
      return response.ok?json({ok:true}):json({ok:false},502);
    }catch{return json({ok:false},400);}
  }
};
