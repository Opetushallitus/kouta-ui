import React from 'react';

import _ from 'lodash';

import FormEditInfo from '#/src/components/FormEditInfo';
import FormHeader from '#/src/components/FormHeader';
import LargeStatusTag from '#/src/components/StatusTag/LargeStatusTag';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

const OppilaitoksenOsaPageHeader = ({ oppilaitos, organisaatio }) => {
  const language = useUserLanguage();

  const organisaatioNimi = getFirstLanguageValue(
    _.get(organisaatio, 'nimi'),
    language
  );

  return (
    <FormHeader
      status={
        _.get(oppilaitos, 'tila') ? (
          <LargeStatusTag status={oppilaitos.tila} />
        ) : null
      }
      editInfo={
        _.get(oppilaitos, 'modified') ? (
          <FormEditInfo
            date={oppilaitos.modified}
            editorOid={oppilaitos.muokkaaja}
          />
        ) : null
      }
    >
      {organisaatioNimi}
    </FormHeader>
  );
};

export default OppilaitoksenOsaPageHeader;
