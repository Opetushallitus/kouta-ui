import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import useSoraKuvaukset from '#/src/hooks/useSoraKuvaukset';

export const useSoraKuvausOptions = args => {
  const { soraKuvaukset, ...rest } = useSoraKuvaukset(args);
  const options = useEntityOptions(soraKuvaukset);

  return { options, ...rest };
};

export default useSoraKuvausOptions;
