const pow = (n: bigint, exp: bigint) => {
  let result = BigInt(1);
  for (let i = BigInt(0); i < exp; i++) {
    result *= n;
  }
  return result;
};

export const multiplyByTenPow = (n: bigint, exp: bigint) => {
  const absExp = exp < 0 ? -exp : exp;
  if (exp < 0) {
    return n / pow(BigInt(10), absExp);
  }

  return n * pow(BigInt(10), absExp);
};
