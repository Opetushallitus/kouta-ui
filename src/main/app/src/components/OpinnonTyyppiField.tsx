import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect } from './formFields';
import { Box } from './virkailija';
import { useLanguageTab } from '../contexts/LanguageTabContext';
import useKoodistoOptions from '../hooks/useKoodistoOptions';

export const OpinnonTyyppiField = ({ name }) => {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageTab();
  const { options } = useKoodistoOptions({
    koodisto: 'opinnontyyppi',
    language: selectedLanguage,
  });

  return (
    <Box display="flex" mx={-1}>
      <Box px={1} flexGrow={1}>
        <Field
          name={`${name}.opinnonTyyppi`}
          component={FormFieldSelect}
          label={t('yleiset.opinnonTyyppi')}
          options={options}
          isClearable
        />
      </Box>
    </Box>
  );
};
