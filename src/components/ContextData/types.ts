import { Dispatch, SetStateAction } from 'react';

export type ContextData<T, ValueKey extends string> =
  | {
      [key in ValueKey]: T;
    }
  | null;

export type StateContextData<T, ValueKey extends string, SetValueKey extends string> =
  | ({
      [key in ValueKey]: T;
    } & {
      [key in SetValueKey]: Dispatch<SetStateAction<T>>;
    })
  | null;

export type StateContextDataOrUndefined<
  T,
  ValueKey extends string,
  SetValueKey extends string,
> = StateContextData<T | undefined, ValueKey, SetValueKey>;
