import React from 'react';
import stripTags from 'striptags';
import { get } from 'lodash';

import { getKoulutusByKoodi } from '../../../apiUtils';
import Typography from '../../Typography';
import { getLanguageValue } from '../../../utils';
import useTranslation from '../../useTranslation';
import useApiAsync from '../../useApiAsync';
import FormLabel from '../../FormLabel';

const getKuvaus = (koulutus, language) => {
  const kuvaus = koulutus ? getLanguageValue(koulutus.kuvaus, language) : null;

  return kuvaus ? stripTags(kuvaus) : null;
};

const getKoulutus = ({ koodiUri, ...args }) =>
  koodiUri ? getKoulutusByKoodi({ koodiUri, ...args }) : Promise.resolve(null);

const TekstiKuvausSection = ({ koulutuskoodi, language }) => {
  const { t } = useTranslation();
  const koodiUri = get(koulutuskoodi, 'value');

  const { data } = useApiAsync({
    promiseFn: getKoulutus,
    koodiUri,
    watch: koodiUri,
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
