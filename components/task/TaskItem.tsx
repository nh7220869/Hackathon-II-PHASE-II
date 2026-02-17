'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { Task, TaskUpdate } from '@/lib/types';
import { useToast } from '@/components/ui/ToastContainer';
import { formatPakistanTime } from '@/lib/timeUtils';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
}

export default function TaskItem({ task, onTaskUpdated }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState<TaskUpdate>({
    title: task.title,
    description: task.description || '',
  });
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await api.toggleComplete(task.id);
      success(task.completed ? 'Task marked as incomplete' : 'Task marked as complete');
      onTaskUpdated();
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to toggle completion');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      await api.updateTask(task.id, editData);
      setIsEditing(false);
      success('Task updated successfully');
      onTaskUpdated();
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.deleteTask(task.id);
      success('Task deleted successfully');
      onTaskUpdated();
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-white rounded-2xl p-8 animate-scale-in shadow-2xl shadow-white/10">
        <div className="mb-6">
          <h3 className="text-white text-2xl font-bold mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            Edit Task
          </h3>
          <div className="h-1 w-24 bg-white rounded-full ml-13"></div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
              maxLength={200}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">Description</label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all resize-none"
              rows={4}
              placeholder="Enter task description (optional)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="flex-1 px-6 py-4 bg-white text-black rounded-xl hover:bg-gray-100 disabled:opacity-50 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="px-6 py-4 bg-gray-800 text-white border-2 border-gray-700 rounded-xl hover:bg-gray-700 disabled:opacity-50 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showDeleteConfirm) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-2xl p-8 animate-scale-in shadow-2xl shadow-red-600/20">
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white text-2xl font-bold mb-2">Delete Task?</h3>
              <p className="text-base text-gray-300 leading-relaxed">
                This action cannot be undone. The task will be permanently removed from your list.
              </p>
            </div>
          </div>
          <div className="h-1 w-24 bg-red-600 rounded-full"></div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Yes, Delete
              </>
            )}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={loading}
            className="px-6 py-4 bg-gray-800 text-white border-2 border-gray-700 rounded-xl hover:bg-gray-700 disabled:opacity-50 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-xl p-5 sm:p-6 hover:shadow-2xl hover:shadow-white/10 hover:border-gray-600 transition-all duration-300 animate-fade-in">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={loading}
          className="mt-1 h-5 w-5 sm:h-6 sm:w-6 bg-gray-700 border-2 border-gray-500 text-white rounded-md focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black cursor-pointer disabled:opacity-50 transition-all duration-300 hover:scale-110 checked:bg-white checked:border-white"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-lg font-bold break-words mb-2 ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm sm:text-base break-words leading-relaxed ${task.completed ? 'text-gray-500' : 'text-gray-200'}`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-700">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              {formatPakistanTime(task.created_at)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg border-2 transition-all duration-300 ${
            task.completed
              ? 'bg-gray-700 border-gray-600 text-gray-400'
              : 'bg-white border-white text-black shadow-lg'
          }`}
        >
          {task.completed ? '✓ Done' : '● Active'}
        </span>

        {/* Action Buttons */}
        <div className="shrink-0 flex gap-1 sm:gap-2">
          <button
            onClick={() => {
              setEditData({ title: task.title, description: task.description || '' });
              setIsEditing(true);
            }}
            className="p-2 sm:p-2.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-110 opacity-70 group-hover:opacity-100"
            title="Edit task"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 sm:p-2.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-110 opacity-70 group-hover:opacity-100"
            title="Delete task"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
