export type User = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  members: ProjectMember[];
};

export type ProjectMember = {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  user?: User;
};

export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | string;

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: Date;
  assigneeId?: string;
  assignee?: User;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AutomationTrigger = 
  | 'task_moved_to_status'
  | 'task_assigned_to_user'
  | 'due_date_passed';

export type AutomationAction = 
  | 'move_to_status'
  | 'assign_to_user'
  | 'send_notification';

export type Automation = {
  id: string;
  projectId: string;
  name: string;
  trigger: AutomationTrigger;
  triggerValue?: string;
  action: AutomationAction;
  actionValue?: string;
  createdBy: string;
  createdAt: Date;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  projectId?: string;
  taskId?: string;
  createdAt: Date;
};