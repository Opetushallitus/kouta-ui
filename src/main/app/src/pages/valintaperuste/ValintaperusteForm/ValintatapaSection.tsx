import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import Button from '#/src/components/Button';
import FieldArrayList from '#/src/components/FieldArrayList';
import { Flex } from '#/src/components/Flex';
import {
  FormFieldEditor,
  FormFieldInput,
  FormFieldSelect,
} from '#/src/components/formFields';
import GridColumn from '#/src/components/GridColumn';
import GridRow from '#/src/components/GridRow';
import { SisaltoFields } from '#/src/components/SisaltoFields';
import Spacing from '#/src/components/Spacing';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

const renderValintatapaFields = ({ valintatapa, tapaOptions, language, t }) => (
  <div {...getTestIdProps('valintatapalista')}>
    <Spacing marginBottom={2} {...getTestIdProps('tapa')}>
      <Field
        name={`${valintatapa}.tapa`}
        required
        component={FormFieldSelect}
        label={t('valintaperustelomake.valitseTapa')}
        options={tapaOptions}
      />
    </Spacing>

    <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
      <Field
        name={`${valintatapa}.nimi.${language}`}
        required
        component={FormFieldInput}
        label={t('valintaperustelomake.valintatapajononNimi')}
      />
    </Spacing>

    <Spacing marginBottom={2}>
      <GridRow>
        <GridColumn sm={6} {...getTestIdProps('enimmaispistemaara')}>
          <Field
            name={`${valintatapa}.enimmaispistemaara`}
            component={FormFieldInput}
            type="number"
            label={t('valintaperustelomake.enimmaispistemaara')}
          />
        </GridColumn>
        <GridColumn sm={6} {...getTestIdProps('vahimmaispistemaara')}>
          <Field
            name={`${valintatapa}.vahimmaispistemaara`}
            component={FormFieldInput}
            type="number"
            label={t('valintaperustelomake.vahimmaispistemaara')}
          />
        </GridColumn>
      </GridRow>
    </Spacing>

    <Spacing marginBottom={2} {...getTestIdProps('kynnysehto')}>
      <Field
        name={`${valintatapa}.kynnysehto.${language}`}
        component={FormFieldEditor}
        label={t('valintaperustelomake.kynnysehto')}
      />
    </Spacing>

    <div {...getTestIdProps('valintatapaSisalto')}>
      <SisaltoFields name={`${valintatapa}.sisalto`} language={language} />
    </div>
  </div>
);

const renderValintavat = ({ fields, tapaOptions, language, t }) => (
  <>
    {fields.length === 0 && (
      <Spacing marginBottom={2}>
        {t('valintaperustelomake.lisaaVahintaanYksiValintatapa') + ' *'}
      </Spacing>
    )}
    <FieldArrayList fields={fields}>
      {({ field: valintatapa }) =>
        renderValintatapaFields({ valintatapa, tapaOptions, language, t })
      }
    </FieldArrayList>
    <Flex justifyCenter marginTop={fields.length > 0 ? 4 : 0}>
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
    </Flex>
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
