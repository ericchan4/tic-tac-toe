const board = document.getElementById('board')
const cellElements = document.querySelectorAll('[data-cell]')
const winningMessage = document.getElementById('winningMessage')
const winnerText = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')

const Player = (mark) => {
    return { mark }
}

const X = Player('x')
const O = Player('o')

function gameController(e) {
    const cell = e.target
    gameModule.placeMark(cell)
    gameModule.checkWin()
    gameModule.checkDraw()
    if (gameModule.displayWinner()) return
    gameModule.switchTurns()
    gameModule.aiMove()
    gameModule.checkWin()
    gameModule.checkDraw()
    if (gameModule.displayWinner()) return
    gameModule.switchTurns()
}

let gameModule = (function gameModule() {
    let _gameboard
    let _oTurn
    let _currentTurn

    function start() {
        _gameboard = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ]
        _oTurn = false
        _currentTurn = X.mark
        board.classList.add(X.mark)
        cellElements.forEach((cell) => {
            cell.addEventListener('click', gameController, { once: true })
            cell.classList.remove(X.mark)
            cell.classList.remove(O.mark)
        })
    }

    function placeMark(cell) {
        const { row } = cell.dataset
        const { col } = cell.dataset
        if (_oTurn) {
            cell.classList.add(O.mark)
            _gameboard[row][col] = O.mark
        } else {
            cell.classList.add(X.mark)
            _gameboard[row][col] = X.mark
        }
    }

    function getValidMoves() {
        const validMoves = []
        for (let i = 0; i <= 2; i += 1) {
            for (let j = 0; j <= 2; j += 1) {
                if (_gameboard[i][j] === '') {
                    const coord = {
                        row: i,
                        col: j,
                    }
                    validMoves.push(coord)
                }
            }
        }
        return validMoves
    }

    function aiMove() {
        const randomIndex = Math.floor(Math.random() * getValidMoves().length)

        const { row } = getValidMoves()[randomIndex]
        const { col } = getValidMoves()[randomIndex]
        const cell = document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`
        )
        placeMark(cell)
    }

    function switchTurns() {
        if (_oTurn) {
            board.classList.remove(O.mark)
            board.classList.add(X.mark)
            _currentTurn = X.mark
        } else {
            board.classList.remove(X.mark)
            board.classList.add(O.mark)
            _currentTurn = O.mark
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
            arr.every((val) => val === arr[0] && val !== '')
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
            return true
        }
        if (checkDraw()) {
            const content = document.createTextNode("It's a draw!")
            winnerText.appendChild(content)
            winningMessage.classList.add('show')
            return true
        }
        return false
    }

    function checkDraw() {
        if (!checkWin()) {
            return (
                !_gameboard[0].includes('') &&
                !_gameboard[1].includes('') &&
                !_gameboard[2].includes('')
            )
        }
        return false
    }

    function restart() {
        winnerText.removeChild(winnerText.lastChild)
        winningMessage.classList.remove('show')
        board.classList.remove(X.mark)
        board.classList.remove(O.mark)
        start()
    }

    return {
        start,
        placeMark,
        aiMove,
        switchTurns,
        checkWin,
        displayWinner,
        checkDraw,
        restart,
        getValidMoves,
    }
})()

gameModule.start()
restartButton.addEventListener('click', gameModule.restart)
