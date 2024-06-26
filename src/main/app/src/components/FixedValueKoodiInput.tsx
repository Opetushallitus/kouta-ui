import React from 'react';

import Input from '@opetushallitus/virkailija-ui-components/Input';

import { FormControl } from '#/src/components/virkailija';
import useKoodi from '#/src/hooks/useKoodi';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

type Props = {
  koodiUri: string;
  selectedLanguage: LanguageCode;
  label?: string;
  prefix?: string;
};

export const FixedValueKoodiInput = ({
  koodiUri,
  label,
  selectedLanguage,
  prefix,
}: Props) => {
  const { koodi } = useKoodi(koodiUri);

  const value = prefix
    ? `${prefix} ${getKoodiNimiTranslation(koodi, selectedLanguage)}`
    : getKoodiNimiTranslation(koodi, selectedLanguage);

  return (
    <FormControl label={label} disabled={true}>
      <Input value={value ?? ''} />
    </FormControl>
  );
};
