import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import OpintojenLaajuusFieldExtended from '#/src/components/OpintojenLaajuusFieldExtended';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { isIn, otherwise } from '#/src/utils';

import KoulutusalatField from './KoulutusalatField';
import OpintojenlaajuusField from './OpintojenlaajuusField';

export const VapaaSivistystyoAmmMuuTiedotSection = ({
  disabled,
  language,
  name,
}) => {
  const { t } = useTranslation();
  const koulutustyyppi = useFieldValue('koulutustyyppi');

  return (
    <Box mb={-2}>
      <Box mb={2}>
        {_fp.cond([
          [
            isIn([KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS]),
            () => (
              <OpintojenLaajuusFieldExtended
                name={name}
                disabled={disabled}
                required
              />
            ),
          ],
          [
            otherwise,
            () => (
              <OpintojenlaajuusField disabled={disabled} name={name} required />
            ),
          ],
        ])(koulutustyyppi)}
      </Box>
      <Box mb={2}>
        <KoulutusalatField disabled={disabled} name={name} />
      </Box>
      <Box mb={2}>
        <Field
          disabled={disabled}
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('koulutuslomake.koulutuksenNimi')}
          helperText={t('koulutuslomake.koulutuksenNimiNakyyOppijalleVaroitus')}
          required
        />
      </Box>
    </Box>
  );
};
