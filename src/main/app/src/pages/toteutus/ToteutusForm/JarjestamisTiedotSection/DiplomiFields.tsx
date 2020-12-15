import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { FormFieldEditor, FormFieldSelect } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import DividerHeading from '#/src/components/DividerHeading';
import { getTestIdProps } from '#/src/utils';

export const DiplomiFields = ({ name, language }) => {
  const { t } = useTranslation();

  const { options: diplomiOptions } = useKoodistoOptions({
    koodisto: 'lukiodiplomit',
  });

  return (
    <>
      <DividerHeading>{t('toteutuslomake.lukiodiplomi')}</DividerHeading>
      <Box display="flex">
        <Box flexGrow={0} flexBasis="30%" {...getTestIdProps('diplomiTyypit')}>
          <Field
            label={t('toteutuslomake.valitseDiplomiOppiaineet')}
            name={`${name}.diplomiTyypit`}
            component={FormFieldSelect}
            options={diplomiOptions}
            isMulti
          />
        </Box>
        <Box flexGrow={1} pl={4} {...getTestIdProps('diplomiKuvaus')}>
          <Field
            name={`${name}.diplomiKuvaus.${language}`}
            label={t('toteutuslomake.lukiodiplominTarkempiKuvaus')}
            component={FormFieldEditor}
            hideHeaderSelect
          />
        </Box>
      </Box>
    </>
  );
};
