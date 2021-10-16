function createGame() {
    const level = $('input[name="level"]:checked').val();
    console.log("level =", level)
    const mines_pos = new Set();
    let mines_num;
    let board_size;
    if (level === 'Easy') {
        mines_num = 10;
        board_size = 9;
    } else if (level === 'Medium') {
        mines_num = 40;
        board_size = 16;
    } else {
        mines_num = 99;
        board_size = 24;
    }
    let random;
    for (let i = 0; i < mines_num;) {
        random = Math.floor(Math.random() * board_size * board_size);
        if (!mines_pos.has(random)) {
            mines_pos.add(random);
            i++;
        }
    }
    console.log(mines_pos);
    var board = [];
    for (let i = 0; i < board_size; i++) {
        let c = []
        for (let j = 0; j < board_size; j++) {
            c[j] = 0;
        }
        board.push(c);
    }
    console.log(board);
    mines_pos.forEach(function (entry) {
        let i = Math.floor(entry / board_size);
        let j = entry % board_size;
        console.log(i, j);
        board[i][j] = -1;
        if (i > 0
            && board[i - 1][j] !== -1) {
            board[i - 1][j] += 1;
        }
        if (j > 0
            && board[i][j - 1] !== -1) {
            board[i][j - 1] += 1;
        }
        if (i < board_size - 1
            && board[i + 1][j] !== -1) {
            board[i + 1][j] += 1;
        }
        if (j < board_size - 1
            && board[i][j + 1] !== -1) {
            board[i][j + 1] += 1;
        }
        if (i > 0 && j > 0
            && board[i - 1][j - 1] !== -1) {
            board[i - 1][j - 1] += 1
        }
        if (i > 0 && j < board_size - 1
            && board[i - 1][j + 1] !== -1) {
            board[i - 1][j + 1] += 1;
        }
        if (i < board_size - 1 && j > 0
            && board[i + 1][j - 1] !== -1) {
            board[i + 1][j - 1] += 1;
        }
        if (i < board_size - 1 && j < board_size - 1
            && board[i + 1][j + 1] !== -1) {
            board[i + 1][j + 1] += 1;
        }
    });
    console.log(board);
}