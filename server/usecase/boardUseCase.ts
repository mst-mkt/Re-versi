import type { Board } from './boardUseCase';
import type { Pos } from './roomUseCase';

export type Board = (-1 | 0 | 1 | 2)[][];

const dirs: (-1 | 0 | 1)[][] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, -1],
  [-1, 1],
  [-1, 0],
];

const pickDirDiscs = (board: Board, putPos: Pos, dir: (-1 | 0 | 1)[]) => {
  const pickedLength = Math.min(
    Math.max(putPos.x * dir[0], (putPos.x - 7) * dir[0]),
    Math.max(putPos.y * dir[1], (putPos.y - 7) * dir[1])
  );
  const pickedDiscs = [...Array(pickedLength)].map((_, i) => {
    const [x, y] = [putPos.x + dir[0] * (i + 1), putPos.y + dir[1] * (i + 1)];
    return board[x][y];
  });
  return pickedDiscs;
};

const reverseOneDirDiscs = (discs: (-1 | 0 | 1 | 2)[], turnColor: 1 | 2) => {
  const emptyIndex = discs.findIndex((disc) => disc <= 0);
  const shouldReverseLength = Math.min(Math.max(discs.length * emptyIndex * -1, 0), discs.length);
  const reverseDiscs = [...Array(shouldReverseLength)].map(() => turnColor);
  const newDiscs = [...reverseDiscs, ...discs.slice(shouldReverseLength)];
  return newDiscs;
};

const putDisc = (board: Board, turnColor: 1 | 2, pos: Pos): Board => {
  return board.map((row, y) =>
    row.map((cell, x) => {
      const overVertical = Math.min(Math.abs(pos.y - y), 1);
      const overHorizontal = Math.min(Math.abs(pos.x - x), 1);
      const overDiagonal = Math.min(Math.abs(pos.x - pos.y - x + y), 1);
      const overAntiDiagonal = Math.min(Math.abs(pos.x + pos.y - x - y), 1);
      const over = overVertical + overHorizontal + overDiagonal + overAntiDiagonal - 3;
      const dir = [Math.min(Math.max(x - pos.x, -1), 1), Math.min(Math.max(y - pos.y, -1), 1)] as (
        | -1
        | 1
        | 0
      )[];
      const distance = x - pos.x - 1;
      const pickedDiscs = pickDirDiscs(board, pos, dir);
      const reversedDiscs = reverseOneDirDiscs(pickedDiscs, turnColor);
      const reversedDisc = reversedDiscs[distance];
      return (board[y][x] * over + reversedDisc * (1 - over)) as -1 | 0 | 1 | 2;
    })
  );
};

export const updateBoard = (board: Board, turnColor: 1 | 2, putPos: Pos) => {
  return putDisc(board, turnColor, putPos);
};
