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
  const content = document.getElementById('scene-content');
  const dialog = document.getElementById('source-dialog');
  const announcement = document.getElementById('announcement');
  let scene = 'research', sourceId = 'pilot', cardCreated = false, question = 'findings';
  let workflow = initialWorkflow(), downloadUrl = null;
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const announce = text => { announcement.textContent = text; };
  const sourceButton = id => `<button type="button" class="source-button" data-source="${id}"><span aria-hidden="true">↗</span> ${id === 'pilot' ? '01 · Pilot note' : '02 · Review memo'}</button>`;
  function releaseDownload() { if (downloadUrl) { URL.revokeObjectURL(downloadUrl); downloadUrl=null; } }
  function researchView() {
    const source = sources[sourceId], card = getCard(sourceId);
    const output = cardCreated ? `<section class="panel card-output" aria-label="Structured knowledge card"><div class="panel-label"><span>KNOWLEDGE CARD</span><span class="sample-label">AI draft · sample</span></div><h4 class="card-title">${escape(card.title)}</h4>${[['WHY',card.why],['WHAT / HOW',card.what+' '+card.how],['FINDING',card.finding],['LIMITATIONS',card.limitations]].map(([label,text])=>`<div class="card-field"><span>${label}</span><p>${escape(text)}</p></div>`).join('')}<div class="card-tags">${card.tags.map(tag=>`<span>${tag}</span>`).join('')}</div><div class="source-links">${sourceButton(sourceId)}</div></section>` : `<div class="panel empty-card"><div class="empty-icon" aria-hidden="true">⌘</div><h4>A source, ready to reuse.</h4><p>Create a sample card to see the question,<br>finding and limitations kept together.</p></div>`;
    return `<div class="scene-heading"><h3>Research to knowledge</h3><p>Choose a source, then turn it into a structured card. The original material stays one click away.</p></div><div class="choice-row" aria-label="Sample documents"><button type="button" class="choice ${sourceId==='pilot'?'selected':''}" data-document="pilot" aria-pressed="${sourceId==='pilot'}">01 · Pilot note</button><button type="button" class="choice ${sourceId==='review'?'selected':''}" data-document="review" aria-pressed="${sourceId==='review'}">02 · Review memo</button></div><div class="research-grid"><section class="panel" aria-label="Sample source"><div class="panel-label"><span>SOURCE MATERIAL</span><span class="sample-label">Fictional</span></div><h4>${escape(source.title)}</h4><p>${escape(source.excerpt)}</p><p class="source-note">${source.type}</p><button type="button" class="primary" data-action="card">${cardCreated?'Rebuild sample card':'Create knowledge card'} <span aria-hidden="true">↗</span></button></section>${output}</div>`;
  }
  function knowledgeView() {
    const answer = getAnswer(question);
    return `<div class="scene-heading"><h3>Answers with evidence</h3><p>Choose a question about the same sample materials. Inspect the sources, or try a question the evidence cannot answer.</p></div><div class="choice-row" aria-label="Sample questions">${[['findings','What did the pilot show?'],['rollout','What should happen next?'],['retention','Did it improve retention?']].map(([id,label])=>`<button type="button" class="choice ${question===id?'selected':''}" data-question="${id}" aria-pressed="${question===id}">${label}</button>`).join('')}</div><section class="panel answer-panel ${answer.supported?'':'gap-panel'}" aria-label="Sample answer"><span class="sample-label">${answer.supported?'Based on sample sources':'Evidence gap'}</span><h4>${escape(answer.title)}</h4><p>${escape(answer.text)}</p><p class="interpretation">${escape(answer.interpretation)}</p>${answer.sources.length?`<div class="source-links">${answer.sources.map(sourceButton).join('')}</div>`:''}</section><p class="knowledge-help">These responses are prewritten to demonstrate source-aware answering. No model is generating an answer here.</p>`;
  }
  function workflowView() {
    releaseDownload();
    if (workflow.approved) downloadUrl = URL.createObjectURL(new Blob([makeBrief(workflow)], {type:'text/plain;charset=utf-8'}));
    return `<div class="scene-heading"><h3>Question to workflow</h3><p>Move from a request to a proposed plan. Review its basis before creating a sample deliverable.</p></div><div class="brief-request"><span>REQUEST</span><p>“Help me prepare a follow-up test of the support assistant.”</p></div><ol class="workflow-steps"><li class="current">01 · Draft a plan</li><li class="${workflow.drafted?'current':''}">02 · Review the evidence</li><li class="${workflow.approved?'current':''}">03 · Generate a brief</li></ol><section class="panel" aria-label="Reviewable workflow">${workflow.drafted?`<div class="panel-label"><span>PROPOSED DELIVERABLES</span><span class="sample-label">Sample plan</span></div><ul class="task-list"><li><span>01</span>Define routine categories and the exception path.</li><li><span>02</span>Set a baseline for reply quality and handling time.</li><li><span>03</span>Keep human review and record corrections.</li><li><span>04</span>Review the findings before an expansion decision.</li></ul><div class="source-links">${sourceButton('pilot')}${sourceButton('review')}</div><label class="review-label"><input type="checkbox" data-review="sources" ${workflow.sources?'checked':''}>I have reviewed the two fictional source notes.</label><label class="review-label"><input type="checkbox" data-review="limits" ${workflow.limits?'checked':''}>I understand that these sources do not establish a causal effect or a retention result.</label><div class="workflow-actions"><button type="button" class="primary" data-action="approve" ${!workflow.sources||!workflow.limits||workflow.approved?'disabled':''}>${workflow.approved?'Review completed':'Finish review & generate brief'} <span aria-hidden="true">↗</span></button>${workflow.approved?`<a class="download-link" href="${downloadUrl}" download="jimmyai-sample-brief.txt">Download sample brief <span aria-hidden="true">↓</span></a>`:''}</div><p class="workflow-hint ${workflow.approved?'approved-note':''}">${workflow.approved?'Your sample brief is ready. This approval exists only within the demo.':'Review both items to continue. Nothing is sent or executed.'}</p>`:`<div class="empty-card"><div class="empty-icon" aria-hidden="true">↳</div><h4>Make the next step explicit.</h4><p>See how one open request becomes<br>a small set of reviewable tasks.</p></div><button type="button" class="primary" data-action="draft">Build sample workflow <span aria-hidden="true">↗</span></button>`}</section>`;
  }
  function render() {
    if (scene !== 'workflow') releaseDownload();
    document.getElementById('breadcrumb').textContent = `Workspace / ${{research:'Research',knowledge:'Knowledge',workflow:'Workflow'}[scene]}`;
    document.querySelectorAll('[data-scene]').forEach(button=>{const active=button.dataset.scene===scene;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    content.innerHTML = scene==='research'?researchView():scene==='knowledge'?knowledgeView():workflowView();
  }
  function focusSame(selector) { content.querySelector(selector)?.focus({preventScroll:true}); }
  function openSource(id) {
    const source=sources[id]; if (!source) return;
    document.getElementById('source-title').textContent=source.title;
    document.getElementById('source-meta').textContent=source.type;
    document.getElementById('source-excerpt').textContent=source.excerpt;
    dialog.showModal();
  }
  document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{scene=button.dataset.scene;render();announce(`${button.innerText.replace(/\s+/g,' ')} selected.`);}));
  document.getElementById('reset').addEventListener('click',()=>{scene='research';sourceId='pilot';cardCreated=false;question='findings';workflow=initialWorkflow();render();announce('All demo scenes reset. Research scene selected.');});
  document.getElementById('close-source').addEventListener('click',()=>dialog.close());
  content.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.source){openSource(button.dataset.source);return;}
    if(button.dataset.document){sourceId=button.dataset.document;cardCreated=false;render();focusSame(`[data-document="${sourceId}"]`);announce('Sample source changed. Create a card to explore it.');return;}
    if(button.dataset.question){question=button.dataset.question;render();focusSame(`[data-question="${question}"]`);announce(getAnswer(question).title);return;}
    const action=button.dataset.action;
    if(action==='card'){cardCreated=true;render();focusSame('[data-action="card"]');announce('Knowledge card created. Source, findings and limitations are ready to review.');}
    if(action==='draft'){workflow=transition(workflow,{type:'draft'});render();focusSame('[data-review="sources"]');announce('Four proposed tasks prepared. Review both items to continue.');}
    if(action==='approve'){workflow=transition(workflow,{type:'approve'});render();focusSame('.download-link');announce('Sample brief ready to download.');}
  });
  content.addEventListener('change',event=>{
    const key=event.target.dataset.review;if(!key)return;
    workflow=transition(workflow,{type:'review',key,checked:event.target.checked});render();focusSame(`[data-review="${key}"]`);announce(workflow.sources&&workflow.limits?'Both review items checked. You can generate the brief.':'Complete both review items to continue.');
  });
  window.addEventListener('pagehide',releaseDownload);
  window.addEventListener('pageshow',event=>{if(event.persisted)render();});
  render();
}
