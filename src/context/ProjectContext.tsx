import React, { createContext, useContext, useState } from 'react';
import { Project, Task, Automation } from '../types';
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_AUTOMATIONS } from '../data/mockData';

type ProjectContextType = {
  projects: Project[];
  tasks: Task[];
  automations: Automation[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (taskId: string, newStatus: string) => void;
  addAutomation: (automation: Omit<Automation, 'id' | 'createdAt'>) => void;
  updateAutomation: (id: string, updates: Partial<Automation>) => void;
  deleteAutomation: (id: string) => void;
};

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  tasks: [],
  automations: [],
  currentProject: null,
  setCurrentProject: () => {},
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  updateTaskStatus: () => {},
  addAutomation: () => {},
  updateAutomation: () => {},
  deleteAutomation: () => {},
});

export const useProjects = () => useContext(ProjectContext);

type ProjectProviderProps = {
  children: React.ReactNode;
};

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    
    // Delete associated tasks and automations
    setTasks(tasks.filter((task) => task.projectId !== id));
    setAutomations(automations.filter((automation) => automation.projectId !== id));
    
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setTasks([...tasks, newTask]);

    // Check automations
    processAutomationsForTask(newTask);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    );
    setTasks(updatedTasks);

    // Get updated task
    const updatedTask = updatedTasks.find((task) => task.id === id);
    if (updatedTask) {
      processAutomationsForTask(updatedTask);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus });
  };

  const addAutomation = (automation: Omit<Automation, 'id' | 'createdAt'>) => {
    const newAutomation: Automation = {
      ...automation,
      id: `automation-${Date.now()}`,
      createdAt: new Date(),
    };
    setAutomations([...automations, newAutomation]);
  };

  const updateAutomation = (id: string, updates: Partial<Automation>) => {
    setAutomations(
      automations.map((automation) =>
        automation.id === id ? { ...automation, ...updates } : automation
      )
    );
  };

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter((automation) => automation.id !== id));
  };

  // Process automations for a task
  const processAutomationsForTask = (task: Task) => {
    const taskAutomations = automations.filter(
      (automation) => automation.projectId === task.projectId
    );

    taskAutomations.forEach((automation) => {
      let shouldTrigger = false;

      // Check if automation should trigger
      switch (automation.trigger) {
        case 'task_moved_to_status':
          shouldTrigger = task.status === automation.triggerValue;
          break;
        case 'task_assigned_to_user':
          shouldTrigger = task.assigneeId === automation.triggerValue;
          break;
        case 'due_date_passed':
          if (task.dueDate) {
            const now = new Date();
            shouldTrigger = task.dueDate < now;
          }
          break;
      }

      // Execute action if triggered
      if (shouldTrigger) {
        executeAutomationAction(task, automation);
      }
    });
  };

  // Execute automation action
  const executeAutomationAction = (task: Task, automation: Automation) => {
    switch (automation.action) {
      case 'move_to_status':
        if (automation.actionValue) {
          updateTask(task.id, { status: automation.actionValue });
        }
        break;
      case 'assign_to_user':
        if (automation.actionValue) {
          updateTask(task.id, { assigneeId: automation.actionValue });
        }
        break;
      case 'send_notification':
        // In a real app, this would send a notification
        console.log(`Notification for task ${task.id}: ${automation.actionValue}`);
        break;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        automations,
        currentProject,
        setCurrentProject,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        addAutomation,
        updateAutomation,
        deleteAutomation,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};