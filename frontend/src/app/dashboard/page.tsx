'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { taskApi } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    createdAt: string;
    updatedAt: string;
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const { user, logout, isLoading: authLoading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await taskApi.getAll({
                page,
                limit: 10,
                status: statusFilter || undefined,
                q: searchQuery || undefined,
            });
            setTasks(data.tasks);
            setTotalPages(data.pagination.totalPages);
            setTotal(data.pagination.total);
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to fetch tasks', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [page, statusFilter, searchQuery, showToast]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user, fetchTasks]);

    const handleCreateTask = async (data: { title: string; description: string; status: string }) => {
        setIsSubmitting(true);
        try {
            await taskApi.create(data);
            showToast('Task created successfully', 'success');
            setIsFormOpen(false);
            fetchTasks();
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to create task', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTask = async (data: { title: string; description: string; status: string }) => {
        if (!editingTask) return;

        setIsSubmitting(true);
        try {
            await taskApi.update(editingTask.id, data);
            showToast('Task updated successfully', 'success');
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to update task', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await taskApi.delete(id);
            showToast('Task deleted successfully', 'success');
            fetchTasks();
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to delete task', 'error');
        }
    };

    const handleToggleTask = async (id: string) => {
        try {
            await taskApi.toggle(id);
            showToast('Task status updated', 'success');
            fetchTasks();
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Failed to toggle task', 'error');
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Task Manager
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">Welcome, {user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters & Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white min-w-[150px]"
                    >
                        <option value="">All Status</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Task
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-sm">Total Tasks</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{total}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-sm">In Progress</p>
                        <p className="text-3xl font-bold text-amber-600 mt-1">
                            {tasks.filter((t) => t.status === 'IN_PROGRESS').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-sm">Completed</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">
                            {tasks.filter((t) => t.status === 'DONE').length}
                        </p>
                    </div>
                </div>

                {/* Task List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
                        <p className="mt-1 text-gray-500">Get started by creating a new task.</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Create Task
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={(t) => setEditingTask(t as Task)}
                                onDelete={handleDeleteTask}
                                onToggle={handleToggleTask}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            {/* Task Form Modal */}
            <TaskForm
                isOpen={isFormOpen || !!editingTask}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                initialData={editingTask}
                isLoading={isSubmitting}
            />
        </div>
    );
}
