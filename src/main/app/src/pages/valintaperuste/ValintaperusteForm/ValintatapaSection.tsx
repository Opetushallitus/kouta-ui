import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';
import { Grid, Cell } from 'styled-css-grid';

import Button from '#/src/components/Button';
import FieldArrayList from '#/src/components/FieldArrayList';
import {
  FormFieldEditor,
  FormFieldInput,
  FormFieldSelect,
} from '#/src/components/formFields';
import { SisaltoFields } from '#/src/components/SisaltoFields';
import { Box } from '#/src/components/virkailija';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import {ErrorPlaceholder} from "#/src/components/formFields/utils";

const renderValintatapaFields = ({ valintatapa, tapaOptions, language, t }) => (
  <div {...getTestIdProps('valintatapalista')}>
    <Box marginBottom={2} {...getTestIdProps('tapa')}>
      <Field
        name={`${valintatapa}.tapa`}
        required
        component={FormFieldSelect}
        label={t('valintaperustelomake.valitseTapa')}
        options={tapaOptions}
      />
    </Box>

    <Box marginBottom={2} {...getTestIdProps('nimi')}>
      <Field
        name={`${valintatapa}.nimi.${language}`}
        required
        component={FormFieldInput}
        label={t('valintaperustelomake.valintatapajononNimi')}
      />
    </Box>

    <Box marginBottom={2}>
      <Grid>
        <Cell width={6} {...getTestIdProps('enimmaispistemaara')}>
          <Field
            name={`${valintatapa}.enimmaispistemaara`}
            component={FormFieldInput}
            type="number"
            label={t('valintaperustelomake.enimmaispistemaara')}
          />
        </Cell>
        <Cell width={6} {...getTestIdProps('vahimmaispistemaara')}>
          <Field
            name={`${valintatapa}.vahimmaispistemaara`}
            component={FormFieldInput}
            type="number"
            label={t('valintaperustelomake.vahimmaispistemaara')}
          />
        </Cell>
      </Grid>
    </Box>

    <Box marginBottom={2} {...getTestIdProps('kynnysehto')}>
      <Field
        name={`${valintatapa}.kynnysehto.${language}`}
        component={FormFieldEditor}
        label={t('valintaperustelomake.kynnysehto')}
      />
    </Box>

    <div {...getTestIdProps('valintatapaSisalto')}>
      <SisaltoFields name={`${valintatapa}.sisalto`} language={language} />
    </div>
  </div>
);

const renderValintavat = ({ fields, tapaOptions, language, t }) => (
  <>
    {fields.length === 0 && (
      <ErrorPlaceholder
        name={'valintatavat'}>
      </ErrorPlaceholder>
    )}
    <FieldArrayList fields={fields}>
      {({ field: valintatapa }) =>
        renderValintatapaFields({ valintatapa, tapaOptions, language, t })
      }
    </FieldArrayList>

    <Box
      display="flex"
      justifyContent="center"
      marginTop={fields.length > 0 ? 4 : 0}
    >
      <Button
        type="button"
        variant="outlined"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaButton')}
      >
        {t('valintaperustelomake.lisaaValintatapa')}
      </Button>
    </Box>
  </>
);

export const ValintatapaSection = ({ language, name }) => {
  const { options } = useKoodistoOptions({ koodisto: 'valintatapajono' });
  const { t } = useTranslation();

  return (
    <FieldArray
      name={name}
      component={renderValintavat}
      tapaOptions={options}
      language={language}
      t={t}
    />
  );
};
