import React from 'react';
import { Field, FieldArray } from 'redux-form';

import Spacing from '../Spacing';
import Button from '../Button';
import Flex from '../Flex';
import ValintatapaContentFields from '../ValintatapaContentFields';
import useKoodistoOptions from '../useKoodistoOptions';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import FieldArrayList from '../FieldArrayList';
import GridRow from '../GridRow';
import GridColumn from '../GridColumn';

import {
  FormFieldInput,
  FormFieldSelect,
  FormFieldTextarea,
} from '../FormFields';

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
        component={FormFieldTextarea}
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

const ValintatapaSection = ({ language, name }) => {
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

export default ValintatapaSection;
