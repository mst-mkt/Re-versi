import type { RoomId, UserId } from '$/commonTypesWithClient/branded';
import type { PlayerModel } from '$/commonTypesWithClient/models';
import { playersRepo } from '$/repository/playersRepo';
import { roomsRepo } from '$/repository/roomsRepo';

export const playerUseCase = {
  join: async (roomId: RoomId, playerId: UserId): Promise<PlayerModel | null> => {
    console.log('playerUseCase.join');
    const room = await roomsRepo.find(roomId);

    if (room === null || room.status !== 'waiting') {
      return null;
    }

    const player = await playersRepo.save({
      id: playerId,
      roomId,
      inTime: Date.now(),
      outTime: null,
      color: 1,
      createdAt: Date.now(),
    });

    const playerNumber = (await playersRepo.findInRoom(roomId)).length;
    if (playerNumber === 2) {
      await roomsRepo.save({ ...room, status: 'playing' });
    }

    return player;
  },
  leave: async (playerId: UserId) => {
    const players = await playersRepo.findSpecificPlayer(playerId);
    await Promise.all(
      players.map((player) => {
        playersRepo.save({ ...player, outTime: Date.now() });
        roomsRepo.find(player.roomId).then(async (room) => {
          if (room !== null) {
            roomsRepo.save({ ...room, status: 'finished' });
          }
        });
      })
    );
  },
};
