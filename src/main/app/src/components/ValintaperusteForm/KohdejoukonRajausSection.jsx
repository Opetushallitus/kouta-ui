import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Select from '../Select';
import { noop } from '../../utils';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={noop} />
);

const KohdejoukonRajausSection = () => {
  const { options } = useKoodistoOptions({ koodisto: 'haunkohdejoukko' });
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        {t('valintaperustelomake.valitseHaunKohdejoukko')}
      </Typography>

      <Field
        name="kohdejoukko"
        component={renderSelectField}
        options={options}
      />
    </>
  );
};

export default KohdejoukonRajausSection;
