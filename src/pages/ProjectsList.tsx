import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Search, Users } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';

export const ProjectsList: React.FC = () => {
  const { projects, tasks } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              className="w-full sm:w-64"
            />
          </div>
          <Link to="/projects/new">
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter((task) => task.projectId === project.id);
            const completedTasks = projectTasks.filter((task) => task.status === 'Done').length;
            const progress = projectTasks.length > 0
              ? Math.round((completedTasks / projectTasks.length) * 100)
              : 0;

            return (
              <Link
                to={`/projects/${project.id}`}
                key={project.id}
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-md group-hover:border-indigo-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>{project.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1.5" />
                        <span>{project.members.length}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{completedTasks}/{projectTasks.length} tasks</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex items-center justify-between">
                      <AvatarGroup
                        avatars={project.members.map((member) => ({
                          src: member.user?.photoURL,
                          name: member.user?.name,
                        }))}
                        size="sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="rounded-full p-3 bg-gray-100">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? `No projects match "${searchTerm}"`
                : "You haven't created any projects yet"}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link to="/projects/new">
                  <Button variant="primary">Create your first project</Button>
                </Link>
              </div>
            )}
            {searchTerm && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};