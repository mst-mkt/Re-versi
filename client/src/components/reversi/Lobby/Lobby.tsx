import type { RoomModel } from 'commonTypesWithClient/models';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { apiClient } from 'src/utils/apiClient';

const Lobby = () => {
  const [rooms, setRooms] = useState<RoomModel[]>([]);
  const [name, setName] = useState('');
  const [user] = useAtom(userAtom);
  const router = useRouter();

  const fetchRooms = async () => {
    const res = await apiClient.rooms.$get();
    setRooms(res);
  };

  const createRoom = async () => {
    const res = await apiClient.rooms.$post({ body: { name } });
    setRooms((rooms) => [...rooms, res]);
    router.push(`/?roomId=${res.id}`);
  };

  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    const fetchIntervalId = setInterval(fetchRooms, 1000);
    return () => clearInterval(fetchIntervalId);
  }, []);

  useEffect(() => {
    fetchRooms();
    if (user !== null) {
      (async () => {
        await apiClient.player._playerId(user?.id).$delete();
      })();
    }
  }, [user]);

  return (
    <div>
      <div>
        <input type="text" value={name} onChange={changeName} />
        <button onClick={createRoom} disabled={name.trim() === ''}>
          create rooms
        </button>
      </div>
      <div>
        {rooms.map((room) => (
          <Link key={room.id} href={`/?roomId=${room.id}`}>
            <p>{room.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Lobby;
