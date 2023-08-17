import { roomsRepo } from '$/repository/roomsRepo';
import { roomUseCase } from '$/usecase/roomUseCase';
import { defineController } from './$relay';
import { roomIdParser } from './../../../service/idParsers';

export default defineController(() => ({
  get: async ({ params }) => ({
    status: 200,
    body: await roomsRepo.find(roomIdParser.parse(params.roomId)),
  }),
  post: async ({ params, body, user }) => ({
    status: 201,
    body: await roomUseCase.put(roomIdParser.parse(params.roomId), user.id, body.pos),
  }),
}));
