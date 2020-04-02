import React from 'react';
import { get } from 'lodash';

import { getEPerusteById } from '../../../apiUtils';
import Typography from '../../Typography';
import { getLanguageValue } from '../../../utils';
import { useTranslation } from 'react-i18next';
import useApiAsync from '../../useApiAsync';
import useFieldValue from '../../useFieldValue';
import { sanitizeHTML } from '#/src/utils';

const getKuvaus = (koulutus, language) => {
  const kuvaus = koulutus ? getLanguageValue(koulutus.kuvaus, language) : null;

  return kuvaus ? sanitizeHTML(kuvaus) : null;
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
      {kuvaus ? (
        <>
          <Typography
            as="div"
            dangerouslySetInnerHTML={{
              __html: kuvaus,
            }}
          ></Typography>
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
