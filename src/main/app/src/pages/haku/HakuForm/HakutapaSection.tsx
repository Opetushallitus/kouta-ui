import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { FormFieldRadioGroup } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

export const HakutapaSection = ({ name, isOphVirkailija }) => {
  const { options } = useKoodistoOptions({ koodisto: 'hakutapa' });
  const { t } = useTranslation();

  const getIsDisabled = useCallback(
    value => {
      return !isOphVirkailija && isYhteishakuHakutapa(value);
    },
    [isOphVirkailija]
  );

  return (
    <Field
      name={name}
      component={FormFieldRadioGroup}
      label={t('hakulomake.valitseHakutapa')}
      options={options}
      getIsDisabled={getIsDisabled}
      required
    />
  );
};
