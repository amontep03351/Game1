let board, selectedPiece;

// ฟังก์ชันสำหรับเริ่มเกมใหม่
function startGame() {
    board = [
        [null, 'ai', null, 'ai', null, 'ai', null, 'ai'],
        ['ai', null, 'ai', null, 'ai', null, 'ai', null],
        [null, 'ai', null, 'ai', null, 'ai', null, 'ai'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['player', null, 'player', null, 'player', null, 'player', null],
        [null, 'player', null, 'player', null, 'player', null, 'player'],
        ['player', null, 'player', null, 'player', null, 'player', null]
    ];
    selectedPiece = null;
    displayBoard(); // แสดงกระดานใหม่
}

// ฟังก์ชันแสดงกระดาน
function displayBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement("div");
            cellDiv.className = (rowIndex + colIndex) % 2 === 0 ? "cell white-cell" : "cell black-cell";
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.col = colIndex;

            // เพิ่ม event listener ให้เซลล์แต่ละอัน
            cellDiv.addEventListener("click", handleCellClick);

            if (cell) {
                const piece = document.createElement("div");
                piece.className = `piece ${cell}`;
                cellDiv.appendChild(piece);
            }
            gameBoard.appendChild(cellDiv);
        });
    });
}

// ฟังก์ชันจัดการการคลิกเซลล์
function handleCellClick(event) {
    const row = parseInt(event.currentTarget.dataset.row);
    const col = parseInt(event.currentTarget.dataset.col);

    if (selectedPiece) {
        // หากเลือกหมากแล้ว ให้ย้ายหมากไปตำแหน่งใหม่
        const capturedPiece = movePiece(selectedPiece.row, selectedPiece.col, row, col);
        selectedPiece = null;
        displayBoard(); // รีเฟรชกระดานหลังย้ายหมาก

        // ให้ AI เคลื่อนที่หลังจากผู้เล่น
        setTimeout(aiMove, 500); // ให้เวลา 500ms ก่อนที่ AI จะเคลื่อนที่

        if (capturedPiece) {
            console.log(`Captured: ${capturedPiece}`);
        }
    } else if (board[row][col] === 'player') {
        // เลือกหมากของผู้เล่นเพื่อเตรียมย้าย
        selectedPiece = { row, col };
    }
}

// ฟังก์ชันย้ายหมาก
function movePiece(fromRow, fromCol, toRow, toCol) {
    // ตรวจสอบการจับหมาก
    const capturedPiece = checkForCapture(fromRow, fromCol, toRow, toCol);
    if (capturedPiece) {
        // ย้ายหมากไปยังตำแหน่งใหม่และลบหมากที่ถูกจับ
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = null;
        board[capturedPiece.row][capturedPiece.col] = null; // เอาหมากที่ถูกจับออก
        return true; // จับหมากสำเร็จ
    } else if (isValidMove(fromRow, fromCol, toRow, toCol) && board[toRow][toCol] === null) {
        // ย้ายหมากไปยังตำแหน่งที่ว่าง
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = null;
        return false; // ไม่ได้จับหมาก
    }
    return null; // การย้ายไม่ถูกต้อง
}

// ฟังก์ชันตรวจสอบการจับหมาก
function checkForCapture(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    // ตรวจสอบว่ามีการจับหมาก
    if (rowDiff === 2 && colDiff === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        // ตรวจสอบว่ามีหมากของฝ่ายตรงข้ามอยู่ที่ตำแหน่งกลาง
        if (board[midRow][midCol] === 'ai') {
            return { row: midRow, col: midCol }; // คืนค่าตำแหน่งหมากที่ถูกจับ
        }
    }
    return null; // ไม่สามารถจับได้
}

// ฟังก์ชันตรวจสอบว่าการย้ายถูกต้องหรือไม่
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    // ตรวจสอบการย้ายหนึ่งช่องในทิศทางทแยงมุม
    return rowDiff === 1 && colDiff === 1; // ย้ายปกติ
}

// ฟังก์ชันให้ AI เคลื่อนที่
function aiMove() {
    // หาหมาก AI ที่สามารถเคลื่อนที่ได้
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === 'ai') {
                // ตรวจสอบตำแหน่งที่สามารถย้ายได้
                const possibleMoves = getPossibleMoves(row, col);
                if (possibleMoves.length > 0) {
                    // เลือกการย้ายแบบสุ่มจากการย้ายที่เป็นไปได้
                    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                    movePiece(row, col, move.row, move.col);
                    displayBoard();
                    return; // ทำการย้ายและหยุดที่นี่
                }
            }
        }
    }
}

// ฟังก์ชันหาการเคลื่อนที่ที่เป็นไปได้สำหรับ AI
function getPossibleMoves(row, col) {
    const possibleMoves = [];
    const directions = [
        { row: 1, col: -1 },
        { row: 1, col: 1 }
    ];

    directions.forEach(dir => {
        const newRow = row + dir.row;
        const newCol = col + dir.col;

        // ตรวจสอบให้แน่ใจว่าตำแหน่งใหม่ภายในขอบเขตและว่าง
        if (newRow < 8 && newCol >= 0 && newCol < 8 && board[newRow][newCol] === null) {
            possibleMoves.push({ row: newRow, col: newCol });
        }

        // ตรวจสอบการจับหมาก
        const captureRow = newRow + dir.row;
        const captureCol = newCol + dir.col;

        if (captureRow < 8 && captureCol >= 0 && captureCol < 8 && board[captureRow][captureCol] === 'player') {
            if (board[newRow][newCol] === null) {
                possibleMoves.push({ row: captureRow, col: captureCol }); // เพิ่มการจับหมาก
            }
        }
    });

    return possibleMoves;
}

// เริ่มเกมใหม่เมื่อโหลดหน้า
startGame();

