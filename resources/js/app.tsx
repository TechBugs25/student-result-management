import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/theme-provider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
    setup({ el, App, props }) {
        createRoot(el!).render(
            <ThemeProvider defaultTheme="light" storageKey="app-theme">
                <App {...props} />
            </ThemeProvider>
        );
    },
});