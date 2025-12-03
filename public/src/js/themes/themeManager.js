// ============================================
// FESTIVCHAIN - THEME MANAGER WITH ANIMATIONS
// ============================================

// Festival date ranges (month-day)
const FESTIVAL_DATES = {
    'Onam': { start: '08-01', end: '09-15' },      // Aug-Sept
    'Diwali': { start: '10-01', end: '11-30' },    // Oct-Nov
    'Christmas': { start: '12-01', end: '12-31' }, // Dec
    'Pongal': { start: '01-01', end: '01-31' },    // Jan
    'Vishu': { start: '04-01', end: '04-30' }      // April
};

const THEME_CLASSES = {
    'Onam': 'theme-onam',
    'Diwali': 'theme-diwali',
    'Christmas': 'theme-christmas',
    'Pongal': 'theme-pongal',
    'Vishu': 'theme-vishu'
};

let currentTheme = null;

// Determine festival from date
function getFestivalFromDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const monthDay = `${month}-${day}`;

    for (const [festival, range] of Object.entries(FESTIVAL_DATES)) {
        if (monthDay >= range.start && monthDay <= range.end) {
            return festival;
        }
    }

    return null;
}

// Apply theme
function applyTheme(festival) {
    if (!festival) return;

    try {
        // Remove all theme classes
        document.body.classList.remove(...Object.values(THEME_CLASSES));

        // Add new theme class
        const themeClass = THEME_CLASSES[festival];
        if (themeClass) {
            document.body.classList.add(themeClass);
            currentTheme = festival;
            console.log(`🎨 Theme applied: ${festival}`);

            // Stop any existing animations
            clearAnimations();

            // Start theme-specific animations
            startThemeAnimations(festival);
            // Reload categories so the top-6 / festival-priority list updates immediately
            try {
                if (typeof loadCategories === 'function') loadCategories(false);
            } catch (e) {
                console.warn('Could not refresh categories after theme change:', e);
            }
        }
    } catch (error) {
        console.error('Error applying theme:', error);
    }
}

// Start theme animations
function startThemeAnimations(festival) {
    const themeBackground = document.getElementById('themeBackground');

    switch(festival) {
        case 'Onam':
            startFlowerFall(themeBackground);
            break;
        case 'Diwali':
            startCrackerBurst(themeBackground);
            break;
        case 'Christmas':
            startSnowfall(themeBackground);
            break;
        case 'Pongal':
            startSparkles(themeBackground);
            break;
        case 'Vishu':
            startConfetti(themeBackground);
            break;
    }
}

// Clear animations
function clearAnimations() {
    const themeBackground = document.getElementById('themeBackground');
    if (themeBackground) {
        themeBackground.innerHTML = '';
    }
}

// Snowfall animation (Christmas)
function startSnowfall(container) {
    if (!container) return;

    const snowflakesCount = 50;
    const duration = 10;

    for (let i = 0; i < snowflakesCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.innerHTML = '❄';
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * 100 + '%';
        // colored snow, varied sizes and continuous animation for visibility
        const colors = ['#FFFFFF', '#CFE9FF', '#FFF5F8', '#E6FFF2', '#FFEFD5', '#F0E6FF'];
        snowflake.style.color = colors[Math.floor(Math.random() * colors.length)];
        snowflake.style.fontSize = (1 + Math.random() * 2) + 'em';
        snowflake.style.textShadow = '0 2px 6px rgba(0,0,0,0.25)';
        snowflake.style.opacity = (0.7 + Math.random() * 0.3).toFixed(2);
        snowflake.style.animationDuration = (duration + Math.random() * 8) + 's';
        snowflake.style.animationDelay = Math.random() * duration + 's';
        snowflake.style.animationIterationCount = 'infinite';

        container.appendChild(snowflake);
    }

    console.log('❄️ Snowfall animation started');
}

// Flower fall animation (Onam)
function startFlowerFall(container) {
    if (!container) return;

    const flowerEmojis = ['🌹', '🌺', '🌻', '🌷', '🌸', '🏵'];
    const flowersCount = 40;
    const duration = 12;

    for (let i = 0; i < flowersCount; i++) {
        const flower = document.createElement('div');
        flower.innerHTML = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        flower.className = 'flower';
        flower.style.left = Math.random() * 100 + '%';
        flower.style.animationDuration = (duration + Math.random() * 6) + 's';
        flower.style.animationIterationCount = 'infinite';
        flower.style.animationDelay = Math.random() * duration + 's';
        flower.style.fontSize = (1.5 + Math.random() * 1.5) + 'em';

        container.appendChild(flower);
    }

    console.log('🌹 Flower fall animation started');
}

// Cracker burst animation (Diwali)
function startCrackerBurst(container) {
    if (!container) return;

    const crackerEmojis = ['✨', '🎆', '💥', '⭐', '🌟', '💫'];

    setInterval(() => {
        const cracker = document.createElement('div');
        cracker.innerHTML = crackerEmojis[Math.floor(Math.random() * crackerEmojis.length)];
        cracker.className = 'cracker';
        cracker.style.left = Math.random() * 100 + '%';
        cracker.style.top = Math.random() * 100 + '%';

        // Random burst direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 300;
        cracker.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        cracker.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        cracker.style.animationDuration = (0.8 + Math.random() * 0.7) + 's';

        container.appendChild(cracker);

        // Remove after animation (longer so bursts stay visible briefly)
        setTimeout(() => cracker.remove(), 4000);
    }, 300);

    console.log('🎆 Cracker burst animation started');
}

// Sparkle animation (Pongal)
function startSparkles(container) {
    if (!container) return;

    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (1.0 + Math.random() * 0.8) + 's';
        sparkle.style.animationIterationCount = 'infinite';

        container.appendChild(sparkle);

        // remove after a while to avoid DOM growth
        setTimeout(() => sparkle.remove(), 3000);
    }, 500);

    console.log('✨ Sparkle animation started');
}

// Confetti animation (Vishu)
function startConfetti(container) {
    if (!container) return;

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA502', '#FF6348'];
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (3 + Math.random() * 2) + 's';
        confetti.style.animationDelay = Math.random() * 1 + 's';
        confetti.style.animationIterationCount = 'infinite';

        container.appendChild(confetti);
    }

    console.log('🎉 Confetti animation started');
}

// Handle date change
function handleDateChange() {
    const dateInput = document.getElementById('festivalDate');
    if (!dateInput.value) return;

    const festival = getFestivalFromDate(dateInput.value);
    if (festival) {
        applyTheme(festival);
        showToast(`🎉 Festival theme changed to ${festival}!`, 'info');
        localStorage.setItem('festivchain_festival', festival);
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('festivchain_festival');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Apply default theme based on current date
        const festival = getFestivalFromDate(new Date().toISOString().split('T')[0]);
        if (festival) {
            applyTheme(festival);
        } else {
            applyTheme('Diwali'); // Default theme
        }
    }
}

// Initialize theme manager on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        loadTheme();
    }, 500);
});
