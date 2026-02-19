export interface ProcessedResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export interface MandrakeTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
  category: 'style' | 'cleanup' | 'background';
}