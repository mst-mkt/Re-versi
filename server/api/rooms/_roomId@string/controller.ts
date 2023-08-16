import type { UserModel } from '$/commonTypesWithClient/models';
import { getUserModel } from '$/middleware/firebaseAdmin';
import { roomsRepo } from '$/repository/roomsRepo';
import { defineController, defineHooks } from './$relay';
import { roomIdParser, userIdParser } from './../../../service/idParsers';

export type AdditionalRequest = {
  user: UserModel;
};

export const hooks = defineHooks(() => ({
  preHandler: async (req, res) => {
    const user = await getUserModel(req.cookies.session);

    if (user === null) {
      res.status(401).send();
      return;
    }

    req.user = {
      id: userIdParser.parse(user.uid),
      email: user.email ?? '',
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  },
}));

export default defineController(() => ({
  get: async ({ params }) => ({
    status: 200,
    body: await roomsRepo.find(roomIdParser.parse(params.roomId)),
  }),
  // post: async ({ params, body, user }) => ({
  //   status: 201,
  //   body: await roomUseCase.put(roomIdParser.parse(params.roomId), user.id, body),
  // }),
}));
