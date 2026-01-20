const cells = document.querySelectorAll(".cell");

function getCell(row, col) {
    return document.querySelector(
        `.cell[data-row='${row}'][data-col='${col}']`
    );
}

function getBlockedCells(row, col) {
    const blocked = [];

    // riga e colonna
    for (let i = 0; i < 6; i++) {
        if (i !== col) blocked.push([row, i]);
        if (i !== row) blocked.push([i, col]);
    }

    // celle adiacenti
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < 6 && c >= 0 && c < 6) {
                blocked.push([r, c]);
            }
        }
    }

    return blocked;
}

cells.forEach(cell => {
    cell.addEventListener("click", async () => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // se è già bloccata, ignora
        if (cell.classList.contains("blocked")) return;

        const res = await fetch("/move", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ row, col })
        });

        const data = await res.json();

        if (!data.valid) return;

        // inseriamo temporaneamente il cuore
        cell.classList.add("active");

        const toBlock = getBlockedCells(row, col);

        // controllo errore
        for (const [r, c] of toBlock) {
            const target = getCell(r, c);
            if (target && target.classList.contains("active")) {
                alert("errore: avete 4 lauree e non siete capaci");

                // rollback
                cell.classList.remove("active");

                await fetch("/move", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ row, col })
                });

                return;
            }
        }

        // applica le X
        toBlock.forEach(([r, c]) => {
            const target = getCell(r, c);
            if (target && !target.classList.contains("active")) {
                target.classList.add("blocked");
            }
        });
    });
});



// document.querySelectorAll(".cell").forEach(cell => {
//     cell.addEventListener("click", async () => {
//         const row = parseInt(cell.dataset.row);
//         const col = parseInt(cell.dataset.col);

//         const res = await fetch("/move", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ row, col })
//         });

//         const data = await res.json();

//         if (!data.valid) {
//             cell.classList.add("error");
//             setTimeout(() => cell.classList.remove("error"), 300);
//             return;
//         }

//         cell.classList.toggle("active");
//     });
// });
