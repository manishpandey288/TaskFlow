import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { MOCK_USERS } from '../data/mockData';

interface ProjectFormData {
  title: string;
  description: string;
}

export const NewProject: React.FC = () => {
  const { addProject } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectFormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // In a real app, we would get the current user from auth context
      const currentUser = user || MOCK_USERS[0];
      
      // Create new project
      addProject({
        title: data.title,
        description: data.description,
        createdBy: currentUser.id,
        members: [
          {
            userId: currentUser.id,
            role: 'owner',
            user: currentUser,
          },
        ],
      });
      
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create a New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="Project Title"
              fullWidth
              placeholder="Enter a title for your project"
              error={errors.title?.message}
              {...register('title', { 
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                }
              })}
            />
            
            <Textarea
              label="Description"
              fullWidth
              placeholder="Describe your project"
              rows={5}
              error={errors.description?.message}
              {...register('description', { 
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                }
              })}
            />
            
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                className="mr-3"
                onClick={() => navigate('/projects')}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
              >
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};