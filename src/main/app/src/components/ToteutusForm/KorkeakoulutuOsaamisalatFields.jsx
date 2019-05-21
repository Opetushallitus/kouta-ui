import React from 'react';
import { FieldArray, Field } from 'redux-form';

import Button from '../Button';
import Spacing from '../Spacing';
import Flex, { FlexItem } from '../Flex';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import { FormFieldInput, FormFieldTextarea } from '../FormFields';
import FieldArrayList from '../FieldArrayList';

const OsaamisalatFieldArray = ({ fields, language, t }) => (
  <>
    <FieldArrayList fields={fields}>
      {({ field }) => (
        <>
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
          <Flex>
            <FlexItem
              grow={1}
              paddingRight={1}
              {...getTestIdProps('osaamisalanLinkki')}
            >
              <Field
                name={`${field}.linkki.${language}`}
                component={FormFieldInput}
                label={t('yleiset.linkki')}
              />
            </FlexItem>
            <FlexItem
              grow={1}
              paddingLeft={1}
              {...getTestIdProps('osaamisalanOtsikko')}
            >
              <Field
                name={`${field}.otsikko.${language}`}
                component={FormFieldInput}
                label={t('toteutuslomake.linkinOtsikko')}
              />
            </FlexItem>
          </Flex>
        </>
      )}
    </FieldArrayList>
    <Flex justifyCenter marginTop={fields.length > 0 ? 4 : 0}>
      <Button
        type="button"
        variant="outlined"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaOsaamisalaButton')}
      >
        {t('toteutuslomake.lisaaOsaamisala')}
      </Button>
    </Flex>
  </>
);

const KorkeakouluOsaamisalatFields = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <FieldArray
      name={name}
      component={OsaamisalatFieldArray}
      language={language}
      t={t}
    />
  );
};

export default KorkeakouluOsaamisalatFields;
