import type { RoomId } from 'commonTypesWithClient/branded';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { Loading } from 'src/components/Loading/Loading';
import Game from 'src/components/reversi/Game/Game';
import Lobby from 'src/components/reversi/Lobby/Lobby';
import { userAtom } from '../atoms/user';

const Home = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  const query = router.query.roomId;
  const roomId = (Array.isArray(query) ? query[0] : query ?? null) as RoomId | null;

  if (!user) return <Loading visible />;
  if (roomId === null) return <Lobby />;

  return <Game roomId={roomId} />;
};

export default Home;
