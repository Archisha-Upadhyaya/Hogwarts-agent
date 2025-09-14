export interface Professor {
  name: string;
  title: string;
  house: string;
  avatar: string;
  color: string;
  description: string;
}

export interface HogwartsChatProps {
  className?: string;
}

export type ProfessorKey = 'dumbledore' | 'mcgonagall' | 'snape' | 'hagrid' | 'luna'| 'archivist';

export interface ToolCall {
  id: string;
  toolName: string;
  args: any;
  status: 'pending' | 'completed' | 'error';
  result?: any;
  error?: string;
}
