import React from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { getLanguageValue } from '#/src/utils/languageUtils';
import { getEPerusteById } from '#/src/utils/ePeruste/getEPerusteById';
import Typography from '#/src/components/Typography';
import useApiAsync from '#/src/hooks/useApiAsync';
import { useFieldValue } from '#/src/hooks/form';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';

const TekstiKuvausSection = ({ language }) => {
  const ePerusteField = useFieldValue('information.eperuste');
  const ePerusteId = _.get(ePerusteField, 'value');
  const { t } = useTranslation();

  const { data = {} } = useApiAsync({
    promiseFn: getEPerusteById,
    ePerusteId,
    watch: ePerusteId,
  });

  const { kuvaus, nimi, diaarinumero } = data;

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
