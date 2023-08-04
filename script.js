const board = document.getElementById('board')
const cellElements = document.querySelectorAll('[data-cell]')
const winningMessage = document.getElementById('winningMessage')
const winnerText = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')
const pve = document.getElementById('pve-toggle')

const Player = (mark) => {
    return { mark }
}

const playerX = Player('x')
const playerO = Player('o')

function gameController(e) {
    const cell = e.target
    if (cell.classList.contains('o')) {
        cell.stopPropagation()
    }
    gameModule.placeMark(cell)
    gameModule.checkWin(gameModule.gameboard, gameModule.currentTurn)
    gameModule.checkDraw()
    if (gameModule.displayWinner()) return
    gameModule.switchTurns()
    if (pve.checked) {
        gameModule.aiMove()
        gameModule.checkWin(gameModule.gameboard, gameModule.currentTurn)
        gameModule.checkDraw()
        if (gameModule.displayWinner()) return
        gameModule.switchTurns()
    }
}

let gameModule = (function gameModule() {
    let gameboard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]
    let currentTurn = playerX
    let _oTurn

    function start() {
        gameboard = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ]
        _oTurn = false
        currentTurn = playerX
        board.classList.add(playerX.mark)
        cellElements.forEach((cell) => {
            cell.addEventListener('click', gameController, { once: true })
            cell.classList.remove(playerX.mark)
            cell.classList.remove(playerO.mark)
        })
    }

    function placeMark(cell) {
        const { row } = cell.dataset
        const { col } = cell.dataset
        if (_oTurn) {
            cell.classList.add(playerO.mark)
            gameboard[row][col] = playerO.mark
        } else {
            cell.classList.add(playerX.mark)
            gameboard[row][col] = playerX.mark
        }
    }

    function getValidMoves() {
        const validMoves = []
        for (let i = 0; i <= 2; i += 1) {
            for (let j = 0; j <= 2; j += 1) {
                if (gameboard[i][j] === '') {
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

    function minimax(newBoard, player) {
        const availSpots = getValidMoves()

        if (checkWin(newBoard, playerX)) return { score: -10 }
        if (checkWin(newBoard, playerO)) return { score: 10 }
        if (availSpots.length === 0) return { score: 0 }

        const moves = []
        // loops through available spots
        for (let i = 0; i < availSpots.length; i += 1) {
            // creating an object for each spot and storing position of empty spot
            const move = {}
            const { row } = availSpots[i]
            const { col } = availSpots[i]
            move.index = [row, col]

            // sets empty spot to the current player
            newBoard[row][col] = player.mark

            // collects the score from calling minimax on the opponent of current player
            if (player === playerO) {
                const result = minimax(newBoard, playerX)
                move.score = result.score
            } else {
                const result = minimax(newBoard, playerO)
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
        if (player === playerO) {
            let bestScore = -Infinity
            for (let i = 0; i < moves.length; i += 1) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score
                    bestMove = i
                }
            }
        } else {
            // else loop over move with lowest score (aka most optimum move for human and least optimum for AI)
            let bestScore = Infinity
            for (let i = 0; i < moves.length; i += 1) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score
                    bestMove = i
                }
            }
        }
        return moves[bestMove]
    }

    function aiMove() {
        const bestMove = minimax(gameboard, playerO)
        const row = bestMove.index[0]
        const col = bestMove.index[1]
        const cell = document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`
        )
        placeMark(cell)
    }

    function switchTurns() {
        if (_oTurn) {
            board.classList.remove(playerO.mark)
            board.classList.add(playerX.mark)
            currentTurn = playerX
        } else {
            board.classList.remove(playerX.mark)
            board.classList.add(playerO.mark)
            currentTurn = playerO
        }
        _oTurn = !_oTurn
    }

    function checkWin(currBoard, player) {
        if (
            (currBoard[0][0] === player.mark &&
                currBoard[0][1] === player.mark &&
                currBoard[0][2] === player.mark) ||
            (currBoard[1][0] === player.mark &&
                currBoard[1][1] === player.mark &&
                currBoard[1][2] === player.mark) ||
            (currBoard[2][0] === player.mark &&
                currBoard[2][1] === player.mark &&
                currBoard[2][2] === player.mark) ||
            (currBoard[0][0] === player.mark &&
                currBoard[1][0] === player.mark &&
                currBoard[2][0] === player.mark) ||
            (currBoard[0][1] === player.mark &&
                currBoard[1][1] === player.mark &&
                currBoard[2][1] === player.mark) ||
            (currBoard[0][2] === player.mark &&
                currBoard[1][2] === player.mark &&
                currBoard[2][2] === player.mark) ||
            (currBoard[0][0] === player.mark &&
                currBoard[1][1] === player.mark &&
                currBoard[2][2] === player.mark) ||
            (currBoard[2][0] === player.mark &&
                currBoard[1][1] === player.mark &&
                currBoard[0][2] === player.mark)
        ) {
            return true
        }
        return false
    }

    function displayWinner() {
        if (checkWin(gameboard, currentTurn)) {
            const content = document.createTextNode(
                `${currentTurn.mark}'s win!`
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
        if (!checkWin(gameboard, currentTurn)) {
            return (
                !gameboard[0].includes('') &&
                !gameboard[1].includes('') &&
                !gameboard[2].includes('')
            )
        }
        return false
    }

    function restart() {
        winnerText.removeChild(winnerText.lastChild)
        winningMessage.classList.remove('show')
        board.classList.remove(playerX.mark)
        board.classList.remove(playerO.mark)
        start()
    }

    return {
        gameboard,
        currentTurn,
        start,
        placeMark,
        aiMove,
        switchTurns,
        checkWin,
        displayWinner,
        checkDraw,
        restart,
    }
})()

gameModule.start()
restartButton.addEventListener('click', gameModule.restart)
