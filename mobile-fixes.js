/* Mobile and flow fixes. Loaded after app.js so these overrides are authoritative. */

function setupBooking(){
  const dateInput=document.querySelector('#date');
  if(!dateInput)return;
  const today=todayStr();
  dateInput.min=today;
  if(!dateInput.value||dateInput.value<today)dateInput.value=today;
  dateInput.addEventListener('change',()=>{
    if(dateInput.value<today){
      dateInput.value=today;
      alert('Past dates are off limits.');
    }
    populateTimes();
  });
  populateTimes();
}

function populateTimes(){
  const dateInput=document.querySelector('#date'),select=document.querySelector('#time'),note=document.querySelector('#timeNote');
  if(!dateInput||!select)return;
  const now=new Date(),today=todayStr();
  dateInput.min=today;
  if(!dateInput.value||dateInput.value<today)dateInput.value=today;
  select.innerHTML='';
  let firstAllowed=9*60,end=22*60;
  if(dateInput.value===today){
    const minAllowed=now.getHours()*60+now.getMinutes()+60;
    firstAllowed=Math.max(firstAllowed,Math.ceil(minAllowed/30)*30);
  }
  if(firstAllowed>end){
    select.innerHTML='<option value="">No times left today</option>';
    if(note)note.textContent='It’s too late to book today — choose a future date.';
    return;
  }
  for(let mins=9*60;mins<=end;mins+=30){
    const h=Math.floor(mins/60),mm=mins%60,ap=h>=12?'PM':'AM',hh=h%12||12,label=`${hh}:${String(mm).padStart(2,'0')} ${ap}`,opt=document.createElement('option');
    opt.value=label;opt.textContent=label;
    if(dateInput.value===today&&mins<firstAllowed){opt.disabled=true;opt.textContent=label+' — unavailable'}
    select.appendChild(opt);
  }
  const first=[...select.options].find(o=>!o.disabled&&o.value);
  if(first)first.selected=true;
  if(note)note.textContent=dateInput.value===today?'Today’s times start at least 1 hour from now.':'Available times: 9:00 AM–10:00 PM.';
}

function book(){
  const d=document.querySelector('#date').value,t=document.querySelector('#time').value,today=todayStr();
  if(!d){alert('Pick a date first 👀');return}
  if(d<today){document.querySelector('#date').value=today;populateTimes();alert('Past dates are off limits.');return}
  if(!t){alert('Pick an available time 👀');return}
  if(d===today){
    const now=new Date(),m=t.match(/(\d+):(\d+) (AM|PM)/),hour=Number(m[1])%12+(m[3]==='PM'?12:0),minute=Number(m[2]),chosen=new Date(now.getFullYear(),now.getMonth(),now.getDate(),hour,minute);
    if(chosen.getTime()-now.getTime()<60*60*1000){alert('Today needs at least 1 hour of notice.');populateTimes();return}
  }
  answers.date=d;answers.time=t;step=9;render();
}

/* Remove the phone-number step from the flow completely. */
const flowRender=render;
render=function(){
  if(step===6)step=7;
  flowRender();
  if(step===10)setTimeout(fillConfirmation,0);
};

pick=function(key,value){
  answers[key]=value;
  if(step===5){step=7;render();return}
  step++;render();
};

handleYouPay=function(btn){
  if(isTouchMobile()){
    if(btn.dataset.armed==='1'){answers.pay='Me';step=7;render();return}
    btn.dataset.armed='1';btn.textContent='Also me';btn.setAttribute('aria-label','Also me. Tap again to continue.');return;
  }
  answers.pay='You';step=7;render();
};

sendSMS=async function(){return{success:false,skipped:true}};

/* Populate the final authorization after the transition has rendered its DOM. */
fillConfirmation=function(){
  const type=document.querySelector('#tv'),choice=document.querySelector('#tdd'),choiceRow=document.querySelector('#detailRow'),date=document.querySelector('#td'),time=document.querySelector('#tt'),deposit=document.querySelector('#finalDeposit');
  if(type)type.textContent=answers.vibe==='Surprise'?'Surprise me':(answers.vibe||'—');
  if(answers.dateDetail){if(choice)choice.textContent=answers.dateDetail;if(choiceRow)choiceRow.style.display=''}else if(choiceRow){choiceRow.style.display='none'}
  if(date)date.textContent=answers.date?new Date(answers.date+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}):'—';
  if(time)time.textContent=answers.time||'—';
  if(deposit)deposit.textContent=activeDepositPrice||'—';
};

/* Keep the fleeing NO button in a separate safe zone below YES. */
setupNo=function(){
  const no=document.querySelector('#no'),arena=document.querySelector('#arena'),msg=document.querySelector('#msg');if(!no||!arena)return;
  const messages=['Nice try','Really?',"You're persistent.",'Wrong button →','This thing may be rigged.'];
  function flee(ev){
    if(ev)ev.preventDefault();noTries++;
    const ar=arena.getBoundingClientRect(),nr=no.getBoundingClientRect(),pad=8,maxX=Math.max(pad,ar.width-nr.width-pad),safeTop=Math.min(ar.height-nr.height-pad,Math.max(82,ar.height*.58)),maxY=Math.max(safeTop,ar.height-nr.height-pad),x=pad+Math.random()*Math.max(0,maxX-pad),y=safeTop+Math.random()*Math.max(0,maxY-safeTop);
    no.style.position='absolute';no.style.margin='0';no.style.left=x+'px';no.style.right='auto';no.style.top=y+'px';
    if(msg)msg.textContent=messages[Math.min(noTries-1,messages.length-1)];
  }
  no.addEventListener('pointerenter',flee);no.addEventListener('pointerdown',flee);
};