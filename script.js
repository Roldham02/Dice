document.getElementById('roll-dice').addEventListener('click', rollDice);

function rollDice() {
    const diceCount = parseInt(document.getElementById('dice-count').value) || 1;
    const initialDiceType = parseInt(document.getElementById('dice-type').value);
    const diceTypes = Array(diceCount).fill(initialDiceType);
    const results = diceTypes.map(diceType => Math.floor(Math.random() * diceType) + 1);
    displayDiceResults(results, diceTypes);
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
            const newResult = Math.floor(Math.random() * newDiceType) + 1;
            const diceElement = select.closest('.dice');
            diceElement.className = `dice d${newDiceType}`;
            diceElement.querySelector('span').textContent = newResult;
            
            updateTotal();
        });
    });
}

function updateTotal() {
    const diceElements = document.querySelectorAll('.dice span');
    const total = Array.from(diceElements).reduce((sum, die) => sum + parseInt(die.textContent), 0);
    document.getElementById('total-result').textContent = `Total: ${total}`;
}
