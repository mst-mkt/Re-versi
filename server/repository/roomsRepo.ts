import type { RoomId } from '$/commonTypesWithClient/branded';
import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Room } from '@prisma/client';
import { z } from 'zod';

const toRoomModel = (prismaRoom: Room): RoomModel => ({
  id: roomIdParser.parse(prismaRoom.id),
  name: z.string().parse(prismaRoom.name),
  board: z
    .array(z.array(z.union([z.literal(-1), z.literal(0), z.literal(1), z.literal(2)])))
    .parse(prismaRoom.board),
  turnColor: z.union([z.literal(1), z.literal(2)]).parse(prismaRoom.turnColor),
  status: z.enum(['waiting', 'playing', 'finished']).parse(prismaRoom.status),
  createdAt: prismaRoom.createdAt.getTime(),
});

export const roomsRepo = {
  save: async (room: RoomModel): Promise<RoomModel> => {
    const newRoom = await prismaClient.room.upsert({
      where: { id: room.id },
      update: {
        board: room.board,
        turnColor: room.turnColor,
        status: room.status,
      },
      create: {
        id: room.id,
        name: room.name,
        board: room.board,
        turnColor: 1,
        status: room.status,
        createdAt: new Date(room.createdAt),
      },
    });
    return toRoomModel(newRoom);
  },
  find: async (roomId: RoomId): Promise<RoomModel | null> => {
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
    });
    return room !== null ? toRoomModel(room) : null;
  },
  findAll: async (): Promise<RoomModel[]> => {
    const rooms = await prismaClient.room.findMany({
      where: { status: 'waiting' },
    });
    return rooms.map(toRoomModel);
  },
};
