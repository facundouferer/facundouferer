import NextAuth from 'next-auth';
import { authOptions } from '@/libs/auth';

export const { handlers: { GET, POST } } = NextAuth(authOptions);
