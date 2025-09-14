export interface Professor {
  name: string;
  title: string;
  house: string;
  avatar: string;
  color: string;
  description: string;
  placeholder: string;
}

export interface HogwartsChatProps {
  className?: string;
}

export type ProfessorKey = 'dumbledore' | 'mcgonagall' | 'snape' | 'slughorn' | 'flitwick'| 'archivist';

export interface ToolCall {
  id: string;
  toolName: string;
  args: any;
  status: 'pending' | 'completed' | 'error';
  result?: any;
  error?: string;
  purpose?: string;
  startTime?: number;
  duration?: number;
}
