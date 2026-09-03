const normalizeEnv = (value='') => String(value).trim().replace(/^['"]|['"]$/g,'');

export default async function handler(req,res){
  const token = normalizeEnv(process.env.TELEGRAM_BOT_TOKEN);
  const chatId = normalizeEnv(process.env.TELEGRAM_CHAT_ID);

  if(req.method === 'GET'){
    return res.status(200).json({ok:true, api:'contact', telegram:{tokenConfigured:Boolean(token),chatIdConfigured:Boolean(chatId)}});
  }
  if(req.method !== 'POST') return res.status(405).json({ok:false,error:'Method not allowed'});

  let body=req.body||{};
  if(typeof body === 'string'){ try{body=JSON.parse(body)}catch{body={}} }

  const clean=(v,max=500)=>String(v??'').replace(/[<>]/g,'').trim().slice(0,max);
  const name=clean(body.name,30), phone=clean(body.phone,30), interest=clean(body.interest,60);
  const preferred=clean(body.preferred_time,60), message=clean(body.message,500);

  if(!name || !phone) return res.status(400).json({ok:false,error:'이름과 연락처를 입력해주세요.'});
  if(!token || !chatId) return res.status(503).json({ok:false,error:'텔레그램 환경변수가 적용되지 않았습니다.'});

  const text=[
    '🏢 양정 아틀리에933 상담신청',
    `이름: ${name}`,
    `연락처: ${phone}`,
    `관심분야: ${interest || '-'}`,
    `상담 가능 시간대: ${preferred || '시간대 무관'}`,
    `문의내용: ${message || '-'}`
  ].join('\n');

  try{
    const tg=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text})
    });
    const data=await tg.json().catch(()=>({}));
    if(!tg.ok || data.ok===false){
      return res.status(502).json({ok:false,error:`텔레그램 전송 오류: ${data.description || `HTTP ${tg.status}`}`});
    }
    return res.status(200).json({ok:true});
  }catch(e){
    return res.status(500).json({ok:false,error:'텔레그램 서버에 연결하지 못했습니다.'});
  }
}
