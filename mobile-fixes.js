/* Core mobile behavior now lives in app.js. This file only extends the date-choice screen. */

function dateFollowUpScreen(){
  const groups={
    Dinner:{emoji:'🍽️',title:'What kind of dinner?',text:'Your culinary preferences have been noted by the selection committee.',options:[
      ['🥩 Steakhouse','Steakhouse'],['🍝 Italian','Italian'],['🍣 Sushi','Sushi'],['🍤 Seafood','Seafood'],['🍔 Burgers','Burgers'],['🍕 Pizza','Pizza'],['🌮 Tacos / Latin','Tacos or Latin'],['🥘 Caribbean','Caribbean'],['🍜 Asian','Asian'],['🥗 Healthy / light','Healthy or light'],['🍳 Brunch','Brunch'],['🍷 Wine bar / small plates','Wine bar or small plates'],['🌊 Waterfront','Waterfront'],['🌇 Rooftop','Rooftop'],['🕯️ Romantic / intimate','Romantic or intimate'],['✨ Fancy','Fancy'],['😌 Casual / fun','Casual'],['🍽️ Chef tasting / experience','Chef tasting or experience']
    ]},
    Activity:{emoji:'🎮',title:'What kind of activity?',text:'Choose how competitive you plan on being.',options:[
      ['🕹️ Arcade','Arcade'],['🎳 Bowling','Bowling'],['⛳ Mini golf','Mini golf'],['🎨 Painting / pottery','Painting or pottery'],['🎤 Karaoke','Karaoke'],['🧩 Escape room','Escape room'],['🎱 Pool / billiards','Pool or billiards'],['🎯 Darts','Darts'],['🪓 Axe throwing','Axe throwing'],['🧗 Rock climbing','Rock climbing'],['⛸️ Ice skating','Ice skating'],['🛼 Roller skating','Roller skating'],['🏎️ Go karts','Go karts'],['🎟️ Comedy show','Comedy show'],['🎭 Theater / live show','Theater or live show'],['🎶 Live music','Live music'],['🏛️ Museum','Museum'],['🐠 Aquarium','Aquarium'],['🐅 Zoo','Zoo'],['🍳 Cooking class','Cooking class'],['💃 Dance class','Dance class'],['📸 Photo walk','Photo walk'],['🛍️ Shopping / market','Shopping or market'],['🎲 Board games','Board games'],['🎮 Gaming','Gaming'],['🏌️ Driving range','Driving range'],['🏓 Pickleball / tennis','Pickleball or tennis'],['🧺 Picnic','Picnic'],['☕ Coffee hopping','Coffee hopping'],['🍨 Dessert hopping','Dessert hopping']
    ]},
    Adventure:{emoji:'🌴',title:'What kind of adventure?',text:'Define “adventure” before things get carried away.',options:[
      ['🏖️ Beach','Beach'],['🥾 Hiking / nature','Hiking or nature'],['🚤 On the water','Water activity'],['🛶 Kayaking / paddleboarding','Kayaking or paddleboarding'],['🎣 Fishing','Fishing'],['🏕️ Camping','Camping'],['🚲 Bike ride','Bike ride'],['🐎 Horseback riding','Horseback riding'],['🎢 Theme park','Theme park'],['💦 Water park','Water park'],['🌆 Explore somewhere new','Explore somewhere new'],['🚗 Day trip','Day trip'],['🗺️ Road trip','Road trip'],['🌅 Sunrise / sunset trip','Sunrise or sunset trip'],['🌲 State / national park','State or national park'],['🏝️ Island / coastal day','Island or coastal day'],['🚂 Scenic train ride','Scenic train ride'],['⛵ Boat day','Boat day'],['🎈 Something spontaneous','Something spontaneous']
    ]}
  };
  const x=groups[answers.vibe];
  return `<div class="emoji">${x.emoji}</div><div class="eyebrow">Question 02B</div><h1>${x.title}</h1><p>${x.text}</p><div class="grid">${x.options.map(o=>`<button class="choice" onclick="pick('dateDetail','${o[1]}')">${o[0]}</button>`).join('')}<button class="choice" onclick="showOtherDateChoice()">✍️ Other</button></div><div id="otherDateChoice"></div>`;
}

function showOtherDateChoice(){
  const area=document.querySelector('#otherDateChoice');
  if(!area)return;
  area.innerHTML=`<div style="margin-top:16px"><label>Other idea<input id="otherDateInput" maxlength="50" autocomplete="off" placeholder="Type your idea" oninput="lettersOnlyDateChoice(this)"></label><div class="small">Letters and spaces only.</div><div class="buttons"><button class="btn yes" onclick="saveOtherDateChoice()">Use this idea →</button></div></div>`;
  const input=document.querySelector('#otherDateInput');
  if(input){input.focus();input.scrollIntoView({behavior:'smooth',block:'center'});}
}

function lettersOnlyDateChoice(input){
  input.value=input.value.replace(/[^A-Za-z\s]/g,'').replace(/\s+/g,' ').replace(/^\s/,'').slice(0,50);
}

function saveOtherDateChoice(){
  const input=document.querySelector('#otherDateInput');
  const value=(input?.value||'').trim();
  if(!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value)){alert('Type your date idea using letters only 👀');return;}
  answers.dateDetail=value;
  step=4;
  render();
}