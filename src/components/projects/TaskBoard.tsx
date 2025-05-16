import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, PlusCircle } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { Task, TaskStatus, User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { TaskModal } from './TaskModal';

interface TaskBoardProps {
  projectId: string;
  statuses: TaskStatus[];
  setShowNewTaskModal: (show: boolean) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ 
  projectId, 
  statuses, 
  setShowNewTaskModal 
}) => {
  const { tasks, updateTaskStatus } = useProjects();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const projectTasks = tasks.filter(task => task.projectId === projectId);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update task status
    const taskId = draggableId;
    const newStatus = destination.droppableId;
    updateTaskStatus(taskId, newStatus);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return projectTasks.filter(task => task.status === status);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col h-full"
                >
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center">
                          {status}
                          <Badge
                            variant={
                              status === 'To Do'
                                ? 'warning'
                                : status === 'In Progress'
                                ? 'primary'
                                : 'success'
                            }
                            size="sm"
                            className="ml-2"
                          >
                            {getTasksByStatus(status).length}
                          </Badge>
                        </CardTitle>
                        {status === 'To Do' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNewTaskModal(true)}
                            leftIcon={<Plus className="h-3 w-3" />}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pt-1">
                      <div className="space-y-3 min-h-[50px]">
                        {getTasksByStatus(status).map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setEditingTask(task)}
                                className={`p-3 bg-white rounded-md shadow-sm border border-gray-200 hover:border-indigo-200 hover:shadow 
                                  transition-all duration-150 cursor-pointer select-none ${
                                    snapshot.isDragging ? 'shadow-md' : ''
                                  }`}
                              >
                                <h4 className="font-medium text-gray-900">
                                  {task.title}
                                </h4>
                                {task.description && (
                                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                                <div className="mt-3 flex items-center justify-between">
                                  {task.dueDate && (
                                    <span className="text-xs text-gray-500">
                                      {task.dueDate.toLocaleDateString()}
                                    </span>
                                  )}
                                  {task.assignee && (
                                    <Avatar
                                      src={task.assignee.photoURL}
                                      name={task.assignee.name}
                                      size="xs"
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      {getTasksByStatus(status).length === 0 && status === 'To Do' && (
                        <button
                          className="mt-3 w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center"
                          onClick={() => setShowNewTaskModal(true)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add a task
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          projectId={projectId}
          task={editingTask}
          statuses={statuses}
        />
      )}
    </>
  );
};