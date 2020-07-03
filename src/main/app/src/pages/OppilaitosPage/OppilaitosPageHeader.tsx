import React from 'react';
import { get } from 'lodash';

import FormHeader from '#/src/components/FormHeader';
import StatusTag from '#/src/components/StatusTag';
import FormEditInfo from '#/src/components/FormEditInfo';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import useLanguage from '#/src/hooks/useLanguage';

const OppilaitosPageHeader = ({ oppilaitos, organisaatio }) => {
  const language = useLanguage();

  const organisaatioNimi = getFirstLanguageValue(
    get(organisaatio, 'nimi'),
    language
  );

  return (
    <FormHeader
      status={
        get(oppilaitos, 'tila') ? (
          <StatusTag status={oppilaitos.tila} large />
        ) : null
      }
      editInfo={
        get(oppilaitos, 'modified') ? (
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

export default OppilaitosPageHeader;
