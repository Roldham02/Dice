let timerInterval;
let remainingTime = 0;
let currentDiceTypes = [];
let diceStats = {
  d4: { rolls: 0, sum: 0, frequency: {} },
  d6: { rolls: 0, sum: 0, frequency: {} },
  d8: { rolls: 0, sum: 0, frequency: {} },
  d10: { rolls: 0, sum: 0, frequency: {} },
  d12: { rolls: 0, sum: 0, frequency: {} },
  d20: { rolls: 0, sum: 0, frequency: {} }
};

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
    const initialDiceType = parseInt(document.getElementById('dice-type').value);
    
    if (currentDiceTypes.length !== diceCount) {
        currentDiceTypes = Array(diceCount).fill(initialDiceType);
    }
    
    const results = currentDiceTypes.map(diceType => {
        const result = Math.floor(Math.random() * diceType) + 1;
        updateStats(diceType, result);
        return result;
    });
    displayDiceResults(results, currentDiceTypes);
    displayStats();
}

function updateStats(diceType, result) {
    const statKey = `d${diceType}`;
    diceStats[statKey].rolls++;
    diceStats[statKey].sum += result;
    diceStats[statKey].frequency[result] = (diceStats[statKey].frequency[result] || 0) + 1;
}

function displayDiceResults(results, diceTypes) {
    const individualResults = document.getElementById('individual-results');
    const totalResult = document.getElementById('total-result');
    
    individualResults.innerHTML = results.map((result, index) => 
        `<div class="dice d${diceTypes[index]}">
            <span>${result}</span>
            <select class="dice-type-select">
                <option value="4" ${diceTypes[index] === 4 ? 'selected' : ''}>D4</option>
                <option value="6" ${diceTypes[index] === 6 ? 'selected' : ''}>D6</option>
                <option value="8" ${diceTypes[index] === 8 ? 'selected' : ''}>D8</option>
                <option value="10" ${diceTypes[index] === 10 ? 'selected' : ''}>D10</option>
                <option value="12" ${diceTypes[index] === 12 ? 'selected' : ''}>D12</option>
                <option value="20" ${diceTypes[index] === 20 ? 'selected' : ''}>D20</option>
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

    addDiceChangeListeners();
}

function addDiceChangeListeners() {
    const diceTypeSelects = document.querySelectorAll('.dice-type-select');
    diceTypeSelects.forEach((select, index) => {
        select.addEventListener('change', (event) => {
            const newDiceType = parseInt(event.target.value);
            currentDiceTypes[index] = newDiceType;
            const newResult = Math.floor(Math.random() * newDiceType) + 1;
            const diceElement = select.closest('.dice');
            diceElement.className = `dice d${newDiceType}`;
            diceElement.querySelector('span').textContent = newResult;
            
            updateStats(newDiceType, newResult);
            updateTotal();
            displayStats();
        });
    });
}

function updateTotal() {
    const diceElements = document.querySelectorAll('.dice span');
    const total = Array.from(diceElements).reduce((sum, die) => sum + parseInt(die.textContent), 0);
    document.getElementById('total-result').textContent = `Total: ${total}`;
}

function displayStats() {
    const statsContainer = document.getElementById('dice-stats');
    statsContainer.innerHTML = '';
    
    for (const [diceType, stats] of Object.entries(diceStats)) {
        if (stats.rolls > 0) {
            const average = (stats.sum / stats.rolls).toFixed(2);
            const mostFrequent = Object.entries(stats.frequency).reduce((a, b) => a[1] > b[1] ? a : b)[0];
            
            statsContainer.innerHTML += `
                <p>${diceType}: 
                   Rolls: ${stats.rolls}, 
                   Average: ${average}, 
                   Most frequent: ${mostFrequent}
                </p>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const savedState = JSON.parse(localStorage.getItem('timerState'));
    if (savedState) {
        const elapsedTime = Math.floor((Date.now() - savedState.lastUpdated) / 1000);
        remainingTime = Math.max(0, savedState.remainingTime - elapsedTime);
        updateTimerDisplay();
    }
});
