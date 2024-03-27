const mapValues = <T, R>(obj: Record<string, T>, fn: (value: T) => R) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));

const formatType = (schema: Record<string, string>) =>
  Object.entries(schema).map(([name, type]) => ({ name, type }));

const types = mapValues(
  {
    EIP712Domain: {
      name: 'string',
      version: 'string',
      chainId: 'uint256',
      verifyingContract: 'address',
      salt: 'bytes32',
    },
    OrderActionPermit: {
      owner: 'address',
      tokenSymbol: 'string',
      currencySymbol: 'string',
      orderId: 'uint256',
      accept: 'bool',
      nonce: 'uint256',
    },
    OrderCreatePermit: {
      owner: 'address',
      tokenSymbol: 'string',
      currencySymbol: 'string',
      listingId: 'uint256',
      tokenAmount: 'uint256',
      nonce: 'uint256',
    },
  },
  formatType,
);

export default types;
