import { ethers } from 'ethers';
import types from './eip712-types';

export async function getDomain(contract: ethers.Contract) {
  const { fields, name, version, chainId, verifyingContract, salt, extensions } =
    await contract.eip712Domain();

  if (extensions.length > 0) {
    throw Error('Extensions not implemented');
  }

  const domain = {
    name,
    version,
    chainId,
    verifyingContract,
    salt,
  };

  types.EIP712Domain.forEach(({ name }, i) => {
    if (!(fields & (1 << i))) {
      delete domain[name as keyof typeof domain];
    }
  });

  return domain;
}

export const signData = (
  signer: ethers.JsonRpcSigner,
  contract: ethers.Contract,
  message: object,
) =>
  getDomain(contract)
    .then(domain =>
      signer.signTypedData(domain, { OrderActionPermit: types.OrderActionPermit }, message),
    )
    .then(ethers.Signature.from);
