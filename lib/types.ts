export type ApiResponse<T> = {
  status?: string;
  code: number;
  message: string;
  data?: T[] | T;
  current_page?: number;
  last_page?: number;
  total?: 15;
  per_page?: 10;
};
