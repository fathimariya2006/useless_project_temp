// ============================================================
// 🌴 Coconut Fall Prediction System — script.js
// 100% vanilla JavaScript. No backend, no database, no guilt.
// ============================================================

// ---------- Grab the HTML elements we need ----------
const predictBtn     = document.getElementById('predictBtn');
const treeHeightEl   = document.getElementById('treeHeight');
const coconutCountEl = document.getElementById('coconutCount');
const windLevelEl    = document.getElementById('windLevel');
const analyzingEl    = document.getElementById('analyzing');

const coconutEl      = document.getElementById('coconut');
const skyEl          = document.getElementById('sky');

const resultsEl      = document.getElementById('results');
const probabilityEl  = document.getElementById('probability');
const fallTimeEl     = document.getElementById('fallTime');
const confidenceEl   = document.getElementById('confidence');
const treeMoodEl     = document.getElementById('treeMood');
const explanationEl  = document.getElementById('explanation');

const analyzedEl     = document.getElementById('analyzed');
const reportProbEl   = document.getElementById('reportProb');
const reportConfEl   = document.getElementById('reportConf');
const reportUselessEl= document.getElementById('reportUseless');
const uselessBarEl   = document.getElementById('uselessBar');

const finalMessageEl = document.getElementById('finalMessage');

// ---------- Funny data pools ----------
const treeMoods = [
    'Chill 🌴',
    'Nervous 😬',
    'Confident 💪',
    'Suspicious 🕵️',
    'Overthinking 🤯',
    'Zen 🧘',
    'Dramatic 🎭',
    'King of the Beach 👑',
];

const fallTimes = [
    '2:47 PM (give or take a year)',
    'In exactly 4.5 seconds… or 4.5 months',
    'Next Tuesday at a very specific moment',
    'Right after you look away',
    'When nobody is watching. Ever.',
    'Between 3:00 PM and never',
    'During the presentation, probably',
];

const explanations = [
    'The coconut is feeling ambitious.',
    'Wind has been officially blamed.',
    'The tree looks suspicious. Very suspicious.',
    'Scientists are confused. But they are always confused.',
    'The coconut has plans of its own.',
    'Gravity has filed a formal complaint.',
    'The coconut consulted its horoscope. It said "maybe".',
    'A seagull whispered secrets into the coconut.',
    'The tree is tired of holding everything together.',
    'A mysterious force is involved. We call it "Tuesday".',
    'Mathematical models were involved. Nobody checked them.',
    'The coconut simply wanted attention.',
];

// ---------- Counter that grows with every prediction ----------
let coconutsAnalyzed = 0;

// Small helper: pick a random item from an array
function pickFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// ============================================================
// BACKGROUND PARTICLES (tiny floating specks, like ocean spray)
// ============================================================
function spawnParticles(count) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'particle';

        const size = Math.random() * 6 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = Math.random() * 14 + 10 + 's';
        p.style.animationDelay = Math.random() * 12 + 's';

        skyEl.appendChild(p);
    }
}
spawnParticles(22);

// ============================================================
// THE PREDICTION MACHINE
// ============================================================
predictBtn.addEventListener('click', () => {
    const height = parseFloat(treeHeightEl.value);
    const count  = parseFloat(coconutCountEl.value);
    const wind   = windLevelEl.value;

    // Gentle input validation (science demands order)
    if (isNaN(height) || isNaN(count) || height < 0 || count < 0) {
        alert('🌴 Please enter valid positive numbers. The tree does not negotiate.');
        return;
    }
    if (count === 0) {
        alert('🥴 A tree with zero coconuts cannot fall. The algorithm refuses.');
        return;
    }

    // 1) Enter "Analyzing..." mode
    setAnalyzing(true);
    resultsEl.classList.add('hidden');
    finalMessageEl.classList.add('hidden');

    // Prevent double-clicks while the supercomputer thinks
    predictBtn.disabled = true;
    predictBtn.textContent = '🔥 Crunching coconut data…';

    // 2) The "supercomputer" (setTimeout) works for a bit…
    setTimeout(() => {
        // ---- The "science" ----
        let probability = Math.random() * 50 + 40;          // base 40-90%
        if (wind === 'high')   probability += 12;           // wind is always guilty
        if (wind === 'medium') probability += 5;
        probability += Math.min(10, height * 0.4);          // taller = more ambition
        probability = Math.min(99, Math.max(1, Math.round(probability)));

        const confidence  = (96 + Math.random() * 3.99).toFixed(2);   // fake 96-99.99%
        const uselessness = Math.round(100 - parseFloat(confidence)); // perfectly useless
        const fallTime    = pickFrom(fallTimes);
        const mood        = pickFrom(treeMoods);
        const explanation = pickFrom(explanations);

        coconutsAnalyzed += count;

        // ---- Render results ----
        probabilityEl.textContent = probability + '%';
        fallTimeEl.textContent    = fallTime;
        confidenceEl.textContent  = confidence + '%';
        treeMoodEl.textContent    = mood;
        explanationEl.textContent = '📣 ' + explanation;

        // ---- Update the official report ----
        analyzedEl.textContent      = coconutsAnalyzed;
        reportProbEl.textContent    = probability + '%';
        reportConfEl.textContent    = confidence + '%';
        reportUselessEl.textContent = uselessness + '%';

        // Smoothly grow the uselessness bar (off-screen it counts as "not starting")
        requestAnimationFrame(() => {
            uselessBarEl.style.width = uselessness + '%';
        });

        // ---- Coconut animation: shake… then take the plunge ----
        coconutEl.classList.remove('shake', 'fall');
        void coconutEl.offsetWidth;              // restart CSS animation
        coconutEl.classList.add('shake');

        setTimeout(() => {
            coconutEl.classList.remove('shake');
            coconutEl.classList.add('fall');
        }, 650);

        // Re-arm the coconut after it lands so it can fall again next time
        setTimeout(() => coconutEl.classList.remove('fall'), 1800);

        // ---- Show the results & the final message ----
        resultsEl.classList.remove('hidden');
        finalMessageEl.classList.remove('hidden');

        // We can only become beautiful | has fallen | now.
        setAnalyzing(false);
        predictBtn.disabled = false;
        predictBtn.textContent = '🥥 Predict Coconut Fall';
    }, 2200); // the fake delay makes the prediction feel REAL
});

// Toggle the "Analyzing…" UI on/off
function setAnalyzing(on) {
    analyzingEl.classList.toggle('hidden', !on);
}

// Bonus: a tiny surprise for anyone who opens the DevTools console 🥸
console.log(
    '%c🥥 COCONUT SCIENCE ONLINE %c\nPrediction accuracy: 0%% — Confidence remaining: infinite.',
    'color:#f9a03f;font-size:18px;font-weight:bold',
    'color:#2ec4b6;font-size:13px'
);