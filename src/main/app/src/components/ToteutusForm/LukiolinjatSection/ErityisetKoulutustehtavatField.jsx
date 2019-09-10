import React from 'react';
import { Field } from 'redux-form';

import { FormFieldSelect } from '../../FormFields';
import useKoodistoOptions from '../../useKoodistoOptions';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';

const ErityisetKoulutustehtavatField = ({ name }) => {
  const { t } = useTranslation();

  const { options } = useKoodistoOptions({
    koodisto: 'lukionerityistehtava',
  });

  return (
    <div {...getTestIdProps('erityisetKoulutustehtavat')}>
      <Field
        component={FormFieldSelect}
        name={name}
        label={t('toteutuslomake.valitseErityisetKoulutustehtavat')}
        options={options}
        isMulti
      />
    </div>
  );
};

export default ErityisetKoulutustehtavatField;
