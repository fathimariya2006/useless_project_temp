// ============================================================
// 🌴 Coconut Fall Prediction System — script.js
// 100% vanilla JavaScript. Audio, Particles & Dynamic Physics logic.
// ============================================================

// ---------- HTML Element References ----------
const predictBtn     = document.getElementById('predictBtn');
const treeHeightEl   = document.getElementById('treeHeight');
const coconutCountEl = document.getElementById('coconutCount');
const windLevelEl    = document.getElementById('windLevel');
const analyzingEl    = document.getElementById('analyzing');

const coconutEl      = document.getElementById('coconut');
const skyEl          = document.getElementById('sky');
const palmTreeEl     = document.getElementById('palmTree');

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

// ---------- Data Pools ----------
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

let coconutsAnalyzed = 0;

function pickFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// ============================================================
// WEB AUDIO SYNTHESIZER
// ============================================================
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playShakeSound() {
    try {
        const ctx = getAudioContext();
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(3, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
    } catch (e) {
        // Fallback for restricted audio permissions
    }
}

function playFallSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.45);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
}

function playThudSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
}

// ============================================================
// DYNAMIC SKY BACKGROUND EFFECTS & PARTICLES
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
spawnParticles(25);

// Adjust background lighting color based on wind levels
windLevelEl.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'low') {
        skyEl.style.background = 'radial-gradient(circle at 50% 10%, #151d3b 0%, #070b19 100%)';
    } else if (val === 'medium') {
        skyEl.style.background = 'radial-gradient(circle at 50% 10%, #1c2b4d 0%, #070b19 100%)';
    } else if (val === 'high') {
        skyEl.style.background = 'radial-gradient(circle at 50% 10%, #3d142b 0%, #070b19 100%)';
    }
});

// ============================================================
// PREDICTION ENGINE & ANIMATION SYNC
// ============================================================
predictBtn.addEventListener('click', () => {
    const height = parseFloat(treeHeightEl.value);
    const count  = parseFloat(coconutCountEl.value);
    const wind   = windLevelEl.value;

    if (isNaN(height) || isNaN(count) || height < 0 || count < 0) {
        alert('🌴 Please enter valid numbers. The tree does not negotiate.');
        return;
    }
    if (count === 0) {
        alert('🥴 A tree with zero coconuts cannot fall. The algorithm refuses.');
        return;
    }

    // Set UI to loading state
    setAnalyzing(true);
    resultsEl.classList.add('hidden');
    finalMessageEl.classList.add('hidden');

    predictBtn.disabled = true;
    predictBtn.textContent = '🔥 Crunching coconut data…';

    setTimeout(() => {
        // Pseudo-scientific calculations
        let probability = Math.random() * 50 + 40;
        if (wind === 'high')   probability += 12;
        if (wind === 'medium') probability += 5;
        probability += Math.min(10, height * 0.4);
        probability = Math.min(99, Math.max(1, Math.round(probability)));

        const confidence  = (96 + Math.random() * 3.99).toFixed(2);
        const uselessness = Math.round(100 - parseFloat(confidence));
        const fallTime    = pickFrom(fallTimes);
        const mood        = pickFrom(treeMoods);
        const explanation = pickFrom(explanations);

        coconutsAnalyzed += count;

        // Render calculated values to DOM
        probabilityEl.textContent = probability + '%';
        fallTimeEl.textContent    = fallTime;
        confidenceEl.textContent  = confidence + '%';
        treeMoodEl.textContent    = mood;
        explanationEl.textContent = '📣 ' + explanation;

        analyzedEl.textContent      = coconutsAnalyzed;
        reportProbEl.textContent    = probability + '%';
        reportConfEl.textContent    = confidence + '%';
        reportUselessEl.textContent = uselessness + '%';

        requestAnimationFrame(() => {
            uselessBarEl.style.width = uselessness + '%';
        });

        // Trigger Animations & Synchronized Audio
        coconutEl.classList.remove('shake', 'fall');
        void coconutEl.offsetWidth; // Force CSS repaint
        
        coconutEl.classList.add('shake');
        playShakeSound();

        setTimeout(() => {
            coconutEl.classList.remove('shake');
            coconutEl.classList.add('fall');
            playFallSound();

            setTimeout(() => {
                playThudSound();
            }, 850);
        }, 650);

        setTimeout(() => coconutEl.classList.remove('fall'), 1800);

        // Display results
        resultsEl.classList.remove('hidden');
        finalMessageEl.classList.remove('hidden');

        setAnalyzing(false);
        predictBtn.disabled = false;
        predictBtn.textContent = '🥥 Predict Coconut Fall';
    }, 2200);
});

function setAnalyzing(on) {
    analyzingEl.classList.toggle('hidden', !on);
}

// DevTools Easter Egg
console.log(
    '%c🥥 COCONUT SCIENCE ONLINE %c\nPrediction accuracy: 0%% — Confidence remaining: infinite.',
    'color:#ffb703;font-size:18px;font-weight:bold',
    'color:#00f5d4;font-size:13px'
);