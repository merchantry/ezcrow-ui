export type ContextData<T, ValueKey extends string> =
  | {
      [key in ValueKey]: T;
    }
  | null;
