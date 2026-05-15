const initialBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
  ];
  
  let gameState = {
    board: JSON.parse(JSON.stringify(initialBoard)),
    selectedPiece: null,
    currentPlayer: "white",
    validMoves: [],
    moveHistory: [],
    enPassantTarget: null,
    castlingRights: {
      white: { kingSide: true, queenSide: true },
      black: { kingSide: true, queenSide: true }
    },
    gameOver: false
  };
  
  const pieceUnicode = {
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    p: "♟",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
    P: "♙"
  };
  
  function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
  
    const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.className = `square ${(row + col) % 2 === 0 ? "white" : "black"}`;
        square.dataset.row = row;
        square.dataset.col = col;
  
        const piece = gameState.board[row][col];
        if (piece) {
          square.textContent = pieceUnicode[piece];
        }
  
        // Add column labels (a-h) at the bottom of the board
        if (row === 7) {
          const label = document.createElement("div");
          label.className = "square-label bottom";
          label.textContent = columns[col];
          square.appendChild(label);
        }
  
        // Add row labels (1-8) on the left side of the board
        if (col === 0) {
          const label = document.createElement("div");
          label.className = "square-label top";
          label.textContent = rows[row];
          square.appendChild(label);
        }
  
        square.addEventListener("click", handleSquareClick);
        board.appendChild(square);
      }
    }
  
    document.getElementById(
      "current-player"
    ).textContent = `Current Player: ${gameState.currentPlayer}`;
    document.getElementById("game-status").textContent = gameState.gameOver
      ? `Game Over! ${gameState.currentPlayer} wins!`
      : "";
  }
  
  function handleSquareClick(event) {
    if (gameState.gameOver) return;
  
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
  
    if (gameState.selectedPiece) {
      if (isValidMove(row, col)) {
        movePiece(row, col);
        gameState.selectedPiece = null;
        gameState.validMoves = [];
        // Switch the current player
        gameState.currentPlayer =
          gameState.currentPlayer === "white" ? "black" : "white";
        updateBoard(); // Refresh the board
        checkGameEnd(); // Check if the game has ended
      } else {
        gameState.selectedPiece = null;
        gameState.validMoves = [];
        updateBoard(); // Refresh the board
      }
    } else {
      const piece = gameState.board[row][col];
      if (piece && isPieceOfCurrentPlayer(piece)) {
        gameState.selectedPiece = { row, col };
        gameState.validMoves = calculateValidMoves(row, col, piece);
        updateBoard(); // Refresh the board
      }
    }
  }
  
  function isPieceOfCurrentPlayer(piece) {
    const isWhite = piece === piece.toUpperCase();
    return (
      (isWhite && gameState.currentPlayer === "white") ||
      (!isWhite && gameState.currentPlayer === "black")
    );
  }
  
  function calculateRawMoves(row, col, piece) {
    const moves = [];
    const pieceLower = piece.toLowerCase();
  
    switch (pieceLower) {
      case "p": // Pawn
        const direction = piece === "P" ? -1 : 1;
        // Regular move
        if (gameState.board[row + direction][col] === null) {
          moves.push({ row: row + direction, col });
          // Initial two-square move
          if ((row === 1 && direction === 1) || (row === 6 && direction === -1)) {
            if (gameState.board[row + 2 * direction][col] === null) {
              moves.push({ row: row + 2 * direction, col });
            }
          }
        }
        // Captures
        [
          [direction, -1],
          [direction, 1]
        ].forEach(([dr, dc]) => {
          const newRow = row + dr;
          const newCol = col + dc;
          if (
            newCol >= 0 &&
            newCol < 8 &&
            gameState.board[newRow][newCol] !== null &&
            !isPieceOfCurrentPlayer(gameState.board[newRow][newCol])
          ) {
            moves.push({ row: newRow, col: newCol });
          }
        });
        // En passant
        if (gameState.enPassantTarget) {
          const [targetRow, targetCol] = gameState.enPassantTarget;
          if (Math.abs(targetCol - col) === 1 && row + direction === targetRow) {
            moves.push({ row: targetRow, col: targetCol });
          }
        }
        break;
  
      case "r": // Rook
        [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1]
        ].forEach(([dr, dc]) => {
          let newRow = row + dr;
          let newCol = col + dc;
          while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (gameState.board[newRow][newCol] === null) {
              moves.push({ row: newRow, col: newCol });
            } else {
              if (!isPieceOfCurrentPlayer(gameState.board[newRow][newCol])) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
            newRow += dr;
            newCol += dc;
          }
        });
        break;
  
      case "n": // Knight
        [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1]
        ].forEach(([dr, dc]) => {
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (
              gameState.board[newRow][newCol] === null ||
              !isPieceOfCurrentPlayer(gameState.board[newRow][newCol])
            ) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        });
        break;
  
      case "b": // Bishop
        [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1]
        ].forEach(([dr, dc]) => {
          let newRow = row + dr;
          let newCol = col + dc;
          while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (gameState.board[newRow][newCol] === null) {
              moves.push({ row: newRow, col: newCol });
            } else {
              if (!isPieceOfCurrentPlayer(gameState.board[newRow][newCol])) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
            newRow += dr;
            newCol += dc;
          }
        });
        break;
  
      case "q": // Queen
        [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1]
        ].forEach(([dr, dc]) => {
          let newRow = row + dr;
          let newCol = col + dc;
          while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (gameState.board[newRow][newCol] === null) {
              moves.push({ row: newRow, col: newCol });
            } else {
              if (!isPieceOfCurrentPlayer(gameState.board[newRow][newCol])) {
                moves.push({ row: newRow, col: newCol });
              }
              break;
            }
            newRow += dr;
            newCol += dc;
          }
        });
        break;
  
      case "k": // King
        [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1]
        ].forEach(([dr, dc]) => {
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (
              gameState.board[newRow][newCol] === null ||
              !isPieceOfCurrentPlayer(gameState.board[newRow][newCol])
            ) {
              moves.push({ row: newRow, col: newCol });
            }
          }
        });
        // Castling
        const castlingRights = gameState.castlingRights[gameState.currentPlayer];
        if (castlingRights.kingSide) {
          if (
            gameState.board[row][5] === null &&
            gameState.board[row][6] === null
          ) {
            moves.push({ row, col: 6 });
          }
        }
        if (castlingRights.queenSide) {
          if (
            gameState.board[row][1] === null &&
            gameState.board[row][2] === null &&
            gameState.board[row][3] === null
          ) {
            moves.push({ row, col: 2 });
          }
        }
        break;
  
      default:
        break;
    }
  
    return moves;
  }
  
  function calculateValidMoves(row, col, piece) {
    const rawMoves = calculateRawMoves(row, col, piece);
    return rawMoves.filter((move) => !isKingInCheckAfterMove(row, col, move));
  }
  
  function isValidMove(row, col) {
    return gameState.validMoves.some(
      (move) => move.row === row && move.col === col
    );
  }
  
  function movePiece(newRow, newCol) {
    const { row: oldRow, col: oldCol } = gameState.selectedPiece;
    const piece = gameState.board[oldRow][oldCol];
    const capturedPiece = gameState.board[newRow][newCol];
  
    // Handle pawn promotion
    if (piece.toLowerCase() === "p" && (newRow === 0 || newRow === 7)) {
      gameState.board[newRow][newCol] =
        gameState.currentPlayer === "white" ? "Q" : "q";
    } else {
      gameState.board[newRow][newCol] = piece;
    }
    gameState.board[oldRow][oldCol] = null;
  
    // Handle en passant
    if (
      piece.toLowerCase() === "p" &&
      newCol !== oldCol &&
      capturedPiece === null
    ) {
      gameState.board[oldRow][newCol] = null;
    }
  
    // Handle castling
    if (piece.toLowerCase() === "k" && Math.abs(newCol - oldCol) === 2) {
      if (newCol > oldCol) {
        gameState.board[newRow][5] = gameState.board[newRow][7];
        gameState.board[newRow][7] = null;
      } else {
        gameState.board[newRow][3] = gameState.board[newRow][0];
        gameState.board[newRow][0] = null;
      }
    }
  
    // Update en passant target
    if (piece.toLowerCase() === "p" && Math.abs(newRow - oldRow) === 2) {
      gameState.enPassantTarget = [newRow + (piece === "P" ? 1 : -1), newCol];
    } else {
      gameState.enPassantTarget = null;
    }
  
    // Update castling rights
    if (piece.toLowerCase() === "k") {
      gameState.castlingRights[gameState.currentPlayer].kingSide = false;
      gameState.castlingRights[gameState.currentPlayer].queenSide = false;
    } else if (piece.toLowerCase() === "r") {
      if (oldCol === 0) {
        gameState.castlingRights[gameState.currentPlayer].queenSide = false;
      } else if (oldCol === 7) {
        gameState.castlingRights[gameState.currentPlayer].kingSide = false;
      }
    }
  
    // Add move to history
    gameState.moveHistory.push({
      piece,
      from: { row: oldRow, col: oldCol },
      to: { row: newRow, col: newCol },
      capturedPiece
    });
  }
  
  function isKingInCheckAfterMove(oldRow, oldCol, move) {
    const newRow = move.row;
    const newCol = move.col;
    const piece = gameState.board[oldRow][oldCol];
    const capturedPiece = gameState.board[newRow][newCol];
  
    // Simulate the move
    gameState.board[newRow][newCol] = piece;
    gameState.board[oldRow][oldCol] = null;
  
    const kingPosition = findKingPosition(gameState.currentPlayer);
    const inCheck = isSquareUnderAttack(
      kingPosition.row,
      kingPosition.col,
      gameState.currentPlayer
    );
  
    // Undo the move
    gameState.board[oldRow][oldCol] = piece;
    gameState.board[newRow][newCol] = capturedPiece;
  
    return inCheck;
  }
  
  function findKingPosition(player) {
    const king = player === "white" ? "K" : "k";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (gameState.board[row][col] === king) {
          return { row, col };
        }
      }
    }
    return null;
  }
  
  function isSquareUnderAttack(row, col, player) {
    const opponent = player === "white" ? "black" : "white";
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = gameState.board[r][c];
        if (piece && isPieceOfPlayer(piece, opponent)) {
          const moves = calculateRawMoves(r, c, piece);
          if (moves.some((move) => move.row === row && move.col === col)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  function isPieceOfPlayer(piece, player) {
    const isWhite = piece === piece.toUpperCase();
    return (isWhite && player === "white") || (!isWhite && player === "black");
  }
  
  function checkGameEnd() {
    const kingPosition = findKingPosition(gameState.currentPlayer);
    if (
      isSquareUnderAttack(
        kingPosition.row,
        kingPosition.col,
        gameState.currentPlayer
      )
    ) {
      if (isCheckmate()) {
        gameState.gameOver = true;
        document.getElementById(
          "game-status"
        ).textContent = `Checkmate! ${gameState.currentPlayer} wins!`;
      } else {
        document.getElementById("game-status").textContent = "Check!";
      }
    } else if (isStalemate()) {
      gameState.gameOver = true;
      document.getElementById("game-status").textContent = "Stalemate!";
    }
  }
  
  function isCheckmate() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece && isPieceOfCurrentPlayer(piece)) {
          const moves = calculateValidMoves(row, col, piece);
          if (moves.length > 0) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  function isStalemate() {
    // Check if the current player has no legal moves and is not in check
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece && isPieceOfCurrentPlayer(piece)) {
          const moves = calculateValidMoves(row, col, piece);
          if (moves.length > 0) {
            return false; // There are legal moves, so it's not a stalemate
          }
        }
      }
    }
    // If no legal moves and the king is not in check, it's a stalemate
    const kingPosition = findKingPosition(gameState.currentPlayer);
    return !isSquareUnderAttack(
      kingPosition.row,
      kingPosition.col,
      gameState.currentPlayer
    );
  }
  
  function updateBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
  
    const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.className = `square ${(row + col) % 2 === 0 ? "white" : "black"}`;
        square.dataset.row = row;
        square.dataset.col = col;
  
        const piece = gameState.board[row][col];
        if (piece) {
          square.textContent = pieceUnicode[piece];
        }
  
        // Add column labels (a-h) at the bottom of the board
        if (row === 7) {
          const label = document.createElement("div");
          label.className = "square-label bottom";
          label.textContent = columns[col];
          square.appendChild(label);
        }
  
        // Add row labels (1-8) on the left side of the board
        if (col === 0) {
          const label = document.createElement("div");
          label.className = "square-label top";
          label.textContent = rows[row];
          square.appendChild(label);
        }
  
        // Add the valid-move class if the square is a valid move
        if (
          gameState.validMoves.some(
            (move) => move.row === row && move.col === col
          )
        ) {
          square.classList.add("valid-move");
        }
  
        // Add the selected class if the square is the selected piece
        if (
          gameState.selectedPiece &&
          gameState.selectedPiece.row === row &&
          gameState.selectedPiece.col === col
        ) {
          square.classList.add("selected");
        }
  
        square.addEventListener("click", handleSquareClick);
        board.appendChild(square);
      }
    }
  
    // Update the current player display
    document.getElementById(
      "current-player"
    ).textContent = `Current Player: ${gameState.currentPlayer}`;
  
    // Update the game status (check, checkmate, or stalemate)
    document.getElementById("game-status").textContent = gameState.gameOver
      ? `Game Over! ${
          gameState.currentPlayer === "white" ? "Black" : "White"
        } wins!`
      : "";
  }
  
  function resetGame() {
    gameState = {
      board: JSON.parse(JSON.stringify(initialBoard)),
      selectedPiece: null,
      currentPlayer: "white", // Reset to white
      validMoves: [],
      moveHistory: [],
      enPassantTarget: null,
      castlingRights: {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true }
      },
      gameOver: false
    };
    updateBoard(); // Refresh the board
  }
  
  // Initialize the game
  createBoard();
  
