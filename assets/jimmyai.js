'use strict';

// All content below is fictional and authored for the portfolio walkthrough.
const sources = {
  pilot: {
    title: 'Assisted support triage — pilot note', type: 'SAMPLE 01 · OBSERVATION', fictional: true,
    excerpt: 'In a fictional internal pilot, a support team used an assistant to suggest categories and draft replies. Reviewers found the drafts useful for routine requests, but policy exceptions still needed manual correction. Every reply was checked by a person before sending. The pilot did not measure customer retention or compare outcomes against a control group.',
    card: {why:'Explore whether an assistant could help a support team prepare routine replies.', what:'A small, internal pilot of suggested categories and draft responses.', how:'A reviewer checked each draft and noted where corrections were needed.', finding:'Routine requests looked promising; policy exceptions required manual correction.', limitations:'No control group, retention measurement or causal estimate. This fictional observation cannot establish a general performance gain.', tags:['customer-support', 'human-review', 'pilot-study']}
  },
  review: {
    title: 'Pilot review — conditions for a next test', type: 'SAMPLE 02 · REVIEW MEMO', fictional: true,
    excerpt: 'The fictional review memo proposes a limited follow-up test for routine support categories. It recommends human review of every reply, a separate path for policy exceptions, and logging corrections. Before expanding, the team should compare reply quality and handling time against a baseline. No expansion decision has been approved and no retention results are available.',
    card: {why:'Turn an early observation into a testable next step.', what:'A review memo proposing conditions for a limited follow-up.', how:'Separate routine requests from policy exceptions and define a baseline comparison.', finding:'Propose a controlled test with human review and correction logging.', limitations:'This is a proposal, not a completed experiment or approved rollout. Expected benefits have not been measured.', tags:['experiment-design', 'review-gate', 'evidence-gap']}
  }
};
function getCard(id) {
  const source = sources[id];
  return source ? {...source.card, source:id, title:source.title} : null;
}
function getAnswer(id) {
  if (id === 'findings') return {supported:true, title:'Useful for routine drafts. Exceptions still need review.', text:'The sample pilot reports that reviewers found routine drafts useful, while policy exceptions needed correction. The review memo recommends testing this more carefully before expanding.', interpretation:'Interpretation: this supports a follow-up test, not a proven improvement in business outcomes.', sources:['pilot','review']};
  if (id === 'rollout') return {supported:true, title:'A limited test is proposed. A rollout is not approved.', text:'The review memo proposes routine categories only, human review of every reply, a separate path for exceptions, and correction logging. It calls for a baseline comparison of quality and handling time before expansion.', interpretation:'Proposed next step: define the comparison and review criteria with the team. The decision stays with the people responsible.', sources:['review']};
  return {supported:false, title:'There is not enough evidence to answer that.', text:'The sample materials contain no customer-retention measurement. An observed improvement in draft preparation would not, by itself, establish an effect on retention.', interpretation:'Missing evidence: a defined retention outcome, an appropriate comparison and a sufficient observation period.', sources:[]};
}
function initialWorkflow() { return {drafted:false, sources:false, limits:false, approved:false}; }
function transition(state, event) {
  if (event.type === 'reset') return initialWorkflow();
  if (event.type === 'draft') return {...initialWorkflow(), drafted:true};
  if (event.type === 'review' && state.drafted && ['sources','limits'].includes(event.key)) return {...state, [event.key]:Boolean(event.checked), approved:false};
  if (event.type === 'approve' && state.drafted && state.sources && state.limits) return {...state, approved:true};
  return {...state};
}
function makeBrief(state) {
  if (!(state.drafted && state.sources && state.limits && state.approved)) throw new Error('Complete the review before exporting.');
  return `JIMMYAI — FICTIONAL SAMPLE BRIEF\n\nPurpose\nPrepare a limited follow-up test of an assistant for routine support requests.\n\nEvidence\nSample 01: reviewers found routine drafts useful; policy exceptions needed correction.\nSample 02: the review memo proposes a controlled follow-up before expansion.\n\nProposed tasks\n1. Define routine categories and route exceptions separately.\n2. Record a baseline for reply quality and handling time.\n3. Keep human review of every reply and log corrections.\n4. Review results with the team before deciding whether to expand.\n\nLimits\nNo causal estimate or customer-retention outcome is available.\nThis is a simulated review in a portfolio demonstration, not a real approval or executed workflow.\n\nSources\nAssisted support triage — pilot note (fictional)\nPilot review — conditions for a next test (fictional)\n`;
}

if (typeof module !== 'undefined' && module.exports) module.exports = {sources,getCard,getAnswer,initialWorkflow,transition,makeBrief};
if (typeof document !== 'undefined') {
  const content=document.getElementById('scene-content'),dialog=document.getElementById('source-dialog'),announcement=document.getElementById('announcement');
  let scene='research',cardCreated=false,question='findings',workflow=initialWorkflow(),downloadUrl=null;
  const escape=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const announce=text=>{announcement.textContent=text;};
  const docIcon='<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h5" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  const hub=small=>`<div class="hub-wrap ${small?'small-hub':''}" aria-hidden="true"><div class="hub-ring"></div><div class="hub">J<span class="spark">✦</span></div><span class="hub-label">JIMMYAI</span></div>`;
  const wires=active=>`<svg class="wires" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true"><path class="wire" d="M160 70C330 70 315 130 480 130S680 130 840 130M160 190C330 190 315 130 480 130"/>${active?'<path class="wire-glow" d="M160 70C330 70 315 130 480 130S680 130 840 130M160 190C330 190 315 130 480 130"/>':''}</svg>`;
  const sourceNode=(id,title,type)=>`<button type="button" class="source-node" data-source="${id}" aria-label="Read sample ${title}"><span class="doc-icon">${docIcon}</span><div><span class="node-name">${title}</span><span class="node-sub">${type}</span></div><span aria-hidden="true">↗</span></button>`;
  const citation=(id,label)=>`<button type="button" class="citation" data-source="${id}">${label} ↗</button>`;
  function releaseDownload(){if(downloadUrl){URL.revokeObjectURL(downloadUrl);downloadUrl=null;}}
  function showDetail(title,meta,body,label='SAMPLE SOURCE'){
    document.getElementById('source-title').textContent=title;
    document.getElementById('source-meta').textContent=meta;
    document.getElementById('source-excerpt').textContent=body;
    document.getElementById('dialog-label').textContent=label;
    dialog.showModal();
  }
  function openSource(id){const source=sources[id];if(source)showDetail(source.title,source.type+' · FICTIONAL',source.excerpt);}
  function researchView(){
    return `<div class="canvas"><div class="canvas-head"><h2>Give your research a structure.</h2><span>SOURCE → KNOWLEDGE</span></div><div class="flow">${wires(cardCreated)}<div class="input-stack">${sourceNode('pilot','Pilot note','OBSERVATION')}${sourceNode('review','Review memo','NEXT STEPS')}<p class="stack-caption">CLICK A SOURCE TO EXPLORE ↗</p></div>${hub(false)}<div class="output-wrap"><section class="result-card ${cardCreated?'arrive':'result-ghost'}" aria-label="Knowledge card"><div class="result-label"><span>KNOWLEDGE CARD</span><span aria-hidden="true">${cardCreated?'✓':'⌁'}</span></div>${cardCreated?`<h3>Support assistant pilot</h3><ul class="result-lines"><li><span>↳</span>Routine drafts show promise.</li><li><span>↳</span>Exceptions need human review.</li><li><span>↳</span>A controlled test comes next.</li></ul><div class="result-tags"><span>Human review</span><span>2 sources</span><span>AI draft · sample</span></div>`:`<h3>Your next useful insight.</h3><div class="placeholder-lines" aria-hidden="true"><i></i><i></i><i></i></div><div class="result-tags"><span>Findings</span><span>Sources</span><span>Limits</span></div>`}</section></div></div><div class="canvas-actions"><button type="button" class="action" data-action="card">${cardCreated?'Replay':'Organize these sources'} <span aria-hidden="true">${cardCreated?'↺':'↗'}</span></button>${cardCreated?'<button type="button" class="text-button" data-detail="card">View evidence & limits ↗</button>':''}</div><p class="tiny-note">A prewritten example of research organization.</p></div>`;
  }
  function knowledgeView(){
    const a=getAnswer(question);
    const short={findings:['What did the pilot show?','Promising drafts.<br>Human review required.','Routine cases looked useful. Exceptions needed correction.'],rollout:['What should happen next?','Test first.<br>Review before expanding.','Use a baseline, log corrections and keep replies human-reviewed.'],retention:['Did retention improve?','A good question.<br>Missing evidence.','The sample sources did not measure retention.']}[question];
    return `<div class="canvas"><div class="canvas-head"><h2>Follow the answer to its source.</h2><span>QUESTION → EVIDENCE</span></div><div class="query-row" aria-label="Example questions">${[['findings','Pilot findings'],['rollout','Next step'],['retention','Retention impact']].map(([id,label])=>`<button type="button" class="query-chip ${id===question?'selected':''}" data-question="${id}" aria-pressed="${id===question}">${label}</button>`).join('')}</div><div class="flow knowledge-flow">${wires(a.supported)}<div class="question-node"><span class="node-sub">YOU ASK</span><div class="quote" aria-hidden="true">“</div><h3>${short[0]}</h3></div>${hub(true)}<section class="result-card answer-card arrive ${a.supported?'':'gap-card'}" aria-label="Sample answer"><div class="result-label"><span>${a.supported?'GROUNDED IN SAMPLE SOURCES':'EVIDENCE GAP'}</span><span aria-hidden="true">${a.supported?'✧':'?'}</span></div><h3>${short[1]}</h3><p>${short[2]}</p><div class="citations">${a.sources.map(id=>citation(id,id==='pilot'?'01 Pilot':'02 Review')).join('')}<button type="button" class="answer-detail" data-detail="answer">${a.supported?'Read more':'What’s missing?'} ↗</button></div></section></div></div>`;
  }
  function workflowView(){
    releaseDownload();if(workflow.approved)downloadUrl=URL.createObjectURL(new Blob([makeBrief(workflow)],{type:'text/plain;charset=utf-8'}));
    return `<div class="canvas"><div class="canvas-head"><h2>Make the next step actionable.</h2><span>REQUEST → REVIEW → BRIEF</span></div><div class="workflow-layout"><div class="workflow-track" aria-label="Workflow progress"><div class="step-node ${workflow.drafted?'done':'active'}"><span class="step-number">${workflow.drafted?'✓':'01'}</span><div><strong>Frame the task</strong><small>Plan a support-assistant test</small></div></div><div class="step-node ${workflow.sources&&workflow.limits?'done':workflow.drafted?'active':''}"><span class="step-number">${workflow.sources&&workflow.limits?'✓':'02'}</span><div><strong>Check the evidence</strong><small>Sources and limitations</small></div></div><div class="step-node ${workflow.approved?'done':workflow.sources&&workflow.limits?'active':''}"><span class="step-number">${workflow.approved?'✓':'03'}</span><div><strong>Create a brief</strong><small>A reviewed next step</small></div></div></div><div class="output-wrap"><section class="result-card brief-card ${workflow.drafted?'arrive':'result-ghost'}" aria-label="Sample brief"><div class="result-label"><span>${workflow.approved?'REVIEWED SAMPLE':'WORKFLOW BRIEF'}</span><span aria-hidden="true">${workflow.approved?'✓':'↳'}</span></div><h3>A focused follow-up test.</h3>${workflow.drafted?`<ul class="brief-lines"><li>Define routine categories</li><li>Compare against a baseline</li><li>Keep human review</li></ul><div class="review-items"><div class="review-row"><label><input type="checkbox" data-review="sources" ${workflow.sources?'checked':''}>Sources reviewed</label><button type="button" class="review-link" data-detail="sources" aria-label="Read sources">Read</button></div><div class="review-row"><label><input type="checkbox" data-review="limits" ${workflow.limits?'checked':''}>Limits understood</label><button type="button" class="review-link" data-detail="limits" aria-label="Read limitations">Read</button></div></div>${workflow.approved?`<a class="download-link" href="${downloadUrl}" download="jimmyai-sample-brief.txt">Download sample brief <span aria-hidden="true">↓</span></a>`:`<button type="button" class="action" data-action="approve" ${!workflow.sources||!workflow.limits?'disabled':''}>Generate brief <span aria-hidden="true">↗</span></button>`}`:`<div class="placeholder-lines" aria-hidden="true"><i></i><i></i><i></i></div><div class="result-tags"><span>Scope</span><span>Evidence</span><span>Next steps</span></div>`}</section></div></div>${!workflow.drafted?'<div class="canvas-actions"><button type="button" class="action" data-action="draft">Build a sample plan <span aria-hidden="true">↗</span></button></div>':''}<p class="tiny-note">${workflow.approved?'Sample brief ready. Nothing has been sent or executed.':'A simulated workflow. You review before generating.'}</p></div>`;
  }
  function render(){
    if(scene!=='workflow')releaseDownload();
    document.querySelectorAll('[data-scene]').forEach(b=>{const active=b.dataset.scene===scene;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    content.innerHTML=scene==='research'?researchView():scene==='knowledge'?knowledgeView():workflowView();
  }
  function focusSame(selector){content.querySelector(selector)?.focus({preventScroll:true});}
  function detail(type){
    if(type==='card')showDetail('What supports this card?','2 FICTIONAL SOURCES · AI DRAFT',getCard('pilot').finding+' '+getCard('review').finding+' Limit: '+getCard('pilot').limitations,'EVIDENCE & LIMITS');
    if(type==='answer'){const a=getAnswer(question);showDetail(a.title,'PREWRITTEN SAMPLE RESPONSE',a.text+' '+a.interpretation,'ANSWER DETAIL');}
    if(type==='sources')showDetail('Two notes. One proposed test.','FICTIONAL SAMPLE SOURCES',sources.pilot.excerpt+'\n\n'+sources.review.excerpt);
    if(type==='limits')showDetail('A proposal, not a proven outcome.','REVIEW BEFORE PROCEEDING',getCard('pilot').limitations+' '+getCard('review').limitations,'EVIDENCE LIMITS');
  }
  document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{scene=b.dataset.scene;render();announce(`${b.innerText} scene selected.`);}));
  document.getElementById('reset').addEventListener('click',()=>{scene='research';cardCreated=false;question='findings';workflow=initialWorkflow();render();announce('Demo reset. Organize scene selected.');});
  document.getElementById('about-demo').addEventListener('click',()=>showDetail('Explore an idea, interactively.','JIMMYAI · PORTFOLIO DEMONSTRATION','Three curated scenes show how research can become reusable knowledge, answers can retain their sources, and a request can become a reviewable plan. All documents and outputs are fictional and prewritten. This page does not call an AI service, access private knowledge or execute real tasks.','ABOUT THIS DEMO'));
  document.getElementById('close-source').addEventListener('click',()=>dialog.close());
  content.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.source){openSource(b.dataset.source);return;}
    if(b.dataset.detail){detail(b.dataset.detail);return;}
    if(b.dataset.question){question=b.dataset.question;render();focusSame(`[data-question="${question}"]`);announce(getAnswer(question).title);return;}
    if(b.dataset.action==='card'){cardCreated=true;render();focusSame('[data-action="card"]');announce('Sample knowledge card organized. View evidence and limits for details.');}
    if(b.dataset.action==='draft'){workflow=transition(workflow,{type:'draft'});render();focusSame('[data-review="sources"]');announce('Sample plan ready. Review the sources and limitations.');}
    if(b.dataset.action==='approve'){workflow=transition(workflow,{type:'approve'});render();focusSame('.download-link');announce('Reviewed sample brief ready to download.');}
  });
  content.addEventListener('change',e=>{const key=e.target.dataset.review;if(!key)return;workflow=transition(workflow,{type:'review',key,checked:e.target.checked});render();focusSame(`[data-review="${key}"]`);announce(workflow.sources&&workflow.limits?'Both items reviewed. Generate your sample brief.':'Review both items to continue.');});
  window.addEventListener('pagehide',releaseDownload);
  window.addEventListener('pageshow',event=>{if(event.persisted)render();});
  render();
}
