import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input';
import Spacing from '../Spacing';
import useTranslation from '../useTranslation';

const renderInputField = ({ input, type = 'text' }) => (
  <Input {...input} type={type} />
);

const YhteystiedotSection = ({ languages }) => {
  const { t } = useTranslation();

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => {
        return (
          <>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.nimi')}
              </Typography>
              <Field
                name={`name.${activeLanguage}`}
                component={renderInputField}
              />
            </Spacing>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.titteli')}
              </Typography>
              <Field
                name={`title.${activeLanguage}`}
                component={renderInputField}
              />
            </Spacing>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.sahkoposti')}
              </Typography>
              <Field
                name={`email.${activeLanguage}`}
                type="email"
                component={renderInputField}
              />
            </Spacing>
            <Spacing marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.puhelin')}
              </Typography>
              <Field
                name={`phone.${activeLanguage}`}
                component={renderInputField}
              />
            </Spacing>
            <Spacing>
              <Typography variant="h6" marginBottom={1}>
                {t('yleiset.verkkosivu')}
              </Typography>
              <Field
                name={`website.${activeLanguage}`}
                type="text"
                component={renderInputField}
              />
            </Spacing>
          </>
        );
      }}
    </LanguageSelector>
  );
};

export default YhteystiedotSection;
