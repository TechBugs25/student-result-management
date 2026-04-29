import { usePage } from '@inertiajs/react';
import Sidebar from './sidebar';

type AppLayoutProps = {
    children: React.ReactNode;
};

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
};

export default function AppLayout({ children }: AppLayoutProps) {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 font-['Inter'] dark:bg-gray-950">
            <Sidebar user={auth?.user} />

            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
