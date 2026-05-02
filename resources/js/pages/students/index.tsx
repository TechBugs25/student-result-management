import { useState, useEffect, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '../../components/app-layout';

type AcademicClass = {
    id: string;
    name: string;
    section: string;
};

type Student = {
    id: string;
    first_name: string;
    last_name: string;
    admission_number: string;
    academic_class_id: string;
    academic_class: AcademicClass;
    date_of_birth: string;
    gender: 'male' | 'female';
    created_at: string;
};

type FormData = {
    first_name: string;
    last_name: string;
    admission_number: string;
    academic_class_id: string;
    date_of_birth: string;
    gender: string;
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
    students: PaginatedData<Student>;
    classes: AcademicClass[];
    filters?: { search?: string };
    flash?: { success?: string };
};

type ModalMode = 'create' | 'edit' | null;

const emptyForm: FormData = {
    first_name: '',
    last_name: '',
    admission_number: '',
    academic_class_id: '',
    date_of_birth: '',
    gender: '',
};

function formatDate(dateStr: string) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function StudentsIndex({ students, classes, filters, flash }: Props) {
    const [modal, setModal] = useState<ModalMode>(null);
    const [editTarget, setEditTarget] = useState<Student | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
    const [search, setSearch] = useState(filters?.search || '');
    const isFirstRender = useRef(true);

    const form = useForm<FormData>(emptyForm);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            router.get('/students', { search }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setEditTarget(null);
        setModal('create');
    };

    const openEdit = (student: Student) => {
        form.setData({
            first_name: student.first_name,
            last_name: student.last_name,
            admission_number: student.admission_number,
            academic_class_id: student.academic_class_id,
            date_of_birth: student.date_of_birth.split('T')[0],
            gender: student.gender,
        });
        form.clearErrors();
        setEditTarget(student);
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
            form.post('/students', { onSuccess: () => closeModal() });
        } else if (modal === 'edit' && editTarget) {
            form.put(`/students/${editTarget.id}`, { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/students/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const currentStudents = students.data;

    const GenderBadge = ({ gender }: { gender: 'male' | 'female' }) => (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${gender === 'male'
                ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/20'
                : 'bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-900/20 dark:text-pink-400 dark:ring-pink-400/20'
                }`}
        >
            {gender === 'male' ? '♂' : '♀'} {gender.charAt(0).toUpperCase() + gender.slice(1)}
        </span>
    );

    return (
        <AppLayout>
            <Head title="Students" />

            <div className="p-8">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Students</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage enrolled students and their class assignments.
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Student
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
                            placeholder="Search by name, admission no., class…"
                            className="w-full rounded-lg border-0 py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/10">
                    {currentStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                            </div>
                            {search ? (
                                <>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">No students found</p>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">No students yet</p>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by enrolling your first student.</p>
                                    <button onClick={openCreate} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                        Add a student →
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">#</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Name</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Admission No.</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Class</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Gender</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Date of Birth</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {currentStudents.map((student, index) => (
                                        <tr key={student.id} className="group transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">{(students.from || 1) + index}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                        {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {student.first_name} {student.last_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">{student.admission_number}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-400/20">
                                                    {student.academic_class?.name} — {student.academic_class?.section}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <GenderBadge gender={student.gender} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(student.date_of_birth)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(student)}
                                                        className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-100 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(student)}
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

                {/* Summary and Pagination */}
                {students.total > 0 && (
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-medium text-gray-900 dark:text-white">{students.from || 0}</span> to{' '}
                            <span className="font-medium text-gray-900 dark:text-white">{students.to || 0}</span> of{' '}
                            <span className="font-medium text-gray-900 dark:text-white">{students.total}</span> students
                        </p>

                        {students.links.length > 3 && (
                            <nav className="flex items-center gap-1">
                                {students.links.map((link, i) => (
                                    link.url ? (
                                        <button
                                            key={i}
                                            onClick={() => router.get(link.url!, {}, { preserveScroll: true, preserveState: true })}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${link.active
                                                    ? 'bg-indigo-600 text-white border border-indigo-600'
                                                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-600 ${link.label === '...' ? '' : 'ring-1 ring-inset ring-gray-200 dark:ring-gray-800'
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
                    <div className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all dark:bg-gray-900 ring-1 ring-gray-900/10 dark:ring-white/10">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5 dark:border-gray-800 dark:bg-gray-800/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                                    {modal === 'create' ? 'Enroll New Student' : 'Edit Student Details'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Please fill in the student's personal and academic information.
                                </p>
                            </div>
                            <button onClick={closeModal} className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors dark:hover:bg-gray-700 dark:hover:text-gray-300">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="px-6 py-6">
                            <div className="space-y-8">
                                {/* Personal Information Section */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name <span className="text-red-500">*</span></label>
                                            <input type="text" value={form.data.first_name} onChange={(e) => form.setData('first_name', e.target.value)} placeholder="e.g. Rahim" className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800/50 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 transition-all duration-200" />
                                            {form.errors.first_name && <p className="mt-1 text-xs text-red-500">{form.errors.first_name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name <span className="text-red-500">*</span></label>
                                            <input type="text" value={form.data.last_name} onChange={(e) => form.setData('last_name', e.target.value)} placeholder="e.g. Uddin" className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800/50 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 transition-all duration-200" />
                                            {form.errors.last_name && <p className="mt-1 text-xs text-red-500">{form.errors.last_name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                                            <input type="date" value={form.data.date_of_birth} onChange={(e) => form.setData('date_of_birth', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800/50 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 transition-all duration-200" />
                                            {form.errors.date_of_birth && <p className="mt-1 text-xs text-red-500">{form.errors.date_of_birth}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender <span className="text-red-500">*</span></label>
                                            <select value={form.data.gender} onChange={(e) => form.setData('gender', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800/50 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 transition-all duration-200">
                                                <option value="">— Select Gender —</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                            {form.errors.gender && <p className="mt-1 text-xs text-red-500">{form.errors.gender}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800"></div>

                                {/* Academic Information Section */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342" />
                                        </svg>
                                        Academic Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admission Number <span className="text-red-500">*</span></label>
                                            <input type="text" value={form.data.admission_number} onChange={(e) => form.setData('admission_number', e.target.value)} placeholder="e.g. ADM-2024-001" className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono dark:bg-gray-800/50 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 transition-all duration-200" />
                                            {form.errors.admission_number && <p className="mt-1 text-xs text-red-500">{form.errors.admission_number}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class Assignment <span className="text-red-500">*</span></label>
                                            <select value={form.data.academic_class_id} onChange={(e) => form.setData('academic_class_id', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800/50 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500 transition-all duration-200">
                                                <option value="">— Select a class —</option>
                                                {classes.map((cls) => (
                                                    <option key={cls.id} value={cls.id}>
                                                        {cls.name} — Section {cls.section}
                                                    </option>
                                                ))}
                                            </select>
                                            {form.errors.academic_class_id && <p className="mt-1 text-xs text-red-500">{form.errors.academic_class_id}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50 rounded-b-2xl">
                                <button type="button" onClick={closeModal} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800 dark:hover:text-white">
                                    Cancel
                                </button>
                                <button type="submit" disabled={form.processing} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {form.processing ? 'Saving...' : modal === 'create' ? 'Enroll Student' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delete Student</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete{' '}
                            <strong>{deleteTarget.first_name} {deleteTarget.last_name}</strong>? This action cannot be undone.
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
