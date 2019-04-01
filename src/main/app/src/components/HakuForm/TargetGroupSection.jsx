import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import { RadioGroup } from '../Radio';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';

const renderRadioGroupField = ({ input, options }) => {
  return <RadioGroup {...input} options={options} />;
};

const TargetGroupSection = () => {
  const { options } = useKoodistoOptions({ koodisto: 'haunkohdejoukko' });
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        {t('hakulomake.valitseHaunKohdejoukko')}
      </Typography>

      <Field name="kohde" component={renderRadioGroupField} options={options} />
    </>
  );
};

export default TargetGroupSection;
