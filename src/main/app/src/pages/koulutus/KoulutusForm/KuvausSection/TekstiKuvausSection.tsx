import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import { Typography } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import useApiAsync from '#/src/hooks/useApiAsync';
import { getEPerusteById } from '#/src/utils/ePeruste/getEPerusteById';
import getEPerusteKuvausHTML from '#/src/utils/ePeruste/getEPerusteKuvaus';
import { getLanguageValue } from '#/src/utils/languageUtils';

const TekstiKuvausSection = ({ language }) => {
  const ePerusteField = useFieldValue('information.eperuste');
  const ePerusteId = ePerusteField?.value;
  const { t, i18n } = useTranslation();

  const { data = {} } = useApiAsync({
    promiseFn: getEPerusteById,
    ePerusteId,
    watch: ePerusteId,
  });

  const { nimi, diaarinumero } = data;

  const kuvaus = useMemo(() => getEPerusteKuvausHTML(data, i18n), [data, i18n]);

  const translatedKuvaus = getLanguageValue(kuvaus, language);
  const translatedNimi = getLanguageValue(nimi, language);

  return (
    <>
      {kuvaus ? (
        <>
          <Typography variant="h5" marginBottom="20px">
            {translatedNimi}{' '}
            <Typography as="span" variant="body">
              ({diaarinumero})
            </Typography>
          </Typography>
          <StyledSectionHTML html={translatedKuvaus} />
          <Typography variant="secondary" as="div" marginTop={1}>
            ({t('yleiset.lahde')}: {t('yleiset.ePerusteet')})
          </Typography>
        </>
      ) : (
        <Typography variant="secondary" as="div">
          {t('koulutuslomake.kuvausEiOleSaatavilla')}
        </Typography>
      )}
    </>
  );
};

export default TekstiKuvausSection;
