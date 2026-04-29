import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '../../components/app-layout';

type AcademicClass = {
    id: string;
    name: string;
    section: string;
    students_count: number;
    created_at: string;
};

type Props = {
    classes: AcademicClass[];
    flash?: { success?: string };
};

type ModalMode = 'create' | 'edit' | null;

export default function ClassesIndex({ classes, flash }: Props) {
    const [modal, setModal] = useState<ModalMode>(null);
    const [editTarget, setEditTarget] = useState<AcademicClass | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AcademicClass | null>(null);

    const form = useForm({ name: '', section: '' });

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setEditTarget(null);
        setModal('create');
    };

    const openEdit = (cls: AcademicClass) => {
        form.setData({ name: cls.name, section: cls.section });
        form.clearErrors();
        setEditTarget(cls);
        setModal('edit');
    };

    const closeModal = () => {
        setModal(null);
        setEditTarget(null);
        form.reset();
        form.clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modal === 'create') {
            form.post('/classes', {
                onSuccess: () => closeModal(),
            });
        } else if (modal === 'edit' && editTarget) {
            form.put(`/classes/${editTarget.id}`, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/classes/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Academic Classes" />

            <div className="p-8">
                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Academic Classes</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage class groups and sections.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Class
                    </button>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-500/20 dark:bg-green-900/10 dark:text-green-400 dark:ring-green-500/30">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {flash.success}
                    </div>
                )}

                {/* Table */}
                <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/10">
                    {classes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">No classes yet</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first class.</p>
                            <button onClick={openCreate} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                Add a class →
                            </button>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">#</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Class Name</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Section</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Students</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {classes.map((cls, index) => (
                                    <tr key={cls.id} className="group transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{cls.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-400/20">
                                                Section {cls.section}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{cls.students_count} student{cls.students_count !== 1 ? 's' : ''}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(cls)}
                                                    className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-100 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(cls)}
                                                    className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 ring-1 ring-red-300 transition hover:bg-red-50 dark:text-red-400 dark:ring-red-800 dark:hover:bg-red-900/20"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Create / Edit Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {modal === 'create' ? 'Add New Class' : 'Edit Class'}
                            </h2>
                            <button onClick={closeModal} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="e.g. Class 10"
                                    className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                />
                                {form.errors.name && <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.data.section}
                                    onChange={(e) => form.setData('section', e.target.value)}
                                    placeholder="e.g. A"
                                    className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                />
                                {form.errors.section && <p className="mt-1 text-xs text-red-500">{form.errors.section}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing || !form.data.name || !form.data.section}
                                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                >
                                    {form.processing ? 'Saving...' : (modal === 'create' ? 'Create Class' : 'Save Changes')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete Class</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete <strong>{deleteTarget.name} — Section {deleteTarget.section}</strong>? This action cannot be undone.
                        </p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
