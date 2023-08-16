import type { RoomId, UserId } from '$/commonTypesWithClient/branded';
import type { PlayerModel } from '$/commonTypesWithClient/models';
import { roomIdParser, userIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Player } from '@prisma/client';
import { z } from 'zod';

const toPlayerModel = (prismaPlayer: Player): PlayerModel => ({
  id: userIdParser.parse(prismaPlayer.id),
  roomId: roomIdParser.parse(prismaPlayer.roomId),
  inTime: prismaPlayer.inTime.getTime(),
  outTime: prismaPlayer.outTime?.getTime() ?? null,
  color: z.union([z.literal(1), z.literal(2)]).parse(prismaPlayer.color),
  createdAt: prismaPlayer.createdAt.getTime(),
});

export const playersRepo = {
  save: async (player: PlayerModel): Promise<PlayerModel> => {
    const newPlayer = await prismaClient.player.upsert({
      where: {
        PlayerId: {
          id: player.id,
          roomId: player.roomId,
        },
      },
      update: {
        inTime: new Date(player.inTime),
        outTime: player.outTime !== null ? new Date(player.outTime) : null,
      },
      create: {
        id: player.id,
        roomId: player.roomId,
        inTime: new Date(player.inTime),
        outTime: player.outTime !== null ? new Date(player.outTime) : null,
        color: player.color,
        createdAt: new Date(player.createdAt),
      },
    });
    return toPlayerModel(newPlayer);
  },
  find: async (playerId: UserId, roomId: RoomId): Promise<PlayerModel | null> => {
    const player = await prismaClient.player.findUnique({
      where: {
        PlayerId: {
          id: playerId,
          roomId,
        },
      },
    });
    return player !== null ? toPlayerModel(player) : null;
  },
  findInRoom: async (roomId: RoomId): Promise<PlayerModel[]> => {
    const players = await prismaClient.player.findMany({
      where: { roomId },
    });
    return players.map(toPlayerModel);
  },
  findSpecificPlayer: async (userId: UserId): Promise<PlayerModel[]> => {
    const players = await prismaClient.player.findMany({
      where: { id: userId },
    });
    return players.map(toPlayerModel);
  },
};
