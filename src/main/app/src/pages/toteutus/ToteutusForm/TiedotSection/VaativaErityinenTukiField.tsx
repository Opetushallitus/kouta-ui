import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSwitch } from '#/src/components/formFields';
import isAmmatillinenPerustutkinto from '#/src/utils/koulutus/isAmmatillinenPerustutkinto';

const VaativaErityinenTukiField = ({ name, koulutus }) => {
  const { t } = useTranslation();

  return isAmmatillinenPerustutkinto(koulutus) ? (
    <Field
      name={`${name}.ammatillinenPerustutkintoErityisopetuksena`}
      component={FormFieldSwitch}
    >
      {t('toteutuslomake.ammatillinenPerustutkintoErityisopetuksena')}
    </Field>
  ) : null;
};
export default VaativaErityinenTukiField;