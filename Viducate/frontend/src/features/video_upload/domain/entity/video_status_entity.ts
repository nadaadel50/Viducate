export interface VideoStatusEntity {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  title: string;
}