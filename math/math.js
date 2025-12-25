//burger menu

// calculator

// guide answer

//notes

// Enhanced Calculator functionality
let currentInput = '';
let previousInput = '';
let operation = null;
let memory = 0;
let shouldResetScreen = false;
let isRadians = true;
let isSecondMode = false;
let history = [];
let maxHistory = 10;

// Display elements
const operDisplay = document.getElementById('operDisplay');
const equalDisplay = document.getElementById('equalDisplay');

// Initialize calculator
function initCalculator() {
    clearDisplay();
    updateDisplay();
    showModeIndicator();
}

// Clear display and reset calculator state
function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
}

// Append character to current input
function appendToDisplay(value) {
    if (shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }
    
    // Handle special cases
    switch(value) {
        case 'mc':
            memory = 0;
            showNotification('Memory cleared');
            return;
        case 'm+':
            if (currentInput !== '') {
                memory += parseFloat(currentInput);
                showNotification(`Added ${currentInput} to memory`);
            }
            return;
        case 'm-':
            if (currentInput !== '') {
                memory -= parseFloat(currentInput);
                showNotification(`Subtracted ${currentInput} from memory`);
            }
            return;
        case 'mr':
            currentInput = memory.toString();
            updateDisplay();
            showNotification(`Memory recalled: ${memory}`);
            return;
        case 'Rand':
            currentInput = (Math.random() * 100).toFixed(6);
            updateDisplay();
            return;
        case 'Rad':
            isRadians = !isRadians;
            showModeIndicator();
            showNotification(isRadians ? 'Radian mode' : 'Degree mode');
            return;
        case 'EE':
            if (!currentInput.includes('e')) {
                currentInput += 'e';
                updateDisplay();
            }
            return;
        case '2ndOPER':
            isSecondMode = !isSecondMode;
            showModeIndicator();
            showNotification(isSecondMode ? 'Second mode ON' : 'Second mode OFF');
            return;
    }
    
    // Handle scientific functions with second mode
    const scientificFunctions = isSecondMode ? 
        ['sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'sinh', 'cosh', 'tanh', 'log₂', '√', '∛', 'x!', '^2', '^3', 'e^x', '⅟', '10^x', '|x|'] :
        ['sin', 'cos', 'tan', 'log10', 'ln', '√', '∛', 'x!', '^2', '^3', 'e^x', '⅟'];
    
    if (scientificFunctions.includes(value)) {
        applyScientificFunction(value);
        return;
    }
    
    // Handle operators
    if (['+', '-', '×', '÷', '%', '^'].includes(value)) {
        handleOperator(value);
        return;
    }
    
    // Handle decimal point
    if (value === '.' && currentInput.includes('.')) {
        return;
    }
    
    // Handle parentheses
    if (value === '(' || value === ')') {
        if (value === '(' || (value === ')' && countChar(currentInput, '(') > countChar(currentInput, ')'))) {
            currentInput += value;
            updateDisplay();
        }
        return;
    }
    
    // Handle numbers
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    
    updateDisplay();
}

// Count occurrences of a character in a string
function countChar(str, char) {
    return (str.match(new RegExp('\\' + char, 'g')) || []).length;
}

// Apply scientific functions
function applyScientificFunction(func) {
    const num = parseFloat(currentInput);
    if (isNaN(num)) {
        showNotification('Invalid input for function');
        return;
    }
    
    let result;
    const angle = isRadians ? num : num * Math.PI / 180;
    
    try {
        switch(func) {
            case 'sin':
                result = Math.sin(angle);
                break;
            case 'cos':
                result = Math.cos(angle);
                break;
            case 'tan':
                result = Math.tan(angle);
                break;
            case 'sin⁻¹':
                result = isRadians ? Math.asin(num) : Math.asin(num) * 180 / Math.PI;
                break;
            case 'cos⁻¹':
                result = isRadians ? Math.acos(num) : Math.acos(num) * 180 / Math.PI;
                break;
            case 'tan⁻¹':
                result = isRadians ? Math.atan(num) : Math.atan(num) * 180 / Math.PI;
                break;
            case 'sinh':
                result = Math.sinh(num);
                break;
            case 'cosh':
                result = Math.cosh(num);
                break;
            case 'tanh':
                result = Math.tanh(num);
                break;
            case 'log10':
                if (num <= 0) throw new Error('Invalid input for log10');
                result = Math.log10(num);
                break;
            case 'ln':
                if (num <= 0) throw new Error('Invalid input for ln');
                result = Math.log(num);
                break;
            case 'log₂':
                if (num <= 0) throw new Error('Invalid input for log₂');
                result = Math.log2(num);
                break;
            case '√':
                if (num < 0) throw new Error('Invalid input for square root');
                result = Math.sqrt(num);
                break;
            case '∛':
                result = Math.cbrt(num);
                break;
            case 'x!':
                result = factorial(num);
                break;
            case '^2':
                result = Math.pow(num, 2);
                break;
            case '^3':
                result = Math.pow(num, 3);
                break;
            case 'e^x':
                result = Math.exp(num);
                break;
            case '10^x':
                result = Math.pow(10, num);
                break;
            case '⅟':
                if (num === 0) throw new Error('Division by zero');
                result = 1 / num;
                break;
            case '|x|':
                result = Math.abs(num);
                break;
        }
        
        // Add to history
        addToHistory(`${func}(${currentInput}) = ${formatResult(result)}`);
        
        currentInput = formatResult(result);
        shouldResetScreen = true;
        updateDisplay();
        
    } catch (error) {
        showNotification(error.message);
        currentInput = 'Error';
        updateDisplay();
    }
}

// Calculate factorial with better error handling
function factorial(n) {
    if (n < 0 || n !== Math.floor(n)) {
        throw new Error('Factorial requires non-negative integer');
    }
    if (n > 170) {
        throw new Error('Number too large for factorial');
    }
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Handle operators with improved logic
function handleOperator(op) {
    if (currentInput === '' && previousInput === '') return;
    
    if (currentInput === '') {
        operation = op;
        return;
    }
    
    if (previousInput !== '') {
        calculate();
    }
    
    operation = op;
    previousInput = currentInput;
    shouldResetScreen = true;
    updateDisplay();
}

// Perform calculation with enhanced error handling
function calculate() {
    if (currentInput === '' || previousInput === '') return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) {
        showNotification('Invalid numbers for calculation');
        return;
    }
    
    let result;
    
    try {
        switch(operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) throw new Error('Division by zero');
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            case '^':
                if (prev === 0 && current < 0) throw new Error('Invalid power operation');
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        // Add to history
        addToHistory(`${previousInput} ${operation} ${currentInput} = ${formatResult(result)}`);
        
        currentInput = formatResult(result);
        operation = null;
        previousInput = '';
        shouldResetScreen = true;
        updateDisplay();
        
    } catch (error) {
        showNotification(error.message);
        currentInput = 'Error';
        updateDisplay();
    }
}

// Remove last character with improved logic
function remove() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
}

// Enhanced result formatting
function formatResult(num) {
    if (isNaN(num)) return 'Error';
    if (!isFinite(num)) {
        if (num > 0) return 'Infinity';
        if (num < 0) return '-Infinity';
        return 'Error';
    }
    
    // Handle very large or very small numbers
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-10 && num !== 0)) {
        return num.toExponential(6);
    }
    
    // Handle decimal places with smart rounding
    const str = num.toString();
    if (str.includes('.')) {
        const parts = str.split('.');
        if (parts[1].length > 8) {
            // Smart rounding to avoid floating point errors
            return Math.round(num * 1e8) / 1e8;
        }
    }
    
    return str;
}

// Update display with enhanced formatting
function updateDisplay() {
    // Update operation display
    if (previousInput !== '' && operation !== null) {
        operDisplay.textContent = `${previousInput} ${operation}`;
    } else {
        operDisplay.textContent = '';
    }
    
    // Update current input display with better formatting
    const displayText = currentInput || '0';
    equalDisplay.textContent = displayText;
    
    // Add visual feedback for long numbers
    if (displayText.length > 12) {
        equalDisplay.style.fontSize = '2rem';
    } else {
        equalDisplay.style.fontSize = '3rem';
    }
}

// Add calculation to history
function addToHistory(calculation) {
    history.unshift(calculation);
    if (history.length > maxHistory) {
        history.pop();
    }
}

// Show mode indicator
function showModeIndicator() {
    const modeText = [];
    if (isRadians) modeText.push('RAD');
    else modeText.push('DEG');
    if (isSecondMode) modeText.push('2nd');
    
    // You can add a mode indicator element to the HTML if needed
    console.log('Mode:', modeText.join(' '));
}

// Show notification (can be enhanced with a proper UI)
function showNotification(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => notification.style.opacity = '1', 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Enhanced keyboard input handling
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Prevent default for calculator keys
    if (['+', '-', '*', '/', '%', 'Enter', '=', 'Backspace', 'Escape', '(', ')', '.'].includes(key)) {
        event.preventDefault();
    }
    
    // Numbers
    if (/[0-9]/.test(key)) {
        appendToDisplay(key);
    }
    // Decimal point
    else if (key === '.') {
        appendToDisplay('.');
    }
    // Operators
    else if (['+', '-', '*', '/', '%'].includes(key)) {
        const opMap = {
            '*': '×',
            '/': '÷'
        };
        appendToDisplay(opMap[key] || key);
    }
    // Enter or equals
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Backspace
    else if (key === 'Backspace') {
        remove();
    }
    // Escape or clear
    else if (key === 'Escape') {
        clearDisplay();
    }
    // Parentheses
    else if (key === '(' || key === ')') {
        appendToDisplay(key);
    }
    // Power
    else if (key === '^') {
        appendToDisplay('^');
    }
});

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', initCalculator);