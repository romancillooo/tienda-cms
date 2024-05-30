export interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  title?: string;
}
