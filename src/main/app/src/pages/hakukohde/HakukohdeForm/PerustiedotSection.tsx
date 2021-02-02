import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import Spacing from '#/src/components/Spacing';
import isAmmatillinenKoulutustyyppi from '#/src/utils/koulutus/isAmmatillinenKoulutustyyppi';
import { getTestIdProps } from '#/src/utils';
import { FormFieldCheckbox, FormFieldInput } from '#/src/components/formFields';
import { Divider } from '#/src/components/virkailija';
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

export default PerustiedotSection;
