document.addEventListener('DOMContentLoaded', () => {

    // Mascot Interaction (Menu & Chat Bubble)
    const mascot = document.querySelector('.mascot-container');
    const mascotBubble = document.createElement('div');

    // Bubble Styles (Greeting)
    mascotBubble.style.position = 'absolute';
    mascotBubble.style.top = '-60px';
    mascotBubble.style.right = '0';
    mascotBubble.style.background = '#FFF';
    mascotBubble.style.padding = '10px 15px';
    mascotBubble.style.borderRadius = '20px 20px 0 20px';
    mascotBubble.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    mascotBubble.style.fontSize = '0.9rem';
    mascotBubble.style.opacity = '0';
    mascotBubble.style.transition = 'opacity 0.3s ease';
    mascotBubble.style.pointerEvents = 'none';
    mascotBubble.style.whiteSpace = 'nowrap';
    mascotBubble.innerText = "คลิกเพื่อดูเมนูนะครับ! 🤖";

    // Create Menu
    const mascotMenu = document.createElement('div');
    mascotMenu.className = 'mascot-menu';
    mascotMenu.innerHTML = `
        <a href="index.html" class="mascot-menu-item"><span class="icon">🏠</span> หน้าหลัก</a>
        <a href="lessons.html" class="mascot-menu-item"><span class="icon">📚</span> บทเรียน</a>
        <a href="resources.html" class="mascot-menu-item"><span class="icon">📂</span> สื่อการสอน</a>
        <a href="quiz.html" class="mascot-menu-item"><span class="icon">📝</span> แบบทดสอบ</a>
        <a href="about.html" class="mascot-menu-item"><span class="icon">ℹ️</span> เกี่ยวกับ</a>
    `;

    if (mascot) {
        mascot.appendChild(mascotBubble);
        mascot.appendChild(mascotMenu);

        // Hover Effect for Bubble
        mascot.addEventListener('mouseenter', () => {
            if (!mascotMenu.classList.contains('active')) {
                mascotBubble.style.opacity = '1';
            }
        });

        mascot.addEventListener('mouseleave', () => {
            mascotBubble.style.opacity = '0';
        });

        // Click to Toggle Menu
        mascot.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mascotMenu.classList.toggle('active');

            if (isActive) {
                mascotBubble.style.opacity = '0'; // Hide bubble
            }
        });

        // Click Outside to Close
        document.addEventListener('click', (e) => {
            if (!mascot.contains(e.target) && mascotMenu.classList.contains('active')) {
                mascotMenu.classList.remove('active');
            }
        });
    }

    // Scroll Spy & Sticky Nav
    const nav = document.querySelector('.nav-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.transform = 'translate(-50%, 0) scale(0.95)';
        } else {
            nav.style.transform = 'translate(-50%, 0) scale(1)';
        }
    });

    // Validated Chapter Card Clicks
    const cards = document.querySelectorAll('.chapter-card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            // Add 'pressed' effect via class if needed, or just animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // No redirect alert - using simple redirect or just bubble
            }, 200);
        });
    });

    // Video Player Logic
    const videoPlayers = document.querySelectorAll('.video-wrapper');

    videoPlayers.forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        const nextBtn = wrapper.querySelector('.btn-next-video');
        if (!iframe || !nextBtn) return;

        // Parse video list from data attribute
        const videoList = JSON.parse(wrapper.dataset.videos || '[]');
        let currentIndex = 0;

        if (videoList.length > 1) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % videoList.length;

                // Add fade effect
                iframe.style.opacity = '0';
                setTimeout(() => {
                    iframe.src = `https://www.youtube.com/embed/${videoList[currentIndex]}`;
                    iframe.style.opacity = '1';
                }, 300);
            });
        } else {
            nextBtn.style.display = 'none';
        }
    });

    // --- Quiz Logic ---
    const quizSelection = document.getElementById('quiz-selection');
    const quizGame = document.getElementById('quiz-game');
    const resultScreen = document.getElementById('result-screen');

    // Elements
    const btnMidterm = document.getElementById('btn-midterm');
    const btnFinal = document.getElementById('btn-final');
    const btnBackMenu = document.getElementById('btn-back-menu');

    if (quizGame && quizSelection) {
        let currentQuestion = 0;
        let score = 0;
        let activeQuizData = []; // Store current active questions

        const questionTitle = document.getElementById('question-title'); // New title element
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const scoreDisplay = document.getElementById('score');
        const progressFill = document.getElementById('progress');
        const feedbackOverlay = document.getElementById('feedback-overlay');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackText = document.getElementById('feedback-text');
        const finalScore = document.getElementById('final-score');
        const finalMaxScore = document.getElementById('final-max-score'); // We need to add this ID to HTML if not present, or handle logic

        // Sounds (Optional - placeholders)
        const playSound = (type) => {
            // Placeholder for sound effects
        };

        const startQuiz = (type) => {
            currentQuestion = 0;
            score = 0;

            if (type === 'midterm') {
                activeQuizData = typeof midtermQuestions !== 'undefined' ? midtermQuestions : [];
            } else {
                activeQuizData = typeof finalQuestions !== 'undefined' ? finalQuestions : [];
            }

            if (activeQuizData.length === 0) {
                alert("ไม่พบข้อมูลข้อสอบ!");
                return;
            }

            quizSelection.style.display = 'none';
            resultScreen.style.display = 'none';
            quizGame.style.display = 'block';

            if (scoreDisplay) scoreDisplay.innerText = 0;
            loadQuestion();
        };

        const loadQuestion = () => {
            const totalQuestions = activeQuizData.length;
            if (currentQuestion >= totalQuestions) {
                showResults();
                return;
            }

            const data = activeQuizData[currentQuestion];
            if (questionText) questionText.innerText = data.question;

            // Update title with "Midterm/Final" and question number if needed, or just keep generic
            // Better: update sub-header?

            if (optionsContainer) {
                optionsContainer.innerHTML = '';
                data.options.forEach((option, index) => {
                    const btn = document.createElement('div');
                    btn.className = 'option-btn';
                    btn.innerText = option;
                    btn.onclick = () => checkAnswer(index, btn);
                    optionsContainer.appendChild(btn);
                });
            }
            updateProgress();
        };

        const checkAnswer = (selectedIndex, btnElement) => {
            if (optionsContainer.style.pointerEvents === 'none') return;
            optionsContainer.style.pointerEvents = 'none';

            const correctIndex = activeQuizData[currentQuestion].answer;
            const isCorrect = selectedIndex === correctIndex;

            if (isCorrect) {
                score++;
                if (scoreDisplay) scoreDisplay.innerText = score;
                btnElement.classList.add('correct');
                showFeedback('correct');
                playSound('correct');
                triggerConfetti();
            } else {
                btnElement.classList.add('wrong');
                const correctBtn = optionsContainer.children[correctIndex];
                if (correctBtn) correctBtn.classList.add('correct');
                showFeedback('wrong');
                playSound('wrong');
            }

            setTimeout(() => {
                currentQuestion++;
                if (optionsContainer) optionsContainer.style.pointerEvents = 'auto';
                loadQuestion();
            }, 1500);
        };

        const showFeedback = (type) => {
            if (!feedbackOverlay) return;
            feedbackOverlay.classList.add('active');
            if (type === 'correct') {
                if (feedbackIcon) feedbackIcon.innerText = '🎉';
                if (feedbackText) {
                    feedbackText.innerText = ['ถูกต้อง!', 'เยี่ยมมาก!', 'สุดยอด!'][Math.floor(Math.random() * 3)];
                    feedbackText.style.color = '#48bb78';
                }
            } else {
                if (feedbackIcon) feedbackIcon.innerText = '✌️';
                if (feedbackText) {
                    feedbackText.innerText = ['เกือบถูกแล้ว!', 'พยายามเข้านะ', 'สู้ๆ!'][Math.floor(Math.random() * 3)];
                    feedbackText.style.color = '#f56565';
                }
            }

            setTimeout(() => {
                feedbackOverlay.classList.remove('active');
            }, 1000);
        };

        const updateProgress = () => {
            if (progressFill) {
                const totalQuestions = activeQuizData.length;
                const progress = ((currentQuestion) / totalQuestions) * 100;
                progressFill.style.width = `${progress}%`;
            }
        };

        const showResults = () => {
            quizGame.style.display = 'none';
            if (resultScreen) {
                resultScreen.style.display = 'block';
                if (finalScore) finalScore.innerText = score + " / " + activeQuizData.length;
            }

            if (score > activeQuizData.length / 2) {
                triggerConfetti();
                setTimeout(triggerConfetti, 500);
            }
        };

        const triggerConfetti = () => {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        };

        // Event Listeners
        if (btnMidterm) btnMidterm.addEventListener('click', () => startQuiz('midterm'));
        if (btnFinal) btnFinal.addEventListener('click', () => startQuiz('final'));
        if (btnBackMenu) btnBackMenu.addEventListener('click', () => {
            quizGame.style.display = 'none';
            quizSelection.style.display = 'block';
        });

    }

    // --- Soft Abstract 3D Background Generator ---
    const initBackgroundShapes = () => {
        // Create container if not exists
        if (document.querySelector('.soft-background-container')) return;

        const container = document.createElement('div');
        container.className = 'soft-background-container';
        document.body.prepend(container);

        // Define shapes configurations
        const shapes = [
            // Large blurred shapes (Corners)
            { type: 'shape-sphere', size: 600, x: -10, y: -10, blur: 80, delay: 0 },
            { type: 'shape-cube', size: 500, x: 80, y: 70, blur: 60, delay: -5 },
            { type: 'shape-torus', size: 400, x: -5, y: 60, blur: 50, delay: -10 },

            // Medium/Small Accent shapes (Near center/content)
            { type: 'shape-sphere', size: 150, x: 70, y: 20, blur: 20, delay: -2 },
            { type: 'shape-pyramid', size: 120, x: 20, y: 80, blur: 10, delay: -7 },
            { type: 'shape-torus', size: 100, x: 85, y: 15, blur: 15, delay: -12 },
            { type: 'shape-cube', size: 80, x: 10, y: 40, blur: 10, delay: -4 }
        ];

        shapes.forEach(config => {
            const shape = document.createElement('div');
            shape.className = `soft-shape ${config.type}`;

            // random slight variation
            const randomOffset = Math.random() * 10;

            shape.style.width = `${config.size}px`;
            shape.style.height = `${config.size}px`;
            shape.style.left = `${config.x}%`;
            shape.style.top = `${config.y}%`;
            shape.style.filter = `blur(${config.blur}px)`;
            shape.style.animationDelay = `${config.delay}s`;

            container.appendChild(shape);
        });
    };

    initBackgroundShapes();

    // Initial State handled by CSS (selection show, game hide)
});
