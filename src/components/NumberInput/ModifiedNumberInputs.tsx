import React from 'react';

import { ROUND_TO_FIAT, MIN_FIAT_AMOUNT, ROUND_TO_TOKEN, MIN_TOKEN_AMOUNT } from 'config/number';
import NumberInput, { NumberInputProps } from './NumberInput';

export type ModifiedNumberInputProps = Omit<NumberInputProps, 'roundTo' | 'min' | 'step'>;

export const FiatInput = (props: ModifiedNumberInputProps) => (
  <NumberInput roundTo={ROUND_TO_FIAT} min={MIN_FIAT_AMOUNT} step={MIN_FIAT_AMOUNT} {...props} />
);

export const TokenInput = (props: ModifiedNumberInputProps) => (
  <NumberInput roundTo={ROUND_TO_TOKEN} min={MIN_TOKEN_AMOUNT} step={MIN_TOKEN_AMOUNT} {...props} />
);
