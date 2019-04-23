import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';

import Spacing from '../Spacing';
import Divider from '../Divider';
import Button from '../Button';
import Flex from '../Flex';
import ValintatapaContentFields from '../ValintatapaContentFields';
import useKoodistoOptions from '../useKoodistoOptions';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
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
    <Spacing marginBottom={2} {...getTestIdProps('sisalto')}>
      <ValintatapaContentFields
        name={`${valintatapa}.sisalto`}
        language={language}
      />
    </Spacing>
    <Spacing marginBottom={2} {...getTestIdProps('kynnysehto')}>
      <Field
        name={`${valintatapa}.kynnysehto.${language}`}
        component={FormFieldTextarea}
        label={t('valintaperustelomake.kynnysehto')}
      />
    </Spacing>
    <Spacing marginBottom={2} {...getTestIdProps('enimmaispistemaara')}>
      <Field
        name={`${valintatapa}.enimmaispistemaara`}
        component={FormFieldInput}
        type="number"
        label={t('valintaperustelomake.enimmaispistemaara')}
      />
    </Spacing>
    <Spacing {...getTestIdProps('vahimmaispistemaara')}>
      <Field
        name={`${valintatapa}.vahimmaispistemaara`}
        component={FormFieldInput}
        type="number"
        label={t('valintaperustelomake.vahimmaispistemaara')}
      />
    </Spacing>
  </div>
);

const renderValintavat = ({ fields, tapaOptions, language, t }) => (
  <>
    {fields.map((valintatapa, index) => (
      <Fragment key={index}>
        <Spacing marginBottom={2}>
          {renderValintatapaFields({ valintatapa, tapaOptions, language, t })}
        </Spacing>
        <Flex justifyEnd>
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            onClick={() => {
              fields.remove(index);
            }}
          >
            {t('yleiset.poista')}
          </Button>
        </Flex>
        <Divider marginTop={3} marginBottom={3} />
      </Fragment>
    ))}
    <Button
      type="button"
      onClick={() => {
        fields.push({});
      }}
      {...getTestIdProps('lisaaButton')}
    >
      {t('valintaperustelomake.lisaaValintatapa')}
    </Button>
  </>
);

const ValintatapaSection = ({ language }) => {
  const { options } = useKoodistoOptions({ koodisto: 'valintatapajono' });
  const { t } = useTranslation();

  return (
    <FieldArray
      name="valintatavat"
      component={renderValintavat}
      tapaOptions={options}
      language={language}
      t={t}
    />
  );
};

export default ValintatapaSection;
