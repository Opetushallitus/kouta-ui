import React from 'react';
import stripTags from 'striptags';

import ApiAsync from '../../ApiAsync';
import { getKoulutusByKoodi } from '../../../apiUtils';
import Typography from '../../Typography';
import { getLanguageValue } from '../../../utils';

const getKuvaus = (koulutus, language) => {
  const kuvaus = koulutus ? getLanguageValue(koulutus.kuvaus, language) : null;

  return kuvaus ? stripTags(kuvaus) : null;
};

const getKoulutus = args => getKoulutusByKoodi(args);

const DescriptionAsync = ({ koodiUri, language = 'fi' }) => (
  <ApiAsync promiseFn={getKoulutus} koodiUri={koodiUri} watch={koodiUri}>
    {({ data }) => <Typography>{getKuvaus(data, language)}</Typography>}
  </ApiAsync>
);

const AmmatillinenKuvausSection = ({ language, koulutusValue }) => {
  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Koulutuksen kuvaus
      </Typography>
      {koulutusValue && koulutusValue.value ? (
        <DescriptionAsync koodiUri={koulutusValue.value} language={language} />
      ) : null}
    </>
  );
};

export default AmmatillinenKuvausSection;
