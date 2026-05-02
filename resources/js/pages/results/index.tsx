import { useState, useEffect, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '../../components/app-layout';

type Result = {
    id: string;
    student_id: string;
    exam_id: string;
    subject_id: string;
    marks_obtained: string | number;
    total_marks: string | number;
    letter_grade: string;
    gpa_point: string | number;
    remarks: string | null;
    created_at: string;
    student: {
        first_name: string;
        last_name: string;
        admission_number: string;
    };
    exam: {
        name: string;
    };
    subject: {
        name: string;
        code: string;
    };
};

type SelectOption = {
    id: string;
    [key: string]: any;
};

type FormData = {
    student_id: string;
    exam_id: string;
    subject_id: string;
    marks_obtained: string | number;
    total_marks: string | number;
    remarks: string;
};

type PaginatedData<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
};

type Props = {
    results: PaginatedData<Result>;
    students: SelectOption[];
    exams: SelectOption[];
    subjects: SelectOption[];
    filters?: { search?: string };
    flash?: { success?: string };
    auth_role: 'admin' | 'teacher' | 'student';
};

type ModalMode = 'create' | 'edit' | null;

const emptyForm: FormData = {
    student_id: '',
    exam_id: '',
    subject_id: '',
    marks_obtained: '',
    total_marks: 100, // default
    remarks: '',
};

export default function ResultsIndex({ results, students, exams, subjects, filters, flash, auth_role }: Props) {
    const [modal, setModal] = useState<ModalMode>(null);
    const [editTarget, setEditTarget] = useState<Result | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Result | null>(null);
    const [search, setSearch] = useState(filters?.search || '');
    const isFirstRender = useRef(true);

    const form = useForm<FormData>(emptyForm);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            router.get('/results', { search }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setEditTarget(null);
        setModal('create');
    };

    const openEdit = (result: Result) => {
        form.setData({
            student_id: result.student_id,
            exam_id: result.exam_id,
            subject_id: result.subject_id,
            marks_obtained: result.marks_obtained,
            total_marks: result.total_marks,
            remarks: result.remarks || '',
        });
        form.clearErrors();
        setEditTarget(result);
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
            form.post('/results', { onSuccess: () => closeModal() });
        } else if (modal === 'edit' && editTarget) {
            form.put(`/results/${editTarget.id}`, { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/results/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const currentResults = results.data;

    return (
        <AppLayout>
            <Head title="Results" />

            <div className="p-8">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Results</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {auth_role === 'student' ? 'View your academic performance.' : 'Manage and record student marks, grades, and GPAs.'}
                        </p>
                    </div>
                    {auth_role !== 'student' && (
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Result
                        </button>
                    )}
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

                {/* Search */}
                <div className="mb-4">
                    <div className="relative max-w-sm">
                        <svg
                            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by student, exam, or subject..."
                            className="w-full rounded-lg border-0 py-2 !pl-9 pr-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/10">
                    {currentResults.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                </svg>
                            </div>
                            {search ? (
                                <>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">No results found</p>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">No results recorded yet</p>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {auth_role === 'student' ? 'Your results have not been published yet.' : 'Start by adding marks for a student.'}
                                    </p>
                                    {auth_role !== 'student' && (
                                        <button onClick={openCreate} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                            Add a result →
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">#</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Student</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Exam</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Subject</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Marks</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Grade / GPA</th>
                                        {auth_role !== 'student' && <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {currentResults.map((result, index) => (
                                        <tr key={result.id} className="group transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">{(results.from || 1) + index}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {result.student.first_name} {result.student.last_name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {result.student.admission_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{result.exam.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{result.subject.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{result.subject.code}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {result.marks_obtained} <span className="text-gray-400">/ {result.total_marks}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {((Number(result.marks_obtained) / Number(result.total_marks)) * 100).toFixed(1)}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-400/20">
                                                    {result.letter_grade} 
                                                </span>
                                                <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {result.gpa_point}
                                                </span>
                                            </td>
                                            {auth_role !== 'student' && (
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEdit(result)}
                                                            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-100 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteTarget(result)}
                                                            className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 ring-1 ring-red-300 transition hover:bg-red-50 dark:text-red-400 dark:ring-red-800 dark:hover:bg-red-900/20"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary and Pagination */}
                {results.total > 0 && (
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-medium text-gray-900 dark:text-white">{results.from || 0}</span> to{' '}
                            <span className="font-medium text-gray-900 dark:text-white">{results.to || 0}</span> of{' '}
                            <span className="font-medium text-gray-900 dark:text-white">{results.total}</span> results
                        </p>
                        
                        {results.links.length > 3 && (
                            <nav className="flex items-center gap-1">
                                {results.links.map((link, i) => (
                                    link.url ? (
                                        <button
                                            key={i}
                                            onClick={() => router.get(link.url!, {}, { preserveScroll: true, preserveState: true })}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white border border-indigo-600'
                                                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-600 ${
                                                link.label === '...' ? '' : 'ring-1 ring-inset ring-gray-200 dark:ring-gray-800'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </nav>
                        )}
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 ring-1 ring-gray-900/10 dark:ring-white/10 transition-all duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {modal === 'create' ? 'Record Result' : 'Edit Result'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Grade and GPA will be calculated automatically.
                                </p>
                            </div>
                            <button onClick={closeModal} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {form.errors.subject_id && form.errors.subject_id.includes('already exists') && (
                            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                                <div className="flex">
                                    <div className="shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Duplicate Entry</h3>
                                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                            <p>{form.errors.subject_id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Selectors Section */}
                            <div className="rounded-lg bg-gray-50 p-4 ring-1 ring-inset ring-gray-900/5 dark:bg-gray-800/50 dark:ring-white/5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Student <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.data.student_id}
                                        onChange={(e) => form.setData('student_id', e.target.value)}
                                        className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                    >
                                        <option value="">— Select a Student —</option>
                                        {students.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.first_name} {s.last_name} ({s.admission_number})
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.student_id && <p className="mt-1 text-xs text-red-500">{form.errors.student_id}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Exam <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.data.exam_id}
                                            onChange={(e) => form.setData('exam_id', e.target.value)}
                                            className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                        >
                                            <option value="">— Select an Exam —</option>
                                            {exams.map((e) => (
                                                <option key={e.id} value={e.id}>{e.name}</option>
                                            ))}
                                        </select>
                                        {form.errors.exam_id && <p className="mt-1 text-xs text-red-500">{form.errors.exam_id}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.data.subject_id}
                                            onChange={(e) => form.setData('subject_id', e.target.value)}
                                            className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                        >
                                            <option value="">— Select a Subject —</option>
                                            {subjects.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Marks Section */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Marks Obtained <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.data.marks_obtained}
                                        onChange={(e) => form.setData('marks_obtained', e.target.value)}
                                        placeholder="e.g. 85.5"
                                        className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                    />
                                    {form.errors.marks_obtained && <p className="mt-1 text-xs text-red-500">{form.errors.marks_obtained}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Total Marks <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.data.total_marks}
                                        onChange={(e) => form.setData('total_marks', e.target.value)}
                                        className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                    />
                                    {form.errors.total_marks && <p className="mt-1 text-xs text-red-500">{form.errors.total_marks}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Remarks (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={form.data.remarks}
                                    onChange={(e) => form.setData('remarks', e.target.value)}
                                    placeholder="Any additional comments..."
                                    className="mt-1.5 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                />
                                {form.errors.remarks && <p className="mt-1 text-xs text-red-500">{form.errors.remarks}</p>}
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
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50 dark:hover:bg-indigo-500"
                                >
                                    {form.processing ? 'Saving…' : modal === 'create' ? 'Save Result' : 'Save Changes'}
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
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete Result</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete the result for{' '}
                            <strong>{deleteTarget.student.first_name} {deleteTarget.student.last_name}</strong> in{' '}
                            <strong>{deleteTarget.subject.name}</strong>?
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
