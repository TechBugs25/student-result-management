import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ThemeProvider } from './components/theme-provider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
    setup({ el, App, props }) {
        const appElement = (
            <ThemeProvider defaultTheme="light" storageKey="app-theme">
                <App {...props} />
            </ThemeProvider>
        );

        if (import.meta.env.SSR) {
            return appElement;
        }

        if (import.meta.env.DEV) {
            createRoot(el!).render(appElement);
            return;
        }

        hydrateRoot(el!, appElement);
    },
});