import React from 'react';

import { useTranslation } from 'react-i18next';

import FormEditInfo from '#/src/components/FormEditInfo';
import FormHeader from '#/src/components/FormHeader';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import LargeStatusTag from './StatusTag/LargeStatusTag';

export default function EntityFormHeader({ entityType, entity, ...props }) {
  const { i18n } = useTranslation();
  const { modified, muokkaaja, tila, nimi } = entity || {};
  const translatedNimi = getFirstLanguageValue(nimi, [i18n.language]);
  return (
    <FormHeader
      status={tila ? <LargeStatusTag status={tila} /> : null}
      editInfo={
        modified ? <FormEditInfo date={modified} editorOid={muokkaaja} /> : null
      }
      {...props}
    >
      {translatedNimi}
    </FormHeader>
  );
}
