import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Layers, 
  Users 
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
  const { projects, tasks } = useProjects();

  // Calculate some statistics
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const toDoTasks = tasks.filter(task => task.status === 'To Do').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get recent tasks - last 5
  const recentTasks = [...tasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  // Get upcoming tasks - tasks with due dates in the future, sorted by closest first
  const now = new Date();
  const upcomingTasks = [...tasks]
    .filter(task => task.dueDate && task.dueDate > now && task.status !== 'Done')
    .sort((a, b) => (a.dueDate as Date).getTime() - (b.dueDate as Date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/projects/new">
          <Button variant="primary">New Project</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Layers className="w-8 h-8 text-indigo-600" />
            </div>
            <CardTitle className="mt-4 text-3xl font-bold text-gray-900">{totalProjects}</CardTitle>
            <p className="mt-2 text-sm font-medium text-gray-500">Total Projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-amber-100 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="mt-4 text-3xl font-bold text-gray-900">{completionRate}%</CardTitle>
            <p className="mt-2 text-sm font-medium text-gray-500">Task Completion Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-teal-100 p-3 rounded-full">
              <Clock className="w-8 h-8 text-teal-600" />
            </div>
            <CardTitle className="mt-4 text-3xl font-bold text-gray-900">{inProgressTasks}</CardTitle>
            <p className="mt-2 text-sm font-medium text-gray-500">Tasks In Progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-rose-100 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-rose-600" />
            </div>
            <CardTitle className="mt-4 text-3xl font-bold text-gray-900">{upcomingTasks.length}</CardTitle>
            <p className="mt-2 text-sm font-medium text-gray-500">Upcoming Tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects and Tasks section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-200">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => {
                  const project = projects.find(p => p.id === task.projectId);
                  return (
                    <div key={task.id} className="py-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            <Link to={`/projects/${task.projectId}/tasks/${task.id}`} className="hover:text-indigo-600">
                              {task.title}
                            </Link>
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            {project?.title} • Updated {task.updatedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className={`
                            text-xs font-medium px-2.5 py-0.5 rounded-full
                            ${task.status === 'Done' ? 'bg-green-100 text-green-800' : 
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'}
                          `}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 py-4">No recent tasks found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-200">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => {
                  const project = projects.find(p => p.id === task.projectId);
                  const dueDate = task.dueDate as Date;
                  const today = new Date();
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  
                  const isToday = dueDate.toDateString() === today.toDateString();
                  const isTomorrow = dueDate.toDateString() === tomorrow.toDateString();
                  
                  let dueDateText;
                  if (isToday) dueDateText = 'Today';
                  else if (isTomorrow) dueDateText = 'Tomorrow';
                  else dueDateText = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  
                  return (
                    <div key={task.id} className="py-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            <Link to={`/projects/${task.projectId}/tasks/${task.id}`} className="hover:text-indigo-600">
                              {task.title}
                            </Link>
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            {project?.title} • Due {dueDateText}
                          </p>
                        </div>
                        {task.assignee && (
                          <Avatar 
                            src={task.assignee.photoURL} 
                            name={task.assignee.name} 
                            size="xs"
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 py-4">No upcoming tasks found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {projects.length > 0 ? (
              projects.map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const projectCompletedTasks = projectTasks.filter(t => t.status === 'Done').length;
                const projectProgress = projectTasks.length > 0 
                  ? Math.round((projectCompletedTasks / projectTasks.length) * 100) 
                  : 0;
                
                return (
                  <div key={project.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          <Link to={`/projects/${project.id}`} className="hover:text-indigo-600">
                            {project.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                          <AvatarGroup 
                            avatars={project.members.map(member => ({
                              src: member.user?.photoURL,
                              name: member.user?.name
                            }))} 
                            size="xs"
                          />
                        </div>
                        <div className="w-32 flex flex-col">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{projectCompletedTasks}/{projectTasks.length} tasks</span>
                            <span>{projectProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${projectProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first project to get started</p>
                <div className="mt-6">
                  <Link to="/projects/new">
                    <Button variant="primary">Create Project</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};