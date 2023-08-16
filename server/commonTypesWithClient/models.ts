import type { RoomId, UserId } from './branded';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export type RoomModel = {
  id: RoomId;
  name: string;
  board: (-1 | 0 | 1 | 2)[][];
  turnColor: 1 | 2;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
};

export type PlayerModel = {
  id: UserId;
  roomId: RoomId;
  inTime: number;
  outTime: number | null;
  color: 1 | 2;
  createdAt: number;
};
