import React, { Fragment } from 'react';
import { FieldArray, Field } from 'redux-form';

import Button from '../Button';
import Spacing from '../Spacing';
import Divider from '../Divider';
import Flex from '../Flex';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import { FormFieldInput, FormFieldTextarea } from '../FormFields';

const renderOsaamisalatFields = ({ fields, language, t }) => (
  <>
    {fields.map((field, index) => (
      <Fragment key={index}>
        <Spacing marginBottom={2} {...getTestIdProps('osaamisalanNimi')}>
          <Field
            name={`${field}.nimi.${language}`}
            component={FormFieldInput}
            label={t('yleiset.nimi')}
          />
        </Spacing>

        <Spacing marginBottom={2} {...getTestIdProps('osaamisalanKuvaus')}>
          <Field
            name={`${field}.kuvaus.${language}`}
            component={FormFieldTextarea}
            label={t('yleiset.kuvaus')}
          />
        </Spacing>
        <Spacing marginBottom={2} {...getTestIdProps('osaamisalanLinkki')}>
          <Field
            name={`${field}.linkki.${language}`}
            component={FormFieldInput}
            label={t('yleiset.linkki')}
          />
        </Spacing>
        <Spacing marginBottom={2} {...getTestIdProps('osaamisalanOtsikko')}>
          <Field
            name={`${field}.otsikko.${language}`}
            component={FormFieldInput}
            label={t('toteutuslomake.linkinOtsikko')}
          />
        </Spacing>
        <Flex justifyEnd>
          <Button
            type="button"
            onClick={() => {
              fields.remove(index);
            }}
            variant="outlined"
            color="secondary"
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
      {...getTestIdProps('lisaaOsaamisalaButton')}
    >
      {t('toteutuslomake.lisaaOsaamisala')}
    </Button>
  </>
);

const KorkeakouluOsaamisalatFields = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <FieldArray
      name={name}
      component={renderOsaamisalatFields}
      language={language}
      t={t}
    />
  );
};

export default KorkeakouluOsaamisalatFields;
