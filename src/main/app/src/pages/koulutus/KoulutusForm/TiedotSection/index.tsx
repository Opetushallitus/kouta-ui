import React, { useEffect, useState } from 'react';
import { get, each, find, toLower } from 'lodash';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { useBoundFormActions, useIsDirty } from '#/src/hooks/form';
import FormConfigFragment from '#/src/components/FormConfigFragment';
import { FormFieldInput } from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';
import { Box } from '#/src/components/virkailija';
import useKoodi from '#/src/hooks/useKoodi';
import KoulutusField from '../KoulutusField';
import KoulutusalatField from './KoulutusalatField';
import KoulutuksenTiedotSection from './KoulutuksenTiedotSection';
import OpintojenlaajuusField from './OpintojenlaajuusField';
import TutkintonimikeField from './TutkintonimikeField';

const useLocalizedKoulutus = ({ fieldName, language, koulutusValue }) => {
  const [changedKoulutus, setChangedKoulutus] = useState(null);
  const koulutusKoodi = useKoodi(get(koulutusValue, 'value'));
  const koodi = get(koulutusKoodi, 'koodi');
  const isDirty = useIsDirty();
  const { change } = useBoundFormActions();

  // When language changes, change the selected 'koulutus' label accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (koodi && isDirty) {
      const { metadata } = koodi;
      const localizedNimi = get(
        find(metadata, ({ kieli }) => toLower(kieli) === language),
        'nimi'
      );
      if (localizedNimi) {
        change(`${fieldName}.koulutus.label`, localizedNimi);
      }
    }
  }, [language, koodi, fieldName, isDirty, change]);

  useEffect(() => {
    if (koulutusValue && isDirty) {
      setChangedKoulutus(koulutusValue.value);
    }
  }, [isDirty, koulutusValue, language]);

  // When koulutus field has changed to a defined value and got its 'koodi'
  // change the language versioned 'nimi' fields accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (changedKoulutus && koodi) {
      each(get(koodi, 'metadata'), ({ kieli, nimi }) => {
        const lang = toLower(kieli);
        change(`${fieldName}.nimi.${lang}`, nimi);
      });
      setChangedKoulutus(null);
    }
  }, [change, changedKoulutus, fieldName, koodi, language]);
};

const TiedotSection = ({
  disabled,
  language,
  koulutustyyppi,
  koulutuskoodi,
  name,
}) => {
  const { t } = useTranslation();

  useLocalizedKoulutus({
    fieldName: name,
    koulutusValue: koulutuskoodi,
    language,
  });

  return (
    <Box mb={-2}>
      <FormConfigFragment name="koulutuskoodiTiedoilla">
        <Box mb={2}>
          <KoulutuksenTiedotSection
            disabled={disabled}
            language={language}
            koulutuskoodi={koulutuskoodi}
            koulutustyyppi={koulutustyyppi}
            name={name}
          />
        </Box>
      </FormConfigFragment>

      <FormConfigFragment name="osaamisala">
        <Box mb={2}>
          <KoulutuksenTiedotSection
            disabled={disabled}
            language={language}
            koulutuskoodi={koulutuskoodi}
            koulutustyyppi={koulutustyyppi}
            selectLabel={t('koulutuslomake.valitseOsaamisala')}
            visibleInfoFields={['koulutus', 'koulutusala']}
            name={name}
          />
        </Box>
      </FormConfigFragment>

      <FormConfigFragment name="koulutuskoodi">
        <Box mb={2} {...getTestIdProps('koulutuskoodiSelect')}>
          <KoulutusField
            disabled={disabled}
            name={`${name}.koulutus`}
            koulutustyyppi={koulutustyyppi}
            language={language}
          />
        </Box>
      </FormConfigFragment>

      <Box mb={2}>
        <OpintojenlaajuusField disabled={disabled} name={name} />
      </Box>

      <Box mb={2}>
        <TutkintonimikeField disabled={disabled} name={name} />
      </Box>

      <Box mb={2}>
        <KoulutusalatField disabled={disabled} name={name} />
      </Box>

      <Box mb={2} {...getTestIdProps('nimiInput')}>
        <Field
          disabled={disabled}
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
        />
      </Box>
    </Box>
  );
};

export default TiedotSection;
