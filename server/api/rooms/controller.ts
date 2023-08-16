import { roomsRepo } from '$/repository/roomsRepo';
import { roomUseCase } from '$/usecase/roomUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await roomsRepo.findAll() }),
  post: async ({ body }) => ({ status: 201, body: await roomUseCase.create(body.name) }),
}));
