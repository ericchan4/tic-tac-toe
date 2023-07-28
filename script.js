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
    gameModule.displayWinner()
    // Check for draw
    // Switch turns
    gameModule.switchTurns()
}

let gameModule = (function () {
    let gameboard
    let oTurn
    let currentTurn

    function start() {
        gameboard = [[...Array(3)], [...Array(3)], [...Array(3)]]
        console.log(gameboard)
        oTurn = false
        currentTurn = x.mark
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
        if (oTurn) {
            cell.classList.add(o.mark)
            gameboard[row][col] = o.mark
        } else {
            cell.classList.add(x.mark)
            gameboard[row][col] = x.mark
        }
    }

    function switchTurns() {
        if (oTurn) {
            board.classList.remove(o.mark)
            board.classList.add(x.mark)
            currentTurn = x.mark
        } else {
            board.classList.remove(x.mark)
            board.classList.add(o.mark)
            currentTurn = o.mark
        }
        oTurn = !oTurn
    }

    function checkWin() {
        const winCombo = [
            // rows
            [gameboard[0][0], gameboard[0][1], gameboard[0][2]], // 0
            [gameboard[1][0], gameboard[1][1], gameboard[1][2]], // 1
            [gameboard[2][0], gameboard[2][1], gameboard[2][2]], // 2
            // cols
            [gameboard[0][0], gameboard[1][0], gameboard[2][0]], // 3
            [gameboard[0][1], gameboard[1][1], gameboard[2][1]], // 4
            [gameboard[0][2], gameboard[1][2], gameboard[2][2]], // 5
            // diag
            [gameboard[0][0], gameboard[1][1], gameboard[2][2]], // 6
            [gameboard[2][0], gameboard[1][1], gameboard[0][2]], // 7
        ]
        const allEqual = (arr) =>
            arr.every((val) => val === arr[0] && val !== undefined)
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
            const content = document.createTextNode(`${currentTurn}'s win!`)
            winnerText.appendChild(content)
            winningMessage.classList.add('show')
        }
    }

    function checkDraw() {}

    function restart() {
        winnerText.removeChild(winnerText.lastChild)
        winningMessage.classList.remove('show')
        board.classList.remove(x.mark)
        board.classList.remove(o.mark)
        start()
    }

    return {
        gameboard,
        currentTurn,
        start,
        placeMark,
        switchTurns,
        checkWin,
        displayWinner,
        restart,
    }
})()

gameModule.start()
restartButton.addEventListener('click', gameModule.restart)
