import React from 'react';
import { Field } from 'redux-form';

import Spacing from '../Spacing';
import isAmmatillinenKoulutustyyppi from '../../utils/isAmmatillinenKoulutustyyppi';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import { FormFieldCheckbox, FormFieldInput } from '../FormFields';
import Divider from '../Divider';
import HakuajatSection from './HakuajatSection';
import AlkamiskausiSection from './AlkamiskausiSection';
import LomakeSection from './LomakeSection';

const PerustiedotSection = ({
  language,
  koulutustyyppi,
  name,
  toteutus,
  haku,
}) => {
  const isAmmatillinen = isAmmatillinenKoulutustyyppi(koulutustyyppi);
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('hakukohteenNimi')}>
        <Field
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('yleiset.nimi')}
        />
      </Spacing>
      {isAmmatillinen ? (
        <div {...getTestIdProps('voiSuorittaaKaksoistutkinnon')}>
          <Field
            name={`${name}.voiSuorittaaKaksoistutkinnon`}
            component={FormFieldCheckbox}
          >
            {t('hakukohdelomake.voiSuorittaaKaksoistutkinnon')}
          </Field>
        </div>
      ) : null}

      <Divider marginTop={4} marginBottom={4} />

      <div {...getTestIdProps('hakuajatSection')}>
        <HakuajatSection name="hakuajat" haku={haku} />
      </div>

      <Divider marginTop={4} marginBottom={4} />

      <div {...getTestIdProps('alkamiskausiSection')}>
        <AlkamiskausiSection name="alkamiskausi" toteutus={toteutus} />
      </div>

      <Divider marginTop={4} marginBottom={4} />

      <div {...getTestIdProps('lomakeSection')}>
        <LomakeSection haku={haku} />
      </div>
    </>
  );
};

export default PerustiedotSection;
