import React from 'react';
import { Field } from 'redux-form';

import Input from '../../Input';
import Textarea from '../../Textarea';
import Typography from '../../Typography';
import Spacing from '../../Spacing';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';

const renderInputField = ({ input }) => <Input {...input} />;

const renderTextareaField = ({ input }) => <Textarea {...input} />;

export const KorkeakouluKuvausSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('kuvauksenNimiInput')}>
        <Typography variant="h6" marginBottom={1}>
          {t('yleiset.kuvauksenNimi')}
        </Typography>
        <Field name={`nimi.${language}`} component={renderInputField} />
      </Spacing>
      <Spacing {...getTestIdProps('kuvausInput')}>
        <Typography variant="h6" marginBottom={1}>
          {t('yleiset.kuvaus')}
        </Typography>
        <Field name={`kuvaus.${language}`} component={renderTextareaField} />
      </Spacing>
    </>
  );
};

export default KorkeakouluKuvausSection;
