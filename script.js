const board = document.getElementById('board')
const cellElements = document.querySelectorAll('[data-cell]')
const winningMessage = document.getElementById('winningMessage')
const winnerText = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')

const Player = (mark) => {
    return { mark }
}

const x = Player('x')
const o = Player('o')

function handleClick(e) {
    // Place mark
    const cell = e.target
    gameModule.placeMark(cell)
    // Check for win
    gameModule.checkWin()
    // Check for draw
    gameModule.checkDraw()
    gameModule.displayWinner()
    // Switch turns
    gameModule.switchTurns()
}

let gameModule = (function gameModule() {
    let _gameboard
    let _oTurn
    let _currentTurn

    function start() {
        _gameboard = [[...Array(3)], [...Array(3)], [...Array(3)]]
        _oTurn = false
        _currentTurn = x.mark
        board.classList.add(x.mark)
        cellElements.forEach((cell) => {
            cell.addEventListener('click', handleClick, { once: true })
            cell.classList.remove(x.mark)
            cell.classList.remove(o.mark)
        })
    }

    function placeMark(cell) {
        const { row } = cell.dataset
        const { col } = cell.dataset
        if (_oTurn) {
            cell.classList.add(o.mark)
            _gameboard[row][col] = o.mark
        } else {
            cell.classList.add(x.mark)
            _gameboard[row][col] = x.mark
        }
    }

    function switchTurns() {
        if (_oTurn) {
            board.classList.remove(o.mark)
            board.classList.add(x.mark)
            _currentTurn = x.mark
        } else {
            board.classList.remove(x.mark)
            board.classList.add(o.mark)
            _currentTurn = o.mark
        }
        _oTurn = !_oTurn
    }

    function checkWin() {
        const winCombo = [
            // rows
            [_gameboard[0][0], _gameboard[0][1], _gameboard[0][2]], // 0
            [_gameboard[1][0], _gameboard[1][1], _gameboard[1][2]], // 1
            [_gameboard[2][0], _gameboard[2][1], _gameboard[2][2]], // 2
            // cols
            [_gameboard[0][0], _gameboard[1][0], _gameboard[2][0]], // 3
            [_gameboard[0][1], _gameboard[1][1], _gameboard[2][1]], // 4
            [_gameboard[0][2], _gameboard[1][2], _gameboard[2][2]], // 5
            // diag
            [_gameboard[0][0], _gameboard[1][1], _gameboard[2][2]], // 6
            [_gameboard[2][0], _gameboard[1][1], _gameboard[0][2]], // 7
        ]
        const allEqual = (arr) =>
            arr.every((val) => val === arr[0] && typeof val !== 'undefined')
        return (
            allEqual(winCombo[0]) ||
            allEqual(winCombo[1]) ||
            allEqual(winCombo[2]) ||
            allEqual(winCombo[3]) ||
            allEqual(winCombo[4]) ||
            allEqual(winCombo[5]) ||
            allEqual(winCombo[6]) ||
            allEqual(winCombo[7])
        )
    }

    function displayWinner() {
        if (checkWin()) {
            const content = document.createTextNode(`${_currentTurn}'s win!`)
            winnerText.appendChild(content)
            winningMessage.classList.add('show')
        }
        if (checkDraw()) {
            const content = document.createTextNode("It's a draw!")
            winnerText.appendChild(content)
            winningMessage.classList.add('show')
        }
    }

    function checkDraw() {
        return (
            !_gameboard[0].includes(undefined) &&
            !_gameboard[1].includes(undefined) &&
            !_gameboard[2].includes(undefined)
        )
    }

    function restart() {
        winnerText.removeChild(winnerText.lastChild)
        winningMessage.classList.remove('show')
        board.classList.remove(x.mark)
        board.classList.remove(o.mark)
        start()
    }

    return {
        start,
        placeMark,
        switchTurns,
        checkWin,
        displayWinner,
        checkDraw,
        restart,
    }
})()

gameModule.start()
restartButton.addEventListener('click', gameModule.restart)
