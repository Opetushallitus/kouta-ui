import React from 'react';
import { get } from 'lodash';

import FormHeader from '../FormHeader';
import StatusTag from '../StatusTag';
import FormEditInfo from '../FormEditInfo';
import { getFirstLanguageValue } from '../../utils';
import useLanguage from '../useLanguage';

const OppilaitosPageHeader = ({ oppilaitos, organisaatio }) => {
  const language = useLanguage();

  const organisaatioNimi = getFirstLanguageValue(
    get(organisaatio, 'nimi'),
    language,
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
