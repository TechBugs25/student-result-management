import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '../../components/app-layout';

type GradingScale = {
    id: string;
    letter_grade: string;
    gpa_point: string | number;
    min_percentage: string | number;
    max_percentage: string | number;
    description: string | null;
    created_at: string;
};

type FormData = {
    letter_grade: string;
    gpa_point: string | number;
    min_percentage: string | number;
    max_percentage: string | number;
    description: string;
};

type Props = {
    gradingScales: GradingScale[];
    flash?: { success?: string };
};

type ModalMode = 'create' | 'edit' | null;

const emptyForm: FormData = {
    letter_grade: '',
    gpa_point: '',
    min_percentage: '',
    max_percentage: '',
    description: '',
};

export default function GradingScalesIndex({ gradingScales, flash }: Props) {
    const [modal, setModal] = useState<ModalMode>(null);
    const [editTarget, setEditTarget] = useState<GradingScale | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<GradingScale | null>(null);

    const form = useForm<FormData>(emptyForm);

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setEditTarget(null);
        setModal('create');
    };

    const openEdit = (scale: GradingScale) => {
        form.setData({
            letter_grade: scale.letter_grade,
            gpa_point: scale.gpa_point,
            min_percentage: scale.min_percentage,
            max_percentage: scale.max_percentage,
            description: scale.description || '',
        });
        form.clearErrors();
        setEditTarget(scale);
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
            form.post('/grading-scales', { onSuccess: () => closeModal() });
        } else if (modal === 'edit' && editTarget) {
            form.put(`/grading-scales/${editTarget.id}`, { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/grading-scales/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Grading Scales" />

            <div className="p-8">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Grading Scales</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Configure how percentages map to letter grades and GPA points.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Grade Scale
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
                    {gradingScales.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">No grading scales configured</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add scales to enable automatic grade calculation.</p>
                            <button onClick={openCreate} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                Add a scale →
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Letter Grade</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">GPA Point</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Percentage Range</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Description</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {gradingScales.map((scale) => (
                                        <tr key={scale.id} className="group transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-3 py-1 font-mono text-sm font-bold text-gray-900 ring-1 ring-inset ring-gray-900/10 dark:bg-gray-800 dark:text-white dark:ring-gray-700">
                                                    {scale.letter_grade}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{Number(scale.gpa_point).toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                                                {scale.min_percentage}% <span className="mx-1 text-gray-400 dark:text-gray-500">—</span> {scale.max_percentage}%
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {scale.description || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(scale)}
                                                        className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-100 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(scale)}
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
                        </div>
                    )}
                </div>
            </div>

            {/* Create / Edit Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 ring-1 ring-gray-900/10 dark:ring-white/10 transition-all duration-300">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {modal === 'create' ? 'Add Grading Scale' : 'Edit Grading Scale'}
                            </h2>
                            <button onClick={closeModal} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Letter Grade <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.letter_grade}
                                        onChange={(e) => form.setData('letter_grade', e.target.value)}
                                        placeholder="e.g. A+"
                                        className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                    />
                                    {form.errors.letter_grade && <p className="mt-1 text-xs text-red-500">{form.errors.letter_grade}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        GPA Point <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.data.gpa_point}
                                        onChange={(e) => form.setData('gpa_point', e.target.value)}
                                        placeholder="e.g. 4.00"
                                        className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                    />
                                    {form.errors.gpa_point && <p className="mt-1 text-xs text-red-500">{form.errors.gpa_point}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Min Percentage <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative mt-1.5 rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={form.data.min_percentage}
                                            onChange={(e) => form.setData('min_percentage', e.target.value)}
                                            placeholder="80"
                                            className="block w-full rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <span className="text-gray-500 sm:text-sm">%</span>
                                        </div>
                                    </div>
                                    {form.errors.min_percentage && <p className="mt-1 text-xs text-red-500">{form.errors.min_percentage}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Max Percentage <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative mt-1.5 rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={form.data.max_percentage}
                                            onChange={(e) => form.setData('max_percentage', e.target.value)}
                                            placeholder="100"
                                            className="block w-full rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <span className="text-gray-500 sm:text-sm">%</span>
                                        </div>
                                    </div>
                                    {form.errors.max_percentage && <p className="mt-1 text-xs text-red-500">{form.errors.max_percentage}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="e.g. Excellent"
                                    className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                />
                                {form.errors.description && <p className="mt-1 text-xs text-red-500">{form.errors.description}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                                >
                                    {form.processing ? 'Saving…' : modal === 'create' ? 'Add Scale' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all duration-300">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 ring-1 ring-gray-900/10 dark:ring-white/10">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete Grading Scale</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete the <strong>{deleteTarget.letter_grade}</strong> grading scale? This action cannot be undone.
                        </p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
