import type { RoomId } from 'commonTypesWithClient/branded';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { userAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';

type Props = {
  roomId: RoomId;
};

const Game = ({ roomId }: Props) => {
  const [user] = useAtom(userAtom);
  useEffect(() => {
    if (user !== null) {
      apiClient.player._playerId(user?.id).$post({ body: { roomId } });
    }
  }, [roomId, user]);

  return (
    <div className="game">
      <div className="game-board" />
      {roomId}
    </div>
  );
};

export default Game;
