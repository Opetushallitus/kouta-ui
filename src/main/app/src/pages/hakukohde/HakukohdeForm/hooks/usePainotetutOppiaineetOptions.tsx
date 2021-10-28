import _ from 'lodash';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

export const getPainotetutOppiaineetOptions = (
  oppiaineetOptions,
  lukionKielivalikoima
) => {
  return oppiaineetOptions.filter(oppiaineOption => {
    const oppiaineParts = oppiaineOption?.value?.match(/^.+_([a-c]\d)(\w\w)/);
    const optionKielitaso = _.capitalize(oppiaineParts?.[1]);
    const optionKieli = oppiaineParts?.[2];

    if (optionKieli && optionKielitaso) {
      return Boolean(
        lukionKielivalikoima[optionKielitaso + 'Kielet']?.find(kieli =>
          kieli.startsWith(`kieli_${optionKieli}`)
        )
      );
    }
    return true;
  });
};

export const usePainotetutOppiaineetOptions = lukionKielivalikoima => {
  const { options } = useKoodistoOptions({
    koodisto: 'painotettavatoppiaineetlukiossa',
  });

  return getPainotetutOppiaineetOptions(options, lukionKielivalikoima);
};
