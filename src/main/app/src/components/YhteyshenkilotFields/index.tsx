import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import Button from '#/src/components/Button';
import FieldArrayList from '#/src/components/FieldArrayList';
import Flex from '#/src/components/Flex';
import { FormFieldInput } from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';

const YhteyshenkilotField = ({ fields, language, t }) => {
  const onAddField = useCallback(() => {
    fields.push({});
  }, [fields]);

  return (
    <>
      <FieldArrayList fields={fields}>
        {({ field }) => (
          <>
            <Spacing marginBottom={2}>
              <Field
                name={`${field}.nimi.${language}`}
                label={t('yleiset.nimi')}
                component={FormFieldInput}
              />
            </Spacing>
            <Spacing marginBottom={2}>
              <Field
                name={`${field}.titteli.${language}`}
                label={t('yleiset.titteli')}
                component={FormFieldInput}
              />
            </Spacing>
            <Spacing marginBottom={2}>
              <Field
                name={`${field}.sahkoposti.${language}`}
                label={t('yleiset.sahkoposti')}
                component={FormFieldInput}
              />
            </Spacing>
            <Spacing marginBottom={2}>
              <Field
                name={`${field}.puhelinnumero.${language}`}
                label={t('yleiset.puhelinnumero')}
                component={FormFieldInput}
              />
            </Spacing>
            <Spacing>
              <Field
                name={`${field}.verkkosivu.${language}`}
                label={t('yleiset.verkkosivu')}
                component={FormFieldInput}
              />
            </Spacing>
          </>
        )}
      </FieldArrayList>
      <Flex justifyCenter marginTop={fields.length > 0 ? 4 : 0}>
        <Button
          variant="outlined"
          color="primary"
          type="button"
          onClick={onAddField}
        >
          {t('yleiset.lisaaYhteyshenkilo')}
        </Button>
      </Flex>
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
