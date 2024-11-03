const boardElement = document.getElementById('board');
const levelSelect = document.getElementById('level');
const messageElement = document.getElementById('message');

let board = [];
let currentPlayer = 'red';
let selectedPiece = null;

function createBoard() {
    board = Array(8).fill(null).map((_, rowIndex) => (
        Array(8).fill(null).map((_, colIndex) => {
            if (rowIndex < 3 && (rowIndex + colIndex) % 2 !== 0) return 'black';
            if (rowIndex > 4 && (rowIndex + colIndex) % 2 !== 0) return 'red';
            return null;
        })
    ));
    renderBoard();
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if ((row + col) % 2 !== 0) {
                cell.classList.add('dark');
                if (board[row][col]) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', board[row][col]);
                    piece.setAttribute('data-row', row);
                    piece.setAttribute('data-col', col);
                    piece.addEventListener('click', () => selectPiece(row, col));
                    cell.appendChild(piece);
                }
            }
            boardElement.appendChild(cell);
        }
    }
}

function selectPiece(row, col) {
    if (board[row][col] === currentPlayer) {
        selectedPiece = { row, col };
    } else if (selectedPiece) {
        if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            if (currentPlayer === 'red') {
                currentPlayer = 'black';
                aiMove();
            } else {
                currentPlayer = 'red';
            }
        }
        selectedPiece = null;
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const direction = currentPlayer === 'red' ? 1 : -1;
    if (toRow === fromRow + direction && (toCol === fromCol - 1 || toCol === fromCol + 1) && !board[toRow][toCol]) {
        return true;
    }
    if (toRow === fromRow + 2 * direction && (toCol === fromCol - 2 || toCol === fromCol + 2)) {
        const jumpedRow = fromRow + direction;
        const jumpedCol = fromCol + (toCol < fromCol ? -1 : 1);
        if (board[jumpedRow][jumpedCol] && board[jumpedRow][jumpedCol] !== currentPlayer) {
            return true;
        }
    }
    return false;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    board[toRow][toCol] = currentPlayer;
    board[fromRow][fromCol] = null;

    // Handle jumping
    if (Math.abs(toRow - fromRow) === 2) {
        const jumpedRow = (fromRow + toRow) / 2;
        const jumpedCol = (fromCol + toCol) / 2;
        board[jumpedRow][jumpedCol] = null;
    }

    renderBoard();
    checkForWin();
}

function aiMove() {
    let possibleMoves = getPossibleMoves('black');
    if (possibleMoves.length > 0) {
        let move;
        if (levelSelect.value === 'easy') {
            move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else if (levelSelect.value === 'medium') {
            move = possibleMoves[0]; // เลือกการเคลื่อนที่แรก
        } else {
            move = possibleMoves.sort((a, b) => evaluateMove(b) - evaluateMove(a))[0]; // เลือกการเคลื่อนที่ที่ดีที่สุด
        }
        movePiece(move.fromRow, move.fromCol, move.toRow, move.toCol);
        currentPlayer = 'red';
    }
}

function getPossibleMoves(player) {
    const possibleMoves = [];
    const playerPieces = board.flatMap((row, rowIndex) => 
        row.map((piece, colIndex) => piece === player ? { row: rowIndex, col: colIndex } : null).filter(Boolean)
    );

    for (const piece of playerPieces) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (isValidMove(piece.row, piece.col, row, col)) {
                    possibleMoves.push({ fromRow: piece.row, fromCol: piece.col, toRow: row, toCol: col });
                }
            }
        }
    }
    return possibleMoves;
}

function evaluateMove(move) {
    // การประเมินค่าการเคลื่อนที่: พิจารณาจำนวนชิ้นส่วนที่จับได้
    const tempBoard = JSON.parse(JSON.stringify(board));
    const { fromRow, fromCol, toRow, toCol } = move;
    const originalPiece = tempBoard[fromRow][fromCol];
    tempBoard[toRow][toCol] = originalPiece;
    tempBoard[fromRow][fromCol] = null;

    let score = 0;
    if (Math.abs(toRow - fromRow) === 2) {
        const jumpedRow = (fromRow + toRow) / 2;
        const jumpedCol = (fromCol + toCol) / 2;
        if (tempBoard[jumpedRow][jumpedCol] && tempBoard[jumpedRow][jumpedCol] !== originalPiece) {
            score += 1; // เพิ่มคะแนนสำหรับการจับ
        }
    }
    return score;
}

function checkForWin() {
    const redPieces = board.flat().filter(piece => piece === 'red').length;
    const blackPieces = board.flat().filter(piece => piece === 'black').length;

    if (redPieces === 0) {
        messageElement.innerText = 'แบล็คชนะ!';
        setTimeout(createBoard, 2000);
    } else if (blackPieces === 0) {
        messageElement.innerText = 'เรดชนะ!';
        setTimeout(createBoard, 2000);
    } else {
        messageElement.innerText = `ตาของ: ${currentPlayer}`;
    }
}

levelSelect.addEventListener('change', createBoard);
createBoard();
