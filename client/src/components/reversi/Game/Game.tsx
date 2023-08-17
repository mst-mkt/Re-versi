import type { RoomId } from 'commonTypesWithClient/branded';
import type { RoomModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';
import styles from './Game.module.css';

type Props = {
  roomId: RoomId;
};

const Game = ({ roomId }: Props) => {
  const [user] = useAtom(userAtom);
  const [room, setRoom] = useState<RoomModel>();

  const fetchRoom = useCallback(async () => {
    const res = await apiClient.rooms._roomId(roomId).$get();
    setRoom(res);
  }, [roomId]);

  const clickCell = async (pos: { x: number; y: number }) => {
    await apiClient.rooms._roomId(roomId).$post({ body: { pos } });
  };

  useEffect(() => {
    if (user !== null) {
      apiClient.player._playerId(user?.id).$post({ body: { roomId } });
    }
  }, [roomId, user]);

  useEffect(() => {
    const fetchIntervalId = setInterval(fetchRoom, 100);
    return () => clearInterval(fetchIntervalId);
  }, [fetchRoom]);

  return (
    <div className={styles.game}>
      <div className={styles.board}>
        {room?.board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="cell"
              style={{ width: 30, height: 30 }}
              onClick={() => clickCell({ x, y })}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      {roomId}
      <button onClick={fetchRoom}>fetch</button>
    </div>
  );
};

export default Game;
