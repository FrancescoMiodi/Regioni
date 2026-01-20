document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", async () => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        const res = await fetch("/move", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ row, col })
        });

        const data = await res.json();

        if (!data.valid) {
            cell.classList.add("error");
            setTimeout(() => cell.classList.remove("error"), 300);
            return;
        }

        cell.classList.toggle("active");
    });
});
