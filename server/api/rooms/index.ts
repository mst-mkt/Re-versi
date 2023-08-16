import type { RoomModel } from '$/commonTypesWithClient/models';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: RoomModel[];
  };
  post: {
    reqBody: {
      name: string;
    };
    resBody: RoomModel;
  };
}>;
