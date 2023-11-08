import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldRadioGroup } from '#/src/components/formFields';
import { HakukohteetToteutuksella } from '#/src/constants';
import { parseBooleanToString, parseStringToBoolean } from '#/src/utils';

export const HakukohteetKaytossaChoice = ({
  name,
  disabled,
  format = parseBooleanToString,
}) => {
  const { t } = useTranslation();

  return (
    <Field
      label={t('toteutuslomake.isHakukohteetKaytossa')}
      name={name}
      component={FormFieldRadioGroup}
      options={[
        {
          label: t('yleiset.kylla'),
          value: HakukohteetToteutuksella.HAKUKOHTEET_KAYTOSSA,
        },
        {
          label: t('yleiset.ei'),
          value: HakukohteetToteutuksella.EI_HAKUKOHTEITA,
        },
      ]}
      disabled={disabled}
      format={format}
      parse={parseStringToBoolean}
      required
    />
  );
};
