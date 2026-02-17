'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { TaskCreate } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/ToastContainer';

interface TaskFormProps {
  onTaskCreated: () => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskCreate>({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createTask(formData);
      setFormData({ title: '', description: '' });
      success('Task created successfully!');
      onTaskCreated();
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl hover:shadow-white/5 transition-all duration-300 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Add New Task</h2>
        <div className="h-1 w-20 bg-white rounded-full"></div>
      </div>

      <div className="space-y-6">
        <Input
          label="Title"
          id="title"
          type="text"
          required
          maxLength={200}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Buy groceries"
          fullWidth
        />

        <Textarea
          label="Description"
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Milk, eggs, bread..."
          helperText="Optional task details"
          fullWidth
        />

        <Button
          type="submit"
          loading={loading}
          fullWidth
          variant="primary"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </span>
        </Button>
      </div>
    </form>
  );
}
