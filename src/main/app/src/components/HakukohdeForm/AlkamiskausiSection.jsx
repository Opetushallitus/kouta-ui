import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Spacing from '../Spacing';
import { RadioGroup } from '../Radio';
import useKoodistoOptions from '../useKoodistoOptions';
import YearSelect from '../YearSelect';
import { noop } from '../../utils';
import useTranslation from '../useTranslation';

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input} options={options} />
);

const renderYearField = ({ input }) => <YearSelect {...input} onBlur={noop} />;

const AlkamiskausiSection = () => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <>
      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          {t('yleiset.kausi')}
        </Typography>

        <Field
          name="kausi"
          component={renderRadioGroupField}
          options={options}
        />
      </Spacing>
      <Spacing>
        <Typography variant="h6" marginBottom={1}>
          {t('yleiset.vuosi')}
        </Typography>
        <Field name="vuosi" component={renderYearField} />
      </Spacing>
    </>
  );
};

export default AlkamiskausiSection;
