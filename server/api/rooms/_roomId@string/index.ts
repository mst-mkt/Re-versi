import type { RoomModel } from '$/commonTypesWithClient/models';
import type { Pos } from '$/usecase/roomUseCase';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: RoomModel | null;
  };
  post: {
    reqBody: {
      pos: Pos;
    };
    resBody: RoomModel | null;
  };
}>;
