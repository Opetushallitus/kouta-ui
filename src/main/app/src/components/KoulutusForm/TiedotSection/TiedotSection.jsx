import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, change, isDirty as formIsDirty } from 'redux-form';
import { get, each, find, toLower } from 'lodash';

import FormConfigField from '../../FormConfigField';
import KoulutuksenTiedotSection from './KoulutuksenTiedotSection';
import KoulutusField from '../KoulutusField';
import Box from '../../Box';
import OpintojenlaajuusField from './OpintojenlaajuusField';
import TutkintonimikeField from './TutkintonimikeField';
import KoulutusalatField from './KoulutusalatField';
import useTranslation from '../../useTranslation';
import { FormFieldInput } from '../../formFields';
import { getTestIdProps } from '../../../utils';
import FormNameContext from '../../FormNameContext';
import useKoodi from '../../useKoodi';

const useFormName = () => useContext(FormNameContext);

const useLocalizedKoulutus = ({ fieldName, language, koulutusValue }) => {
  const dispatch = useDispatch();
  const formName = useFormName();
  const [changedKoulutus, setChangedKoulutus] = useState(null);
  const koulutusKoodi = useKoodi(get(koulutusValue, 'value'));
  const koodi = get(koulutusKoodi, 'koodi');
  const isDirty = useSelector(formIsDirty(formName));

  // When language changes, change the selected 'koulutus' label accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (koodi && isDirty) {
      const { metadata } = koodi;
      const localizedNimi = get(
        find(metadata, ({ kieli }) => toLower(kieli) === language),
        'nimi',
      );
      if (localizedNimi) {
        dispatch(
          change(formName, `${fieldName}.koulutus.label`, localizedNimi),
        );
      }
    }
  }, [language, koodi, dispatch, formName, fieldName, isDirty]);

  useEffect(() => {
    if (koulutusValue && isDirty) {
      setChangedKoulutus(koulutusValue.value);
    }
  }, [formName, isDirty, koulutusValue, language]);

  // When koulutus field has changed to a defined value and got its 'koodi'
  // change the language versioned 'nimi' fields accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (changedKoulutus && koodi) {
      each(get(koodi, 'metadata'), ({ kieli, nimi }) => {
        const lang = toLower(kieli);
        dispatch(change(formName, `${fieldName}.nimi.${lang}`, nimi));
      });
      setChangedKoulutus(null);
    }
  }, [changedKoulutus, dispatch, fieldName, formName, koodi, language]);
};

const TiedotSection = ({ language, koulutustyyppi, koulutuskoodi, name }) => {
  const { t } = useTranslation();

  useLocalizedKoulutus({
    fieldName: name,
    koulutusValue: koulutuskoodi,
    language,
  });

  return (
    <Box mb={-2}>
      <FormConfigField name="koulutuskoodiTiedoilla">
        <Box mb={2}>
          <KoulutuksenTiedotSection
            language={language}
            koulutuskoodi={koulutuskoodi}
            koulutustyyppi={koulutustyyppi}
            name={name}
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="osaamisala">
        <Box mb={2}>
          <KoulutuksenTiedotSection
            language={language}
            koulutuskoodi={koulutuskoodi}
            koulutustyyppi={koulutustyyppi}
            selectLabel={t('koulutuslomake.valitseOsaamisala')}
            visibleInfoFields={['koulutus', 'koulutusala']}
            name={name}
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="koulutuskoodi">
        <Box mb={2} {...getTestIdProps('koulutuskoodiSelect')}>
          <KoulutusField
            name={`${name}.koulutus`}
            koulutustyyppi={koulutustyyppi}
            language={language}
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="opintojenlaajuus">
        <Box mb={2}>
          <OpintojenlaajuusField name={name} />
        </Box>
      </FormConfigField>

      <FormConfigField name="tutkintonimike">
        <Box mb={2}>
          <TutkintonimikeField name={name} />
        </Box>
      </FormConfigField>

      <FormConfigField name="koulutusalat">
        <Box mb={2}>
          <KoulutusalatField name={name} />
        </Box>
      </FormConfigField>

      <FormConfigField name="nimi">
        <Box mb={2} {...getTestIdProps('nimiInput')}>
          <Field
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
          />
        </Box>
      </FormConfigField>
    </Box>
  );
};

export default TiedotSection;
