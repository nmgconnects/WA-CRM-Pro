export type ContactStatus = 'lead' | 'contact' | 'customer' | 'archived';

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  status: ContactStatus;
  workspace_id: string;
  created_at: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  contact_name: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  icon: string; // Icon name string
  color?: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface AutomationRule {
  id: string;
  trigger: string;
  action: string;
  hits: number;
  status: 'Active' | 'Paused';
}
