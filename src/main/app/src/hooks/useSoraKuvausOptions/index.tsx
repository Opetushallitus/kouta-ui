import useSoraKuvaukset from '#/src/hooks/useSoraKuvaukset';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';

export const useSoraKuvausOptions = args => {
  const { soraKuvaukset, ...rest } = useSoraKuvaukset(args);
  const options = useEntityOptions(soraKuvaukset);

  return { options, ...rest };
};

export default useSoraKuvausOptions;
