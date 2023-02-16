import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import Button from '#/src/components/Button';
import FieldArrayList from '#/src/components/FieldArrayList';
import { FormFieldInput, FormFieldUrlInput } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';

const YhteyshenkilotField = ({ fields, language, t }) => {
  const onAddField = useCallback(() => {
    fields.push({});
  }, [fields]);

  return (
    <>
      <FieldArrayList fields={fields}>
        {({ field }) => (
          <>
            <Box marginBottom={2}>
              <Field
                name={`${field}.nimi.${language}`}
                label={t('yleiset.nimi')}
                component={FormFieldInput}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                name={`${field}.titteli.${language}`}
                label={t('yleiset.titteli')}
                component={FormFieldInput}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                name={`${field}.sahkoposti.${language}`}
                label={t('yleiset.sahkoposti')}
                component={FormFieldInput}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                name={`${field}.puhelinnumero.${language}`}
                label={t('yleiset.puhelinnumero')}
                component={FormFieldInput}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                name={`${field}.verkkosivu.${language}`}
                label={t('yleiset.verkkosivu')}
                component={FormFieldUrlInput}
              />
            </Box>
            <Box>
              <Field
                name={`${field}.verkkosivuTeksti.${language}`}
                label={t('yleiset.verkkosivun-teksti')}
                component={FormFieldInput}
              />
            </Box>
          </>
        )}
      </FieldArrayList>
      <Box
        display="flex"
        justifyContent="center"
        marginTop={fields.length > 0 ? 4 : 0}
      >
        <Button
          variant="outlined"
          color="primary"
          type="button"
          onClick={onAddField}
        >
          {t('yleiset.lisaaYhteyshenkilo')}
        </Button>
      </Box>
    </>
  );
};

export const YhteyshenkilotFields = ({
  name = 'yhteyshenkilot',
  language = 'fi',
}) => {
  const { t } = useTranslation();

  return (
    <FieldArray
      name={name}
      component={YhteyshenkilotField}
      t={t}
      language={language}
    />
  );
};
