import React from 'react';

import _ from 'lodash';

import FormEditInfo from '#/src/components/FormEditInfo';
import FormHeader from '#/src/components/FormHeader';
import StatusTag from '#/src/components/StatusTag';
import useLanguage from '#/src/hooks/useLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

const OppilaitosPageHeader = ({ oppilaitos, organisaatio }) => {
  const language = useLanguage();

  const organisaatioNimi = getFirstLanguageValue(
    _.get(organisaatio, 'nimi'),
    language
  );

  return (
    <FormHeader
      status={
        _.get(oppilaitos, 'tila') ? (
          <StatusTag status={oppilaitos.tila} large />
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

export default OppilaitosPageHeader;
