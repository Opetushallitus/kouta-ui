import React from 'react';
import stripTags from 'striptags';
import { get } from 'lodash';

import { getPerusteById } from '../../../apiUtils';
import Typography from '../../Typography';
import { getLanguageValue } from '../../../utils';
import useTranslation from '../../useTranslation';
import useApiAsync from '../../useApiAsync';
import FormLabel from '../../FormLabel';
import useFieldValue from '../../useFieldValue';

const getKuvaus = (koulutus, language) => {
  const kuvaus = koulutus ? getLanguageValue(koulutus.kuvaus, language) : null;

  return kuvaus ? stripTags(kuvaus) : null;
};

const TekstiKuvausSection = ({ language }) => {
  const perusteField = useFieldValue('information.peruste');
  const perusteId = get(perusteField, 'value');
  const { t } = useTranslation();

  const { data } = useApiAsync({
    promiseFn: getPerusteById,
    perusteId,
    watch: perusteId,
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
