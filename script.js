const board = [
    [null, 'ai', null, 'ai', null, 'ai', null, 'ai'],
    ['ai', null, 'ai', null, 'ai', null, 'ai', null],
    [null, 'ai', null, 'ai', null, 'ai', null, 'ai'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['player', null, 'player', null, 'player', null, 'player', null],
    [null, 'player', null, 'player', null, 'player', null, 'player'],
    ['player', null, 'player', null, 'player', null, 'player', null],
];

let currentPlayer = 'player'; // ผู้เล่นเริ่มเกมเป็น 'player'

// ตรวจสอบการเคลื่อนที่ที่ถูกต้องตามกฎ
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = toRow - fromRow; // ตรวจสอบการเคลื่อนที่ในแถว
    const colDiff = toCol - fromCol; // ตรวจสอบการเคลื่อนที่ในคอลัมน์
    const isForwardMove = (board[fromRow][fromCol] === 'player' && rowDiff === 1) || 
                          (board[fromRow][fromCol] === 'ai' && rowDiff === -1);

    // ตรวจสอบการเคลื่อนที่แบบปกติ (1 ช่อง)
    if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1 && board[toRow][toCol] === null) {
        return true; // ย้ายปกติ
    }

    // ตรวจสอบการจับหมาก (2 ช่อง)
    if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        // ตรวจสอบว่ามีหมากฝ่ายตรงข้ามอยู่ที่ตำแหน่งกลาง
        if (board[midRow][midCol] && board[midRow][midCol] !== board[fromRow][fromCol]) {
            return true; // จับหมาก
        }
    }

    return false; // การย้ายไม่ถูกต้อง
}

// ทำการย้าย
function makeMove(from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    // ทำการย้าย
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = null;

    // ตรวจสอบว่ามีการจับหมากหรือไม่
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        board[midRow][midCol] = null; // ลบหมากที่ถูกจับ
    }
}

// ฟังก์ชันที่ให้ AI ทำการเคลื่อนที่
function aiMove() {
    const possibleMoves = getPossibleMoves('ai');
    
    // หาก AI ไม่มีการเคลื่อนที่ที่เป็นไปได้
    if (possibleMoves.length === 0) {
        return;
    }

    // เลือกการเคลื่อนที่แบบสุ่ม
    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    makeMove(move.from, move.to);
    currentPlayer = 'player'; // เปลี่ยนเป็นผู้เล่น
}

// คืนค่าการเคลื่อนที่ทั้งหมดที่เป็นไปได้สำหรับผู้เล่นที่กำหนด
function getPossibleMoves(player) {
    const moves = [];
    
    // วนลูปผ่านกระดานเพื่อค้นหาหมากของผู้เล่น
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === player) {
                // ตรวจสอบการเคลื่อนที่ที่เป็นไปได้
                checkValidMoves(row, col, moves);
            }
        }
    }
    
    return moves;
}

// ตรวจสอบการเคลื่อนที่ที่ถูกต้อง (ทั้งการเคลื่อนที่ปกติและการจับหมาก)
function checkValidMoves(row, col, moves) {
    // ตรวจสอบการเคลื่อนที่ปกติ (1 ช่อง)
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]]; // ทิศทางที่อนุญาต
    for (let [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;

        // ตรวจสอบว่าตำแหน่งใหม่ว่างอยู่หรือไม่
        if (isWithinBounds(newRow, newCol) && board[newRow][newCol] === null) {
            moves.push({ from: [row, col], to: [newRow, newCol] });
        }

        // ตรวจสอบการจับหมาก
        const jumpRow = row + 2 * dRow;
        const jumpCol = col + 2 * dCol;

        if (isWithinBounds(jumpRow, jumpCol) && board[jumpRow][jumpCol] === null) {
            // ตรวจสอบว่ามีหมากฝ่ายตรงข้ามอยู่ที่ตำแหน่งกลาง
            const midRow = row + dRow;
            const midCol = col + dCol;

            if (isWithinBounds(midRow, midCol) && board[midRow][midCol] && board[midRow][midCol] !== player) {
                moves.push({ from: [row, col], to: [jumpRow, jumpCol] });
            }
        }
    }
}

// ตรวจสอบว่าตำแหน่งอยู่ในขอบเขตของกระดาน 8x8 หรือไม่
function isWithinBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// ฟังก์ชันเริ่มเกมที่กำหนดค่าต่างๆ
function startGame() {
    // เริ่มต้นกระดานหมากฮอส
    console.log("เริ่มเกมหมากฮอส");
    renderBoard(); // ฟังก์ชันที่ใช้แสดงกระดาน

    // เริ่มเกมโดยให้ AI เคลื่อนที่ก่อน
    aiMove();
}

// ฟังก์ชันแสดงกระดานหมากฮอส
function renderBoard() {
    // การแสดงผลกระดานใน console หรือ UI
    console.clear();
    console.table(board);
}

// เรียกใช้ startGame เพื่อเริ่มเกม
startGame();
