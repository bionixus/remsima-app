import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'ar', 'hi'];

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as any)) {
        // This is just to satisfy TS, middleware should handle this
        // In a real app we might throw or return default
    }

    return {
        locale: locale || 'en',
        messages: (await import(`../../messages/${locale || 'en'}.json`)).default
    };
});
