"use strict";

class App {
  scoreHuman = 0;
  scoreAi = 0;
  scoreTie = 0;
  game = false;
  // 0-1-2
  // 3-4-5
  // 6-7-8
  // prettier-ignore
  goals = [[[1,2],[3,6],[4,8]],
           [[0,2],[4,7]],
           [[5,8],[0,1],[4,6]],
           [[0,6],[4,5]],
           [[0,8],[1,7],[2,6],[3,5]],
           [[3,4],[2,8]],
           [[0,3],[2,4],[7,8]],
           [[1,4],[6,8]],
           [[6,7],[0,4],[2,5]]];

  constructor(side, mode) {
    this.side = side;
    this.mode = mode;
    this.turn = side === "X" ? true : false; // true human turn / false ai turn
    this.table = [null, null, null, null, null, null, null, null, null];
    this._initial();
    // this._reset();
    // this._selectSide();
    // this._start();
    // this._score();
  }

  _initial() {
    document.querySelector(".container").classList.remove("hidden");
    setTimeout(function () {
      document.querySelector(".container").classList.remove("visually-hidden");
    }, 100);
    cells.forEach((e) =>
      e.addEventListener("click", this._makeMove.bind(this))
    );
    allahMode.addEventListener("change", this._setMode.bind(this));
    this._reset();
  }
  _setMode(e) {
    this.mode = e.target.checked;
    console.log(this.mode);
  }
  _reset() {
    this._tieBorderAnimation(false);
    this._winnerAnimation(false);
    this.game = true;
    this.turn = this.side === "X" ? true : false;
    this.table = [null, null, null, null, null, null, null, null, null];
    cells.forEach((e) => (e.textContent = ""));
    !this.turn && this._aiTurn();
  }
  _humanTurn() {}

  _score(result) {
    this.game = false;
    if (result === "tie") {
      this._tieBorderAnimation(true);
      this.scoreTie++;
      document.querySelector(".score-tie").textContent = this.scoreTie;
      // console.log(
      //   `Tie! - Score : Human ${this.scoreHuman} , Ai ${this.scoreAi} , Tie ${this.scoreTie}`
      // );
    } else {
      this.turn ? this.scoreHuman++ : this.scoreAi++;
      this._winnerAnimation(true);
      document.querySelector(".score-human").textContent = this.scoreHuman;
      document.querySelector(".score-ai").textContent = this.scoreAi;
      // console.log(
      //   `'Winner is ${this.turn ? this.side : this.side === "X" ? "O" : "X"}'`
      // );
      // console.log(
      //   `Score : Human ${this.scoreHuman} , Ai ${this.scoreAi} , Tie ${this.scoreTie}`
      // );
    }
    setTimeout(() => this._reset(), 2000);
    // this._reset();
  }
  _checkWinner() {
    const winner =
      (this.table[0] === this.table[1] &&
        this.table[1] === this.table[2] &&
        this.table[0] !== null) ||
      (this.table[3] === this.table[4] &&
        this.table[4] === this.table[5] &&
        this.table[3] !== null) ||
      (this.table[6] === this.table[7] &&
        this.table[7] === this.table[8] &&
        this.table[6] !== null) ||
      (this.table[0] === this.table[3] &&
        this.table[3] === this.table[6] &&
        this.table[0] !== null) ||
      (this.table[1] === this.table[4] &&
        this.table[4] === this.table[7] &&
        this.table[1] !== null) ||
      (this.table[2] === this.table[5] &&
        this.table[5] === this.table[8] &&
        this.table[2] !== null) ||
      (this.table[0] === this.table[4] &&
        this.table[4] === this.table[8] &&
        this.table[0] !== null) ||
      (this.table[2] === this.table[4] &&
        this.table[4] === this.table[6] &&
        this.table[2] !== null);

    const tie = this.table.reduce((ret, val) => val && ret, true);
    winner && this._score();
    !winner && tie && this._score("tie");
    !winner && !tie && this.turn && this._aiTurn();
  }
  _aiTurn() {
    this.turn = false;
    const aiSide = this.side === "X" ? "O" : "X";
    const cellIndex = this.mode ? this._allahAi(aiSide) : this._kolsuzAi();
    console.log(cellIndex);
    // const randIndex = Math.trunc(Math.random() * 9);
    // const nullCells = this.table
    //   .map((val, idx) => (val === null ? idx : null))
    //   .filter((val) => val !== null);
    // const cellIndex = nullCells[randIndex % nullCells.length];
    this.table[cellIndex] = aiSide;
    const selectedCell = document.querySelector(`.cell--${cellIndex}`);
    selectedCell.textContent = aiSide;
    this._checkWinner();
  }

  _makeMove(e) {
    if (this.game) {
      const selectedCell = e.target;
      const cellIndex = Number(selectedCell.classList.value.slice(-1));
      if (this.table[cellIndex] === null) {
        this.table[cellIndex] = this.side;
        selectedCell.textContent = this.side;
        this.turn = true;
        this._checkWinner();
      }
    }
  }

  _tieBorderAnimation(isTie) {
    const borders = document.querySelectorAll(".border");
    borders.forEach((e) =>
      isTie ? e.classList.add("tie-border") : e.classList.remove("tie-border")
    );
  }
  _winnerAnimation(isWinner) {
    const winner = this.turn ? this.side : this.side === "X" ? "O" : "X";
    const winnerCells = this.table
      .map((val, idx) => (val === winner ? idx : null))
      .filter((val) => val !== null);
    isWinner
      ? winnerCells.forEach((e) =>
          document.querySelector(`.cell--${e}`).classList.add("winner-cell")
        )
      : cells.forEach((e) => e.classList.remove("winner-cell"));
  }

  _kolsuzAi() {
    const randIndex = Math.trunc(Math.random() * 9);
    const nullCells = this.table
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    return nullCells[randIndex % nullCells.length];
  }

  _allahAi(val) {
    const allahSide = val;
    const kulSide = this.side;
    const goalsF = this.goals;
    const tableF = this.table;
    const candidate = this.table
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    const cellchances = new Array(9).fill(0);
    let acc = 0;
    candidate.forEach(function (indxA, idx) {
      cellchances[indxA] = 100;
      acc = 0;
      goalsF[indxA].forEach(function (val, idx) {
        acc += tableF[val[0]] === null && tableF[val[1]] === allahSide ? 4 : 0;
        acc += tableF[val[1]] === null && tableF[val[0]] === allahSide ? 4 : 0;
        acc += tableF[val[1]] === null && tableF[val[0]] === null ? 3 : 0;
        acc +=
          tableF[val[0]] === kulSide && tableF[val[1]] === kulSide ? 50 : 0;
        acc += tableF[val[0]] === null && tableF[val[1]] === kulSide ? -2 : 0;
        acc += tableF[val[1]] === null && tableF[val[0]] === kulSide ? -2 : 0;
        acc +=
          tableF[val[0]] === kulSide && tableF[val[1]] === allahSide ? -7 : 0;
        acc +=
          tableF[val[1]] === kulSide && tableF[val[0]] === allahSide ? -7 : 0;
        acc +=
          tableF[val[0]] === allahSide && tableF[val[1]] === allahSide
            ? 150
            : 0;
      });
      console.log(indxA, acc);
      cellchances[indxA] += acc;
    });
    console.log(`returned ${cellchances}`);
    return cellchances.reduce(
      (mvp, val, idx, arr) => (mvp = val >= arr[mvp] ? idx : mvp),
      0
    );
  }
}

// [[1,2],[3,6],[4,8]],
// [[0,2],[4,7]],
// [[5,8],[0,1],[4,6]],
// [[0,6],[4,5]],
// [[0,8],[1,7],[2,6],[3,5]],
// [[3,4],[2,8]],
// [[0,3],[2,4],[7,8]],
// [[1,4],[6,8]],
// [[6,7],[0,4],[2,5]]
