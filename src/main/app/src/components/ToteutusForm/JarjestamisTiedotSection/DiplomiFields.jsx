import React from 'react';
import { Field } from 'redux-form';

import useKoodistoOptions from '../../useKoodistoOptions';
import useTranslation from '../../useTranslation';
import { FormFieldTextarea, FormFieldSelect } from '../../FormFields';
import Box from '../../Box';
import DividerHeading from '../../DividerHeading';
import { getTestIdProps } from '../../../utils';

const DiplomiFields = ({ name, language }) => {
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
            component={FormFieldTextarea}
          />
        </Box>
      </Box>
    </>
  );
};

export default DiplomiFields;
