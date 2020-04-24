import React from 'react';
import stripTags from 'striptags';
import { get } from 'lodash';

import { getEPerusteById } from '../../../apiUtils';
import Typography from '../../Typography';
import { getLanguageValue } from '../../../utils';
import { useTranslation } from 'react-i18next';
import useApiAsync from '../../useApiAsync';
import FormLabel from '../../FormLabel';
import useFieldValue from '../../useFieldValue';

const getKuvaus = (koulutus, language) => {
  const kuvaus = koulutus ? getLanguageValue(koulutus.kuvaus, language) : null;

  return kuvaus ? stripTags(kuvaus) : null;
};

const TekstiKuvausSection = ({ language }) => {
  const ePerusteField = useFieldValue('information.eperuste');
  const ePerusteId = get(ePerusteField, 'value');
  const { t } = useTranslation();

  const { data } = useApiAsync({
    promiseFn: getEPerusteById,
    ePerusteId,
    watch: ePerusteId,
  });

  const kuvaus = getKuvaus(data, language);

  return (
    <>
      <FormLabel>{t('yleiset.kuvaus')}</FormLabel>
      {kuvaus ? (
        <>
          <Typography as="div">{kuvaus}</Typography>
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
