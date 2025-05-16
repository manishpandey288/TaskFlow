import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Clock, User, X } from 'lucide-react';
import { Task, TaskStatus, User as UserType } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { MOCK_USERS } from '../../data/mockData';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  task?: Task;
  statuses: TaskStatus[];
}

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  assigneeId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  projectId,
  task,
  statuses,
}) => {
  const { addTask, updateTask, deleteTask } = useProjects();
  const isEditing = !!task;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || statuses[0],
      dueDate: task?.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : undefined,
      assigneeId: task?.assigneeId || '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEditing && task) {
        updateTask(task.id, {
          title: data.title,
          description: data.description,
          status: data.status,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          assigneeId: data.assigneeId || undefined,
          assignee: data.assigneeId ? MOCK_USERS.find(u => u.id === data.assigneeId) : undefined,
        });
      } else {
        addTask({
          projectId,
          title: data.title,
          description: data.description,
          status: data.status,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          assigneeId: data.assigneeId || undefined,
          assignee: data.assigneeId ? MOCK_USERS.find(u => u.id === data.assigneeId) : undefined,
          createdBy: 'user-1', // In a real app, this would be the current user's ID
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  });

  const handleDeleteTask = () => {
    if (task) {
      deleteTask(task.id);
      onClose();
    }
  };

  const modalFooter = (
    <div className="flex justify-between">
      <div>
        {isEditing && (
          <Button
            variant="danger"
            onClick={handleDeleteTask}
          >
            Delete
          </Button>
        )}
      </div>
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onSubmit}
          isLoading={isSubmitting}
        >
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create Task'}
      footer={modalFooter}
      size="lg"
    >
      <form className="space-y-4">
        <Input
          label="Title"
          fullWidth
          placeholder="Enter task title"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />

        <Textarea
          label="Description"
          fullWidth
          placeholder="Enter task description"
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              {...register('status')}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              {...register('assigneeId')}
            >
              <option value="">Unassigned</option>
              {MOCK_USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <Input
            type="date"
            fullWidth
            placeholder="Select due date"
            {...register('dueDate')}
          />
        </div>
      </form>
    </Modal>
  );
};