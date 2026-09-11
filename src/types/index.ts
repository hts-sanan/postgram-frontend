export * from './user';
export * from './post';
export * from './comment';

/** Discriminated union representing the lifecycle of an async fetch. */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
