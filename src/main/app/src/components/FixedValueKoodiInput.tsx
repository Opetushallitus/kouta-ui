import React from 'react';

import Input from '@opetushallitus/virkailija-ui-components/Input';
import { useTranslation } from 'react-i18next';

import { FormControl } from '#/src/components/virkailija';
import useKoodi from '#/src/hooks/useKoodi';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

type Props = {
  koodiUri: string;
  label: string;
  selectedLanguage: LanguageCode;
  prefix?: string;
};

export const FixedValueKoodiInput = ({
  koodiUri,
  label,
  selectedLanguage,
  prefix,
}: Props) => {
  const { t } = useTranslation();
  const { koodi } = useKoodi(koodiUri);

  const value = prefix
    ? `${prefix} ${getKoodiNimiTranslation(koodi, selectedLanguage)}`
    : getKoodiNimiTranslation(koodi, selectedLanguage);

  return (
    <FormControl label={t(label)} disabled={true}>
      <Input value={value} {...getTestIdProps('fixed-value-koodi-input')} />
    </FormControl>
  );
};
