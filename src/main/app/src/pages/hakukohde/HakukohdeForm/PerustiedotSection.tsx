import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldCheckbox, FormFieldInput } from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { Divider } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';
import isAmmatillinenKoulutustyyppi from '#/src/utils/koulutus/isAmmatillinenKoulutustyyppi';

import { AlkamiskausiSection } from './AlkamiskausiSection';
import { HakuajatSection } from './HakuajatSection';
import LomakeSection from './LomakeSection';

export const PerustiedotSection = ({
  language,
  koulutustyyppi,
  name,
  toteutus,
  haku,
}) => {
  const isAmmatillinen = isAmmatillinenKoulutustyyppi(koulutustyyppi);
  const nimiReadonly = koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS;
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('hakukohteenNimi')}>
        <Field
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('yleiset.nimi')}
          required
          disabled={nimiReadonly}
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
        <AlkamiskausiSection
          name="ajankohta"
          language={language}
          toteutus={toteutus}
          haku={haku}
        />
      </div>

      <Divider marginTop={4} marginBottom={4} />

      <div {...getTestIdProps('lomakeSection')}>
        <LomakeSection haku={haku} language={language} />
      </div>
    </>
  );
};
