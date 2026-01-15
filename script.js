// Calculator State
let currentInput = '';
let expression = '';
let history = [];
let isScientificMode = false;

// DOM Elements
const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');
const modeToggle = document.getElementById('modeToggle');
const calculator = document.querySelector('.calculator');
const historyToggle = document.getElementById('historyToggle');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadHistory();
});

// Event Listeners Setup
function setupEventListeners() {
    // Button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', handleButtonClick);
    });

    // Mode toggle
    modeToggle.addEventListener('click', toggleScientificMode);

    // History toggle
    historyToggle.addEventListener('click', toggleHistory);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

// Handle Button Clicks
function handleButtonClick(e) {
    const btn = e.currentTarget;
    const value = btn.dataset.value;
    const action = btn.dataset.action;
    const func = btn.dataset.function;

    if (value !== undefined) {
        handleValue(value);
    } else if (action) {
        handleAction(action);
    } else if (func) {
        handleFunction(func);
    }
}

// Handle Value Input
function handleValue(value) {
    if (value === 'pi') {
        currentInput += Math.PI.toString();
        expression += 'π';
    } else {
        currentInput += value;
        expression += value;
    }
    updateDisplay();
}

// Handle Actions
function handleAction(action) {
    switch (action) {
        case 'clear':
            clear();
            break;
        case 'backspace':
            backspace();
            break;
        case 'equals':
            calculate();
            break;
        case 'percent':
            handlePercent();
            break;
        case 'negate':
            negate();
            break;
    }
}

// Handle Scientific Functions
function handleFunction(func) {
    const num = parseFloat(currentInput) || 0;
    let result;

    switch (func) {
        case 'sqrt':
            result = Math.sqrt(num);
            expression = `√(${currentInput})`;
            break;
        case 'sin':
            result = Math.sin(num * Math.PI / 180);
            expression = `sin(${currentInput})`;
            break;
        case 'cos':
            result = Math.cos(num * Math.PI / 180);
            expression = `cos(${currentInput})`;
            break;
        case 'tan':
            result = Math.tan(num * Math.PI / 180);
            expression = `tan(${currentInput})`;
            break;
        case 'pow':
            result = Math.pow(num, 2);
            expression = `(${currentInput})²`;
            break;
        case 'ln':
            result = Math.log(num);
            expression = `ln(${currentInput})`;
            break;
        case 'log':
            result = Math.log10(num);
            expression = `log(${currentInput})`;
            break;
    }

    if (result !== undefined) {
        currentInput = result.toString();
        addToHistory(expression, result);
        updateDisplay();
    }
}

// Clear
function clear() {
    currentInput = '';
    expression = '';
    updateDisplay();
}

// Backspace
function backspace() {
    currentInput = currentInput.slice(0, -1);
    expression = expression.slice(0, -1);
    updateDisplay();
}

// Calculate
function calculate() {
    if (!currentInput && !expression) return;

    try {
        // Replace display symbols with actual operators
        let evalExpression = currentInput
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, Math.PI.toString());

        // Evaluate the expression
        const result = eval(evalExpression);
        
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }

        // Round to avoid floating point errors
        const roundedResult = Math.round(result * 1000000000) / 1000000000;
        
        addToHistory(expression || currentInput, roundedResult);
        currentInput = roundedResult.toString();
        expression = '';
        updateDisplay();
    } catch (error) {
        resultDisplay.textContent = 'Error';
        setTimeout(() => {
            clear();
        }, 1500);
    }
}

// Handle Percent
function handlePercent() {
    if (currentInput) {
        const num = parseFloat(currentInput);
        currentInput = (num / 100).toString();
        expression = expression.slice(0, -1) + '%';
        updateDisplay();
    }
}

// Negate
function negate() {
    if (currentInput) {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
            expression = expression.replace(/^-/, '');
        } else {
            currentInput = '-' + currentInput;
            expression = '-' + expression;
        }
        updateDisplay();
    }
}

// Update Display
function updateDisplay() {
    expressionDisplay.textContent = expression;
    resultDisplay.textContent = currentInput || '0';
}

// Toggle Scientific Mode
function toggleScientificMode() {
    isScientificMode = !isScientificMode;
    calculator.classList.toggle('scientific-mode');
    
    // Add rotation animation
    modeToggle.style.transform = isScientificMode ? 'rotate(180deg)' : 'rotate(0deg)';
}

// History Management
function toggleHistory() {
    historyPanel.classList.toggle('active');
}

function addToHistory(expr, result) {
    const historyItem = {
        expression: expr,
        result: result,
        timestamp: new Date().toLocaleTimeString()
    };
    
    history.unshift(historyItem);
    
    // Limit history to 50 items
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    saveHistory();
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No calculations yet</p>';
        return;
    }

    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item" data-index="${index}">
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">= ${item.result}</div>
        </div>
    `).join('');

    // Add click listeners to history items
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = item.dataset.index;
            const historyItem = history[index];
            currentInput = historyItem.result.toString();
            expression = '';
            updateDisplay();
            toggleHistory();
        });
    });
}

function clearHistory() {
    if (confirm('Clear all history?')) {
        history = [];
        saveHistory();
        renderHistory();
    }
}

function saveHistory() {
    try {
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
    } catch (e) {
        console.error('Failed to save history:', e);
    }
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('calculatorHistory');
        if (saved) {
            history = JSON.parse(saved);
            renderHistory();
        }
    } catch (e) {
        console.error('Failed to load history:', e);
        history = [];
    }
}

// Keyboard Support
function handleKeyboard(e) {
    const key = e.key;

    // Numbers and operators
    if (/[0-9]/.test(key)) {
        handleValue(key);
    } else if (key === '.') {
        handleValue('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleValue(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === '%') {
        handlePercent();
    } else if (key === '(' || key === ')') {
        handleValue(key);
    }
}

// Add visual feedback for keyboard presses
document.addEventListener('keydown', (e) => {
    const keyMap = {
        '0': '[data-value="0"]',
        '1': '[data-value="1"]',
        '2': '[data-value="2"]',
        '3': '[data-value="3"]',
        '4': '[data-value="4"]',
        '5': '[data-value="5"]',
        '6': '[data-value="6"]',
        '7': '[data-value="7"]',
        '8': '[data-value="8"]',
        '9': '[data-value="9"]',
        '+': '[data-value="+"]',
        '-': '[data-value="-"]',
        '*': '[data-value="*"]',
        '/': '[data-value="/"]',
        '.': '[data-value="."]',
        'Enter': '[data-action="equals"]',
        'Escape': '[data-action="clear"]',
        'Backspace': '[data-action="backspace"]'
    };

    const selector = keyMap[e.key];
    if (selector) {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 100);
        }
    }
});
