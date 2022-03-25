import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { getTestIdProps } from '#/src/utils';

import useKoodistoOptions from '../hooks/useKoodistoOptions';
import { FormFieldInput, FormFieldSelect } from './formFields';
import { Box } from './virkailija';

const OpintojenLaajuusFieldExtended = ({
  name,
  disabled,
  required = false,
}) => {
  const { t } = useTranslation();

  const { options } = useKoodistoOptions({
    koodisto: 'opintojenlaajuusyksikko',
  });

  return (
    <Box display="flex" mx={-1}>
      <Box px={1} flexGrow={1} {...getTestIdProps('laajuus')}>
        <Field
          name={`${name}.opintojenLaajuusnumero`}
          component={FormFieldInput}
          label={t('yleiset.laajuus')}
          type="number"
          disabled={disabled}
          required={required}
        />
      </Box>

      <Box px={1} flexGrow={1} {...getTestIdProps('laajuusyksikko')}>
        <Field
          name={`${name}.opintojenLaajuusyksikko`}
          component={FormFieldSelect}
          label={t('yleiset.laajuusyksikko')}
          options={options}
          disabled={disabled}
          required={required}
          isClearable
        />
      </Box>
    </Box>
  );
};

export default OpintojenLaajuusFieldExtended;
