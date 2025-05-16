import { Project, Task, Automation, User, ProjectMember } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'user-3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    photoURL: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
];

export const MOCK_PROJECT_MEMBERS: ProjectMember[] = [
  {
    userId: 'user-1',
    role: 'owner',
    user: MOCK_USERS[0],
  },
  {
    userId: 'user-2',
    role: 'admin',
    user: MOCK_USERS[1],
  },
  {
    userId: 'user-3',
    role: 'member',
    user: MOCK_USERS[2],
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'Website Redesign',
    description: 'Redesign the company website with a modern look and improved UX',
    createdBy: 'user-1',
    createdAt: new Date('2023-05-15'),
    members: [MOCK_PROJECT_MEMBERS[0], MOCK_PROJECT_MEMBERS[1]],
  },
  {
    id: 'project-2',
    title: 'Mobile App Development',
    description: 'Create a cross-platform mobile app for our product',
    createdBy: 'user-1',
    createdAt: new Date('2023-06-20'),
    members: MOCK_PROJECT_MEMBERS,
  },
  {
    id: 'project-3',
    title: 'Content Marketing Campaign',
    description: 'Plan and execute a content marketing campaign for Q3',
    createdBy: 'user-2',
    createdAt: new Date('2023-07-10'),
    members: [MOCK_PROJECT_MEMBERS[1], MOCK_PROJECT_MEMBERS[2]],
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Design new homepage',
    description: 'Create a modern homepage design with improved UX',
    status: 'To Do',
    dueDate: new Date('2023-06-15'),
    assigneeId: 'user-2',
    assignee: MOCK_USERS[1],
    createdBy: 'user-1',
    createdAt: new Date('2023-05-16'),
    updatedAt: new Date('2023-05-16'),
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: 'Implement new design',
    description: 'Implement the approved homepage design with HTML/CSS',
    status: 'To Do',
    dueDate: new Date('2023-06-30'),
    assigneeId: 'user-3',
    assignee: MOCK_USERS[2],
    createdBy: 'user-1',
    createdAt: new Date('2023-05-18'),
    updatedAt: new Date('2023-05-18'),
  },
  {
    id: 'task-3',
    projectId: 'project-2',
    title: 'Create wireframes',
    description: 'Design wireframes for the mobile app',
    status: 'In Progress',
    dueDate: new Date('2023-07-05'),
    assigneeId: 'user-2',
    assignee: MOCK_USERS[1],
    createdBy: 'user-1',
    createdAt: new Date('2023-06-21'),
    updatedAt: new Date('2023-06-25'),
  },
  {
    id: 'task-4',
    projectId: 'project-2',
    title: 'Setup development environment',
    description: 'Configure development environment for React Native',
    status: 'Done',
    assigneeId: 'user-3',
    assignee: MOCK_USERS[2],
    createdBy: 'user-1',
    createdAt: new Date('2023-06-22'),
    updatedAt: new Date('2023-06-23'),
  },
  {
    id: 'task-5',
    projectId: 'project-3',
    title: 'Content calendar',
    description: 'Create content calendar for Q3',
    status: 'In Progress',
    dueDate: new Date('2023-07-20'),
    assigneeId: 'user-1',
    assignee: MOCK_USERS[0],
    createdBy: 'user-2',
    createdAt: new Date('2023-07-12'),
    updatedAt: new Date('2023-07-15'),
  },
];

export const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: 'automation-1',
    projectId: 'project-1',
    name: 'Mark as In Progress when assigned',
    trigger: 'task_assigned_to_user',
    action: 'move_to_status',
    actionValue: 'In Progress',
    createdBy: 'user-1',
    createdAt: new Date('2023-05-16'),
  },
  {
    id: 'automation-2',
    projectId: 'project-2',
    name: 'Notify on overdue tasks',
    trigger: 'due_date_passed',
    action: 'send_notification',
    actionValue: 'Task is overdue!',
    createdBy: 'user-1',
    createdAt: new Date('2023-06-22'),
  },
  {
    id: 'automation-3',
    projectId: 'project-3',
    name: 'Assign to Jane when Done',
    trigger: 'task_moved_to_status',
    triggerValue: 'Done',
    action: 'assign_to_user',
    actionValue: 'user-2',
    createdBy: 'user-2',
    createdAt: new Date('2023-07-12'),
  },
];