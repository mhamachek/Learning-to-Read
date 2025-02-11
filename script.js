class LetterGrid {
    constructor() {
        this.currentIndex = 0;
        this.letters = [];
        this.stats = {
            correct: 0,
            incorrect: 0
        };
        this.initializeElements();
        this.setupEventListeners();
        this.generateLetterCheckboxes();
        this.restart();
    }

    initializeElements() {
        this.gridContainer = document.getElementById('letterGrid');
        this.settingsToggle = document.getElementById('settingsToggle');
        this.settingsContent = document.getElementById('settingsContent');
        this.gridSizeSelect = document.getElementById('gridSize');
        this.fontSelect = document.getElementById('fontSelect');
        this.letterCheckboxes = document.getElementById('letterCheckboxes');
        this.modeRadios = document.querySelectorAll('input[name="mode"]');
        this.commonMistakesBtn = document.getElementById('commonMistakes');
        this.restartBtn = document.getElementById('restart');
    }

    setupEventListeners() {
        this.settingsToggle.addEventListener('click', () => {
            this.settingsContent.classList.toggle('hidden');
        });

        this.gridSizeSelect.addEventListener('change', () => this.restart());
        this.fontSelect.addEventListener('change', () => this.updateFont());
        
        this.modeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.letterCheckboxes.classList.toggle('hidden', radio.value === 'random');
                this.restart();
            });
        });

        this.commonMistakesBtn.addEventListener('click', () => {
            document.getElementById('customMode').checked = true;
            this.letterCheckboxes.classList.remove('hidden');
            this.selectCommonMistakes();
            this.restart();
        });

        this.restartBtn.addEventListener('click', () => this.restart());
    }

    generateLetterCheckboxes() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.letterCheckboxes.innerHTML = alphabet.split('').map(letter => `
            <label>
                <input type="checkbox" value="${letter}"> ${letter}
            </label>
        `).join('');
    }

    selectCommonMistakes() {
        const commonMistakes = ['H', 'W', 'X'];
        const checkboxes = this.letterCheckboxes.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = commonMistakes.includes(checkbox.value);
        });
    }

    getSelectedLetters() {
        const mode = document.querySelector('input[name="mode"]:checked').value;
        if (mode === 'random') {
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        }
        
        const checked = [...this.letterCheckboxes.querySelectorAll('input:checked')];
        return checked.map(cb => cb.value);
    }

    generateLetters() {
        const selectedLetters = this.getSelectedLetters();
        const gridSize = parseInt(this.gridSizeSelect.value);
        this.letters = Array(gridSize).fill().map(() => {
            const letter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
            return Math.random() > 0.5 ? letter.toLowerCase() : letter.toUpperCase();
        });
    }

    createGrid() {
        this.gridContainer.innerHTML = '';
        this.letters.forEach((letter, index) => {
            const cell = document.createElement('div');
            cell.className = 'letter-cell';
            cell.textContent = letter;
            
            // Add hover detection
            cell.addEventListener('mousemove', (e) => {
                if (cell.classList.contains('active')) {
                    const rect = cell.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const isTopZone = y < rect.height * 0.7;
                    
                    cell.classList.toggle('hover-top', isTopZone);
                    cell.classList.toggle('hover-bottom', !isTopZone);
                }
            });
            
            cell.addEventListener('mouseleave', () => {
                cell.classList.remove('hover-top', 'hover-bottom');
            });
            
            cell.addEventListener('click', (e) => this.handleClick(e, index));
            this.gridContainer.appendChild(cell);
        });
        this.updateActiveCell();
    }

    handleClick(event, index) {
        if (index !== this.currentIndex) return;

        const cell = event.currentTarget;
        const rect = cell.getBoundingClientRect();
        const clickY = event.clientY - rect.top;
        const isTopHalf = clickY < rect.height * 0.7;

        if (isTopHalf) {
            cell.classList.add('correct');
            this.stats.correct++;
        } else {
            cell.classList.add('incorrect');
            this.stats.incorrect++;
        }

        this.currentIndex++;
        this.updateActiveCell();
        this.updateStats();
    }

    updateActiveCell() {
        const cells = this.gridContainer.children;
        [...cells].forEach((cell, index) => {
            cell.classList.toggle('active', index === this.currentIndex);
        });

        if (this.currentIndex >= this.letters.length) {
            document.getElementById('stats').classList.remove('hidden');
        }
    }

    updateStats() {
        document.getElementById('correctCount').textContent = this.stats.correct;
        document.getElementById('incorrectCount').textContent = this.stats.incorrect;
    }

    updateFont() {
        this.gridContainer.style.fontFamily = this.fontSelect.value;
    }

    restart() {
        this.currentIndex = 0;
        this.stats.correct = 0;
        this.stats.incorrect = 0;
        this.generateLetters();
        this.createGrid();
        this.updateFont();
        this.updateStats();
        document.getElementById('stats').classList.add('hidden');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LetterGrid();
}); 