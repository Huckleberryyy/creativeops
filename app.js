/* CreativeOps · NTV360 prototype — app logic.
   Sample data is near the top; each page is a function that returns HTML. */
"use strict";
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const MON={9:"Sep",10:"Oct"};
const dlabel=k=>MON[Math.floor(k/100)]+" "+(k%100);
const GR=[["#b5532a","#8a8a1f"],["#c2305f","#a33a2e"],["#8e2bb5","#a22a6b"],["#3138b8","#6a2fb0"],["#2fa3b8","#2430a8"],["#2fb85a","#1f8a8a"],["#5cb82f","#1f9a4a"],["#b8a02f","#5f9a1f"],["#d9487a","#f0902f"],["#2f78b8","#2fb8a0"]];
const grad=i=>`linear-gradient(135deg,${GR[i%GR.length][0]},${GR[i%GR.length][1]})`;

/* ---------- sample data ---------- */
const SUBS=["Trivia & Facts","Q&A","Highlights","Tips"];
const SUB_ORDER=["Tips","Highlights","Q&A","Trivia & Facts"];
let uid=1;
function sportAssets(sport,start){
  const out=[];let k=start;
  SUB_ORDER.forEach(sub=>{
    [2,1].forEach(n=>{out.push({id:uid++,title:`${sport} ${sub} #${n}`,cat:"Channel",sport,sub,ext:n===2?"PNG":"MP4",v:n===2?2:1,key:k--});});
  });
  return out;
}
const OTHER={
 "Ad Content":["Summer Promo Spot","Grand Opening Ad","Weekend Deals Loop","Loyalty Card Promo","Combo Meal Feature","Seasonal Banner Ad"],
 "Reels":["Highlight Reel Week 1","Behind the Scenes","Customer Shout-outs","Staff Spotlight","Community Event Recap","New Arrivals Teaser"],
 "Statics":["Store Hours Poster","Wi-Fi Info Card","Safety Notice","Holiday Greeting","Menu Highlights Static","Welcome Screen"],
 "Menu Board":["Breakfast Menu","Lunch Combos","Drinks Board","Dessert Specials","Kids Menu","Seasonal Specials"]
};
function otherAssets(){
  const out=[];
  Object.keys(OTHER).forEach((cat,ci)=>OTHER[cat].forEach((t,i)=>{
    const ext=cat==="Reels"?"MP4":cat==="Statics"?"PNG":(i%2?"MP4":"PNG");
    out.push({id:uid++,title:t,cat,ext,v:1+(i%2),key:1020-i-ci,sport:null,sub:null});
  }));
  return out;
}
const STATE={
  view:"login",role:"Admin",page:"library",modal:null,
  loginErr:"",showPw:false,
  sports:["Basketball","Volleyball","Badminton"],
  assets:[...sportAssets("Basketball",1013),...sportAssets("Volleyball",928),...sportAssets("Badminton",914),...otherAssets()],
  lib:{cat:"Channel",sport:"Basketball",sub:null,open:{Basketball:true},q:"",type:"All",sort:"new",mode:"grid"},
};
const CATS=["Ad Content","Channel","Sponsorship","Reels","Statics","Menu Board"];
const SPONSOR_COUNT=6;
const catCount=c=>c==="Sponsorship"?SPONSOR_COUNT:STATE.assets.filter(a=>a.cat===c).length;
const PEOPLE={Admin:{name:"John Doe",email:"admin@nctv360.com",label:"Admin / QC"},Designer:{name:"Jane Doe",email:"designer@nctv360.com",label:"Designer"}};
const PW="spark123";

function toast(m){const t=$("#toast");t.textContent=m;t.classList.remove("hide");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.add("hide"),2600);}

/* ---------- logo + avatar ---------- */
const nlogo=(s=40)=>`<span class="nlogo" aria-label="NTV360"><b style="font-size:${s}px">NTV</b><i style="font-size:${Math.round(s*.3)}px">360</i></span>`;
const avatar=(role)=>{
  const c=role==="Admin"?["#ffd2dd","#ff8fa8","#2b2140","#f0b48a"]:["#ffe3d1","#ffb08a","#5a2a1a","#f3c3a0"];
  const hair=role==="Admin"?`<path d="M20 30c0-12 8-18 12-18s12 6 12 18c-4-6-8-8-12-8s-8 2-12 8z" fill="${c[2]}"/>`:`<path d="M18 36c-2-16 6-24 14-24s16 8 14 24c-2-8-6-12-14-12s-12 4-14 12z" fill="${c[2]}"/>`;
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="av${role}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="64" height="64" fill="url(#av${role})"/><path d="M8 64c2-14 12-18 24-18s22 4 24 18z" fill="${role==="Admin"?"#2b2140":"#e8342a"}"/><circle cx="32" cy="30" r="11" fill="${c[3]}"/>${hair}<circle cx="28" cy="31" r="1.4" fill="#222"/><circle cx="36" cy="31" r="1.4" fill="#222"/><path d="M28 36q4 3 8 0" stroke="#a33" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>`;
};

/* ---------- login ---------- */
function loginView(){
  let remembered="";try{remembered=localStorage.getItem("ntv_email")||"";}catch(e){}
  return `<div class="lg-wrap"><div class="lg-in">
  <form class="lg-card" data-a="loginForm" novalidate>
    <div style="text-align:center">${nlogo(46)}</div>
    <h1>Sign In</h1><p class="sub">Enter your credentials to access your account.</p>
    <label class="lb" for="lemail">Email</label>
    <input class="inp" id="lemail" type="email" placeholder="example@email.com" autocomplete="username" value="${esc(remembered)}">
    <label class="lb" for="lpw">Password</label>
    <div class="pw"><input class="inp" id="lpw" type="${STATE.showPw?"text":"password"}" placeholder="••••••••" autocomplete="current-password"><button type="button" data-a="togglePw" aria-label="Show or hide password">${STATE.showPw?"Hide":"Show"}</button></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 18px;font-size:12px">
      <label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="lrem" ${remembered?"checked":""}> Remember me</label>
      <button type="button" data-a="forgot" style="border:0;background:none;color:#0c2d57;font-size:12px;padding:0">Forgot Password? <span class="muted">(unavailable)</span></button>
    </div>
    <p class="err" id="lerr" role="alert" style="margin:-6px 0 12px"></p>
    <button class="btn btn-g" type="submit" style="width:100%;padding:12px">Log-In</button>
  </form>
  <div class="lg-demo"><p>Try a demo account</p>
    ${["Admin","Designer"].map(r=>`<button class="dcard" data-a="demo" data-v="${r}"><div class="av">${avatar(r)}<span class="rp">${r}</span></div><div><h3>${PEOPLE[r].name}</h3><p>${r==="Admin"?"Reviews, approves and manages the whole library.":"Works on requests and adds assets to the library."}</p></div><span class="ar">→</span></button>`).join("")}
    <div class="hint"><b>Demo credentials</b> (sample only)<br>admin@nctv360.com or designer@nctv360.com<br>Password: spark123</div>
  </div></div></div>`;
}

/* ---------- shell ---------- */
const NAV=[["dashboard","Dashboard","▦"],["requests","Requests & Tasks","☰"],["library","Mini-Library","▣"],["franchisees","Franchisees","◉"],["settings","Settings & Workflow","⚙"]];
function navFor(role){return NAV.filter(n=>role==="Admin"||!["franchisees","settings"].includes(n[0]));}
function shell(){
  const p=PEOPLE[STATE.role];
  return `<div class="app"><aside class="side">
    <div class="brand"><img class="blogo" src=".\\assets\\logo.png" alt="CreativeOps"><small>NTV360</small></div>
    <nav class="nav" aria-label="Main">${navFor(STATE.role).map(n=>`<button class="nv ${STATE.page===n[0]?"on":""}" data-a="nav" data-v="${n[0]}"><span>${n[2]}</span>${n[1]}</button>`).join("")}</nav>
    <div class="sidebot"><small>Demo role</small>
      <select class="sel" data-i="role" aria-label="Demo role"><option value="Admin" ${STATE.role==="Admin"?"selected":""}>Admin / QC</option><option value="Designer" ${STATE.role==="Designer"?"selected":""}>Designer</option></select>
      <div class="who">${p.name}</div><button class="logout" data-a="logout">Log out</button></div>
  </aside><main class="main"><div class="banner">Prototype · simulated data only. No live connection to Monday.com, Bitybox or Premiere Pro.</div>${pageView()}</main></div>`;
}
function pageView(){
  switch(STATE.page){
    case "dashboard":return dashboard();
    case "requests":return requests();
    case "franchisees":return franchisees();
    case "settings":return settings();
    default:return library();
  }
}
const head=(t,s,extra="")=>`<div class="ph"><div><h1>${t}</h1><p>${s}</p></div>${extra}</div>`;
const SAMPLE=`<span class="pill n">Sample data</span>`;
function dashboard(){
  return head("Dashboard",`Overview of creative work. ${SAMPLE}`)+`
  <div class="stats">${[["Open requests","12"],["In QC review","4"],["Delivered this week","9"],["Library assets",STATE.assets.length+SPONSOR_COUNT]].map(s=>`<div class="card stat"><span class="muted">${s[0]}</span><b>${s[1]}</b></div>`).join("")}</div>
  <div class="card"><div style="padding:14px 16px;font-weight:700">Recent activity</div><div class="tw"><table class="tbl"><tbody>
  ${[["Basketball Tips #2 added to Channel","Jennielou Perochy","Oct 13"],["Menu Board: Lunch Combos approved","John Doe","Oct 12"],["Request #1042 moved to QC","Jennielou Perochy","Oct 12"],["Sponsorship templates refreshed","NCTV360","Oct 10"]].map(r=>`<tr><td>${r[0]}</td><td class="muted">${r[1]}</td><td class="muted">${r[2]}</td></tr>`).join("")}</tbody></table></div></div>`;
}
function requests(){
  const rows=[["#1042","Grand opening promo screen","Franchise 014","In QC","Oct 14"],["#1041","Weekend deals loop","Franchise 007","Design","Oct 15"],["#1039","Breakfast menu board refresh","Franchise 021","Delivered","Oct 11"],["#1038","Volleyball trivia pack","Channel","Design","Oct 16"],["#1036","Sponsor banner: local gym","Franchise 003","Intake","Oct 18"],["#1033","Holiday greeting static","Franchise 011","Delivered","Oct 9"]];
  const cls={Intake:"n","In QC":"w",Design:"",Delivered:"ok"};
  return head("Requests & Tasks",`Sample list of creative requests. ${SAMPLE}`)+`<div class="card tw"><table class="tbl"><thead><tr><th>ID</th><th>Request</th><th>From</th><th>Status</th><th>Due</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td><b>${r[1]}</b></td><td class="muted">${r[2]}</td><td><span class="pill ${cls[r[3]]}">${r[3]}</span></td><td class="muted">${r[4]}</td></tr>`).join("")}</tbody></table></div>`;
}
function franchisees(){
  const rows=[["Franchise 003","Cebu City","12 screens","Sponsorship, Menu Board"],["Franchise 007","Davao","8 screens","Ad Content"],["Franchise 011","Manila","15 screens","Channel, Statics"],["Franchise 014","Iloilo","6 screens","Reels, Ad Content"],["Franchise 021","Baguio","9 screens","Menu Board"]];
  return head("Franchisees",`Admin view. ${SAMPLE}`)+`<div class="card tw"><table class="tbl"><thead><tr><th>Name</th><th>Location</th><th>Screens</th><th>Uses</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td class="muted">${r[3]}</td></tr>`).join("")}</tbody></table></div>`;
}
function settings(){
  return head("Settings & Workflow",`Admin view. Editing is unavailable in this prototype. ${SAMPLE}`)+`<div class="flow">${[["1  Intake","Request arrives with brief and assets."],["2  Design","Designer builds the creative."],["3  QC review","Admin / QC checks brand and quality."],["4  Delivered","Approved asset lands in the Mini-Library."]].map(s=>`<div class="card"><b>${s[0]}</b><p class="muted" style="margin-top:6px">${s[1]}</p></div>`).join("")}</div>`;
}
/* ---------- Mini-Library ---------- */
function visibleAssets(){
  const L=STATE.lib;let list=STATE.assets.filter(a=>a.cat===L.cat);
  if(L.cat==="Channel"){if(L.sport)list=list.filter(a=>a.sport===L.sport);if(L.sub)list=list.filter(a=>a.sub===L.sub);}
  if(L.type!=="All")list=list.filter(a=>a.ext===L.type);
  const q=L.q.trim().toLowerCase();
  if(q)list=list.filter(a=>(a.title+" "+(a.sport||"")+" "+(a.sub||"")+" "+a.cat).toLowerCase().includes(q));
  list.sort((a,b)=>L.sort==="new"?b.key-a.key||b.id-a.id:a.key-b.key||a.id-b.id);
  return list;
}
const subtitle=a=>a.cat==="Channel"?`${a.sport} › ${a.sub} · v${a.v}`:`${a.cat} · v${a.v}`;
const ficon=e=>e==="MP4"?"▶ MP4":"▨ PNG";
function catPanel(){
  const L=STATE.lib,adm=STATE.role==="Admin";
  return `<aside class="card cats" aria-label="Categories">
   ${CATS.map(c=>`<button class="ct ${L.cat===c?"on":""}" data-a="cat" data-v="${c}">${c}<em>${catCount(c)}</em></button>`).join("")}
   <hr><div class="hd">SPORTS</div>
   <div class="sp">${STATE.sports.map(s=>{
     const open=!!L.open[s],sel=L.cat==="Channel"&&L.sport===s&&!L.sub;
     return `<button class="ct ${sel?"on":""}" data-a="sport" data-v="${esc(s)}"><span><small style="font-size:9px;margin-right:6px">${open?"▾":"▸"}</small>${esc(s)}</span></button>${open?`<div class="subs">${SUBS.map(u=>`<button class="ct ${L.cat==="Channel"&&L.sport===s&&L.sub===u?"on":""}" data-a="sub" data-v="${esc(s)}" data-v2="${esc(u)}">${u}</button>`).join("")}</div>`:""}`;}).join("")}</div>
   <div style="padding:10px 8px 4px">${adm?`<button class="btn" data-a="addSport">+ Add sport (admin)</button>`:`<p class="note" style="padding:0 4px">Only Admin / QC can add sports.</p>`}</div>
  </aside>`;
}
function library(){
  const L=STATE.lib;
  const addBtn=L.cat==="Sponsorship"?`<button class="btn off" data-a="addUnavail" title="Sponsorship templates are managed by NCTV360">+ Add asset</button>`:`<button class="btn btn-g" data-a="addAsset">+ Add asset</button>`;
  let body;
  if(L.cat==="Sponsorship"){body=sponsorshipView();}
  else{
    const crumb=["Channel"===L.cat?"Channel":L.cat].concat(L.cat==="Channel"?[L.sport,L.sub].filter(Boolean):[]).map(esc).join(" › ");
    const list=visibleAssets();
    body=`<div class="crumb">${crumb}</div>
    <div class="tools"><input class="inp" id="lq" data-i="lq" placeholder="Search title or keyword…" value="${esc(L.q)}" aria-label="Search assets">
      <select class="sel" data-i="ltype" aria-label="File type">${["All","PNG","MP4"].map(t=>`<option value="${t}" ${L.type===t?"selected":""}>${t==="All"?"All file types":t}</option>`).join("")}</select>
      <select class="sel" data-i="lsort" aria-label="Sort"><option value="new" ${L.sort==="new"?"selected":""}>Newest</option><option value="old" ${L.sort==="old"?"selected":""}>Oldest</option></select>
      <button class="btn" data-a="mode">${L.mode==="grid"?"List view":"Grid view"}</button></div>
    ${list.length?(L.mode==="grid"?`<div class="grid">${list.map(card).join("")}</div>`:list.map(row).join("")):emptyState()}`;
  }
  return `<div class="ph"><div><h1>Mini-Library</h1><p>One searchable home for creative assets, replacing the scattered Bitybox folders.</p></div>${addBtn}</div>
  <div class="lib">${catPanel()}<section class="libmain">${body}</section></div>`;
}
function emptyState(){
  const L=STATE.lib,filtered=L.q||L.type!=="All";
  return `<div class="empty"><h3>${filtered?"No assets match your search":"No assets here yet"}</h3><p class="muted" style="margin-bottom:14px">${filtered?"Try a different keyword or clear the file type filter.":"Add the first asset to this category."}</p>${filtered?`<button class="btn" data-a="clearFilters">Clear filters</button>`:`<button class="btn btn-g" data-a="addAsset">+ Add asset</button>`}</div>`;
}
const thumb=a=>`<div class="th" style="background:${grad(a.id)}">${ficon(a.ext)}</div>`;
const card=a=>`<button class="ac" data-a="preview" data-v="${a.id}">${thumb(a)}<div class="bd"><b>${esc(a.title)}</b><span>${esc(subtitle(a))}</span><span>Updated ${dlabel(a.key)}</span></div></button>`;
const row=a=>`<button class="lrow" data-a="preview" data-v="${a.id}"><div class="th" style="background:${grad(a.id)}">${a.ext}</div><div class="t"><b>${esc(a.title)}</b><span>${esc(subtitle(a))}</span></div><span>Updated ${dlabel(a.key)}</span></button>`;

function modalView(){
  const m=STATE.modal;if(!m)return "";
  let inner="";
  if(m.type==="preview"){
    const a=STATE.assets.find(x=>x.id==m.id);if(!a)return "";
    const mp=a.ext==="MP4";
    inner=`<h2>${esc(a.title)}</h2>
    <div class="big ${mp?"mp":""}" id="pvbig" style="background:${grad(a.id)}">${mp?"▶ Simulated video preview":"▨ PNG preview"}</div>
    ${mp?`<div class="prog" id="pvprog"><i></i></div>`:""}
    <dl class="kv"><dt>File type</dt><dd>${a.ext}</dd><dt>Version</dt><dd>v${a.v}</dd><dt>Location</dt><dd>${esc(a.cat==="Channel"?`Channel › ${a.sport} › ${a.sub}`:a.cat)}</dd><dt>Updated</dt><dd>${dlabel(a.key)}</dd><dt>Size</dt><dd>${mp?"18.4 MB":"1.2 MB"} (sample)</dd></dl>
    <p class="note">Sample asset. The preview is a placeholder, not a real file.</p>
    <div class="mfoot">${mp?`<button class="btn" data-a="pvplay" id="pvbtn">Pause preview</button>`:""}<button class="btn" data-a="closeModal">Close</button><button class="btn btn-g" data-a="download" data-v="${a.id}">Download (simulated)</button></div>`;
  }else if(m.type==="add"){
    const L=STATE.lib,ch=L.cat==="Channel";
    const path=ch?"":`<dt>Category</dt><dd>${esc(L.cat)}</dd>`;
    inner=`<h2>Add asset</h2><p class="note">Simulated upload. The asset is kept in this session only.</p>
    <label class="lb" for="af-title">Title</label><input class="inp" id="af-title" placeholder="e.g. Basketball Tips #3" autofocus>
    <label class="lb" for="af-ext">File type</label><select class="sel" id="af-ext" style="width:100%"><option>PNG</option><option>MP4</option></select>
    ${ch?`<div class="cols"><div><label class="lb" for="af-sport">Sport</label><select class="sel" id="af-sport" style="width:100%">${STATE.sports.map(s=>`<option ${s===(L.sport||STATE.sports[0])?"selected":""}>${esc(s)}</option>`).join("")}</select></div><div><label class="lb" for="af-sub">Subcategory</label><select class="sel" id="af-sub" style="width:100%">${SUBS.map(s=>`<option ${s===(L.sub||"Tips")?"selected":""}>${s}</option>`).join("")}</select></div></div>`:`<p class="note" style="margin-top:12px">Category: <b>${esc(L.cat)}</b></p>`}
    <p class="err" id="af-err" hidden></p>
    <div class="mfoot"><button class="btn" data-a="closeModal">Cancel</button><button class="btn btn-g" data-a="saveAsset">Add asset</button></div>`;
  }else if(m.type==="sport"){
    inner=`<h2>Add sport</h2><p class="note">Creates a new sport with the four standard subcategories. Session only.</p>
    <label class="lb" for="sp-name">Sport name</label><input class="inp" id="sp-name" placeholder="e.g. Tennis" autofocus>
    <p class="err" id="sp-err" hidden></p>
    <div class="mfoot"><button class="btn" data-a="closeModal">Cancel</button><button class="btn btn-g" data-a="saveSport">Add sport</button></div>`;
  }else if(m.type==="submitted"){
    inner=`<div style="text-align:center;padding:10px 0"><div class="ok-box" style="border:0"><div class="tick">✓</div><h2 style="margin-bottom:6px">Request submitted (simulated)</h2><p class="muted">Reference ${esc(m.ref)}. Nothing was sent to NCTV360. In a live version, the team would review your ${m.n} selection${m.n>1?"s":""}.</p></div><div class="mfoot" style="justify-content:center"><button class="btn btn-g" data-a="closeModal">Done</button></div></div>`;
  }
  return `<div class="ov" data-a="ovClose" role="dialog" aria-modal="true"><div class="md">${inner}</div></div>`;
}
/* ---------- Sponsorship = NCTV360 Mini Library (rebuilt from spec) ---------- */
const CATN={qa:"Q&A Templates",li:"Logo Animations",ad:"Advertisement Templates",sp:"Sponsorship Banners",qt:"Timers"};
const T=(id,n,cat,style,motion,o,sub,type,dur,desc,added,pop,fx)=>({id,n,cat,style,motion,o,sub,type,dur,desc,added,pop,...fx});
const B=["16:9","9:16"],L=["16:9"];
const TPL=[
 T("QA-001","Clean Cards","qa","Minimal","Animated",B,"Included","Brand-Customizable","8 s loop","Calm white cards with a single accent colour. Reads well from across a room.",914,5),
 T("QA-002","Pop Quiz","qa","Playful","Animated",B,"Included","Brand-Customizable","8 s loop","Bubbly colours and bouncing answer pills for a lively quiz moment.",922,6),
 T("QA-003","Spotlight","qa","Elegant","Animated",L,"Premium","Assisted-Customization","8 s loop","A swaying spotlight and serif type for a game-show feel.",928,4,{feat:1}),
 T("QA-004","Bold Trivia","qa","Energetic","Animated",B,"Included","Brand-Customizable","8 s loop","Slanted blocks and heavy caps that slide in with punch.",1003,3),
 T("QA-005","Modern Quiz","qa","Corporate","Static",B,"Included","Ready-Made","Static","A clean split layout with the answer revealed. No motion.",1006,2),
 T("QA-006","Play & Learn","qa","Playful","Animated",B,"Premium","Assisted-Customization","8 s loop","Sky, sun and bobbing bubbles. Made for kids’ learning content.",1013,3,{isnew:1}),
 T("LI-001","Clean Reveal","li","Minimal","Animated",B,"Included","Brand-Customizable","6 s","Your logo fades up and an accent line draws underneath.",920,4),
 T("LI-002","Luxe Glow","li","Elegant","Animated",B,"Premium","Assisted-Customization","Loop","A gold glow and a shimmer sweep across your logo.",1001,5,{feat:1}),
 T("LI-003","Impact","li","Energetic","Animated",B,"Included","Brand-Customizable","4 s","Your logo slams in over spinning rays.",1009,3),
 T("AD-001","Product Spotlight","ad","Corporate","Animated",B,"Included","Brand-Customizable","4 s loop","A floating product with a price tag that pops in.",925,4,{feat:1}),
 T("AD-002","Promo Flash","ad","Energetic","Animated",B,"Included","Ready-Made","1.6 s loop","A flashing starburst and a scrolling promo ticker.",1005,3),
 T("AD-003","Service Story","ad","Corporate","Animated",B,"Premium","Assisted-Customization","8 s loop","Three steps slide in one after another to explain a service.",1016,2,{isnew:1}),
 T("SP-001","Corner Tab","sp","Minimal","Animated",L,"Included","Brand-Customizable","6 s","A small tab slides in from the corner of the screen.",918,3),
 T("SP-002","Sponsor Bar","sp","Corporate","Animated",B,"Included","Brand-Customizable","6 s","A full-width bar rises along the bottom edge.",1014,4,{isnew:1}),
 T("SP-003","Partner Card","sp","Elegant","Animated",L,"Premium","Assisted-Customization","6 s","A floating card with a light sweep for premium partners.",1002,5,{feat:1}),
 T("QT-001","Circular Countdown","qt","Minimal","Animated",B,"Included","Ready-Made","5 s","A ring drains as the numbers count down.",910,5),
 T("QT-002","Progress Bar","qt","Corporate","Animated",B,"Included","Ready-Made","5 s","A bar shrinks from full to empty.",910,3),
 T("QT-003","Filling Shape","qt","Playful","Animated",B,"Included","Ready-Made","5 s","A shape fills from the bottom as time runs out.",912,3),
 T("QT-004","Domino Countdown","qt","Playful","Animated",B,"Premium","Ready-Made","5 s","Dominoes tip over one after another.",1008,4),
 T("QT-005","Balloon Pop","qt","Playful","Animated",B,"Premium","Ready-Made","5 s","Balloons pop one by one until time is up.",1012,3,{isnew:1}),
 T("QT-006","Star Countdown","qt","Elegant","Animated",B,"Included","Ready-Made","5 s","Stars light up one at a time.",1015,2,{isnew:1}),
];
const tpl=id=>TPL.find(t=>t.id===id);
const DEF={q:"Which planet is known as the Red Planet?",ans:"Mars",w1:"Venus",w2:"Jupiter",w3:"Mercury",brand:"Your Brand",logo:"",logoName:"",cu:false,c1:"#C41E5C",c2:"#F7931E",word:"Sponsored By",timer:"QT-001"};
const WORDS=["Sponsored By","Presented By","Brought to You By","Partnered With","In Collaboration With","Powered By"];
const PACKS={"General Knowledge":{q:"Which planet is known as the Red Planet?",ans:"Mars",w1:"Venus",w2:"Jupiter",w3:"Mercury"},"Sports Trivia":{q:"How many players are on court for one basketball team?",ans:"Five",w1:"Four",w2:"Six",w3:"Seven"},"Local Business Quiz":{q:"Which drink do we serve hot or iced all day?",ans:"Coffee",w1:"Soda",w2:"Juice",w3:"Water"},"Kids Learning":{q:"What colour do you get mixing blue and yellow?",ans:"Green",w1:"Purple",w2:"Orange",w3:"Pink"}};
const S={page:"home",cat:null,tid:null,q:"",f:{style:"All",o:"Any",m:"Any"},sel:[],cfg:{...DEF},orient:"16:9",playing:true,notes:""};

/* dynamic keyframes for timers */
(function(){let css="";for(let i=0;i<5;i++){const a=i*17+8;
 css+=`@keyframes dm${i}{0%,${a}%{transform:rotate(0)}${a+8}%,92%{transform:rotate(78deg)}100%{transform:rotate(0)}}`;
 css+=`@keyframes bp${i}{0%,${a}%{transform:scale(1);opacity:1}${a+4}%{transform:scale(1.3);opacity:1}${a+7}%,92%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}`;
 css+=`@keyframes st${i}{0%,${a}%{background:#3a3550;transform:scale(1)}${a+4}%{background:var(--t);transform:scale(1.35)}${a+9}%,92%{background:var(--t);transform:scale(1)}100%{background:#3a3550}}`;}
 const s=document.createElement("style");s.textContent=css;document.head.appendChild(s);})();

const CDN=`<div class="cd"><div>5</div><div>4</div><div>3</div><div>2</div><div>1</div></div>`;
function tmHTML(id){
  const n=`<div class="num">${CDN}</div>`;
  switch(id){
   case "QT-001":return `<div class="tm tm1"><svg viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="40"/><circle class="arc" cx="50" cy="50" r="40"/></svg>${n}</div>`;
   case "QT-002":return `<div class="tm tm2"><div class="bar"><i></i></div>${n}</div>`;
   case "QT-003":return `<div class="tm tm3"><div class="shape"><i></i></div>${n}</div>`;
   case "QT-004":return `<div class="tm tm4"><div class="dr">${[5,4,3,2,1].map((x,i)=>`<div class="dm" style="animation:dm${i} 5s infinite">${x}</div>`).join("")}</div>${n}</div>`;
   case "QT-005":return `<div class="tm tm5"><div class="bl">${["#e8342a","#ff5c8a","#f7931e","#4dd0e1","#a50a5a"].map((c,i)=>`<div class="bn" style="animation-delay:${i*.3}s"><i style="background:${c};animation:bp${i} 5s infinite"></i></div>`).join("")}</div>${n}</div>`;
   default:return `<div class="tm tm6"><div class="sr">${[0,1,2,3,4].map(i=>`<div class="st" style="animation:st${i} 5s infinite"></div>`).join("")}</div>${n}</div>`;
  }
}
const lgo=c=>`<div class="lgo"><div class="mk">${c.logo?`<img src="${c.logo}" alt="">`:esc((c.brand||"B").trim().charAt(0).toUpperCase())}</div><div class="nm">${esc(c.brand)}</div></div>`;
function qaHTML(id,c){
  const o=[c.w1,c.ans,c.w2,c.w3],LT=["A","B","C","D"],q=esc(c.q);
  const opt=(i,inner,st)=>`<div class="o pop d${i+1}"><div class="oi ${i===1?"ok":"no"}" style="${st||""}">${inner}</div></div>`;
  switch(id){
   case "QA-001":return `<div class="sc qa1"><div class="fx"><div class="k pop">Question 3 of 10</div><div class="q pop d1">${q}</div><div class="opts">${o.map((t,i)=>opt(i,`<i>${LT[i]}</i>${esc(t)}`)).join("")}</div></div></div>`;
   case "QA-002":{const col=["#ffd23f","#4dd8ff","#9bf06b","#ff9d5c"];return `<div class="sc qa2">${[[14,"8%","12%"],[9,"85%","20%"],[18,"78%","70%"],[11,"6%","72%"]].map((b,i)=>`<span class="bub" style="width:calc(var(--u)*${b[0]});height:calc(var(--u)*${b[0]});left:${b[1]};top:${b[2]};animation-delay:${i*.7}s"></span>`).join("")}<div class="fx"><div class="q pop">${q}</div><div class="opts">${o.map((t,i)=>opt(i,`<i>${LT[i]}</i>${esc(t)}`,`background:${col[i]}`)).join("")}</div></div></div>`;}
   case "QA-003":return `<div class="sc qa3"><div class="fx"><div class="q pop">${q}</div><div class="opts">${o.map((t,i)=>opt(i,`<i>${LT[i]}.</i>${esc(t)}`)).join("")}</div></div></div>`;
   case "QA-004":return `<div class="sc qa4"><div class="fx"><div class="q pop">${q}</div><div class="opts">${o.map((t,i)=>opt(i,`<i>${LT[i]}</i>${esc(t)}`)).join("")}</div></div></div>`;
   case "QA-005":return `<div class="sc qa5"><div class="fx"><div class="l"><div class="tag">Quick quiz</div><div class="q">${q}</div></div><div class="r">${o.map((t,i)=>`<div class="o"><div class="oi ${i===1?"ok":"no"}"><i>${i+1}</i>${esc(t)}</div></div>`).join("")}</div></div></div>`;
   default:{const col=["#ff6b6b","#4d96ff","#ffb02e","#6bcB77"];return `<div class="sc qa6"><div class="sun"></div><span class="cl" style="top:12%;animation-delay:-4s"></span><span class="cl" style="top:26%;animation-delay:-14s;transform:scale(.8)"></span><div class="fx"><div class="q pop">${q}</div><div class="opts">${o.map((t,i)=>opt(i,esc(t),`background:${col[i]};animation-delay:${i*.4}s`)).join("")}</div></div></div>`;}
  }
}
function preview(t,c,o={}){
  const p=o.p,cls=`scr${p?" p":""}${o.paused?" paused":""}`;
  const st=c.cu?`--c1:${c.c1};--c2:${c.c2};`:"";
  let inner="";
  switch(t.cat){
   case "qa":inner=qaHTML(t.id,c)+(o.timer?`<div class="tov">${tmHTML(o.timer)}</div>`:"");break;
   case "qt":inner=`<div class="sc tmbg"><div class="fx">${tmHTML(t.id)}</div></div>`;break;
   case "li":inner=t.id==="LI-001"?`<div class="sc li1"><div class="fx">${lgo(c)}<div class="ln"></div><div class="tg">Your tagline here</div></div></div>`:t.id==="LI-002"?`<div class="sc li2"><div class="fx">${lgo(c)}</div></div>`:`<div class="sc li3"><div class="fx">${lgo(c)}</div></div>`;break;
   case "ad":
    if(t.id==="AD-001")inner=`<div class="sc ad1"><div class="fx"><div class="prod"><div class="it">Fresh</div></div><div><h3>Fresh. Local. Yours.</h3><p>Made this morning, just for you.</p><span class="price">₱99</span></div></div></div>`;
    else if(t.id==="AD-002")inner=`<div class="sc ad2"><div class="fx"><div class="big"><b>50%</b><span>OFF TODAY</span></div></div><div class="mq"><span>LIMITED TIME ★ THIS WEEK ONLY ★ ASK AT THE COUNTER ★ LIMITED TIME ★</span></div></div>`;
    else inner=`<div class="sc ad3"><div class="fx"><h3>Getting started is easy</h3><div class="st3">${["Book online","Visit the store","Enjoy the service"].map((x,i)=>`<div class="pn" style="animation-delay:${i*.8}s"><b>${i+1}</b><span>${x}</span></div>`).join("")}</div>${lgo(c)}</div></div>`;break;
   default:{
    const sc=`<div class="sc scene sp sp${t.id.slice(-1)}"><span class="lbl">Sample screen content</span><div class="ln"></div><span class="ball"></span>`;
    if(t.id==="SP-001")inner=sc+`<div class="tab"><div><span class="w">${esc(c.word)}</span>${lgo(c).replace('class="lgo"','class="lgo" style="color:#1c2540"')}</div></div></div>`;
    else if(t.id==="SP-002")inner=sc+`<div class="bar"><span class="w">${esc(c.word)}</span>${lgo(c)}</div></div>`;
    else inner=sc+`<div class="card3"><div><span class="w">${esc(c.word)}</span>${lgo(c)}</div></div></div>`;
   }
  }
  return `<div class="${cls}" style="${st}">${inner}</div>`;
}
/* ---------- Sponsorship views ---------- */
const sel=id=>S.sel.includes(id);
function tCard(t){
  const tags=[`<span class="pill n">${t.style}</span>`,`<span class="pill ${t.motion==="Static"?"n":""}">${t.motion}</span>`,...t.o.map(x=>`<span class="pill n">${x}</span>`)].join("");
  return `<article class="tc"><div role="button" tabindex="0" aria-label="Open ${esc(t.n)}" data-a="sOpen" data-v="${t.id}">${preview(t,DEF,{})}</div>
  <div class="bd"><div class="id">${t.id}</div><h4>${esc(t.n)}</h4><div class="tags">${tags}</div>
  <div class="tags"><span class="pill ${t.sub==="Included"?"ok":"w"}">${t.sub==="Included"?"Included in subscription":"Premium add-on"}</span><span class="pill n">${t.type}</span></div>
  <div class="foot"><button class="btn btn-sm" data-a="sOpen" data-v="${t.id}">Preview</button>${sel(t.id)?`<span class="pill ok">Selected</span>`:""}</div></div></article>`;
}
const rowOf=(title,ids,extra="")=>`<section class="sec"><h3>${title}${extra}</h3><div class="row">${ids.map(i=>tCard(tpl(i))).join("")}</div></section>`;
function chipBar(){
  const items=[["home","Discover"],["qa","Q&A Templates"],["li","Logo Animations"],["ad","Advertisement Templates"],["sp","Sponsorship Banners"],["qt","Timers"],["recent","Recently Added"],["sel",`My Selections (${S.sel.length})`]];
  const cur=S.page==="cat"?S.cat:(S.page==="recent"?"recent":(S.page==="sel"?"sel":(S.page==="home"?"home":null)));
  return `<div class="chips" role="tablist">${items.map(i=>`<button class="chip ${cur===i[0]?"on":""}" data-a="sGo" data-v="${i[0]}">${i[1]}</button>`).join("")}</div>`;
}
function sponsorshipView(){
  let body="";
  switch(S.page){
   case "cat":body=sCat();break;case "detail":body=sDetail();break;case "custom":body=sCustom();break;case "sel":body=sSel();break;case "search":body=sSearch();break;case "recent":body=sRecent();break;default:body=sHome();
  }
  return `<div class="emb"><div class="etop"><b>NCTV360 Mini Library</b><input class="inp" id="sq" data-i="sq" placeholder="Search templates…" value="${esc(S.q)}" aria-label="Search templates"><span class="pill ok" title="Sample badge">Premium subscription (sample)</span></div>${chipBar()}<div class="ebody">${body}<p class="note" style="margin-top:8px">Sample templates. “Videos” are simulated with CSS animation. Nothing is uploaded, saved or sent.</p></div></div>`;
}
function sHome(){
  const byPop=[...TPL].sort((a,b)=>b.pop-a.pop).slice(0,6).map(t=>t.id);
  const rec=[...TPL].sort((a,b)=>b.added-a.added).slice(0,6).map(t=>t.id);
  return `<div class="hero"><h2>Your Screens. More Possibilities.</h2><p>Quiz, logo, ad and sponsor templates for your digital signage, included with your subscription.</p><button class="btn" data-a="sGo" data-v="qa">Browse Q&A templates</button></div>
  ${rowOf("Featured",TPL.filter(t=>t.feat).map(t=>t.id))}
  ${rowOf("New This Month",TPL.filter(t=>t.isnew).map(t=>t.id))}
  <section class="sec"><h3>Browse by Category</h3><div class="cgrid">${Object.keys(CATN).map(k=>`<button class="cbox" data-a="sGo" data-v="${k}"><b>${CATN[k]}</b><span>${TPL.filter(t=>t.cat===k).length} templates</span></button>`).join("")}</div></section>
  ${rowOf("Popular Templates",byPop)}
  ${rowOf("Recently Added",rec)}`;
}
function sRecent(){return `<h2 style="margin-bottom:12px;font-size:20px">Recently Added</h2><div class="tgrid">${[...TPL].sort((a,b)=>b.added-a.added).map(tCard).join("")}</div>`;}
function sSearch(){
  const q=S.q.trim().toLowerCase();
  const r=TPL.filter(t=>(t.id+" "+t.n+" "+t.style+" "+CATN[t.cat]+" "+t.desc).toLowerCase().includes(q));
  return `<h2 style="margin-bottom:12px;font-size:20px">Search results for “${esc(S.q)}”</h2>${r.length?`<div class="tgrid">${r.map(tCard).join("")}</div>`:`<div class="empty"><h3>No templates found</h3><p class="muted" style="margin-bottom:12px">Try a style such as Playful, or an ID like QA-003.</p><button class="btn" data-a="sClearQ">Clear search</button></div>`}`;
}
function sCat(){
  const all=TPL.filter(t=>t.cat===S.cat);
  const styles=["All",...new Set(all.map(t=>t.style))];
  const F=S.f;
  const list=all.filter(t=>(F.style==="All"||t.style===F.style)&&(F.o==="Any"||t.o.includes(F.o))&&(F.m==="Any"||t.motion===F.m));
  const grp=(label,key,vals)=>`<div class="grp"><small>${label}</small>${vals.map(v=>`<button class="chip sm ${F[key]===v?"on":""}" data-a="sFilter" data-v="${key}" data-v2="${v}">${v==="All"?"All Styles":v}</button>`).join("")}</div>`;
  return `<h2 style="font-size:22px;margin-bottom:4px">${CATN[S.cat]}</h2><p class="muted" style="margin-bottom:14px">${all.length} templates${S.cat==="qa"?". Our most detailed category.":""}</p>
  <div class="filters">${S.cat!=="qt"||styles.length>2?grp("Style","style",styles):""}${grp("Orientation","o",["Any","16:9","9:16"])}${grp("Motion","m",["Any","Static","Animated"])}</div>
  ${list.length?`<div class="tgrid">${list.map(tCard).join("")}</div>`:`<div class="empty"><h3>No templates match these filters</h3><p class="muted" style="margin-bottom:12px">Loosen a filter to see more.</p><button class="btn" data-a="sResetF">Reset filters</button></div>`}`;
}
function editable(t){
  const base=["Question and answer text"];
  if(t.cat!=="qa")base.length=0;
  if(t.type==="Ready-Made")return t.cat==="qa"?base:["Nothing. This template is used as it is"];
  return ["Logo","Two brand colours",...(t.cat==="qa"?["Question and answer text","Timer style"]:[]),...(t.cat==="sp"?["Sponsor wording"]:[])];
}
function assets(t){return t.cat==="qa"?"Question list; logo (PNG or SVG) if branded":t.cat==="sp"?"Sponsor logo (PNG or SVG) and name":t.cat==="li"?"Logo (PNG or SVG)":t.cat==="ad"?"Logo and product or service details":"None";}
function sDetail(){
  const t=tpl(S.tid),c=S.cfg,p=S.orient==="9:16";
  const similar=TPL.filter(x=>x.cat===t.cat&&x.id!==t.id).slice(0,3);
  const isSel=sel(t.id);
  return `<button class="btn btn-sm" data-a="sGo" data-v="${t.cat}" style="margin-bottom:12px">← ${CATN[t.cat]}</button>
  <div class="detail"><div><div class="player"><div class="pwrap ${p?"p":"l"}" id="pwrap">${preview(t,c,{p,paused:!S.playing,timer:t.cat==="qa"?c.timer:null})}</div>
   <div class="pctl"><button class="btn on" data-a="play" id="playbtn">${S.playing?"Pause":"Play"}</button>
   ${["16:9","9:16"].map(o=>t.o.includes(o)?`<button class="btn ${S.orient===o?"on":""}" data-a="orient" data-v="${o}">${o==="16:9"?"Landscape 16:9":"Portrait 9:16"}</button>`:`<button class="btn off" disabled title="Not supported by this template">${o==="16:9"?"Landscape 16:9":"Portrait 9:16"}</button>`).join("")}</div>
   <p class="note" style="text-align:center;margin-top:8px;color:#a9a4b8">Simulated preview${t.cat==="qa"?" of a question, then the answer reveal":""}. Looped CSS animation.</p></div>
   ${t.cat==="sp"?`<div class="box" style="margin-top:14px"><b>Wording</b><div class="tags" style="margin-top:8px">${WORDS.map(w=>`<button class="chip sm ${c.word===w?"on":""}" data-a="word" data-v="${w}">${w}</button>`).join("")}</div></div>`:""}
   ${t.cat==="qa"?`<div class="box" style="margin-top:14px"><b>Available timer styles</b><div class="tags" style="margin-top:8px">${TPL.filter(x=>x.cat==="qt").map(x=>`<button class="chip sm ${c.timer===x.id?"on":""}" data-a="timer" data-v="${x.id}">${x.n}</button>`).join("")}</div></div>
   <div class="box" style="margin-top:14px"><b>Recommended question packs</b><p class="note" style="margin:2px 0 8px">Tap a pack to load its sample question into the preview.</p><div class="tags">${Object.keys(PACKS).map(k=>`<button class="chip sm" data-a="pack" data-v="${esc(k)}">${k}</button>`).join("")}</div></div>`:""}
  </div>
  <div><div class="id muted" style="font-weight:700">${t.id}</div><h2 style="font-size:24px;margin:2px 0 6px">${esc(t.n)}</h2><p class="muted" style="margin-bottom:12px">${esc(t.desc)}</p>
   <div class="tags" style="margin-bottom:14px"><span class="pill ${t.sub==="Included"?"ok":"w"}">${t.sub==="Included"?"Included in subscription":"Premium add-on"}</span><span class="pill">${t.type}</span></div>
   <dl class="kv"><dt>Visual style</dt><dd>${t.style}</dd><dt>Motion</dt><dd>${t.motion}</dd><dt>Orientations</dt><dd>${t.o.join(" and ")}</dd><dt>Duration</dt><dd>${t.dur}</dd><dt>You can edit</dt><dd>${editable(t).join(", ")}</dd><dt>Required assets</dt><dd>${assets(t)}</dd></dl>
   ${t.type==="Assisted-Customization"?`<div class="assist"><b>Assisted customization</b><p class="note" style="margin-top:4px">NCTV360 finishes the final design for you after you submit a request.</p></div>`:""}
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">${isSel?`<button class="btn off" disabled>Selected ✓</button>`:`<button class="btn btn-g" data-a="select" data-v="${t.id}">Select This Template</button>`}<button class="btn ${isSel?"btn-g":""}" data-a="custom" data-v="${t.id}">Customize</button></div>
   ${similar.length?`<h4 style="margin:22px 0 8px">Similar templates</h4><div style="display:grid;gap:10px">${similar.map(s=>`<button class="sel-row" data-a="sOpen" data-v="${s.id}" style="text-align:left;margin:0"><div style="width:110px;flex:none;pointer-events:none">${preview(s,DEF,{})}</div><div><b>${esc(s.n)}</b><div class="note">${s.id} · ${s.style}</div></div></button>`).join("")}</div>`:""}
  </div></div>`;
}
function sCustom(){
  const t=tpl(S.tid),c=S.cfg,ready=t.type==="Ready-Made",p=S.orient==="9:16",qa=t.cat==="qa";
  const dis=ready?"disabled":"";
  return `<button class="btn btn-sm" data-a="sOpen" data-v="${t.id}" style="margin-bottom:12px">← Back to ${esc(t.n)}</button>
  <h2 style="font-size:22px;margin-bottom:2px">Customize ${esc(t.n)}</h2><p class="muted" style="margin-bottom:14px">${t.id} · <span class="pill">${t.type}</span></p>
  <div class="cust"><div>
   <div class="box"><b>What you can edit</b>
    ${ready?`<p class="note" style="margin-top:6px">This template is Ready-Made, so ${qa?"only the question text can be changed":"it is used exactly as shown"}.</p>`:""}
    <label class="lb">Logo ${ready?"":`<span class="muted" style="font-weight:500">(simulated upload, stays in your browser)</span>`}</label>
    <input type="file" accept="image/*" data-i="logo" ${dis} aria-label="Upload logo"><p class="note" id="logoname">${c.logoName?"Selected: "+esc(c.logoName):"No logo chosen. A placeholder is shown."}</p>
    <label class="lb" for="cf-brand">Brand name</label><input class="inp" id="cf-brand" data-i="brand" value="${esc(c.brand)}" ${dis}>
    <div class="cols"><div><label class="lb" for="cf-c1">Colour 1</label><input type="color" id="cf-c1" data-i="c1" value="${c.c1}" ${dis}></div><div><label class="lb" for="cf-c2">Colour 2</label><input type="color" id="cf-c2" data-i="c2" value="${c.c2}" ${dis}></div></div>
    ${qa?`<label class="lb" for="cf-q">Question</label><input class="inp" id="cf-q" data-i="q" value="${esc(c.q)}"><div class="cols"><div><label class="lb" for="cf-ans">Correct answer</label><input class="inp" id="cf-ans" data-i="ans" value="${esc(c.ans)}"></div></div><div class="cols"><div><label class="lb" for="cf-w1">Other answer</label><input class="inp" id="cf-w1" data-i="w1" value="${esc(c.w1)}"></div><div><label class="lb" for="cf-w2">Other answer</label><input class="inp" id="cf-w2" data-i="w2" value="${esc(c.w2)}"></div><div><label class="lb" for="cf-w3">Other answer</label><input class="inp" id="cf-w3" data-i="w3" value="${esc(c.w3)}"></div></div>
     <label class="lb" for="cf-timer">Timer</label><select class="sel" id="cf-timer" data-i="timer" style="width:100%">${TPL.filter(x=>x.cat==="qt").map(x=>`<option value="${x.id}" ${c.timer===x.id?"selected":""}>${x.id} ${x.n}</option>`).join("")}</select>`:""}
    ${t.cat==="sp"?`<label class="lb" for="cf-word">Sponsor wording</label><select class="sel" id="cf-word" data-i="word" style="width:100%">${WORDS.map(w=>`<option ${c.word===w?"selected":""}>${w}</option>`).join("")}</select>`:""}
    <label class="lb">Orientation</label><div class="tags">${["16:9","9:16"].map(o=>t.o.includes(o)?`<button class="chip sm ${S.orient===o?"on":""}" data-a="orient" data-v="${o}" data-keep="1">${o}</button>`:`<button class="chip sm" disabled title="Not supported">${o}</button>`).join("")}</div>
   </div>
   <div class="assist"><b>Needs NCTV360 assistance</b><ul style="margin:6px 0 0;padding-left:18px" class="note"><li>Custom fonts and typography</li><li>Your own background footage or photos</li><li>New animation timing or transitions</li><li>Bilingual or multi-language layouts</li><li>Sound or music</li></ul>${t.type==="Assisted-Customization"?`<p class="note" style="margin-top:6px"><b>This template is Assisted-Customization:</b> NCTV360 finalises it for you.</p>`:""}</div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="btn btn-g" data-a="addSel" data-v="${t.id}">Add to My Selections</button><button class="btn" data-a="resetCfg">Reset to defaults</button></div>
  </div>
  <div class="player" style="position:sticky;top:8px"><div class="pwrap ${p?"p":"l"}" id="prev">${preview(t,c,{p,paused:!S.playing,timer:qa?c.timer:null})}</div><div class="pctl"><button class="btn on" data-a="play" id="playbtn">${S.playing?"Pause":"Play"}</button></div><p class="note" style="text-align:center;margin-top:8px;color:#a9a4b8">Live simulated preview</p></div></div>`;
}
function sSel(){
  if(!S.sel.length)return `<div class="empty"><h3>No selections yet</h3><p class="muted" style="margin-bottom:12px">Pick templates you like, then submit them as one request.</p><button class="btn btn-g" data-a="sGo" data-v="home">Discover templates</button></div>`;
  const assisted=S.sel.filter(i=>tpl(i).type==="Assisted-Customization").length;
  return `<h2 style="font-size:22px;margin-bottom:12px">My Selections</h2>
  ${S.sel.map(i=>{const t=tpl(i);return `<div class="sel-row"><div style="width:150px;flex:none">${preview(t,DEF,{})}</div><div style="flex:1;min-width:150px"><div class="id muted" style="font-weight:700">${t.id}</div><b>${esc(t.n)}</b><div class="tags" style="margin-top:4px"><span class="pill">${t.type}</span><span class="pill ${t.sub==="Included"?"ok":"w"}">${t.sub==="Included"?"Included":"Premium add-on"}</span></div></div><button class="btn btn-sm" data-a="custom" data-v="${t.id}">Customize</button><button class="btn btn-sm" data-a="rmSel" data-v="${t.id}">Remove</button></div>`;}).join("")}
  ${assisted?`<div class="assist"><b>${assisted} template${assisted>1?"s need":" needs"} NCTV360 assistance</b><p class="note">We will contact you to finish ${assisted>1?"them":"it"}.</p></div>`:""}
  <label class="lb" for="sn" style="margin-top:14px">Notes for the NCTV360 team (optional)</label><textarea class="inp" id="sn" data-i="notes" rows="3" placeholder="Anything we should know?">${esc(S.notes)}</textarea>
  <div style="margin-top:14px"><button class="btn btn-g" data-a="submitReq">Submit request</button> <span class="note">Simulated. Nothing is sent.</span></div>`;
}
/* ---------- render & events ---------- */
function render(top){
  const a=document.activeElement,id=a&&a.id,ss=a&&a.selectionStart,se=a&&a.selectionEnd,y=window.scrollY;
  document.documentElement.className=STATE.view==="login"?"login":"";
  $("#root").innerHTML=STATE.view==="login"?loginView():shell()+modalView();
  if(id){const n=document.getElementById(id);if(n&&(n.tagName==="INPUT"||n.tagName==="TEXTAREA")&&n.type!=="file"&&n.type!=="color"){n.focus();try{if(ss!=null)n.setSelectionRange(ss,se);}catch(e){}}}
  window.scrollTo(0,top?0:y);
}
function doLogin(role){STATE.view="app";STATE.role=role;STATE.page="library";STATE.loginErr="";render(true);}
function updatePrev(){const t=tpl(S.tid),n=$("#prev");if(!t||!n)return;n.innerHTML=preview(t,S.cfg,{p:S.orient==="9:16",paused:!S.playing,timer:t.cat==="qa"?S.cfg.timer:null});}
function setTid(id){const t=tpl(id);if(S.tid!==id)S.cfg.cu=false;S.tid=id;S.orient=t.o.includes(S.orient)?S.orient:t.o[0];S.playing=true;}
function selAdd(id){if(!S.sel.includes(id))S.sel.push(id);}

const ACT={
 togglePw(){STATE.showPw=!STATE.showPw;const i=$("#lpw");i.type=STATE.showPw?"text":"password";$("[data-a=togglePw]").textContent=STATE.showPw?"Hide":"Show";},
 forgot(){toast("Password reset isn’t available in this prototype.");},
 demo(v){doLogin(v.v);},
 logout(){STATE.view="login";STATE.modal=null;render(true);},
 nav(v){STATE.page=v.v;STATE.modal=null;render(true);},
 cat(v){const L=STATE.lib;L.cat=v.v;L.sport=null;L.sub=null;L.q="";L.type="All";render();},
 sport(v){const L=STATE.lib,s=v.v,same=L.cat==="Channel"&&L.sport===s&&!L.sub;L.cat="Channel";L.sport=s;L.sub=null;L.open[s]=same?!L.open[s]:true;L.q="";render();},
 sub(v){const L=STATE.lib;L.cat="Channel";L.sport=v.v;L.sub=v.v2;L.open[v.v]=true;L.q="";render();},
 mode(){const L=STATE.lib;L.mode=L.mode==="grid"?"list":"grid";render();},
 clearFilters(){const L=STATE.lib;L.q="";L.type="All";render();},
 preview(v){STATE.modal={type:"preview",id:v.v};render();},
 closeModal(){STATE.modal=null;render();},
 pvplay(){const big=$("#pvbig"),pr=$("#pvprog"),b=$("#pvbtn"),stop=!big.classList.contains("stop");big.classList.toggle("stop",stop);pr&&pr.classList.toggle("stop",stop);b.textContent=stop?"Play preview":"Pause preview";},
 download(){toast("Download simulated. No file was saved.");},
 addAsset(){STATE.modal={type:"add"};render();setTimeout(()=>{const t=$("#af-title");t&&t.focus();},0);},
 addUnavail(){toast("Sponsorship templates are managed by NCTV360, so adding assets is unavailable here.");},
 saveAsset(){
  const title=$("#af-title").value.trim(),err=$("#af-err");
  if(!title){err.textContent="Enter a title for the asset.";err.hidden=false;return;}
  const L=STATE.lib,ext=$("#af-ext").value;let sport=null,sub=null;
  if(L.cat==="Channel"){sport=$("#af-sport").value;sub=$("#af-sub").value;L.sport=sport;L.sub=sub;L.open[sport]=true;}
  STATE.assets.push({id:uid++,title,cat:L.cat,sport,sub,ext,v:1,key:1027});
  L.q="";L.type="All";L.sort="new";STATE.modal=null;render();toast("Asset added (simulated upload, this session only).");
 },
 addSport(){STATE.modal={type:"sport"};render();setTimeout(()=>{const t=$("#sp-name");t&&t.focus();},0);},
 saveSport(){
  const n=$("#sp-name").value.trim(),err=$("#sp-err");
  const bad=!n?"Enter a sport name.":n.length>30?"Keep the name under 30 characters.":STATE.sports.some(s=>s.toLowerCase()===n.toLowerCase())?"That sport already exists.":"";
  if(bad){err.textContent=bad;err.hidden=false;return;}
  STATE.sports.push(n);const L=STATE.lib;L.cat="Channel";L.sport=n;L.sub=null;L.open[n]=true;STATE.modal=null;render();toast(`${n} added with 4 subcategories.`);
 },
 /* sponsorship */
 sGo(v){const k=v.v;S.q="";if(CATN[k]){S.page="cat";S.cat=k;S.f={style:"All",o:"Any",m:"Any"};}else S.page=k;render();},
 sOpen(v){setTid(v.v);S.page="detail";render();$(".emb")&&$(".emb").scrollIntoView({block:"start"});},
 sFilter(v){S.f[v.v]=v.v2;render();},
 sResetF(){S.f={style:"All",o:"Any",m:"Any"};render();},
 sClearQ(){S.q="";S.page="home";render();},
 play(){S.playing=!S.playing;document.querySelectorAll(".player .scr").forEach(n=>n.classList.toggle("paused",!S.playing));const b=$("#playbtn");b&&(b.textContent=S.playing?"Pause":"Play");},
 orient(v){S.orient=v.v;render();},
 word(v){S.cfg.word=v.v;render();},
 timer(v){S.cfg.timer=v.v;render();},
 pack(v){Object.assign(S.cfg,PACKS[v.v]);render();toast(`Loaded “${v.v}” sample question.`);},
 select(v){selAdd(v.v);render();toast("Added to My Selections.");},
 custom(v){setTid(v.v);S.page="custom";render(true);},
 addSel(v){selAdd(v.v);S.page="sel";render(true);toast("Added to My Selections.");},
 rmSel(v){S.sel=S.sel.filter(i=>i!==v.v);render();},
 resetCfg(){S.cfg={...DEF};render();},
 submitReq(){STATE.modal={type:"submitted",ref:"REQ-"+(1000+Math.floor(Math.random()*9000)),n:S.sel.length};S.sel=[];S.notes="";render();},
};

document.addEventListener("click",e=>{
  const el=e.target.closest("[data-a]");if(!el)return;
  const a=el.dataset.a;
  if(a==="loginForm")return;
  if(a==="ovClose"){if(e.target===el)ACT.closeModal();return;}
  if(el.disabled)return;
  ACT[a]&&ACT[a]({v:el.dataset.v,v2:el.dataset.v2});
});
document.addEventListener("submit",e=>{
  const f=e.target.closest("form[data-a=loginForm]");if(!f)return;e.preventDefault();
  const email=$("#lemail").value.trim().toLowerCase(),pw=$("#lpw").value,er=$("#lerr");
  const fail=m=>{er.textContent=m;};
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))return fail("Enter a valid email address, like name@company.com.");
  if(pw.length<6)return fail("Password must be at least 6 characters.");
  const role=email===PEOPLE.Admin.email?"Admin":email===PEOPLE.Designer.email?"Designer":null;
  if(!role||pw!==PW)return fail("Wrong email or password. Use one of the demo accounts shown on this page.");
  try{if($("#lrem").checked)localStorage.setItem("ntv_email",email);else localStorage.removeItem("ntv_email");}catch(x){}
  doLogin(role);
});
const CH_ONLY=new Set(["role","ltype","lsort","logo"]);
function onField(e){
  const el=e.target.closest("[data-i]");if(!el)return;const k=el.dataset.i,v=el.value,L=STATE.lib;
  if(CH_ONLY.has(k)&&e.type!=="change")return;
  switch(k){
   case "role":STATE.role=v;if(v==="Designer"&&["franchisees","settings"].includes(STATE.page))STATE.page="dashboard";render();toast(`Now viewing as ${PEOPLE[v].label}.`);break;
   case "lq":L.q=v;render();break;
   case "ltype":L.type=v;render();break;
   case "lsort":L.sort=v;render();break;
   case "sq":S.q=v;if(v.trim())S.page="search";else if(S.page==="search")S.page="home";render();break;
   case "notes":S.notes=v;break;
   case "c1":case "c2":S.cfg[k]=v;S.cfg.cu=true;updatePrev();break;
   case "logo":{const f=el.files&&el.files[0];if(!f)break;const r=new FileReader();r.onload=()=>{S.cfg.logo=r.result;S.cfg.logoName=f.name;const n=$("#logoname");n&&(n.textContent="Selected: "+f.name);updatePrev();};r.readAsDataURL(f);break;}
   case "timer":case "word":case "brand":case "q":case "ans":case "w1":case "w2":case "w3":S.cfg[k]=v;updatePrev();break;
  }
}
document.addEventListener("input",onField);document.addEventListener("change",onField);
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&STATE.modal){ACT.closeModal();return;}
  if((e.key==="Enter"||e.key===" ")&&e.target.matches("[role=button][data-a]")){e.preventDefault();e.target.click();}
});
render(true);
