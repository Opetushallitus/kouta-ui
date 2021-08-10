import React from 'react';

import { useTranslation } from 'react-i18next';

import FormHeader from '#/src/components/FormHeader';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import LargeStatusTag from './StatusTag/LargeStatusTag';

export default function EntityFormHeader({ entity, ...props }) {
  const { i18n } = useTranslation();
  const { tila, nimi } = entity || {};
  const translatedNimi = getFirstLanguageValue(nimi, [i18n.language]);
  return (
    <FormHeader
      status={tila ? <LargeStatusTag status={tila} /> : null}
      {...props}
    >
      {translatedNimi}
    </FormHeader>
  );
}
