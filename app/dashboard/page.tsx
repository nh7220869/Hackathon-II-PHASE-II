'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { TaskListResponse } from '@/lib/types';
import TaskForm from '@/components/task/TaskForm';
import TaskList from '@/components/task/TaskList';
import TaskFilters from '@/components/task/TaskFilters';
import UserProfileModal from '@/components/ui/UserProfileModal';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';

export default function DashboardPage() {
  const router = useRouter();
  const [taskData, setTaskData] = useState<TaskListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const loadTasks = async (filter?: 'all' | 'pending' | 'completed') => {
    try {
      const filterToUse = filter || currentFilter;
      console.log('Loading tasks with filter:', filterToUse);
      const data = await api.listTasks(filterToUse);
      console.log('Tasks loaded:', data);
      setTaskData(data);
      setError('');
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: 'all' | 'pending' | 'completed') => {
    setCurrentFilter(filter);
    loadTasks(filter);
  };

  useEffect(() => {
    // Check authentication
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }

    setUser(api.getUser());
    loadTasks();
  }, [router]);

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          {/* Animated loading spinner */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>

          {/* Loading text with animation */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-white text-lg font-medium">Loading</span>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black animate-fade-in">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-lg animate-slide-down">
        <div className="max-w-7xl lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Left - Dashboard Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
            </div>

            {/* Right - User Profile & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User Profile Button */}
              {user && (
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-br from-gray-800 to-black border border-gray-700 hover:border-white rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all duration-300 group"
                >
                  {/* Profile Picture */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-white to-gray-200 flex items-center justify-center text-black font-bold text-xs sm:text-sm border-2 border-gray-700 group-hover:border-white transition-all duration-300 group-hover:scale-110 shadow-lg">
                    {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : user.email[0].toUpperCase()}
                  </div>

                  {/* Username */}
                  <div className="hidden sm:flex flex-col items-start pr-1">
                    <span className="text-sm font-bold text-white leading-tight">
                      {user.name || user.email.split('@')[0]}
                    </span>
                    <span className="text-xs text-gray-400 leading-tight">
                      View Profile
                    </span>
                  </div>

                  {/* Chevron */}
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-gray-800 to-black border border-gray-700 hover:border-red-600 rounded-xl hover:bg-red-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 shadow-lg"
              >
                <span className="hidden sm:inline">Logout</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Profile Modal */}
      {user && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
        />
      )}

      <main className="max-w-7xl lg:max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {error && (
          <div className="bg-gray-900 border border-red-600 text-white px-4 py-3 rounded-lg mb-6 animate-slide-down">
            {error}
          </div>
        )}

        {/* Statistics */}
        {taskData && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 p-5 sm:p-6 rounded-2xl shadow-2xl mb-6 animate-scale-in transition-all duration-300 hover:border-gray-600">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-white">Task Statistics</h2>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 sm:p-4 rounded-xl border border-gray-600 text-center transform hover:scale-105 transition-all duration-300 hover:border-gray-500">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">{taskData.total}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-300">Total</div>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 sm:p-4 rounded-xl border border-gray-600 text-center transform hover:scale-105 transition-all duration-300 hover:border-gray-500">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">{taskData.completed}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-300">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 sm:p-4 rounded-xl border border-gray-600 text-center transform hover:scale-105 transition-all duration-300 hover:border-gray-500">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">{taskData.pending}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-300">Pending</div>
              </div>
            </div>
            {taskData.total > 0 && (
              <div className="mt-5 sm:mt-6 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-300">Progress</span>
                  <span className="text-sm font-bold text-white">
                    {Math.round((taskData.completed / taskData.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden border border-gray-600">
                  <div
                    className="bg-gradient-to-r from-white to-gray-300 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${(taskData.completed / taskData.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Task Form */}
          <div className="order-2 lg:order-1">
            <TaskForm onTaskCreated={loadTasks} />
          </div>

          {/* Task List */}
          <div className="order-1 lg:order-2 bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl hover:shadow-white/5 transition-all duration-300 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Your Tasks</h2>
              <div className="h-1 w-20 bg-white rounded-full"></div>
            </div>

            <TaskFilters currentFilter={currentFilter} onFilterChange={handleFilterChange} />

            <div className="mt-6">
              <TaskList
                tasks={taskData?.tasks || []}
                onTaskUpdated={() => loadTasks()}
                emptyMessage={
                  currentFilter === 'all'
                    ? 'No tasks yet!'
                    : `No ${currentFilter} tasks found`
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
