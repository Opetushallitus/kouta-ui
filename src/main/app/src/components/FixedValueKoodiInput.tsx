import React from 'react';

import Input from '@opetushallitus/virkailija-ui-components/Input';
import { useTranslation } from 'react-i18next';

import useKoodi from '#/src/hooks/useKoodi';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';

import { FormControl } from './virkailija';

type Props = {
  koodiUri: string;
  label: string;
  selectedLanguage: LanguageCode;
};

export const FixedValueKoodiInput = ({
  koodiUri,
  label,
  selectedLanguage,
}: Props) => {
  const { t } = useTranslation();
  const { koodi } = useKoodi(koodiUri);

  return (
    <FormControl label={t(label)} disabled={true}>
      <Input
        value={getKoodiNimiTranslation(koodi, selectedLanguage)}
        {...getTestIdProps('fixed-value')}
      />
    </FormControl>
  );
};
