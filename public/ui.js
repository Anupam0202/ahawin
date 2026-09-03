const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = {
  imageDataUrl: '',
  result: null,
  traceConfirmed: false,
  diagnosisPassed: false,
  teachbackPassed: false,
  transferPassed: false,
  toastTimer: null
};

function toast(message, error = false) {
  const node = $('#toast');
  node.textContent = message;
  node.className = `toast show${error ? ' error' : ''}`;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => { node.className = 'toast'; }, 3400);
}

function setAnalysisStatus(message = '') {
  const node = $('#analysisStatus');
  node.textContent = message;
  node.classList.toggle('hidden', !message);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('ahawin-theme', theme); } catch {}
  $('#themeToggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
}

async function checkHealth() {
  try {
    const response = await fetch('/api/health', { headers: { Accept: 'application/json' } });
    const health = await response.json();
    if (!response.ok) throw new Error('Health check failed');
    $('#apiChip').classList.toggle('live', health.geminiConfigured);
    $('#apiStatus').textContent = health.geminiConfigured ? 'Gemini ready' : 'Guided demo ready';
  } catch {
    $('#apiStatus').textContent = 'Open through local server';
  }
}

function setLoader(show) {
  $('#loader').classList.toggle('hidden', !show);
  document.body.classList.toggle('is-loading', show);
  if (!show) return;
  const title = $('#loaderTitle');
  const items = $$('#loader li');
  const phases = [
    ['Reading the reasoning…', 0],
    ['Finding the first divergence…', 1],
    ['Designing a falsifiable check…', 2]
  ];
  phases.forEach(([label, index], order) => setTimeout(() => {
    if ($('#loader').classList.contains('hidden')) return;
    title.textContent = label;
    items.forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === index));
  }, order * 430));
}

function syntheticForm() {
  $('#subject').value = 'Algebra';
  $('#problem').value = 'Solve 3(x − 2) = 12';
  $('#work').value = '3(x − 2) = 12\n3x − 2 = 12\n3x = 14\nx = 14/3';
  state.imageDataUrl = '';
  $('#imagePreview').src = '/sample-work.svg';
  $('#imagePreview').alt = 'Guided handwritten algebra sample';
  $('#previewWrap').classList.remove('hidden');
  $('#chooseImage').classList.add('hidden');
}

async function callAnalyze(body) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Analysis failed safely.');
  return payload;
}

async function runDemo() {
  syntheticForm();
  setAnalysisStatus();
  setLoader(true);
  try {
    const [result] = await Promise.all([
      callAnalyze({ demo: true, subject: 'Algebra', problem: $('#problem').value, work: $('#work').value }),
      new Promise(resolve => setTimeout(resolve, 1300))
    ]);
    state.result = result;
    renderResult();
  } catch (error) {
    setAnalysisStatus(error.message);
    setTimeout(() => $('#analysisStatus').focus(), 0);
  } finally {
    setLoader(false);
  }
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return reject(new Error('Choose a JPG, PNG, or WebP image.'));
    if (file.size > 12_000_000) return reject(new Error('Choose an image under 12 MB.'));
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const ratio = Math.min(1, 1600 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * ratio));
      canvas.height = Math.max(1, Math.round(image.height * ratio));
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.84));
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that image.')); };
    image.src = url;
  });
}

async function useImage(file) {
  if (!file) return;
  try {
    state.imageDataUrl = await resizeImage(file);
    $('#imagePreview').src = state.imageDataUrl;
    $('#imagePreview').alt = `Preview of ${file.name}`;
    $('#previewWrap').classList.remove('hidden');
    $('#chooseImage').classList.add('hidden');
    toast('Image ready. It will be processed in memory.');
  } catch (error) {
    toast(error.message, true);
  }
}

function removeImage() {
  state.imageDataUrl = '';
  $('#fileInput').value = '';
  $('#imagePreview').removeAttribute('src');
  $('#previewWrap').classList.add('hidden');
  $('#chooseImage').classList.remove('hidden');
}

function text(node, value) { node.textContent = String(value ?? ''); }
function traceIcon(status) {
  if (status === 'correct') return '✓';
  if (status === 'first_wrong') return '!';
  if (status === 'downstream') return '·';
  return '?';
}

function makeChoice(label, index, onChoose) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'choice';
  const badge = document.createElement('b');
  badge.textContent = String.fromCharCode(65 + index);
  const copy = document.createElement('span');
  copy.textContent = label;
  button.append(badge, copy);
  button.addEventListener('click', () => onChoose(button, index));
  return button;
}

function updateMastery() {
  const complete = 1 + Number(state.traceConfirmed) + Number(state.diagnosisPassed) + Number(state.transferPassed);
  $('#masteryBar').style.width = `${complete / 4 * 100}%`;
  if (state.transferPassed) text($('#masteryText'), 'Repair loop complete · retrieve it again later');
  else if (state.teachbackPassed) text($('#masteryText'), 'Teach-back passed · prove transfer');
  else if (state.diagnosisPassed) text($('#masteryText'), 'Contradiction caught · teach it back');
  else if (state.traceConfirmed) text($('#masteryText'), 'Trace confirmed · test the rule');
  else text($('#masteryText'), 'Confirm → test → teach → transfer');
}

function unlockTeachback() {
  state.diagnosisPassed = true;
  $('#teachCard').classList.remove('locked');
  $('#teachbackInput').disabled = false;
  $('#teachbackButton').disabled = false;
  text($('#teachPrompt'), state.result.teachback.prompt);
  updateMastery();
}

function renderCounterChoices() {
  const result = state.result;
  const list = $('#choiceList');
  list.replaceChildren();
  result.counterexample.choices.forEach((choice, index) => {
    const button = makeChoice(choice, index, (selectedButton, selected) => {
      $$('.choice', list).forEach(item => { item.disabled = true; });
      if (selected === result.counterexample.correctIndex) {
        selectedButton.classList.add('correct');
        $('#choiceFeedback').className = 'feedback success';
        text($('#choiceFeedback'), `Exactly. ${result.counterexample.explanation}`);
        unlockTeachback();
        setTimeout(() => $('#teachbackInput').focus(), 250);
      } else {
        selectedButton.classList.add('wrong');
        $('#choiceFeedback').className = 'feedback error';
        text($('#choiceFeedback'), 'Not quite. Compare what changed in the original check and Echo’s check, then try again.');
        setTimeout(() => {
          $$('.choice', list).forEach(item => { item.disabled = false; item.classList.remove('wrong'); });
        }, 700);
      }
    });
    button.disabled = !state.traceConfirmed;
    list.append(button);
  });
}

function renderTransferChoices() {
  const result = state.result;
  const list = $('#transferChoices');
  list.replaceChildren();
  result.teachback.transferChoices.forEach((choice, index) => list.append(makeChoice(choice, index, (button, selected) => {
    $$('.choice', list).forEach(item => { item.disabled = true; });
    if (selected === result.teachback.transferCorrectIndex) {
      button.classList.add('correct');
      state.transferPassed = true;
      $('#transferFeedback').className = 'feedback success';
      text($('#transferFeedback'), `Transfer confirmed. ${result.teachback.transferExplanation}`);
      updateMastery();
      toast('Aha loop complete—new problem, repaired rule.');
    } else {
      button.classList.add('wrong');
      $('#transferFeedback').className = 'feedback error';
      text($('#transferFeedback'), 'Use the rule you just taught Echo, then compare every term.');
      setTimeout(() => {
        $$('.choice', list).forEach(item => { item.disabled = false; item.classList.remove('wrong'); });
      }, 700);
    }
  })));
}

function diagnosisCopy(result) {
  if (result.diagnosis.state === 'no_divergence') return {
    title: 'No defensible wrong turn found.',
    evidenceLabel: 'CURRENT EVIDENCE',
    twinLabel: 'VERIFICATION TWIN'
  };
  if (result.diagnosis.state === 'needs_more_evidence') return {
    title: 'The evidence needs a human check.',
    evidenceLabel: 'WHAT NEEDS CONFIRMATION',
    twinLabel: 'EVIDENCE CHECK'
  };
  return {
    title: 'Meet the rule hiding inside the work.',
    evidenceLabel: 'EARLIEST DEFENSIBLE DIVERGENCE',
    twinLabel: 'MISCONCEPTION TWIN'
  };
}

function renderResult() {
  const result = state.result;
  state.traceConfirmed = false;
  state.diagnosisPassed = false;
  state.teachbackPassed = false;
  state.transferPassed = false;

  $('#teachCard').classList.add('locked');
  $('#teachbackInput').value = '';
  $('#teachbackInput').disabled = true;
  $('#teachbackButton').disabled = true;
  text($('#teachbackButton'), 'Check my explanation');
  $('#teachbackFeedback').className = 'feedback-card hidden';
  $('#transferBlock').classList.add('locked');
  $('#transferChoices').replaceChildren();
  text($('#transferQuestion'), 'Complete the teach-back to unlock.');
  text($('#transferFeedback'), '');
  text($('#choiceFeedback'), '');
  $('#choiceFeedback').className = 'feedback';
  $('#twinCard').classList.add('locked-stage');
  $('#twinCard').setAttribute('aria-disabled', 'true');
  $('#twinLock').classList.remove('hidden');
  $('#traceReview').classList.remove('confirmed');
  $('#confirmTrace').disabled = false;
  text($('#confirmTrace'), 'Yes, continue');

  const live = result.meta?.poweredByGemini;
  $('#modeBanner').classList.toggle('live', live);
  text($('#modePill'), live ? 'LIVE GEMINI' : 'GUIDED DEMO');
  text($('#modeWarning'), result.meta?.warning || `Analyzed live with ${result.meta?.model}. Confirm the transcription before using the diagnosis.`);

  const copy = diagnosisCopy(result);
  text($('#resultTitle'), copy.title);
  text($('#evidenceLabel'), copy.evidenceLabel);
  text($('.twin-card .panel-label'), '');
  const labelStep = document.createElement('span');
  labelStep.className = 'step-number small';
  labelStep.textContent = '2';
  $('.twin-card .panel-label').append(labelStep, document.createTextNode(copy.twinLabel));

  text($('#resultSubject'), result.problem.subject);
  text($('#resultProblem'), result.problem.prompt);
  text($('#diagnosisLabel'), result.diagnosis.label);
  text($('#diagnosisSummary'), result.diagnosis.summary);
  text($('#diagnosisUncertainty'), `${result.diagnosis.confidence}% hypothesis confidence · ${result.diagnosis.uncertainty}`);
  text($('#traceConfidence'), `${result.transcription.confidence}% read confidence`);
  text($('#traceNote'), result.transcription.note || 'Confirm the transcription before Echo uses it.');
  text($('#skillName'), result.diagnosis.skill);
  text($('#twinRule'), result.twin.workingRule);
  text($('#twinSays'), result.twin.says);
  text($('#counterTitle'), result.counterexample.title);
  text($('#counterSetup'), result.counterexample.setup);
  text($('#originalCheck'), result.counterexample.originalCheck);
  text($('#twinCheck'), result.counterexample.twinCheck);
  text($('#counterPrompt'), result.counterexample.prompt);

  const trace = $('#traceList');
  trace.replaceChildren();
  result.transcription.steps.forEach(step => {
    const item = document.createElement('li');
    item.className = `trace-step ${step.status}`;
    const label = document.createElement('small');
    label.textContent = step.label;
    const expression = document.createElement('b');
    expression.textContent = step.expression;
    const icon = document.createElement('span');
    icon.className = 'trace-icon';
    icon.textContent = traceIcon(step.status);
    const reason = document.createElement('p');
    reason.textContent = step.reason;
    item.append(label, expression, icon, reason);
    trace.append(item);
  });

  renderCounterChoices();
  updateMastery();
  $('#resultView').classList.remove('hidden');
  $('#resultView').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => $('#confirmTrace').focus(), 450);
}

function confirmTrace() {
  if (!state.result || state.traceConfirmed) return;
  state.traceConfirmed = true;
  $('#twinCard').classList.remove('locked-stage');
  $('#twinCard').setAttribute('aria-disabled', 'false');
  $('#twinLock').classList.add('hidden');
  $('#traceReview').classList.add('confirmed');
  $('#confirmTrace').disabled = true;
  text($('#confirmTrace'), 'Trace confirmed ✓');
  $$('.choice', $('#choiceList')).forEach(item => { item.disabled = false; });
  updateMastery();
  toast('Trace confirmed. Now make Echo’s rule face a check.');
  setTimeout(() => $('.choice', $('#choiceList'))?.focus(), 200);
}

function editInput() {
  $('#resultView').classList.add('hidden');
  $('#workbench').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => $('#work').focus(), 300);
  toast('Edit the evidence, then run the analysis again.');
}

async function submitAnalysis(event) {
  event.preventDefault();
  const body = {
    subject: $('#subject').value,
    problem: $('#problem').value,
    work: $('#work').value,
    imageDataUrl: state.imageDataUrl || null
  };
  if (!body.problem.trim() && !body.work.trim() && !body.imageDataUrl) {
    setAnalysisStatus('Add the problem, the learner’s steps, or an image.');
    $('#analysisStatus').focus();
    return;
  }
  setAnalysisStatus();
  setLoader(true);
  $('#analyzeButton').disabled = true;
  try {
    const [result] = await Promise.all([callAnalyze(body), new Promise(resolve => setTimeout(resolve, 1100))]);
    state.result = result;
    renderResult();
  } catch (error) {
    setAnalysisStatus(error.message);
    setTimeout(() => $('#analysisStatus').focus(), 0);
  } finally {
    setLoader(false);
    $('#analyzeButton').disabled = false;
  }
}

async function submitTeachback(event) {
  event.preventDefault();
  const answer = $('#teachbackInput').value.trim();
  if (!answer) return toast('Explain the corrected rule in your own words.', true);
  $('#teachbackButton').disabled = true;
  try {
    const evaluation = await callAnalyze({ action: 'teachback', text: answer, rubric: state.result.teachback });
    const feedback = $('#teachbackFeedback');
    feedback.classList.remove('hidden', 'retry');
    if (evaluation.passed) {
      state.teachbackPassed = true;
      text($('#teachbackButton'), 'Explanation checked ✓');
      text(feedback, `${evaluation.headline} ${evaluation.feedback}`);
      $('#transferBlock').classList.remove('locked');
      text($('#transferQuestion'), state.result.teachback.transferQuestion);
      renderTransferChoices();
      updateMastery();
    } else {
      feedback.classList.add('retry');
      text(feedback, `${evaluation.headline} ${evaluation.feedback}`);
      $('#teachbackButton').disabled = false;
    }
  } catch (error) {
    toast(error.message, true);
    $('#teachbackButton').disabled = false;
  }
}

async function copyRepairCard() {
  if (!state.result) return;
  const result = state.result;
  const card = [
    'AHAWIN REPAIR CARD',
    result.problem.prompt,
    `Possible misconception: ${result.diagnosis.label}`,
    `Evidence: ${result.diagnosis.evidence}`,
    `Counterexample: ${result.counterexample.originalCheck} vs ${result.counterexample.twinCheck}`,
    `Teach-back target: ${result.teachback.modelSentence}`,
    `Transfer: ${state.transferPassed ? 'confirmed in this session' : 'not yet confirmed'}`,
    'Status: hypothesis from submitted work; confirm with the learner.'
  ].join('\n');
  try {
    await navigator.clipboard.writeText(card);
    toast('Repair card copied.');
  } catch {
    toast('Clipboard unavailable in this browser.', true);
  }
}

function reset() {
  state.result = null;
  $('#resultView').classList.add('hidden');
  $('#analysisForm').reset();
  removeImage();
  $('#workbench').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => $('#problem').focus(), 250);
}

function bind() {
  $('#themeToggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  $('#heroDemo').addEventListener('click', runDemo);
  $('#formDemo').addEventListener('click', runDemo);
  $('#analysisForm').addEventListener('submit', submitAnalysis);
  $('#teachbackForm').addEventListener('submit', submitTeachback);
  $('#chooseImage').addEventListener('click', () => $('#fileInput').click());
  $('#fileInput').addEventListener('change', event => useImage(event.target.files?.[0]));
  $('#removeImage').addEventListener('click', removeImage);
  $('#copyCard').addEventListener('click', copyRepairCard);
  $('#startOver').addEventListener('click', reset);
  $('#confirmTrace').addEventListener('click', confirmTrace);
  $('#editTrace').addEventListener('click', editInput);
  const zone = $('#dropZone');
  zone.addEventListener('dragover', event => { event.preventDefault(); zone.classList.add('dragging'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragging'));
  zone.addEventListener('drop', event => {
    event.preventDefault();
    zone.classList.remove('dragging');
    useImage(event.dataTransfer.files?.[0]);
  });
}

function init() {
  let stored = '';
  try { stored = localStorage.getItem('ahawin-theme') || ''; } catch {}
  const dark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(stored || (dark ? 'dark' : 'light'));
  bind();
  checkHealth();
  if (new URLSearchParams(location.search).get('demo') === '1') setTimeout(runDemo, 350);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') init();
