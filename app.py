from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

GRID_SIZE = 7

REGIONS = [
    [7, 7, 3, 7, 3, 7, 6],
    [7, 3, 7, 3, 7, 3, 7],
    [3, 1, 1, 7, 2, 2, 3],
    [3, 1, 7, 4, 2, 2, 3],
    [3, 1, 1, 7, 2, 7, 3],
    [7, 3, 3, 7, 3, 3, 7],
    [5, 7, 7, 3, 7, 7, 7],
]

tokens = []

def is_valid_move(r, c):
    for tr, tc in tokens:
        if tr == r or tc == c:
            return False
        if REGIONS[tr][tc] == REGIONS[r][c]:
            return False
        if abs(tr - r) <= 1 and abs(tc - c) <= 1:
            return False
    return True

@app.route("/")
def index():
    return render_template("index.html", regions=REGIONS)

@app.route("/move", methods=["POST"])
def move():
    data = request.json
    r, c = data["row"], data["col"]

    if (r, c) in tokens:
        tokens.remove((r, c))
        return jsonify(valid=True, removed=True)

    if is_valid_move(r, c):
        tokens.append((r, c))
        return jsonify(valid=True, removed=False)

    return jsonify(valid=False)

if __name__ == "__main__":
    app.run(debug=True)
