import chains from 'web3/chains.json';

export const useNetwork = () => 'telostest' as keyof typeof chains;

export const useChain = () => {
  const network = useNetwork();
  return chains[network];
};
