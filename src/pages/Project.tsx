import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit2, 
  Plus, 
  Settings, 
  Trash, 
  Users 
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { TaskBoard } from '../components/projects/TaskBoard';
import { TaskModal } from '../components/projects/TaskModal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

export const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    projects, 
    tasks, 
    updateProject, 
    deleteProject, 
    setCurrentProject 
  } = useProjects();

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const project = projects.find((p) => p.id === id);
  const projectTasks = tasks.filter((task) => task.projectId === id);
  
  // Default statuses for tasks
  const statuses = ['To Do', 'In Progress', 'Done'];
  
  const completedTasks = projectTasks.filter((task) => task.status === 'Done').length;
  const progressPercentage = projectTasks.length > 0
    ? Math.round((completedTasks / projectTasks.length) * 100)
    : 0;

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
      setEditTitle(project.title);
      setEditDescription(project.description);
    } else {
      navigate('/projects');
    }
    
    return () => setCurrentProject(null);
  }, [project, setCurrentProject, navigate]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <p className="mb-8 text-gray-600">
          The project you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link to="/projects">
          <Button variant="primary">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const handleUpdateProject = () => {
    updateProject(project.id, {
      title: editTitle,
      description: editDescription,
    });
    setShowEditProjectModal(false);
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    navigate('/projects');
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/projects" className="mr-4">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Projects
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 className="h-4 w-4" />}
            onClick={() => setShowEditProjectModal(true)}
          >
            Edit
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowNewTaskModal(true)}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">{project.description}</p>
              
              <div className="mt-6 flex flex-col sm:flex-row justify-between">
                <div className="flex items-center text-sm text-gray-500 mb-4 sm:mb-0">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span>Created on {project.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Team:</span>
                  <AvatarGroup
                    avatars={project.members.map((member) => ({
                      src: member.user?.photoURL,
                      name: member.user?.name,
                    }))}
                    size="sm"
                  />
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-medium">Progress</span>
                  <span>
                    {completedTasks}/{projectTasks.length} tasks completed ({progressPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Task Board */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <TaskBoard 
              projectId={project.id} 
              statuses={statuses}
              setShowNewTaskModal={setShowNewTaskModal}
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Project Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 text-lg font-semibold">
                    {progressPercentage === 100 ? 'Completed' : 'In Progress'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tasks</p>
                  <p className="mt-1 text-lg font-semibold">
                    {projectTasks.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Team Members</p>
                  <div className="mt-1">
                    {project.members.map((member) => (
                      <div key={member.userId} className="flex items-center py-1">
                        <Avatar
                          src={member.user?.photoURL}
                          name={member.user?.name}
                          size="sm"
                        />
                        <div className="ml-2">
                          <p className="text-sm font-medium">{member.user?.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftIcon={<Users className="h-4 w-4" />}
              >
                Manage Team
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="mt-2"
                leftIcon={<Settings className="h-4 w-4" />}
              >
                Project Settings
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                className="mt-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                leftIcon={<Trash className="h-4 w-4" />}
                onClick={() => setShowDeleteProjectModal(true)}
              >
                Delete Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <TaskModal
          isOpen={showNewTaskModal}
          onClose={() => setShowNewTaskModal(false)}
          projectId={project.id}
          statuses={statuses}
        />
      )}
      
      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditProjectModal}
        onClose={() => setShowEditProjectModal(false)}
        title="Edit Project"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowEditProjectModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateProject}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Project Title"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            fullWidth
            rows={4}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </div>
      </Modal>

      {/* Delete Project Modal */}
      <Modal
        isOpen={showDeleteProjectModal}
        onClose={() => setShowDeleteProjectModal(false)}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteProjectModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          This will permanently delete the project "{project.title}" and all its tasks. 
          This action cannot be reversed.
        </p>
      </Modal>
    </div>
  );
};