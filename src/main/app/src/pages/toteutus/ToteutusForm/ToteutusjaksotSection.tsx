import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import FieldArrayList from '#/src/components/FieldArrayList';
import FormButton from '#/src/components/FormButton';
import { FormFieldInput, FormFieldEditor } from '#/src/components/formFields';
import { SisaltoFields } from '#/src/components/SisaltoFields';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

const ToteutusjaksotField = ({ fields, language, t }) => {
  const onAddField = useCallback(() => {
    fields.push({});
  }, [fields]);

  return (
    <>
      <FieldArrayList fields={fields}>
        {({ field }) => (
          <>
            <Box mb={2} {...getTestIdProps('nimi')}>
              <Field
                name={`${field}.nimi.${language}`}
                label={t('toteutuslomake.toteutusjaksonNimi')}
                component={FormFieldInput}
              />
            </Box>

            <Box display="flex" mb={2} mx={-1}>
              <Box flexGrow={1} px={1}>
                <Field
                  name={`${field}.koodi`}
                  label={t('toteutuslomake.toteutusjaksonKoodi')}
                  component={FormFieldInput}
                />
              </Box>

              <Box flexGrow={1} px={1}>
                <Field
                  name={`${field}.laajuus.${language}`}
                  label={t('toteutuslomake.toteutusjaksonLaajuus')}
                  component={FormFieldInput}
                />
              </Box>
            </Box>

            <Box mb={2} {...getTestIdProps('ilmoittautumislinkki')}>
              <Field
                name={`${field}.ilmoittautumislinkki.${language}`}
                label={t('toteutuslomake.ilmoittautumislinkki')}
                component={FormFieldInput}
              />
            </Box>

            <Box mb={2} {...getTestIdProps('kuvaus')}>
              <Field
                name={`${field}.kuvaus.${language}`}
                label={t('toteutuslomake.toteutusjaksonKuvaus')}
                component={FormFieldEditor}
              />
            </Box>

            <SisaltoFields name={`${field}.sisalto`} language={language} />
          </>
        )}
      </FieldArrayList>
      <Box
        display="flex"
        justifyContent="center"
        mt={fields.length > 0 ? 4 : 0}
      >
        <FormButton
          variant="outlined"
          color="primary"
          type="button"
          onClick={onAddField}
          {...getTestIdProps('lisaaToteutusjaksoButton')}
        >
          {t('toteutuslomake.lisaaToteutusjakso')}
        </FormButton>
      </Box>
    </>
  );
};

export const ToteutusjaksotSection = ({ name, language = 'fi' }) => {
  const { t } = useTranslation();

  return (
    <FieldArray
      name={name}
      component={ToteutusjaksotField}
      t={t}
      language={language}
    />
  );
};
