import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSwitch } from '#/src/components/formFields';
import { useKoulutusByKoodi } from '#/src/utils/koulutus/getKoulutusByKoodi';

const useIsAmmatillinenPerustutkinto = koulutus => {
  // Ammatillisella koulutuksella voi olla vain yksi koulutusKoodiUri
  const koodiUri = koulutus?.koulutuksetKoodiUri?.[0];

  const { data: koulutusByKoodiUri } = useKoulutusByKoodi({
    koodiUri,
  });

  return koulutusByKoodiUri?.koulutustyyppiKoodit?.includes('koulutustyyppi_1');
};

export const VaativaErityinenTukiField = ({ name, koulutus }) => {
  const { t } = useTranslation();

  return useIsAmmatillinenPerustutkinto(koulutus) ? (
    <Field
      name={`${name}.ammatillinenPerustutkintoErityisopetuksena`}
      component={FormFieldSwitch}
    >
      {t('toteutuslomake.ammatillinenPerustutkintoErityisopetuksena')}
    </Field>
  ) : null;
};
