import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { useTranslation } from 'react-i18next';

import Spacing from '#/src/components/Spacing';
import Button from '#/src/components/Button';
import Flex from '#/src/components/Flex';
import ValintatapaContentFields from '#/src/components/ValintatapaContentFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import FieldArrayList from '#/src/components/FieldArrayList';
import GridRow from '#/src/components/GridRow';
import GridColumn from '#/src/components/GridColumn';

import {
  FormFieldEditor,
  FormFieldInput,
  FormFieldSelect,
} from '#/src/components/formFields';

const renderValintatapaFields = ({ valintatapa, tapaOptions, language, t }) => (
  <div {...getTestIdProps('valintatapalista')}>
    <Spacing marginBottom={2} {...getTestIdProps('tapa')}>
      <Field
        name={`${valintatapa}.tapa`}
        component={FormFieldSelect}
        label={t('valintaperustelomake.valitseTapa')}
        options={tapaOptions}
      />
    </Spacing>

    <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
      <Field
        name={`${valintatapa}.nimi.${language}`}
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

    <div {...getTestIdProps('sisalto')}>
      <ValintatapaContentFields
        name={`${valintatapa}.sisalto`}
        language={language}
      />
    </div>
  </div>
);

const renderValintavat = ({ fields, tapaOptions, language, t }) => (
  <>
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
