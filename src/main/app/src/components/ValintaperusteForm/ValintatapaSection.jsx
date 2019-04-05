import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';

import Typography from '../Typography';
import Input from '../Input';
import LanguageSelector from '../LanguageSelector';
import Select from '../Select';
import Spacing from '../Spacing';
import Divider from '../Divider';
import Button from '../Button';
import Flex from '../Flex';
import ValintatapaContentFields from '../ValintatapaContentFields';
import useKoodistoOptions from '../useKoodistoOptions';
import Textarea from '../Textarea';
import { noop, getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';

const renderInputField = ({ input, type = 'text' }) => (
  <Input {...input} type={type} />
);

const renderSelectField = ({ input, options }) => (
  <Select {...input} options={options} onBlur={noop} />
);

const renderTextareaField = ({ input }) => <Textarea {...input} />;

const renderValintatapaFields = ({ valintatapa, tapaOptions, language, t }) => (
  <div {...getTestIdProps('valintatapalista')}>
    <Spacing marginBottom={2} {...getTestIdProps('tapa')}>
      <Typography variant="h6" marginBottom={1}>
        {t('valintaperustelomake.valitseTapa')}
      </Typography>
      <Field
        name={`${valintatapa}.tapa`}
        component={renderSelectField}
        options={tapaOptions}
      />
    </Spacing>
    <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
      <Typography variant="h6" marginBottom={1}>
        {t('valintaperustelomake.valintatapajononNimi')}
      </Typography>
      <Field
        name={`${valintatapa}.nimi.${language}`}
        component={renderInputField}
      />
    </Spacing>
    <Spacing marginBottom={2} {...getTestIdProps('sisalto')}>
      <ValintatapaContentFields
        name={`${valintatapa}.sisalto`}
        language={language}
      />
    </Spacing>
    <Spacing marginBottom={2} {...getTestIdProps('kynnysehto')}>
      <Typography variant="h6" marginBottom={1}>
        {t('valintaperustelomake.kynnysehto')}
      </Typography>
      <Field
        name={`${valintatapa}.kynnysehto.${language}`}
        component={renderTextareaField}
      />
    </Spacing>
    <Spacing marginBottom={2} {...getTestIdProps('enimmaispistemaara')}>
      <Typography variant="h6" marginBottom={1}>
        {t('valintaperustelomake.enimmaispistemaara')}
      </Typography>
      <Field
        name={`${valintatapa}.enimmaispistemaara`}
        component={renderInputField}
        type="number"
      />
    </Spacing>
    <Spacing {...getTestIdProps('vahimmaispistemaara')}>
      <Typography variant="h6" marginBottom={1}>
        {t('valintaperustelomake.vahimmaispistemaara')}
      </Typography>
      <Field
        name={`${valintatapa}.vahimmaispistemaara`}
        component={renderInputField}
        type="number"
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

const ValintatapaSection = ({ languages }) => {
  const { options } = useKoodistoOptions({ koodisto: 'valintatapajono' });
  const { t } = useTranslation();

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <FieldArray
          name="valintatavat"
          component={renderValintavat}
          tapaOptions={options}
          language={activeLanguage}
          t={t}
        />
      )}
    </LanguageSelector>
  );
};

export default ValintatapaSection;
