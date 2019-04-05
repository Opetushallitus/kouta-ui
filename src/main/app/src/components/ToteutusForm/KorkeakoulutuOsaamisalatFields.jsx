import React, { Fragment } from 'react';
import { FieldArray, Field } from 'redux-form';

import Button from '../Button';
import Spacing from '../Spacing';
import Typography from '../Typography';
import Divider from '../Divider';
import Flex from '../Flex';
import Input from '../Input';
import Textarea from '../Textarea';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';

const renderInputField = ({ input }) => <Input {...input} />;

const renderTextareaField = ({ input }) => <Textarea {...input} />;

const renderOsaamisalatFields = ({ fields, language, t }) => (
  <>
    {fields.map((field, index) => (
      <Fragment key={index}>
        <Spacing marginBottom={2} {...getTestIdProps('osaamisalanNimi')}>
          <Typography variant="h6" marginBottom={1}>
            {t('yleiset.nimi')}
          </Typography>

          <Field
            name={`${field}.nimi.${language}`}
            component={renderInputField}
          />
        </Spacing>

        <Spacing marginBottom={2} {...getTestIdProps('osaamisalanKuvaus')}>
          <Typography variant="h6" marginBottom={1}>
            {t('yleiset.kuvaus')}
          </Typography>

          <Field
            name={`${field}.kuvaus.${language}`}
            component={renderTextareaField}
          />
        </Spacing>
        <Spacing marginBottom={2} {...getTestIdProps('osaamisalanLinkki')}>
          <Typography variant="h6" marginBottom={1}>
            {t('yleiset.linkki')}
          </Typography>

          <Field
            name={`${field}.linkki.${language}`}
            component={renderInputField}
          />
        </Spacing>
        <Spacing marginBottom={2} {...getTestIdProps('osaamisalanOtsikko')}>
          <Typography variant="h6" marginBottom={1}>
            {t('toteutuslomake.linkinOtsikko')}
          </Typography>

          <Field
            name={`${field}.otsikko.${language}`}
            component={renderInputField}
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
