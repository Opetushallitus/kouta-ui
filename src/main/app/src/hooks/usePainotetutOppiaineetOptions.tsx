import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getPainotetutOppiaineetOptions } from '#/src/utils/hakukohde/getPainotetutOppiaineetOptions';

const usePainotetutOppiaineetOptions = lukionKielivalikoima => {
  const { options } = useKoodistoOptions({
    koodisto: 'oppiaineetyleissivistava',
  });
  const kieliOptions = useKoodistoOptions({ koodisto: 'kieli' }).options;

  return getPainotetutOppiaineetOptions(
    options,
    kieliOptions,
    lukionKielivalikoima
  );
};

export default usePainotetutOppiaineetOptions;
