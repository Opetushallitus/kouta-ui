import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { FormFieldSelect } from '#/src/components/formFields';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import Box from '#/src/components/Box';
import DividerHeading from '#/src/components/DividerHeading';
import { getTestIdProps } from '#/src/utils';

const KielivalikoimaBox = props => (
  <Box flexGrow={1} width={0.33} p={1} {...props} />
);

const KielivalikoimaFields = ({ name }) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'kieli' });

  return (
    <>
      <DividerHeading>{t('toteutuslomake.kielivalikoima')}</DividerHeading>
      <Box display="flex" flexWrap="wrap" m={-1}>
        <KielivalikoimaBox {...getTestIdProps('A1A2Kielet')}>
          <Field
            component={FormFieldSelect}
            name={`${name}.A1A2Kielet`}
            options={options}
            label={t('toteutuslomake.A1A2Kielet')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox {...getTestIdProps('B2Kielet')}>
          <Field
            component={FormFieldSelect}
            name={`${name}.B2Kielet`}
            options={options}
            label={t('toteutuslomake.B2Kielet')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox {...getTestIdProps('aidinkielet')}>
          <Field
            component={FormFieldSelect}
            name={`${name}.aidinkielet`}
            options={options}
            label={t('toteutuslomake.valinnainenAidinkielenOpetus')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox {...getTestIdProps('B1Kielet')}>
          <Field
            component={FormFieldSelect}
            name={`${name}.B1Kielet`}
            options={options}
            label={t('toteutuslomake.B1Kielet')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox {...getTestIdProps('B3Kielet')}>
          <Field
            component={FormFieldSelect}
            name={`${name}.B3Kielet`}
            options={options}
            label={t('toteutuslomake.B3Kielet')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox {...getTestIdProps('muutKielet')}>
          <Field
            component={FormFieldSelect}
            name={`${name}.muutKielet`}
            options={options}
            label={t('toteutuslomake.muutKielet')}
            isMulti
          />
        </KielivalikoimaBox>
      </Box>
    </>
  );
};

export default KielivalikoimaFields;
