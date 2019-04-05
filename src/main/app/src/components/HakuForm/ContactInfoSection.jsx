import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input';
import useTranslation from '../useTranslation';
import Spacing from '../Spacing';
import { getTestIdProps } from '../../utils';

const renderInputField = ({ input, placeholder }) => (
  <Input placeholder={placeholder} {...input} />
);

const ContactInfoSection = ({ languages, koodiUri, ...props }) => {
  const { t } = useTranslation();

  return (
    <div {...props}>
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value: activeLanguage }) => {
          return (
            <>
              <Spacing marginBottom={2} {...getTestIdProps('nimi')}>
                <Typography variant="h6" marginTop={1} marginBottom={1}>
                  {t('yleiset.nimi')}
                </Typography>
                <Field
                  name={`nimi.${activeLanguage}`}
                  component={renderInputField}
                />
              </Spacing>
              <Spacing marginBottom={2} {...getTestIdProps('titteli')}>
                <Typography variant="h6" marginTop={1} marginBottom={1}>
                  {t('yleiset.titteli')}
                </Typography>
                <Field
                  name={`titteli.${activeLanguage}`}
                  component={renderInputField}
                />
              </Spacing>

              <Spacing marginBottom={2} {...getTestIdProps('sahkoposti')}>
                <Typography variant="h6" marginTop={1} marginBottom={1}>
                  {t('yleiset.sahkoposti')}
                </Typography>
                <Field
                  name={`email.${activeLanguage}`}
                  component={renderInputField}
                />
              </Spacing>

              <Spacing {...getTestIdProps('puhelin')}>
                <Typography variant="h6" marginTop={1} marginBottom={1}>
                  {t('yleiset.puhelin')}
                </Typography>
                <Field
                  name={`puhelin.${activeLanguage}`}
                  component={renderInputField}
                />
              </Spacing>
            </>
          );
        }}
      </LanguageSelector>
    </div>
  );
};

export default ContactInfoSection;
