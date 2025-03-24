let timerInterval;
let remainingTime = 0;

document.getElementById('start-timer').addEventListener('click', function() {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    remainingTime = hours * 3600 + minutes * 60 + seconds;
    updateTimerDisplay();

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
        } else {
            remainingTime--;
            updateTimerDisplay();
            saveTimerState();
        }
    }, 1000);
});

document.getElementById('pause-timer').addEventListener('click', function() {
    clearInterval(timerInterval);
});

document.getElementById('reset-timer').addEventListener('click', function() {
    clearInterval(timerInterval);
    remainingTime = 0;
    document.getElementById('hours').value = '';
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
    updateTimerDisplay();
    saveTimerState();
});

function updateTimerDisplay() {
    const hours = Math.floor(remainingTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((remainingTime % 3600) / 60).toString().padStart(2, '0');
    const seconds = (remainingTime % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').textContent = `${hours}:${minutes}:${seconds}`;
}

function saveTimerState() {
    localStorage.setItem('timerState', JSON.stringify({
        remainingTime,
        lastUpdated: Date.now()
    }));
}

document.addEventListener('mousemove', function(e) {
    document.getElementById('mouse-tracker').textContent = `X: ${e.clientX}, Y: ${e.clientY}`;
});

document.getElementById('roll-dice').addEventListener('click', rollDice);

function rollDice() {
    const diceCount = parseInt(document.getElementById('dice-count').value) || 1;
    const diceType = parseInt(document.getElementById('dice-type').value);
    const results = [];
    for (let i = 0; i < diceCount; i++) {
        results.push(Math.floor(Math.random() * diceType) + 1);
    }
    displayDiceResults(results, diceType);
}

function displayDiceResults(results, diceType) {
    const individualResults = document.getElementById('individual-results');
    const totalResult = document.getElementById('total-result');
    
    individualResults.innerHTML = results.map(result => 
        `<div class="dice d${diceType}">
            <span>${result}</span>
            <select class="dice-type-select">
                <option value="4" ${diceType === 4 ? 'selected' : ''}>D4</option>
                <option value="6" ${diceType === 6 ? 'selected' : ''}>D6</option>
                <option value="8" ${diceType === 8 ? 'selected' : ''}>D8</option>
                <option value="10" ${diceType === 10 ? 'selected' : ''}>D10</option>
                <option value="12" ${diceType === 12 ? 'selected' : ''}>D12</option>
                <option value="20" ${diceType === 20 ? 'selected' : ''}>D20</option>
            </select>
        </div>`
    ).join('');

    const total = results.reduce((sum, current) => sum + current, 0);
    totalResult.textContent = `Total: ${total}`;

    const diceElements = individualResults.querySelectorAll('.dice');
    diceElements.forEach(die => {
        die.classList.add('rolling');
        die.addEventListener('animationend', () => {
            die.classList.remove('rolling');
        }, {once: true});
    });

    const diceTypeSelects = individualResults.querySelectorAll('.dice-type-select');
    diceTypeSelects.forEach((select, index) => {
        select.addEventListener('change', (event) => {
            const newDiceType = parseInt(event.target.value);
            const newResult = Math.floor(Math.random() * newDiceType) + 1;
            const diceElement = select.closest('.dice');
            diceElement.className = `dice d${newDiceType}`;
            diceElement.querySelector('span').textContent = newResult;
            
            results[index] = newResult;
            const newTotal = results.reduce((sum, current) => sum + current, 0);
            totalResult.textContent = `Total: ${newTotal}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const savedState = JSON.parse(localStorage.getItem('timerState'));
    if (savedState) {
        const elapsedTime = Math.floor((Date.now() - savedState.lastUpdated) / 1000);
        remainingTime = Math.max(0, savedState.remainingTime - elapsedTime);
        updateTimerDisplay();
    }
});
