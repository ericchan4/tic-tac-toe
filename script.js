const gameModule = (function () {
    let _gameBoard = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X'],
    ];

    function printGameBoard() {
        console.log(_gameBoard);
    }

    return { printGameBoard };
})();

const Player = (name) => {
    const getName = () => name;

    return { getName };
};
