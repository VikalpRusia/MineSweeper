function createGame() {
    console.log("Hello, World!");
    const level = document.getElementById("level").values;
    const mines_pos = new Set();
    let mines_num;
    let board_size;
    if (level === 1) {
        mines_num = 10;
        board_size = 9;
    } else if (level === 2) {
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
}