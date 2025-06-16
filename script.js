// --- Matrix Effect Script ---
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const terminalContainer = document.querySelector('.terminal-container');
const terminalBody = document.getElementById('terminal-body'); // Get terminal body for auto-scroll

// Global variables for terminal position, updated on load and resize
let termRect = { x: 0, y: 0, width: 0, height: 0 };

// Function to update terminal position (called on load and resize)
function updateTerminalRect() {
    if (terminalContainer) {
        termRect = terminalContainer.getBoundingClientRect();
    }
}

// Set canvas dimensions to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters for the matrix rain - only 1s and 0s for subtle binary effect
const binary = '01';

// Use only binary characters for a more subtle, focused effect
const alphabet = binary;

const fontSize = 16;
const columns = canvas.width / fontSize; // Number of columns based on font size

const rainDrops = []; // Array to store the Y position of each rain drop

// Initialize rain drops at the top of the screen
for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
}

// Main drawing function for the matrix effect
function draw() {
    // Semi-transparent black rectangle to fade out old characters, creating trails
    // Increased opacity for more aggressive fading, making the effect more subtle
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = fontSize + 'px monospace'; // Set font for matrix characters
    
    // Loop through each rain drop
    for (let i = 0; i < rainDrops.length; i++) {
        // Get a random character from the alphabet (1s and 0s only)
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        const charX = i * fontSize;
        const charY = rainDrops[i] * fontSize;

        let opacity = 0.05; // Very low base opacity for subtle effect

        // Calculate opacity based on distance from the terminal's center
        if (termRect.width > 0 && termRect.height > 0) {
            const termCenterX = termRect.left + termRect.width / 2;
            const termCenterY = termRect.top + termRect.height / 2;
            // Smaller influence radius for more localized effect
            const maxInfluenceDistance = Math.max(termRect.width, termRect.height) * 1.2; 

            const distance = Math.sqrt(Math.pow(charX - termCenterX, 2) + Math.pow(charY - termCenterY, 2));

            if (distance < maxInfluenceDistance) {
                // Much stronger influence near terminal for "glow illumination" effect
                const influenceFactor = 1 - (distance / maxInfluenceDistance);
                // More dramatic opacity change near terminal
                opacity = 0.05 + (0.4 * Math.pow(influenceFactor, 2)); // Quadratic falloff for more dramatic effect
            }
        }
        ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`; // Apply dynamic opacity
        ctx.fillText(text, charX, charY);
        
        // Slower, more sparse rain drops for subtle effect
        if (charY > canvas.height && Math.random() > 0.985) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++; // Move the rain drop down
    }
    
    // Request next animation frame for a smooth loop
    requestAnimationFrame(draw);
}

// --- Terminal Typing Effect and Command Processing Script ---
const terminalText = document.getElementById('typing-text');
const commandLine = document.getElementById('command-line');
const commandInput = document.getElementById('command-input');

// Command history variables
let commandHistory = [];
let historyIndex = -1; // -1 means no command selected, points to end of array + 1

// Function to auto-scroll the terminal body to the bottom
function autoScrollTerminal() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Array of messages to be typed out initially
const messages = [
    { text: "Initializing Developer Terminal...", delay: 50 },
    { text: "Loading Aditya Mendiratta's profile...", delay: 50 },
    { text: "Connecting to GitHub repositories...", delay: 50 },
    { text: "██████████████ 100%", delay: 30, style: "color: #0ff" },
    { text: "\n", delay: 200 },
    { text: "> System initialized successfully", delay: 30, style: "color: #0f0" },
    { text: "\n", delay: 100 },    { text: "\n\n", delay: 200 },
    { text: ">> DEVELOPER PROFILE <<", delay: 10, style: "color: #b19cd9; text-decoration: underline" },
    { text: "\n", delay: 100 },
    { text: "PROFILE_IMAGE", delay: 100, style: "display: block; margin: 10px 0;" },
    { text: "\n", delay: 100 },
    { text: "> NAME: ", delay: 20 },
    { text: "Aditya Mendiratta", delay: 100, style: "color: #0ff; font-weight: bold" },
    { text: "\n", delay: 50 },
    { text: "> TITLE: ", delay: 20 },
    { text: "Student & Full Stack Developer", delay: 50, style: "color: #0ff" },
    { text: "\n", delay: 50 },
    { text: "> LOCATION: ", delay: 20 },
    { text: "Kentucky, USA 🌟", delay: 70, style: "color: #ffbd2e" },
    { text: "\n", delay: 50 },
    { text: "\n", delay: 50 },
    { text: "> CURRENT FOCUS: ", delay: 20 },
    { text: "Bookish - Digital Library Platform", delay: 50, style: "color: #0ff" },
    { text: "\n\n", delay: 100 },
    { text: ">> TECH STACK <<", delay: 10, style: "color: #b19cd9; text-decoration: underline" },
    { text: "\n", delay: 100 },
    { text: "> PYTHON: ", delay: 20 },
    { text: "████████▉ 90%", delay: 30, style: "color: #0ff" },
    { text: "\n", delay: 50 },
    { text: "> JAVASCRIPT/TYPESCRIPT: ", delay: 20 },
    { text: "█████████ 88%", delay: 30, style: "color: #0ff" },
    { text: "\n", delay: 50 },
    { text: "> REACT/REACT NATIVE: ", delay: 20 },
    { text: "████████▊ 85%", delay: 30, style: "color: #0ff" },
    { text: "\n", delay: 50 },
    { text: "> DJANGO/FLASK: ", delay: 20 },
    { text: "████████▌ 82%", delay: 30, style: "color: #0ff" },
    { text: "\n", delay: 50 },
    { text: "> MACHINE LEARNING: ", delay: 20 },
    { text: "███████▍ 75%", delay: 30, style: "color: #0ff" },
    { text: "\n", delay: 50 },
    { text: "> JAVA: ", delay: 20 },
    { text: "███████▎ 72%", delay: 30, style: "color: #0ff" },
    { text: "\n\n", delay: 100 },
    { text: ">> FEATURED PROJECTS <<", delay: 10, style: "color: #b19cd9; text-decoration: underline" },
    { text: "\n", delay: 100 },
    { text: "> [2025] 📚 BOOKISH - Digital Library Platform with Virtual Pet System", delay: 30 },
    { text: "\n", delay: 50 },
    { text: "> [2025] 🌱 AGRIMIND.AI - Farm Management with AI Sustainability Scoring", delay: 30 },
    { text: "\n", delay: 50 },
    { text: "> [2024] 🏥 WOUNDGUARD - Arduino-powered Medical Monitoring System", delay: 30 },
    { text: "\n", delay: 50 },
    { text: "> [2024] ⚛️ PERIODIC PORTAL - Interactive Chemistry Learning Tool", delay: 30 },
    { text: "\n", delay: 50 },
    { text: "> [2024] 🔧 CODE PLOTTER - GCode Manipulation Tool for CNC Devices", delay: 30 },
    { text: "\n\n", delay: 100 },
    { text: ">> CONTACT CHANNELS <<", delay: 10, style: "color: #b19cd9; text-decoration: underline" },
    { text: "\n", delay: 100 },
    { text: "> EMAIL: ", delay: 20 },
    { text: "adityam3ndiratta@gmail.com", delay: 30, style: "color: #0ff" },
    { text: "\n", delay: 50 },
    { text: "> GITHUB: ", delay: 20 },
    { text: "github.com/amend09", delay: 30, style: "color: #0ff" },
    { text: "\n", delay: 50 },
    { text: "> CURRENTLY LEARNING: ", delay: 20 },
    { text: "Django • React • Machine Learning", delay: 30, style: "color: #ffbd2e" },
    { text: "\n\n", delay: 100 },
    { text: "═══════════════════════════════════════════════════════════", delay: 5, style: "color: #b19cd9" },
    { text: "\n", delay: 50 },
    { text: "🚀 Type 'help' to explore available commands", delay: 30, style: "color: #0f0" },
    { text: "\n", delay: 50 },
    { text: "💡 Try 'projects', 'skills', 'about', or 'contact' to get started!", delay: 30, style: "color: #ffbd2e" },
    { text: "\n", delay: 50 },
];

let currentMessageIndex = 0;
let currentCharIndex = 0;
let isTyping = true;

// Function to simulate typing text character by character
function typeNextCharacter() {
    if (currentMessageIndex >= messages.length) {
        isTyping = false;
        commandLine.classList.remove('hidden'); // Show command line when typing finishes
        commandInput.focus(); // Focus on the input field
        autoScrollTerminal(); // Auto-scroll to ensure prompt is visible
        return;
    }
      const currentMessage = messages[currentMessageIndex];
    const textToType = currentMessage.text;
    
    // Special handling for profile image
    if (textToType === "PROFILE_IMAGE") {
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = 'text-align: center; margin: 15px 0; padding: 10px; border: 2px solid #0ff; border-radius: 8px; background: rgba(0, 255, 255, 0.1);';
        
        const profileImg = document.createElement('img');
        profileImg.src = 'image.jpg';
        profileImg.alt = 'Aditya Mendiratta - Developer Profile';
        profileImg.style.cssText = 'max-width: 150px; max-height: 150px; border-radius: 50%; border: 3px solid #0ff; box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); display: block; margin: 0 auto;';
        
        // Add a glowing effect
        profileImg.onload = function() {
            this.style.animation = 'profileGlow 2s ease-in-out infinite alternate';
        };
        
        imageContainer.appendChild(profileImg);
        terminalText.appendChild(imageContainer);
        
        currentMessageIndex++;
        currentCharIndex = 0;
        autoScrollTerminal();
        setTimeout(typeNextCharacter, currentMessage.delay);
        return;
    }
    
    if (currentCharIndex < textToType.length) {
        const char = textToType.charAt(currentCharIndex);
        const span = document.createElement('span');
        span.textContent = char;
        
        if (currentMessage.style) {
            span.style = currentMessage.style; // Apply custom style if defined
        }
        
        terminalText.appendChild(span);
        currentCharIndex++;
        
        autoScrollTerminal(); // Auto-scroll during typing
        // Continue typing after a delay
        setTimeout(typeNextCharacter, currentMessage.delay);
    } else {
        currentMessageIndex++;
        currentCharIndex = 0;
        // Move to the next message after a short pause
        setTimeout(typeNextCharacter, 100);
    }
}

// Function to process user commands
function processCommand(command) {
    terminalText.appendChild(document.createElement('br')); // New line before prompt
    
    const prompt = document.createElement('span');
    prompt.textContent = '> ';
    prompt.style.color = '#0f0';
    terminalText.appendChild(prompt);
    
    const cmdText = document.createElement('span');
    cmdText.textContent = command;
    cmdText.style.color = '#e0e0e0';
    terminalText.appendChild(cmdText);
    
    terminalText.appendChild(document.createElement('br'));
    
    const response = document.createElement('div');
    response.style.marginTop = '10px';
    
    command = command.toLowerCase().trim(); // Clean and normalize command
    
    // Store command in history only if it's not empty
    if (command.trim() !== '') {
        commandHistory.push(command.trim());
        historyIndex = commandHistory.length; // Reset index to the end of history
    }    if (command === 'help') {
        response.innerHTML = `Available commands:<br>
        - <span class="highlight">about</span>: Show detailed developer profile<br>
        - <span class="highlight">skills</span>: List technical skills & expertise<br>
        - <span class="highlight">projects</span>: Display featured projects<br>
        - <span class="highlight">experience</span>: Show education & achievements<br>
        - <span class="highlight">ls</span>: List current directory contents<br>
        - <span class="highlight">contact</span>: Show contact information<br>
        - <span class="highlight">resume</span>: View resume/portfolio links<br>
        - <span class="highlight">clear</span>: Clear the terminal<br>
        - <span class="highlight">whoami</span>: Display current user info`;
    }    else if (command === 'about') {
        response.innerHTML = `// DEVELOPER PROFILE //<br><br>
        <span class="highlight">👨‍💻 Aditya Mendiratta</span> - Full Stack Developer & AI Enthusiast<br>
        📍 Based in Kentucky, USA 🌟<br><br>
        
        🚀 <strong>Mission Statement:</strong><br>
        "Building the future with code" - I'm passionate about creating innovative solutions that combine cutting-edge technology with practical applications. Currently working on Bookish, a digital library platform that gamifies reading through virtual pet care.<br><br>
        
        � <strong>Specializations:</strong><br>
        - 🌐 Full Stack Web Development (React, Django, Flask)<br>
        - 📱 Mobile Development (React Native)<br>
        - 🤖 AI/Machine Learning applications<br>
        - 🔧 Open Source Development<br>
        - ⚡ Hardware Integration (Arduino, IoT)<br>
        - 🎮 Educational Technology & Gamification<br><br>
        
        🎯 <strong>Current Focus:</strong><br>
        Developing Bookish - A revolutionary digital library platform that transforms reading into an interactive experience through virtual pet care mechanics.<br><br>
        
        🌱 <strong>Philosophy:</strong><br>
        "Always learning, always creating" - I believe in continuous growth, open collaboration, and using technology to make a positive impact on the world.`;
    }
    else if (command === 'skills') {
        response.innerHTML = `>> TECHNICAL EXPERTISE <<br><br>
        <div class="skill-bar"><span class="skill-name">Python:</span> <span class="skill-level" style="width: 90%"></span></div>
        <div class="skill-bar"><span class="skill-name">JavaScript/TS:</span> <span class="skill-level" style="width: 88%"></span></div>
        <div class="skill-bar"><span class="skill-name">React/React Native:</span> <span class="skill-level" style="width: 85%"></span></div>
        <div class="skill-bar"><span class="skill-name">Django/Flask:</span> <span class="skill-level" style="width: 82%"></span></div>
        <div class="skill-bar"><span class="skill-name">HTML5/CSS3:</span> <span class="skill-level" style="width: 88%"></span></div>
        <div class="skill-bar"><span class="skill-name">PostgreSQL:</span> <span class="skill-level" style="width: 78%"></span></div>
        <div class="skill-bar"><span class="skill-name">Machine Learning:</span> <span class="skill-level" style="width: 75%"></span></div>
        <div class="skill-bar"><span class="skill-name">Java:</span> <span class="skill-level" style="width: 72%"></span></div>
        <div class="skill-bar"><span class="skill-name">Arduino/IoT:</span> <span class="skill-level" style="width: 80%"></span></div>
        <div class="skill-bar"><span class="skill-name">Git/Linux:</span> <span class="skill-level" style="width: 85%"></span></div>`;
    }    else if (command === 'projects') {
        response.innerHTML = `>> FEATURED PROJECTS <<br><br>
        <span class="highlight">📚 BOOKISH (2025)</span><br>
        - Digital Library Platform with Virtual Pet System<br>
        - React-based frontend with gamification elements<br>
        - <a href="https://amend09.github.io/Bookish/" target="_blank" style="color: var(--terminal-cyan);">🔗 Live Demo</a><br><br>
        
        <span class="highlight">🌱 AGRIMIND.AI (2025)</span><br>
        - Farm Management with AI Sustainability Scoring<br>
        - Created for TSA 2025 Software Development Competition<br>
        - <a href="https://amend09.github.io/AgriMind.ai/" target="_blank" style="color: var(--terminal-cyan);">🔗 Live Demo</a><br><br>
        
        <span class="highlight">🏥 WOUNDGUARD (2024)</span><br>
        - Arduino-powered Medical Monitoring System<br>
        - HOSA Medical Innovations Competition Project<br>
        - <a href="https://amend09.github.io/WoundGuard/" target="_blank" style="color: var(--terminal-cyan);">🔗 Live Demo</a><br><br>
        
        <span class="highlight">⚛️ PERIODIC PORTAL (2024)</span><br>
        - Interactive Chemistry Learning Tool<br>
        - Comprehensive periodic table with educational features<br>
        - <a href="https://amend09.github.io/periodic-portal/" target="_blank" style="color: var(--terminal-cyan);">🔗 Live Demo</a><br><br>
        
        <span class="highlight">🔧 CODE PLOTTER (2024)</span><br>
        - GCode Manipulation Tool for CNC Devices<br>
        - Python-based tool for move, scale, and rotate operations<br>
        - <a href="https://github.com/AMEND09/CodePlotter" target="_blank" style="color: var(--terminal-cyan);">🔗 Source Code</a>`;
    }
    else if (command === 'experience') {
        response.innerHTML = `>> EDUCATION & ACHIEVEMENTS <<br><br>
        <span class="highlight">🎓 Current Student</span><br>
        - Pursuing excellence in Computer Science and Technology<br>
        - Location: Kentucky, USA<br><br>
        
        <span class="highlight">🏆 Competition Achievements</span><br>
        - TSA 2025 Software Development Competition (AgriMind.ai)<br>
        - HOSA Medical Innovations Competition (WoundGuard)<br><br>
        
        <span class="highlight">🌟 Open Source Contributions</span><br>
        - Active GitHub contributor with multiple public repositories<br>
        - Focus on educational tools and practical applications<br>
        - Community-driven development approach<br><br>
        
        <span class="highlight">💡 Current Learning</span><br>
        - Advanced Django development<br>
        - React ecosystem and modern frontend patterns<br>
        - Machine Learning and AI applications<br>
        - Mobile development with React Native`;
    }    else if (command === 'ls') {
        response.innerHTML = `.` + ` `.repeat(15) + `..` + `<br>` +
                             `<span class="ls-dir">projects/</span>` + ` `.repeat(8) + `<span class="ls-dir">skills/</span>` + `<br>` +
                             `<span class="ls-dir">contact/</span>` + ` `.repeat(9) + `<span class="ls-dir">about/</span>` + `<br>` +
                             `<span class="ls-file">portfolio.html</span>` + ` `.repeat(3) + `<span class="ls-file">README.md</span>` + `<br>` +
                             `<span class="ls-file">resume.pdf</span>` + ` `.repeat(5) + `<span class="ls-file">github-stats.json</span>`;
    }
    else if (command === 'contact') {
        response.innerHTML = `>> CONTACT CHANNELS <<br><br>
        <div class="contact-item">📧 Email: <a href="mailto:adityam3ndiratta@gmail.com">adityam3ndiratta@gmail.com</a></div>
        <div class="contact-item">💻 GitHub: <a href="https://github.com/amend09" target="_blank">github.com/amend09</a></div>
        <div class="contact-item">🌐 Portfolio: <a href="https://amend09.github.io" target="_blank">amend09.github.io</a></div>
        <div class="contact-item">📍 Location: <span style="color: var(--terminal-yellow);">Kentucky, USA</span></div>
        <div class="contact-item">🎵 Currently Vibing: <span style="color: var(--terminal-purple);">Check Spotify integration on GitHub</span></div>`;
    }
    else if (command === 'resume') {
        response.innerHTML = `>> PORTFOLIO LINKS <<br><br>
        🚀 <strong>Featured Projects:</strong><br>
        - <a href="https://amend09.github.io/Bookish/" target="_blank" style="color: var(--terminal-cyan);">Bookish - Digital Library Platform</a><br>
        - <a href="https://amend09.github.io/AgriMind.ai/" target="_blank" style="color: var(--terminal-cyan);">AgriMind.ai - Farm Management System</a><br>
        - <a href="https://amend09.github.io/WoundGuard/" target="_blank" style="color: var(--terminal-cyan);">WoundGuard - Medical Monitoring</a><br><br>
        
        📊 <strong>GitHub Analytics:</strong><br>
        - <a href="https://github.com/amend09" target="_blank" style="color: var(--terminal-cyan);">View GitHub Profile & Stats</a><br>
        - Multiple repositories showcasing diverse tech stack<br><br>
        
        📄 <strong>Download Resume:</strong><br>
        <span style="color: var(--terminal-yellow);">Contact via email for the latest resume version</span>`;
    }
    else if (command === 'whoami') {
        response.innerHTML = `<span style="color: var(--terminal-green);">aditya@developer-terminal:~$</span><br><br>
        🚀 <strong>Aditya Mendiratta</strong><br>
        📍 Kentucky, USA<br>
        💻 Full Stack Developer • AI Enthusiast • Open Source Contributor<br>
        🎯 Currently building: Digital Library Platform (Bookish)<br>
        🌱 Learning: Django, React, Machine Learning<br>
        ⚡ Fun fact: Building the future with code, one project at a time!`;
    }    else if (command === 'clear') {
        terminalText.innerHTML = ''; // Clear all typed content
        commandInput.value = ''; // Clear input field
        return;
    }    else if (command === 'exit') {
        response.innerHTML = `<span style="color: var(--terminal-red);">➜ Nice try! But you can't escape from Aditya's terminal that easily! 😄</span><br>
        <span style="color: var(--terminal-yellow);">Try exploring more commands instead!</span>`;
    }
    else if (command === 'achievements') {
        response.innerHTML = `>> COMPETITION ACHIEVEMENTS <<br><br>
        <span class="highlight">🏆 TSA 2025 Software Development Competition</span><br>
        - Project: AgriMind.ai - Farm Management with AI Sustainability Scoring<br>
        - Advanced AI integration for sustainable farming solutions<br><br>
        
        <span class="highlight">🏥 HOSA Medical Innovations Competition</span><br>
        - Project: WoundGuard - Arduino-powered Medical Monitoring System<br>
        - Hardware-software integration for healthcare solutions<br><br>
        
        <span class="highlight">💻 Open Source Contributions</span><br>
        - Multiple GitHub repositories with educational and practical applications<br>
        - Community-driven development approach<br>
        - Focus on accessible technology solutions`;
    }
    else if (command === 'github') {
        response.innerHTML = `>> GITHUB PROFILE <<br><br>
        🚀 <strong>Profile:</strong> <a href="https://github.com/amend09" target="_blank" style="color: var(--terminal-cyan);">github.com/amend09</a><br><br>
        
        📊 <strong>Featured Repositories:</strong><br>
        - Bookish (Digital Library Platform)<br>
        - AgriMind.ai (AI Farm Management)<br>
        - WoundGuard (Medical Monitoring)<br>
        - Periodic Portal (Educational Tool)<br>
        - CodePlotter (CNC G-code Tool)<br><br>
        
        💡 <strong>Focus Areas:</strong><br>
        - Educational Technology<br>
        - Healthcare Solutions<br>
        - Sustainable Technology<br>
        - Open Source Development`;
    }
    else if (command === 'spotify') {
        response.innerHTML = `>> CURRENT VIBES <<br><br>
        🎵 <strong>Now Playing:</strong> <span style="color: var(--terminal-purple);">Code & Coffee Playlist</span><br>
        🎧 <strong>Status:</strong> <span style="color: var(--terminal-green);">Coding with Lo-Fi Beats</span><br><br>
        
        💭 <strong>Coding Soundtrack:</strong><br>
        - Lo-Fi Hip Hop for deep focus sessions<br>
        - Synthwave for late night debugging<br>
        - Classical for complex algorithm design<br><br>
        
        <span style="color: var(--terminal-yellow);">🎼 Music fuels creativity and keeps the code flowing!</span>`;
    }
    else if (command === 'sudo') {
        response.innerHTML = `<span style="color: var(--terminal-red);">⚠️  sudo: Nice try! But this isn't that kind of terminal... 😏</span><br><br>
        <span style="color: var(--terminal-yellow);">🔐 Access Level: Guest (You're not root here!)</span><br>
        <span style="color: var(--terminal-cyan);">💡 Try 'whoami' to see your current privileges</span><br><br>
        
        <span style="color: var(--terminal-green);">Fun fact: Even sudo can't give you admin access to my portfolio! 🚀</span>`;
    }
    else {
        // Fallback for unknown commands
        response.innerHTML = `<span style="color: var(--terminal-red);">Command not found: ${command}</span><br>
        Type <span class="highlight">'help'</span> for available commands.<br>
        <span style="color: var(--terminal-yellow);">💡 Tip: Try 'projects', 'skills', or 'contact'</span>`;
    }
    
    terminalText.appendChild(response); // Append the command response
    terminalText.appendChild(document.createElement('br')); // Add a new line
    terminalText.appendChild(document.createElement('br')); // Add another new line for spacing
    autoScrollTerminal(); // Auto-scroll after command response
}

// Event listener for keyboard input on the command input field
commandInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const command = this.value;
        this.value = ''; // Clear input after command is entered
        
        if (command.trim() !== '') { // Process only if command is not empty
            processCommand(command);
        }
        historyIndex = commandHistory.length; // Reset history index to the end after a new command
    } else if (e.key === 'ArrowUp') {
        e.preventDefault(); // Prevent cursor from moving in the input field
        if (commandHistory.length > 0) {
            historyIndex--;
            if (historyIndex < 0) {
                historyIndex = 0; // Don't go past the first command
            }
            this.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent cursor from moving in the input field
        if (commandHistory.length > 0) {
            historyIndex++;
            if (historyIndex >= commandHistory.length) {
                historyIndex = commandHistory.length; // If past last command, clear input
                this.value = '';
            } else {
                this.value = commandHistory[historyIndex];
            }
        }
    }
});

// --- Initialize Animations on Window Load and Resize ---
window.addEventListener('load', function() {
    updateTerminalRect(); // Initial calculation of terminal position
    draw(); // Start the matrix background animation
    typeNextCharacter(); // Start the terminal typing animation
});

// Adjust canvas size and terminal position on window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateTerminalRect(); // Recalculate terminal position on resize
});
