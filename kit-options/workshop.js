/* Local review drafts only. No network calls or roster writes. */
"use strict";
(() => {
  const data = JSON.parse(document.getElementById("kit-data").textContent);
  const slots = ["Passive", "Basic", "Active1", "Active2", "Ultimate"];
  const slotNames = {Passive:"Passive",Basic:"Basic",Active1:"Active 1",Active2:"Active 2",Ultimate:"Ultimate"};
  const storeKey = "projectg-kit-drafts-2026-10-25-v1";
  const unitMap = new Map(data.units.map(u => [u.id,u]));
  const allSkills = new Map(data.units.flatMap(u=>u.options.flatMap(o=>o.skills.map(s=>[s.id,{...s,optionLabel:o.label,optionName:o.name,unitId:u.id}]))));
  let saved = {}, storageAvailable = true, toastTimer, kitFilter = "all";
  try { saved = JSON.parse(localStorage.getItem(storeKey) || "{}"); if (!saved || typeof saved !== "object" || Array.isArray(saved)) saved = {}; } catch { storageAvailable=false; }
  // Ignore obsolete ids without silently replacing them with another choice.
  for (const [id,draft] of Object.entries(saved)) {
    if (!unitMap.has(id) || !draft || typeof draft !== "object") { delete saved[id]; continue; }
    if (!draft.skills || typeof draft.skills !== "object") draft.skills = {};
    for (const [slot,skillId] of Object.entries(draft.skills)) {
      const skill=allSkills.get(skillId);
      if (!skill || skill.unitId!==id || skill.slot!==slot) delete draft.skills[slot];
    }
    if(typeof draft.notes!=="string") draft.notes="";
  }
  function escape(value) { return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function getDraft(id) { if(!saved[id]) saved[id]={skills:{},notes:""}; return saved[id]; }
  function selectedCount(id) { return Object.values(saved[id]?.skills||{}).filter(Boolean).length; }
  function activeUnit() { let id=""; try { id=decodeURIComponent(location.hash.slice(1)); } catch {} return unitMap.get(id) || data.units[0]; }
  function notify(message) { document.getElementById("toast").textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>document.getElementById("toast").textContent="",3200); }
  function persist() {
    try { localStorage.setItem(storeKey,JSON.stringify(saved)); storageAvailable=true; }
    catch { storageAvailable=false; }
    updateSaveStatus();
    renderNav();
  }
  function updateSaveStatus(){const el=document.getElementById("save-status");if(el)el.textContent=storageAvailable?"Draft saved in this browser. Export it to keep a portable copy; it does not submit or approve a kit.":"Browser storage is unavailable. Export your draft before leaving this page.";}
  function renderNav() {
    const current=activeUnit().id;
    document.getElementById("unit-nav").innerHTML=data.units.map(u=>`<a href="#${escape(u.id)}" ${u.id===current?'aria-current="page"':""}><span>${escape(u.name)}</span><small>${selectedCount(u.id)}/5</small></a>`).join("");
    const started=data.units.filter(u=>selectedCount(u.id)>0).length;
    document.getElementById("draft-progress").textContent=`${started} of ${data.units.length} units have a draft.`;
  }
  function summaryMarkup(skill) { return (skill.summary||[skill.description]).map(line=>`<p>${escape(line)}</p>`).join(""); }
  function skillMarkup(skill,option,unit) {
    const picked=saved[unit.id]?.skills?.[skill.slot]===skill.id;
    const meta=skill.slot==="Passive"?"Automatic":skill.slot==="Basic"?"No cooldown":`CD ${skill.cooldown}${skill.charge?` · ${skill.charge} charge`:""}`;
    return `<section class="skill${picked?' is-picked':''}" id="${escape(skill.id)}"><div class="slot"><span>${slotNames[skill.slot]}</span><span>${meta}</span></div><h4>${escape(skill.name)}</h4><p class="target">${escape(skill.targetLabel||skill.target)}</p><div class="effect effect-lines">${summaryMarkup(skill)}</div><button type="button" class="${picked?'picked':''}" data-pick="${escape(skill.id)}" aria-label="Use ${escape(skill.name)} in ${slotNames[skill.slot]} slot" aria-pressed="${picked}">${picked?'✓ In your draft':`Use ${slotNames[skill.slot]}`}</button><details class="skill-rules"><summary>Detailed rules &amp; mixing</summary><p><strong>Full effect:</strong> ${escape(skill.description)}</p><p><strong>Targeting:</strong> ${escape(skill.target)}</p><p><strong>Mixing:</strong> ${escape(skill.mixNote)}</p></details></section>`;
  }
  function resolveSkillName(id) { const s=allSkills.get(id);return s?`${s.optionLabel} · ${s.name} (${slotNames[s.slot]})`:id; }
  function kitMarkup(option,unit) {
    return `<article class="kit-card" id="${escape(option.id)}" aria-labelledby="${escape(option.id)}-name"><header class="kit-top"><div class="kit-title-row"><span class="option-letter">${escape(option.label)}</span>${option.isNew?'<span class="new-tag">New</span>':""}<span>${escape(option.role)} · ${escape(option.position)}</span></div><span class="complexity-badge ${option.complexity}">${option.complexity==="simple"?"Straightforward":"Signature mechanic"}</span><h3 id="${escape(option.id)}-name">${escape(option.name)}</h3><p class="fantasy">${escape(option.fantasy)}</p><button type="button" class="primary" data-whole="${escape(option.id)}">Use whole kit ${escape(option.label)}</button></header><details class="kit-context"><summary>Play loop, strengths & tradeoff</summary><span class="mini-label">Play loop</span><ol>${option.loop.map(x=>`<li>${escape(x)}</li>`).join("")}</ol><span class="mini-label">Strengths</span><ul>${option.strengths.map(x=>`<li>${escape(x)}</li>`).join("")}</ul><span class="mini-label">Tradeoff</span><p>${escape(option.tradeoff)}</p><span class="mini-label">Against bosses</span><p>${escape(option.bossPlan)}</p><span class="mini-label">Stat priorities</span><p>${option.recommendedStats.map(escape).join(" → ")}</p></details><div class="skills">${option.skills.map(s=>skillMarkup(s,option,unit)).join("")}</div><details class="mechanics"><summary>Mechanics & suggested mixes</summary><dl>${option.mechanics.map(m=>`<dt>${escape(m.name)}${m.newLogic?' · new logic':''}</dt><dd>${escape(m.rules)}</dd>`).join("")}</dl><span class="mini-label">Try importing</span><ul>${option.mixGuide.bestImports.map(id=>`<li>${escape(resolveSkillName(id))}</li>`).join("")}</ul><span class="mini-label">Keep together</span><ul>${option.mixGuide.keepTogether.map(x=>`<li>${escape(x)}</li>`).join("")}</ul><span class="mini-label">Watch out</span><ul>${option.mixGuide.watchOut.map(x=>`<li>${escape(x)}</li>`).join("")}</ul></details></article>`;
  }
  function renderUnit() {
    const unit=activeUnit();getDraft(unit.id);
    const visibleOptions=unit.options.filter(o=>kitFilter==="all"||o.complexity===kitFilter);
    document.title=`${unit.name} · Kit workshop · ProjectG`;
    document.getElementById("unit-view").innerHTML=`<header class="unit-header"><a class="sprite-wrap" href="review.html#${escape(unit.id)}" aria-label="Review accepted ${escape(unit.name)} sprite"><img src="${escape(unit.sprite)}" alt="Accepted ${escape(unit.name)} pixel sprite"></a><div><div class="eyebrow">${data.units.indexOf(unit)+1} / ${data.units.length} · ${unit.options.length} alternatives</div><h2 id="unit-title" tabindex="-1">${escape(unit.name)}</h2><p class="identity">${escape(unit.identity)}</p><span class="badge type-${escape(unit.type)}">Suggested type · ${escape(unit.type)}</span><span class="badge">5 slots per kit</span><div class="accepted">Visual design accepted · ${escape(unit.spriteVersion)} · kit selection pending</div><p class="draft-jump"><a href="#custom-draft" id="jump-draft">Review custom draft ↓</a> <span id="unit-draft-count" class="muted"></span></p>${unit.shieldScaling?'<p class="revision-note">Shield revision: all Roselle shields now scale with Roselle’s Max HP.</p>':""}</div></header><div class="kit-filters" role="group" aria-label="Kit style">${[["all","All variants"],["simple","Straightforward"],["signature","Signature mechanics"]].map(([value,label])=>`<button type="button" data-filter="${value}" aria-pressed="${kitFilter===value}">${label} · ${unit.options.filter(o=>value==="all"||o.complexity===value).length}</button>`).join("")}</div><nav class="option-nav" id="variant-shortcuts" aria-label="Kit variant shortcuts">${visibleOptions.map(o=>`<button type="button" data-jump="${escape(o.id)}">${o.label} · ${escape(o.name)}${o.isNew?' <span class="new-tag">New</span>':""}</button>`).join("")}</nav><div class="option-grid">${visibleOptions.map(o=>kitMarkup(o,unit)).join("")}</div><section class="draft-panel" aria-labelledby="draft-title" id="custom-draft"><div class="draft-heading"><div><p class="eyebrow">Your working selection</p><h3 id="draft-title">${escape(unit.name)} · custom draft</h3></div><button type="button" id="clear-unit">Clear this draft</button></div><p class="help">Choose one skill for each slot from A through E. The checks below flag missing mechanics. You can keep partial drafts and add notes. These choices stay in this browser until you export them.</p><div class="draft-slots" id="draft-slots"></div><div class="checks" id="dependency-checks" aria-live="polite"></div><label class="notes">Notes for ${escape(unit.name)}<textarea id="unit-notes" placeholder="What to keep, change, or combine…">${escape(getDraft(unit.id).notes)}</textarea></label><p class="save-status" id="save-status" role="status"></p></section>`;
    document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{kitFilter=button.dataset.filter;renderUnit();}));
    document.querySelectorAll("[data-jump]").forEach(button=>button.addEventListener("click",()=>{const target=document.getElementById(button.dataset.jump);target.scrollIntoView({block:"start"});const heading=target.querySelector("h3");if(heading){heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true});}}));
    document.getElementById("jump-draft").addEventListener("click",event=>{event.preventDefault();document.getElementById("custom-draft").scrollIntoView({block:"start"});document.getElementById("draft-title").setAttribute("tabindex","-1");document.getElementById("draft-title").focus({preventScroll:true});});
    document.getElementById("unit-view").querySelectorAll("[data-whole]").forEach(button=>button.addEventListener("click",()=>{
      const option=unit.options.find(o=>o.id===button.dataset.whole);
      getDraft(unit.id).skills=Object.fromEntries(option.skills.map(s=>[s.slot,s.id]));persist();updateDraft();notify(`Kit ${option.label} added to ${unit.name}'s draft. Mix any slot below.`);
    }));
    document.getElementById("unit-view").querySelectorAll("[data-pick]").forEach(button=>button.addEventListener("click",()=>{
      const skill=allSkills.get(button.dataset.pick);getDraft(unit.id).skills[skill.slot]=skill.id;persist();updateDraft();notify(`${skill.name} selected for ${slotNames[skill.slot]}.`);
    }));
    document.getElementById("unit-notes").addEventListener("input",event=>{getDraft(unit.id).notes=event.target.value;persist();});
    document.getElementById("clear-unit").addEventListener("click",()=>{
      const previous=JSON.parse(JSON.stringify(getDraft(unit.id)));
      saved[unit.id]={skills:{},notes:""};persist();renderUnit();
      const undo=document.createElement("button");undo.type="button";undo.textContent="Undo clear";undo.style.marginLeft="10px";undo.addEventListener("click",()=>{saved[unit.id]=previous;persist();renderUnit();notify("Draft restored.");});
      notify("Draft cleared.");document.getElementById("toast").append(undo);
    });
    updateDraft();renderNav();
  }
  function updateDraft() {
    const unit=activeUnit(),draft=getDraft(unit.id);
    document.getElementById("draft-slots").innerHTML=slots.map(slot=>{
      const chosen=allSkills.get(draft.skills[slot]);
      return `<div class="slot-picker"><label for="choose-${slot}">${slotNames[slot]}</label><select id="choose-${slot}" data-slot="${slot}"><option value="">Choose ${slotNames[slot]}…</option>${unit.options.map(o=>{const s=o.skills.find(s=>s.slot===slot);return `<option value="${escape(s.id)}" ${chosen?.id===s.id?'selected':''}>${o.label} · ${escape(s.name)}</option>`;}).join("")}</select>${chosen?`<p class="origin">From ${escape(chosen.optionLabel)} · ${escape(chosen.optionName)}</p><div class="chosen-description effect-lines">${summaryMarkup(chosen)}</div><details class="draft-rules"><summary>Detailed rules</summary><p>${escape(chosen.description)}</p></details>`:'<p class="chosen-description muted">No skill selected.</p>'}</div>`;
    }).join("");
    document.getElementById("draft-slots").querySelectorAll("select").forEach(select=>select.addEventListener("change",()=>{if(select.value)draft.skills[select.dataset.slot]=select.value;else delete draft.skills[select.dataset.slot];persist();updateDraft();document.getElementById(`choose-${select.dataset.slot}`).focus({preventScroll:true});}));
    for(const button of document.querySelectorAll("[data-pick]")){
      const skill=allSkills.get(button.dataset.pick),picked=draft.skills[skill.slot]===skill.id;
      button.classList.toggle("picked",picked);button.setAttribute("aria-pressed",String(picked));button.textContent=picked?"✓ In your draft":`Use ${slotNames[skill.slot]}`;button.closest(".skill").classList.toggle("is-picked",picked);
    }
    const selected=Object.values(draft.skills).map(id=>allSkills.get(id)).filter(Boolean);
    const provided=new Set(selected.flatMap(s=>s.provides));
    const mechanics=new Map(unit.options.flatMap(o=>o.mechanics.map(m=>[m.id,m])));
    const warnings=[];
    for(const skill of selected){
      const hard=skill.requires.filter(id=>!provided.has(id));
      const soft=skill.benefitsFrom.filter(id=>!provided.has(id));
      if(hard.length)warnings.push(`<p class="hard-warning"><strong>Needs its mechanic:</strong> ${escape(skill.name)} requires ${hard.map(id=>escape(mechanics.get(id)?.name||id)).join(", ")}. Choose a provider in another slot or replace this skill.</p>`);
      if(soft.length)warnings.push(`<p class="soft-warning"><strong>Base effect works:</strong> ${escape(skill.name)} loses optional ${soft.map(id=>escape(mechanics.get(id)?.name||id)).join(", ")} bonuses in this mix.</p>`);
    }
    const missing=slots.filter(slot=>!draft.skills[slot]);
    let lead=missing.length?`${5-missing.length}/5 slots selected. Still open: ${missing.map(s=>slotNames[s]).join(", ")}.`:"5/5 slots selected. This is a review draft; balance is not validated.";
    document.getElementById("dependency-checks").innerHTML=`<p>${escape(lead)}</p>${warnings.join("")}${selected.length&&!warnings.length?'<p>No missing mechanics in this selection. Review the tradeoffs before deciding.</p>':""}`;
    document.getElementById("unit-draft-count").textContent=`${selected.length}/5 slots selected`;
    updateSaveStatus();
  }
  function exportPayload(){return {schemaVersion:1,project:"ProjectG",proposalVersion:data.version,exportedAt:new Date().toISOString(),status:"user-working-draft-not-gameplay-approval",units:data.units.filter(u=>selectedCount(u.id)>0||saved[u.id]?.notes).map(unit=>({id:unit.id,name:unit.name,complete:selectedCount(unit.id)===5,skills:slots.map(slot=>{const s=allSkills.get(saved[unit.id]?.skills?.[slot]);return s?{slot,id:s.id,name:s.name,option:s.optionLabel}:null;}).filter(Boolean),notes:saved[unit.id]?.notes||""}))};}
  function download(filename,content,mime){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([content],{type:mime}));a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);notify("Draft export prepared. Share the exported file here when you are ready.");}
  document.getElementById("export-json").addEventListener("click",()=>download("projectg-kit-selections.json",JSON.stringify(exportPayload(),null,2)+"\n","application/json"));
  document.getElementById("export-text").addEventListener("click",()=>{const p=exportPayload();let text="# ProjectG kit selections\n\nWorking review draft — not gameplay approval.\n\n";for(const u of p.units){text+=`## ${u.name}\n\n`;for(const s of u.skills)text+=`- ${slotNames[s.slot]}: ${s.option} · ${s.name}\n`;text+=`\nNotes: ${u.notes||"None"}\n\n`;}if(!p.units.length)text+="No selections yet.\n";download("projectg-kit-selections.md",text,"text/markdown");});
  window.addEventListener("hashchange",()=>{renderUnit();document.getElementById("unit-title").focus({preventScroll:true});document.getElementById("unit-view").scrollIntoView({block:"start"});});
  renderUnit();
})();
