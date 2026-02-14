let currentTemp = 20;

/**
 * Update the temperature display and circular progress indicator
 * @param {number} temp - The new temperature value
 */
function updateTemperature(temp) {
    // Clamp temperature between 10 and 35 degrees
    currentTemp = Math.max(10, Math.min(35, temp));
    document.querySelector('.temp-value').textContent = currentTemp + '°C';
    
    // Update circle progress (10-35 range mapped to circle)
    const percentage = (currentTemp - 10) / 25;
    const circumference = 565.48;
    const offset = circumference - (percentage * circumference);
    document.getElementById('progressCircle').style.strokeDashoffset = offset;
}

/**
 * Increase temperature by 1 degree
 */
function increaseTemp() {
    updateTemperature(currentTemp + 1);
}

/**
 * Decrease temperature by 1 degree
 */
function decreaseTemp() {
    updateTemperature(currentTemp - 1);
}

/**
 * Initialize all event listeners and animations
 */
function initializeApp() {
    // Room tabs functionality
    document.querySelectorAll('.room-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.room-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Device cards functionality
    document.querySelectorAll('.device-card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Control buttons functionality
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Bottom nav functionality
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize temperature circle
    updateTemperature(20);

    // Stagger animations for device cards
    document.querySelectorAll('.device-card').forEach((card, index) => {
        card.style.animationDelay = `${0.1 + (index * 0.05)}s`;
    });
}

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);