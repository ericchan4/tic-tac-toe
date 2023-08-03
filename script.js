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
    if (cell.classList.contains('o')) {
        cell.stopPropagation()
    }
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
        _currentTurn = X
        board.classList.add(X.mark)
        cellElements.forEach((cell) => {
            cell.addEventListener('click', gameController, { once: true })
            cell.classList.remove(X.mark)
            cell.classList.remove(O.mark)
        })
    }

    function minimax(newBoard, player) {
        const availSpots = getValidMoves()

        if (checkWin() && player === X) {
            return { score: -10 }
        }
        if (checkWin() && player === O) {
            return { score: 10 }
        }
        if (availSpots.length === 0) {
            return { score: 0 }
        }

        const moves = []
        // loops through available spots
        for (let i = 0; i < availSpots.length; i += 1) {
            // creating an object for each spot and storing position of empty spot
            const move = {}
            const { row } = availSpots[i]
            const { col } = availSpots[i]
            move.index = [row, col]

            // sets empty spot to the current player
            // eslint-disable-next-line no-param-reassign
            newBoard[row][col] = player.mark

            // collects the score from calling minimax on the opponent of current player
            if (player === O) {
                const result = minimax(newBoard, X)
                move.score = result.score
            } else {
                const result = minimax(newBoard, O)
                move.score = result.score
            }

            // resets the spot to empty
            newBoard[row][col] = ''

            // push the object into the array
            moves.push(move)
        }

        // evalutes the best move in the moves array
        let bestMove
        // if AI turn, it will loop over moves to search for one with higest score (e.g. most optimum move for ai)
        if (player === O) {
            let bestScore = -1000
            for (let i = 0; i < moves.length; i += 1) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score
                    bestMove = i
                }
            }
        } else {
            // else loop over move with lowest score (aka most optimum move for human and least optimum for AI)
            let bestScore = 1000
            for (let i = 0; i < moves.length; i += 1) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score
                    bestMove = i
                }
            }
        }
        return moves[bestMove]
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

        // const bestMove = minimax(_gameboard, O)
        // const row = bestMove.index[0]
        // const col = bestMove.index[1]
        // console.log(bestMove)

        const { row } = getValidMoves()[randomIndex]
        const { col } = getValidMoves()[randomIndex]
        const cell = document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`
        )
        // const cell = document.querySelector(
        //     `[data-row="${row}"][data-col="${col}"]`
        // )
        placeMark(cell)
    }

    function switchTurns() {
        if (_oTurn) {
            board.classList.remove(O.mark)
            board.classList.add(X.mark)
            _currentTurn = X
        } else {
            board.classList.remove(X.mark)
            board.classList.add(O.mark)
            _currentTurn = O
        }
        _oTurn = !_oTurn
    }
    //
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
            const content = document.createTextNode(
                `${_currentTurn.mark}'s win!`
            )
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
        minimax,
    }
})()

gameModule.start()
// let origBoard = [
//     ['X', 'X', ''],
//     ['', 'O', ''],
//     ['', '', ''],
// ]
// console.log(gameModule.minimax(origBoard, O))
restartButton.addEventListener('click', gameModule.restart)
