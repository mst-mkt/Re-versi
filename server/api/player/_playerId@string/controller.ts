import { playerUseCase } from '$/usecase/playerUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body, user }) => ({
    status: 201,
    body: await (async () => {
      console.log(0);
      return await playerUseCase.join(body.roomId, user.id);
    })(),
  }),
  delete: async ({ user }) => ({ status: 201, body: await playerUseCase.leave(user.id) }),
}));
