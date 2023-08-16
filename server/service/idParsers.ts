import { z } from 'zod';
import type { RoomId, UserId } from '../commonTypesWithClient/branded';

export const userIdParser: z.ZodType<UserId> = z.string().brand<'UserId'>();

export const roomIdParser: z.ZodType<RoomId> = z.string().brand<'RoomId'>();
