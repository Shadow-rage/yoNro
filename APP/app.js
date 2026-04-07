// yoNro Application Logic - Advanced Mobile Enhancements

const state = {
    currentScreen: 'splash',
    onboardingStep: 0,
    goals: [],
    currentState: '',
    desiredState: 'Calm State', // Now used for Theme driving
    chatHistory: [
        { sender: 'ai', text: 'Hello. Your heart rate variability indicates a slight increase in stress. How are you feeling?' }
    ],
    environment: { lighting: 60, sound: 40, aroma: 50, temp: 72 }, // Sliders
    metrics: { score: 78, hrv: 32, hr: 70, sleep: 85, focus: 78 }
};

// Theme engine
const themes = {
    'Calm State': { color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' }, // Cyan/Green
    'Deep Focus': { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' }, // Amber
    'Sleep Cycle': { color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' }, // Purple
    'Stressed State': { color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' } // Red
};

function applyMoodTheme(mood) {
    const theme = themes[mood] || themes['Calm State'];
    document.documentElement.style.setProperty('--theme-accent', theme.color);
    document.documentElement.style.setProperty('--theme-glow', theme.glow);
}

// Init
const screens = { splash: document.getElementById('screen-splash'), onboarding: document.getElementById('screen-onboarding'), main: document.getElementById('screen-main') };
const onboardingContent = document.getElementById('onboarding-content');
const mainContent = document.getElementById('main-content');
const bottomNavBtns = document.querySelectorAll('.nav-item');

document.addEventListener('DOMContentLoaded', () => {
    applyMoodTheme(state.desiredState); // Initial Theme
    
    setTimeout(() => {
        // Check if user data exists, if not show registration form
        const userData = localStorage.getItem('yonro_user');
        if (!userData) {
            navigateTo('onboarding');
            renderRegistrationForm();
        } else {
            navigateTo('onboarding');
            renderOnboardingStep();
        }
    }, 2500);

    bottomNavBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            bottomNavBtns.forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            renderMainTab(target.getAttribute('data-tab'));
        });
    });
});

function navigateTo(screenName) {
    Object.values(screens).forEach(screen => {
        if(screen) screen.classList.remove('screen-active');
        setTimeout(() => { if(screen && !screen.classList.contains('screen-active')) screen.classList.add('hidden'); }, 500);
    });
    const target = screens[screenName];
    if(target) { target.classList.remove('hidden'); requestAnimationFrame(() => target.classList.add('screen-active')); }
    state.currentScreen = screenName;
}

// --- REGISTRATION FORM ---
function renderRegistrationForm() {
    onboardingContent.innerHTML = `
        <div class="onboarding-container">
            <div class="onboarding-header" style="text-align: center; margin-bottom: 32px;">
                <h2>Create Your Profile</h2>
                <p>Let's personalize your yoNro experience</p>
            </div>
            
            <form id="registration-form" style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
                <div class="form-group">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Full Name</label>
                    <input type="text" id="user-name" required 
                        style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; color: var(--text-primary); font-size: 0.95rem; outline: none; transition: border 0.3s;"
                        placeholder="Enter your name"
                        onfocus="this.style.borderColor='var(--theme-accent)'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                </div>
                
                <div class="form-group">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Email Address</label>
                    <input type="email" id="user-email" required 
                        style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; color: var(--text-primary); font-size: 0.95rem; outline: none; transition: border 0.3s;"
                        placeholder="your@email.com"
                        onfocus="this.style.borderColor='var(--theme-accent)'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                </div>
                
                <div class="form-group">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Age</label>
                    <input type="number" id="user-age" required min="13" max="120"
                        style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; color: var(--text-primary); font-size: 0.95rem; outline: none; transition: border 0.3s;"
                        placeholder="Enter your age"
                        onfocus="this.style.borderColor='var(--theme-accent)'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                </div>
                
                <div class="form-group">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Phone Number (Optional)</label>
                    <input type="tel" id="user-phone"
                        style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; color: var(--text-primary); font-size: 0.95rem; outline: none; transition: border 0.3s;"
                        placeholder="+1 (555) 000-0000"
                        onfocus="this.style.borderColor='var(--theme-accent)'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                </div>
                
                <div style="margin-top: auto; padding-top: 24px;">
                    <button type="submit" class="btn btn-primary">
                        Continue <i class="ph ph-arrow-right"></i>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Handle form submission
    document.getElementById('registration-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            age: document.getElementById('user-age').value,
            phone: document.getElementById('user-phone').value || 'Not provided',
            registeredDate: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('yonro_user', JSON.stringify(userData));
        
        // Proceed to onboarding
        state.onboardingStep = 0;
        renderOnboardingStep();
    });
}

// --- ONBOARDING FLOW ---
const onboardingFlow = [
    {
        id: 'welcome',
        render: () => `
            <div class="onboarding-container">
                <div class="onboarding-header" style="text-align: center; margin-top:20px;">
                    <h2>Welcome to yoNro</h2>
                    <p>Real-time emotional tracking</p>
                </div>
                <div style="flex:1; display:flex; justify-content:center; align-items:center;">
                    <div class="glow-orb" style="position:static; width: 200px; height: 200px; animation-duration: 4s;"></div>
                </div>
                <button class="btn btn-primary" onclick="nextOnboardingStep()">Get Started <i class="ph ph-arrow-right"></i></button>
            </div>
        `
    },
    {
        id: 'goals',
        render: () => `
            <div class="onboarding-container">
                <div class="onboarding-header">
                    <h2>What do you want help with?</h2>
                    <p>Select your primary focus area.</p>
                </div>
                <div class="grid-cards">
                    ${['Stress', 'Sleep', 'Focus', 'Anxiety', 'Energy'].map(g => 
                        `<div class="selection-card ${state.goals.includes(g) ? 'selected' : ''}" onclick="toggleGoal('${g}')">
                            <span>${g}</span>
                        </div>`
                    ).join('')}
                </div>
                <div style="margin-top: auto; padding-top: 24px;">
                    <button class="btn btn-primary" onclick="nextOnboardingStep()">Continue</button>
                </div>
            </div>
        `
    },
    {
        id: 'current_state',
        render: () => `
            <div class="onboarding-container">
                <div class="onboarding-header">
                    <h2>How do you feel right now?</h2>
                    <p>Be honest, Neuro is here to help.</p>
                </div>
                <div class="grid-cards">
                    ${['Calm', 'Stressed', 'Tired', 'Focused', 'Overwhelmed'].map(s => 
                        `<div class="selection-card ${state.currentState === s ? 'selected' : ''}" onclick="selectCurrentState('${s}')"><span>${s}</span></div>`
                    ).join('')}
                </div>
            </div>
        `
    },
    {
        id: 'desired_state',
        render: () => `
            <div class="onboarding-container">
                <div class="onboarding-header">
                    <h2>How do you want to feel?</h2>
                    <p>Choose your target state to calibrate.</p>
                </div>
                <div class="grid-cards" style="margin-bottom: 24px;">
                    ${['Deep Focus', 'Calm State', 'Sleep Cycle', 'Stressed State'].map(s => 
                        `<div class="selection-card ${state.desiredState === s ? 'selected' : ''}" onclick="selectDesiredState('${s}')"><span>${s}</span></div>`
                    ).join('')}
                </div>
                <div style="margin-top: auto; padding-top: 24px;">
                    <button class="btn btn-primary" onclick="nextOnboardingStep()">Continue</button>
                </div>
            </div>
        `
    },
    {
        id: 'transition',
        render: () => `
            <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
                <div class="wave-animation" style="margin-bottom: 24px;">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <h2>Synchronizing...</h2>
                <p style="color: var(--text-secondary); margin-top: 12px;">Reading bio-signals and calibrating ${state.desiredState}.</p>
            </div>
        `
    }
];

function renderOnboardingStep() {
    const step = onboardingFlow[state.onboardingStep];
    onboardingContent.innerHTML = step.render();
    if(step.id === 'transition') {
        setTimeout(() => { navigateTo('main'); renderMainTab('home'); }, 3000);
    }
}

window.nextOnboardingStep = function() {
    if(state.onboardingStep < onboardingFlow.length - 1) { state.onboardingStep++; renderOnboardingStep(); }
};

window.toggleGoal = function(goal) {
    if(state.goals.includes(goal)) state.goals = state.goals.filter(g => g !== goal);
    else state.goals.push(goal);
    renderOnboardingStep();
};
window.selectCurrentState = function(s) { state.currentState = s; window.nextOnboardingStep(); };
window.selectDesiredState = function(s) { state.desiredState = s; applyMoodTheme(s); window.nextOnboardingStep(); };

// --- MAIN TABS ---
window.renderMainTab = function(tab) {
    if(tab === 'home') mainContent.innerHTML = renderHome();
    else if(tab === 'neuro') mainContent.innerHTML = renderNeuroChat();
    else if(tab === 'controls') mainContent.innerHTML = renderControls();
    else if(tab === 'insights') mainContent.innerHTML = renderInsights();
    else if(tab === 'profile') mainContent.innerHTML = renderProfile();

    if(tab === 'neuro') {
        const chatContainer = document.querySelector('.chat-history');
        if(chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// --- 1. Dashboard (Matching screenshot "Live Status") ---
function renderHome() {
    return `
        <div class="dashboard-header">
            <h2>Live Status</h2><p>Real-time emotional tracking</p>
        </div>

        <div class="neuro-score-container">
            <div class="score-circle">
                <div class="score-value">${state.metrics.score}</div>
                <div class="score-label">Neuro Score</div>
                <div class="score-tag">${state.desiredState.split(' ')[0]}</div>
            </div>
            
            <div style="position:absolute; bottom:-10px; left:0;">
                <div style="font-size:0.6rem; color:var(--text-secondary); letter-spacing:1px; margin-bottom:4px;">STRESS (HRV)</div>
                <div style="font-size:1.2rem; color:#fff;">${state.metrics.hrv}%</div>
            </div>
            <div style="position:absolute; bottom:-10px; right:0; text-align:right;">
                <div style="font-size:0.6rem; color:var(--text-secondary); letter-spacing:1px; margin-bottom:4px;">HEART RATE</div>
                <div style="font-size:1.2rem; color:#fff;">${state.metrics.hr} <span style="font-size:0.7rem;color:var(--text-secondary);">BPM</span></div>
            </div>
        </div>

        <div style="display:flex; gap:16px; margin-bottom: 24px;">
            <div class="glass-panel" style="flex:1; padding: 16px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                    <i class="ph ph-moon" style="color:var(--text-secondary);"></i>
                    <span style="color:#10b981; font-size:0.75rem;">+2%</span>
                </div>
                <div style="color:var(--text-secondary); font-size:0.75rem; margin-bottom:4px;">Sleep Quality</div>
                <div style="font-size:1.5rem; color:#fff;">${state.metrics.sleep}%</div>
            </div>
            <div class="glass-panel" style="flex:1; padding: 16px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                    <i class="ph ph-brain" style="color:var(--text-secondary);"></i>
                    <span style="color:#f43f5e; font-size:0.75rem;">-5</span>
                </div>
                <div style="color:var(--text-secondary); font-size:0.75rem; margin-bottom:4px;">Focus Score</div>
                <div style="font-size:1.5rem; color:#fff;">${state.metrics.focus}</div>
            </div>
        </div>

        <div style="margin-bottom: 12px; font-size:0.9rem; color:var(--text-secondary);">Quick Actions</div>
        
        <div class="quick-action" onclick="document.querySelector('[data-tab=neuro]').click();">
            <div class="qa-icon"><i class="ph ph-sparkle"></i></div>
            <div class="qa-text"><h4>Talk to Neuro</h4><p>AI Therapist ready to listen</p></div>
        </div>
        <div class="quick-action" onclick="document.querySelector('[data-tab=controls]').click();">
            <div class="qa-icon"><i class="ph ph-sliders"></i></div>
            <div class="qa-text"><h4>Optimize Environment</h4><p>Adjust light, sound & temp</p></div>
        </div>
    `;
}

// --- 2. Neuro AI Chat ---
function renderNeuroChat() {
    return `
        <div class="chat-container">
            <div class="dashboard-header" style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
                <div style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.03); display:flex; justify-content:center; align-items:center; color:var(--theme-accent); border:1px solid rgba(255,255,255,0.05);"><i class="ph ph-sparkle"></i></div>
                <div>
                    <h2 style="font-size:1.2rem;">Neuro AI</h2>
                    <p style="font-size:0.8rem; display:flex; align-items:center; gap:6px;"><span style="width:6px; height:6px; border-radius:50%; background:var(--theme-accent);"></span> Listening to your bio-signals</p>
                </div>
            </div>
            
            <div class="chat-history" id="chat-history">
                ${state.chatHistory.map(msg => `<div class="chat-bubble ${msg.sender === 'ai' ? 'chat-ai' : 'chat-user'}">${msg.text}</div>`).join('')}
            </div>

            <div class="suggestions">
                <div class="chip" onclick="processChat('I feel anxious right now.')">I feel anxious right now.</div>
                <div class="chip" onclick="processChat('Help me focus on my work.')">Help me focus on my work.</div>
                <div class="chip" onclick="processChat('I can\\'t seem to fall asleep.')">I can't seem to fall asleep.</div>
            </div>

            <div class="chat-input-area">
                <div class="chat-input-container">
                    <input type="text" id="ai-chat-input" class="chat-input" placeholder="How are you feeling right now?" onkeypress="if(event.key === 'Enter') handleChatInput()">
                </div>
                <button class="chat-send-btn" onclick="handleChatInput()">
                    <i class="ph ph-paper-plane-right"></i>
                </button>
            </div>
        </div>
    `;
}

window.handleChatInput = function() {
    const input = document.getElementById('ai-chat-input');
    const text = input.value.trim();
    if(text) {
        processChat(text);
    }
}

window.processChat = function(text) {
    state.chatHistory.push({ sender: 'user', text: text });
    renderMainTab('neuro');
    
    setTimeout(() => {
        let resp = "I am tracking your bio-signals. How can I further assist?";
        
        // Dynamic Mood trigger
        if(text.includes('anxious')) {
            resp = "I understand you're feeling stressed. Your metrics reflect this. Let me dim the lights and start a calming breathing exercise. I'm here for you.";
            state.desiredState = 'Stressed State';
            state.metrics.score = 62;
            applyMoodTheme('Stressed State');
        } else if (text.includes('focus')) {
            resp = "Switching your environment to Deep Focus. I have increased the Binaural Soundscape to aid concentration.";
            state.desiredState = 'Deep Focus';
            state.metrics.score = 88;
            applyMoodTheme('Deep Focus');
        } else if (text.includes('asleep')) {
            resp = "I will adjust the room for Sleep Cycle. Lowering temperature to 68°F and initiating ambient relaxation sounds.";
            state.desiredState = 'Sleep Cycle';
            state.metrics.score = 92;
            applyMoodTheme('Sleep Cycle');
        }
        
        state.chatHistory.push({ sender: 'ai', text: resp });
        renderMainTab('neuro');
    }, 1200);
}

// --- 3. Environment Controls ---
function renderControls() {
    return `
        <div class="dashboard-header" style="margin-bottom:32px;">
            <h2>NeuroEnvironment</h2>
            <p>Adaptive surroundings based on your bio-feedback.</p>
        </div>

        <div style="font-size:0.8rem; color:var(--text-secondary); letter-spacing:1px; margin-bottom:12px;">ACTIVE MODE</div>
        <div class="mode-grid">
            <div class="mode-card ${state.desiredState === 'Deep Focus' ? 'active' : ''}" onclick="window.switchMode('Deep Focus')">
                <i class="ph ph-lightning"></i>
                <span style="font-size:0.85rem; font-weight:500;">Deep Focus</span>
            </div>
            <div class="mode-card ${state.desiredState === 'Calm State' || state.desiredState === 'Stressed State' ? 'active' : ''}" onclick="window.switchMode('Calm State')">
                <i class="ph ph-sparkle"></i>
                <span style="font-size:0.85rem; font-weight:500;">Calm State</span>
            </div>
            <div class="mode-card ${state.desiredState === 'Sleep Cycle' ? 'active' : ''}" onclick="window.switchMode('Sleep Cycle')" style="grid-column: span 2;">
                <i class="ph ph-moon"></i>
                <span style="font-size:0.85rem; font-weight:500;">Sleep Cycle</span>
            </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div style="font-size:0.8rem; color:var(--text-secondary); letter-spacing:1px;">GRANULAR CONTROL</div>
            <div style="font-size:0.7rem; color:var(--text-secondary); background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:12px;">Auto-adjusting</div>
        </div>

        <div class="slider-group">
            <div class="slider-header">
                <span><i class="ph ph-lightbulb"></i> NeuroLights Intensity</span>
                <span class="val">${state.environment.lighting}%</span>
            </div>
            <input type="range" min="0" max="100" value="${state.environment.lighting}" onchange="updateEnv('lighting', this.value)">
        </div>
        
        <div class="slider-group">
            <div class="slider-header">
                <span><i class="ph ph-speaker-hight"></i> Binaural Soundscape</span>
                <span class="val">${state.environment.sound}%</span>
            </div>
            <input type="range" min="0" max="100" value="${state.environment.sound}" onchange="updateEnv('sound', this.value)">
        </div>
    `;
}

window.switchMode = function(mode) {
    state.desiredState = mode;
    
    if(mode === 'Deep Focus') { state.environment.lighting = 80; state.environment.sound = 60; state.metrics.score = 88; }
    if(mode === 'Calm State') { state.environment.lighting = 40; state.environment.sound = 30; state.metrics.score = 78;}
    if(mode === 'Sleep Cycle') { state.environment.lighting = 10; state.environment.sound = 15; state.metrics.score= 90;}
    
    applyMoodTheme(mode);
    renderMainTab('controls');
};

window.updateEnv = function(key, val) {
    state.environment[key] = val;
    renderMainTab('controls');
};


// --- 4. Insights Tab with Graphs and Analytics ---
function renderInsights() {
    return `
        <div class="dashboard-header">
            <h2>Insights</h2>
            <p>Your wellness journey at a glance</p>
        </div>

        <!-- Weekly Overview -->
        <div class="glass-panel" style="padding: 20px; margin-bottom: 24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h3 style="font-size:1.1rem; font-weight:600;">Weekly Overview</h3>
                <span style="font-size:0.8rem; color:var(--text-secondary);">Last 7 days</span>
            </div>
            
            <!-- Bar Chart -->
            <div class="bar-chart">
                <div class="bar-item">
                    <div class="bar-label">Mon</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 75%;"></div>
                    </div>
                    <div class="bar-value">75</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Tue</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 82%;"></div>
                    </div>
                    <div class="bar-value">82</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Wed</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 68%;"></div>
                    </div>
                    <div class="bar-value">68</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Thu</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 79%;"></div>
                    </div>
                    <div class="bar-value">79</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Fri</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 85%;"></div>
                    </div>
                    <div class="bar-value">85</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Sat</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="height: 91%;"></div>
                    </div>
                    <div class="bar-value">91</div>
                </div>
                <div class="bar-item">
                    <div class="bar-label">Today</div>
                    <div class="bar-container">
                        <div class="bar-fill active" style="height: ${state.metrics.score}%;"></div>
                    </div>
                    <div class="bar-value">${state.metrics.score}</div>
                </div>
            </div>
        </div>

        <!-- Key Metrics Grid -->
        <div style="margin-bottom: 12px; font-size:0.9rem; color:var(--text-secondary);">Key Metrics</div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:24px;">
            <!-- HRV Metric -->
            <div class="glass-panel" style="padding: 20px;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                    <i class="ph ph-heart" style="color:var(--theme-accent); font-size:1.2rem;"></i>
                    <span style="font-size:0.85rem; color:var(--text-secondary);">HRV</span>
                </div>
                <div style="font-size:2rem; font-weight:600; margin-bottom:8px;">${state.metrics.hrv}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${state.metrics.hrv}%;"></div>
                </div>
                <div style="font-size:0.75rem; color:#10b981; margin-top:8px;">+5% from last week</div>
            </div>

            <!-- Heart Rate -->
            <div class="glass-panel" style="padding: 20px;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                    <i class="ph ph-activity" style="color:var(--theme-accent); font-size:1.2rem;"></i>
                    <span style="font-size:0.85rem; color:var(--text-secondary);">Heart Rate</span>
                </div>
                <div style="font-size:2rem; font-weight:600; margin-bottom:8px;">${state.metrics.hr} <span style="font-size:0.9rem; color:var(--text-secondary);">BPM</span></div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 70%; background: linear-gradient(90deg, #f59e0b, #f97316);"></div>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:8px;">Normal range</div>
            </div>

            <!-- Sleep Quality -->
            <div class="glass-panel" style="padding: 20px;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                    <i class="ph ph-moon" style="color:var(--theme-accent); font-size:1.2rem;"></i>
                    <span style="font-size:0.85rem; color:var(--text-secondary);">Sleep</span>
                </div>
                <div style="font-size:2rem; font-weight:600; margin-bottom:8px;">${state.metrics.sleep}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${state.metrics.sleep}%; background: linear-gradient(90deg, #8b5cf6, #a78bfa);"></div>
                </div>
                <div style="font-size:0.75rem; color:#10b981; margin-top:8px;">Excellent</div>
            </div>

            <!-- Focus Score -->
            <div class="glass-panel" style="padding: 20px;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                    <i class="ph ph-brain" style="color:var(--theme-accent); font-size:1.2rem;"></i>
                    <span style="font-size:0.85rem; color:var(--text-secondary);">Focus</span>
                </div>
                <div style="font-size:2rem; font-weight:600; margin-bottom:8px;">${state.metrics.focus}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${state.metrics.focus}%; background: linear-gradient(90deg, #06b6d4, #0ea5e9);"></div>
                </div>
                <div style="font-size:0.75rem; color:#f43f5e; margin-top:8px;">-5 from yesterday</div>
            </div>
        </div>

        <!-- Activity Timeline -->
        <div style="margin-bottom: 12px; font-size:0.9rem; color:var(--text-secondary);">Today's Activity</div>
        <div class="glass-panel" style="padding: 20px; margin-bottom:24px;">
            <div class="timeline-item">
                <div class="timeline-dot" style="background: #10b981;"></div>
                <div class="timeline-content">
                    <div class="timeline-time">8:30 AM</div>
                    <div class="timeline-title">Morning Meditation</div>
                    <div class="timeline-desc">15 min session • Calm State achieved</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot" style="background: #f59e0b;"></div>
                <div class="timeline-content">
                    <div class="timeline-time">11:00 AM</div>
                    <div class="timeline-title">Deep Focus Session</div>
                    <div class="timeline-desc">2 hours • Productivity peak detected</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot" style="background: #f43f5e;"></div>
                <div class="timeline-content">
                    <div class="timeline-time">3:45 PM</div>
                    <div class="timeline-title">Stress Spike</div>
                    <div class="timeline-desc">Environment auto-adjusted to calm</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot" style="background: #8b5cf6;"></div>
                <div class="timeline-content">
                    <div class="timeline-time">10:00 PM</div>
                    <div class="timeline-title">Sleep Preparation</div>
                    <div class="timeline-desc">Lights dimmed • Temperature lowered</div>
                </div>
            </div>
        </div>

        <!-- Mood Distribution -->
        <div style="margin-bottom: 12px; font-size:0.9rem; color:var(--text-secondary);">Weekly Mood Distribution</div>
        <div class="glass-panel" style="padding: 20px;">
            <div class="mood-distribution">
                <div class="mood-bar-item">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-size:0.85rem;">Calm</span>
                        <span style="font-size:0.85rem; font-weight:600;">45%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 45%; background: #10b981;"></div>
                    </div>
                </div>
                <div class="mood-bar-item">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-size:0.85rem;">Focused</span>
                        <span style="font-size:0.85rem; font-weight:600;">30%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 30%; background: #f59e0b;"></div>
                    </div>
                </div>
                <div class="mood-bar-item">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-size:0.85rem;">Stressed</span>
                        <span style="font-size:0.85rem; font-weight:600;">15%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 15%; background: #f43f5e;"></div>
                    </div>
                </div>
                <div class="mood-bar-item">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-size:0.85rem;">Resting</span>
                        <span style="font-size:0.85rem; font-weight:600;">10%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 10%; background: #8b5cf6;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- 5. Profile Tab with User Info and Device Management ---
function renderProfile() {
    const userData = JSON.parse(localStorage.getItem('yonro_user') || '{}');
    const isConnected = localStorage.getItem('yonroband_connected') !== 'false';
    
    return `
        <div class="dashboard-header">
            <h2>Profile</h2>
            <p>Manage your account and devices</p>
        </div>

        <!-- User Info Card -->
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px; text-align: center;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--theme-accent), #0ea5e9); margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; font-weight: 600;">
                ${userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 style="font-size: 1.3rem; margin-bottom: 4px;">${userData.name || 'User'}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 8px;">${userData.email || 'user@yonro.com'}</p>
            <div style="display: inline-block; background: rgba(16, 185, 129, 0.1); border: 1px solid var(--theme-accent); color: var(--theme-accent); padding: 6px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                Premium Member
            </div>
        </div>

        <!-- Personal Information -->
        ${userData.age || userData.phone ? `
        <div style="margin-bottom: 12px; font-size:0.9rem; color:var(--text-secondary);">Personal Information</div>
        <div class="glass-panel" style="padding: 20px; margin-bottom: 24px;">
            ${userData.age ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="ph ph-calendar" style="color: var(--theme-accent);"></i>
                    <span style="font-size: 0.9rem;">Age</span>
                </div>
                <span style="font-size: 0.9rem; color: var(--text-primary);">${userData.age} years</span>
            </div>
            ` : ''}
            ${userData.phone && userData.phone !== 'Not provided' ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="ph ph-phone" style="color: var(--theme-accent);"></i>
                    <span style="font-size: 0.9rem;">Phone</span>
                </div>
                <span style="font-size: 0.9rem; color: var(--text-primary);">${userData.phone}</span>
            </div>
            ` : ''}
            ${userData.registeredDate ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; ${userData.phone && userData.phone !== 'Not provided' ? 'border-top: 1px solid rgba(255,255,255,0.05);' : ''}">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="ph ph-clock" style="color: var(--theme-accent);"></i>
                    <span style="font-size: 0.9rem;">Member Since</span>
                </div>
                <span style="font-size: 0.9rem; color: var(--text-primary);">${new Date(userData.registeredDate).toLocaleDateString()}</span>
            </div>
            ` : ''}
        </div>
        ` : ''}

        <!-- Connected Devices -->
        <div style="margin-bottom: 12px; font-size:0.9rem; color:var(--text-secondary);">Connected Devices</div>
        
        <div class="glass-panel" style="padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                <div style="width: 50px; height: 50px; border-radius: 12px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;">
                    <i class="ph ph-watch" style="font-size: 1.5rem; color: var(--theme-accent);"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="font-size: 1rem; margin-bottom: 4px;">yoNroBand</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary);">
                        ${isConnected ? 'Connected • Battery 87%' : 'Disconnected'}
                    </p>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${isConnected ? '#10b981' : '#64748b'};"></div>
                    <span style="font-size: 0.75rem; color: ${isConnected ? '#10b981' : '#64748b'};">
                        ${isConnected ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
            
            ${isConnected ? `
                <button class="btn btn-secondary" onclick="disconnectDevice()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="ph ph-plug"></i>
                    Disconnect yoNroBand
                </button>
            ` : `
                <button class="btn btn-primary" onclick="connectDevice()" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="ph ph-bluetooth"></i>
                    Connect yoNroBand
                </button>
            `}
        </div>

        <!-- Account Stats -->
        <div style="margin-bottom: 12px; font-size:0.9rem; color:var(--text-secondary);">Account Statistics</div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div class="glass-panel" style="padding: 20px; text-align: center;">
                <div style="font-size: 2rem; font-weight: 600; color: var(--theme-accent); margin-bottom: 4px;">127</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Days Active</div>
            </div>
            <div class="glass-panel" style="padding: 20px; text-align: center;">
                <div style="font-size: 2rem; font-weight: 600; color: var(--theme-accent); margin-bottom: 4px;">89%</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Avg Score</div>
            </div>
            <div class="glass-panel" style="padding: 20px; text-align: center;">
                <div style="font-size: 2rem; font-weight: 600; color: var(--theme-accent); margin-bottom: 4px;">342</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Sessions</div>
            </div>
            <div class="glass-panel" style="padding: 20px; text-align: center;">
                <div style="font-size: 2rem; font-weight: 600; color: var(--theme-accent); margin-bottom: 4px;">24</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">Achievements</div>
            </div>
        </div>

        <!-- Settings Options -->
        <div style="margin-bottom: 12px; font-size:0.9rem; color:var(--text-secondary);">Settings</div>
        
        <div class="settings-list">
            <div class="settings-item" onclick="editProfile()">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="ph ph-user-circle" style="color: var(--text-secondary);"></i>
                    <span>Edit Profile</span>
                </div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
            </div>
            <div class="settings-item">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="ph ph-bell" style="color: var(--text-secondary);"></i>
                    <span>Notifications</span>
                </div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
            </div>
            <div class="settings-item">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="ph ph-lock" style="color: var(--text-secondary);"></i>
                    <span>Privacy & Security</span>
                </div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
            </div>
            <div class="settings-item">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="ph ph-question" style="color: var(--text-secondary);"></i>
                    <span>Help & Support</span>
                </div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
            </div>
            <div class="settings-item">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="ph ph-info" style="color: var(--text-secondary);"></i>
                    <span>About yoNro</span>
                </div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
            </div>
        </div>

        <!-- Logout Button -->
        <button class="btn btn-secondary" onclick="logout()" style="width: 100%; margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 8px; color: #f43f5e; border-color: rgba(244, 63, 94, 0.3);">
            <i class="ph ph-sign-out"></i>
            Sign Out
        </button>
    `;
}

// Device Management Functions
window.disconnectDevice = function() {
    if(confirm('Are you sure you want to disconnect your yoNroBand? You will stop receiving real-time bio-signal tracking.')) {
        localStorage.setItem('yonroband_connected', 'false');
        renderMainTab('profile');
    }
};

window.connectDevice = function() {
    // Simulate connection process
    const connecting = document.createElement('div');
    connecting.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(15, 23, 42, 0.95); padding: 24px; border-radius: 16px; text-align: center; z-index: 1000;';
    connecting.innerHTML = `
        <div class="wave-animation" style="margin-bottom: 16px;">
            <span></span><span></span><span></span><span></span><span></span>
        </div>
        <p style="color: var(--text-primary);">Connecting to yoNroBand...</p>
    `;
    document.body.appendChild(connecting);
    
    setTimeout(() => {
        document.body.removeChild(connecting);
        localStorage.setItem('yonroband_connected', 'true');
        renderMainTab('profile');
    }, 2000);
};

window.logout = function() {
    if(confirm('Are you sure you want to sign out?')) {
        localStorage.clear();
        window.location.href = '../index.html';
    }
};

window.editProfile = function() {
    const userData = JSON.parse(localStorage.getItem('yonro_user') || '{}');
    
    mainContent.innerHTML = `
        <div style="padding: 0;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
                <button onclick="renderMainTab('profile')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-primary);">
                    <i class="ph ph-arrow-left"></i>
                </button>
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 600;">Edit Profile</h2>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Update your personal information</p>
                </div>
            </div>
            
            <form id="edit-profile-form" style="display: flex; flex-direction: column; gap: 20px;">
                <div class="form-group">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Full Name</label>
                    <input type="text" id="edit-name" required value="${userData.name || ''}"
                        style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; color: var(--text-primary); font-size: 0.95rem; outline: none; transition: border 0.3s;"
                        onfocus="this.style.borderColor='var(--theme-accent)'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                </div>
                
                <div class="form-group">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Email Address</label>
                    <input type="email" id="edit-email" required value="${userData.email || ''}"
                        style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; color: var(--text-primary); font-size: 0.95rem; outline: none; transition: border 0.3s;"
                        onfocus="this.style.borderColor='var(--theme-accent)'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                </div>
                
                <div class="form-group">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Age</label>
                    <input type="number" id="edit-age" required min="13" max="120" value="${userData.age || ''}"
                        style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; color: var(--text-primary); font-size: 0.95rem; outline: none; transition: border 0.3s;"
                        onfocus="this.style.borderColor='var(--theme-accent)'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                </div>
                
                <div class="form-group">
                    <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Phone Number</label>
                    <input type="tel" id="edit-phone" value="${userData.phone && userData.phone !== 'Not provided' ? userData.phone : ''}"
                        style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; color: var(--text-primary); font-size: 0.95rem; outline: none; transition: border 0.3s;"
                        placeholder="+1 (555) 000-0000"
                        onfocus="this.style.borderColor='var(--theme-accent)'"
                        onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
                </div>
                
                <button type="submit" class="btn btn-primary" style="margin-top: 24px;">
                    <i class="ph ph-check"></i>
                    Save Changes
                </button>
            </form>
        </div>
    `;
    
    // Handle form submission
    document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedData = {
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            age: document.getElementById('edit-age').value,
            phone: document.getElementById('edit-phone').value || 'Not provided',
            registeredDate: userData.registeredDate || new Date().toISOString()
        };
        
        localStorage.setItem('yonro_user', JSON.stringify(updatedData));
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: rgba(16, 185, 129, 0.9); padding: 16px 24px; border-radius: 12px; color: white; z-index: 1000; font-size: 0.9rem; box-shadow: 0 4px 20px rgba(0,0,0,0.3);';
        successMsg.innerHTML = '<i class="ph ph-check-circle" style="margin-right: 8px;"></i>Profile updated successfully!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            document.body.removeChild(successMsg);
            renderMainTab('profile');
        }, 2000);
    });
};
