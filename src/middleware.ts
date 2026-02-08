import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/utils/supabase/middleware';
import { type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'ar', 'hi'],

    // Used when no locale matches
    defaultLocale: 'en'
});

export default async function middleware(request: NextRequest) {
    const response = intlMiddleware(request);
    return await updateSession(request, response);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(ar|en|hi)/:path*']
};
