import { createPinia } from 'pinia'

const store = createPinia()

export interface ResponseType<P> {
  code: number;
  msg: string;
  data: P;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export default store
