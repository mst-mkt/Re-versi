import type { RoomId } from '$/commonTypesWithClient/branded';
import type { PlayerModel } from '$/commonTypesWithClient/models';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    reqBody: {
      roomId: RoomId;
    };
    resBody: PlayerModel | null;
  };
  delete: {
    resBody: void;
  };
}>;
