import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldKoulutustyyppiSelect } from '#/src/components/formFields';

const KoulutustyyppiSection = ({ organisaatioOid, johtaaTutkintoon, name }) => {
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      component={FormFieldKoulutustyyppiSelect}
      label={t('yleiset.valitseKoulutustyyppi')}
      johtaaTutkintoon={johtaaTutkintoon}
    />
  );
};

export default KoulutustyyppiSection;
