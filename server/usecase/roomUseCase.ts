import type { RoomId, UserId } from '$/commonTypesWithClient/branded';
import type { PlayerModel, RoomModel } from '$/commonTypesWithClient/models';
import { playersRepo } from '$/repository/playersRepo';
import { roomsRepo } from '$/repository/roomsRepo';
import { roomIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';
import { updateBoard } from './boardUseCase';

export type Pos = {
  x: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  y: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
};

const initialBoard = [...Array(8)].map((_, i) =>
  [...Array(8)].map((_, j) => {
    const isBlack = ([i, j]: number[]): boolean => {
      return i === j && (i === 3 || i === 4);
    };
    const isWhite = ([i, j]: number[]): boolean => {
      return i + j === 7 && (i === 3 || i === 4);
    };
    if (isBlack([i, j])) return 1;
    if (isWhite([i, j])) return 2;
    return 0;
  })
);

const getPlayerColor = (players: PlayerModel[], playerId: UserId): 1 | 2 | null => {
  const player = players.find((player) => player.id === playerId);
  return player?.color ?? null;
};

export const roomUseCase = {
  create: async (name: string) => {
    const newRoom: RoomModel = await roomsRepo.save({
      id: roomIdParser.parse(randomUUID()),
      name,
      createdAt: Date.now(),
      board: initialBoard,
      turnColor: 1,
      status: 'waiting',
    });
    return newRoom;
  },
  put: async (roomId: RoomId, userId: UserId, body: Pos) => {
    const room = await roomsRepo.find(roomId);
    const players = (await playersRepo.findInRoom(roomId)).sort(
      (a, b) => a.createdAt - b.createdAt
    );
    // const isMyTurn = getPlayerColor(players, userId) === room?.turnColor;

    if (room === null) {
      return null;
    }

    const newRoom = await roomsRepo.save({
      ...room,
      board: updateBoard(room.board, room.turnColor, body),
      turnColor: (3 - room.turnColor) as 1 | 2,
    });

    return newRoom;
  },
};
