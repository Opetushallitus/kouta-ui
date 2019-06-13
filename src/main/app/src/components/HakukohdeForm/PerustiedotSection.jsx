import React from 'react';
import { Field } from 'redux-form';

import Spacing from '../Spacing';
import isAmmatillinenKoulutustyyppi from '../../utils/isAmmatillinenKoulutustyyppi';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import { FormFieldCheckbox, FormFieldInput } from '../FormFields';

const PerustiedotSection = ({ language, koulutustyyppi }) => {
  const isAmmatillinen = isAmmatillinenKoulutustyyppi(koulutustyyppi);
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
        <Field
          name={`nimi.${language}`}
          component={FormFieldInput}
          label={t('yleiset.nimi')}
        />
      </Spacing>
      {isAmmatillinen ? (
        <Field
          name="voiSuorittaaKaksoistutkinnon"
          component={FormFieldCheckbox}
        >
          {t('hakukohdelomake.voiSuorittaaKaksoistutkinnon')}
        </Field>
      ) : null}
    </>
  );
};

export default PerustiedotSection;
