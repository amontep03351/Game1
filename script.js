const board = [
    ['ai', null, 'ai', null, 'ai', null, 'ai', null],
    [null, 'ai', null, 'ai', null, 'ai', null, 'ai'],
    ['ai', null, 'ai', null, 'ai', null, 'ai', null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['player', null, 'player', null, 'player', null, 'player', null],
    [null, 'player', null, 'player', null, 'player', null, 'player'],
    ['player', null, 'player', null, 'player', null, 'player', null],
];

let currentPlayer = 'player'; // ผู้เล่นเริ่มต้น
let selectedPiece = null; // หมายเลขหมากที่เลือก

function drawBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // ล้างกระดานเก่า

    for (let row = 0; row < board.length; row++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';

        for (let col = 0; col < board[row].length; col++) {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';

            if (board[row][col] === 'player') {
                cellElement.innerHTML = '<div class="piece player"></div>';
            } else if (board[row][col] === 'ai') {
                cellElement.innerHTML = '<div class="piece ai"></div>';
            }

            cellElement.onclick = () => handleCellClick(row, col);
            rowElement.appendChild(cellElement);
        }
        boardElement.appendChild(rowElement);
    }
}

function handleCellClick(row, col) {
    if (currentPlayer === 'player') {
        if (selectedPiece) {
            const [fromRow, fromCol] = selectedPiece;
            if (isValidMove(fromRow, fromCol, row, col)) {
                makeMove(selectedPiece, [row, col]);
                if (checkGameOver()) {
                    alert(`${currentPlayer} ชนะ!`);
                    return;
                }
                currentPlayer = 'ai'; // เปลี่ยนไปให้ AI เล่น
                aiMove();
            } else {
                console.log("การย้ายไม่ถูกต้อง");
            }
            selectedPiece = null; // รีเซ็ตการเลือก
        } else if (board[row][col] === 'player') {
            selectedPiece = [row, col]; // เลือกหมากของผู้เล่น
        }
    }
    drawBoard(); // วาดกระดานใหม่
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];

    // ตรวจสอบว่าเคลื่อนที่ในแนวทแยง
    if (Math.abs(toRow - fromRow) === 1 && Math.abs(toCol - fromCol) === 1 && board[toRow][toCol] === null) {
        return true; // เคลื่อนที่ปกติ
    }

    // ตรวจสอบการกินหมาก
    if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 2) {
        const middleRow = (fromRow + toRow) / 2;
        const middleCol = (fromCol + toCol) / 2;

        if (board[middleRow][middleCol] === 'ai') {
            board[middleRow][middleCol] = null; // กินหมาก AI
            return true; // เคลื่อนที่พร้อมกินหมาก
        }
    }
    return false; // ไม่ถูกต้อง
}

function makeMove(from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    board[toRow][toCol] = board[fromRow][fromCol]; // ย้ายหมาก
    board[fromRow][fromCol] = null; // เคลียร์ตำแหน่งเดิม
}

function checkGameOver() {
    const playerHasPieces = board.flat().includes('player');
    const aiHasPieces = board.flat().includes('ai');
    return !playerHasPieces || !aiHasPieces; // ถ้าไม่มีหมากจะจบเกม
}

function aiMove() {
    // AI ควรเลือกการเคลื่อนที่ (กรุณาปรับปรุง AI ที่นี่)
    let possibleMoves = [];
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 'ai') {
                // ตรวจสอบการเคลื่อนที่ที่ถูกต้อง
                const moves = getValidAiMoves(row, col);
                possibleMoves.push(...moves);
            }
        }
    }

    // เลือกการเคลื่อนที่แบบสุ่ม
    if (possibleMoves.length > 0) {
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        makeMove(move.from, move.to);
        if (checkGameOver()) {
            alert("AI ชนะ!");
            return;
        }
        currentPlayer = 'player'; // เปลี่ยนกลับให้ผู้เล่นเล่น
    }
    drawBoard(); // วาดกระดานใหม่
}

function getValidAiMoves(row, col) {
    const moves = [];
    // เพิ่มการตรวจสอบการเคลื่อนที่ที่ถูกต้องที่นี่
    const directions = [[1, 1], [1, -1], [2, 2], [2, -2]]; // ตัวอย่างการเคลื่อนที่ของ AI

    directions.forEach(([dRow, dCol]) => {
        const toRow = row + dRow;
        const toCol = col + dCol;
        if (isValidMove(row, col, toRow, toCol)) {
            moves.push({ from: [row, col], to: [toRow, toCol] });
        }
    });

    return moves;
}

// เริ่มต้นเกม
function startGame() {
    drawBoard();
}

document.addEventListener("DOMContentLoaded", startGame);

