import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSelect } from '#/src/components/formFields';
import Heading from '#/src/components/Heading';
import { Box } from '#/src/components/virkailija';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

const KielivalikoimaBox = props => (
  <Box flexGrow={1} width={0.33} p={1} {...props} />
);

const KielivalikoimaFields = ({ name }) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'kieli' });

  return (
    <>
      <Heading hasDivider>{t('toteutuslomake.kielivalikoima')}</Heading>
      <Box display="flex" flexWrap="wrap" m={-1}>
        <KielivalikoimaBox width={0.5}>
          <Field
            component={FormFieldSelect}
            name={`${name}.kielivalikoima.A1Kielet`}
            options={options}
            label={t('toteutuslomake.A1Kielet')}
            isMulti
          />
        </KielivalikoimaBox>
        <KielivalikoimaBox width={0.5}>
          <Field
            component={FormFieldSelect}
            name={`${name}.kielivalikoima.A2Kielet`}
            options={options}
            label={t('toteutuslomake.A2Kielet')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox>
          <Field
            component={FormFieldSelect}
            name={`${name}.kielivalikoima.B1Kielet`}
            options={options}
            label={t('toteutuslomake.B1Kielet')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox>
          <Field
            component={FormFieldSelect}
            name={`${name}.kielivalikoima.B2Kielet`}
            options={options}
            label={t('toteutuslomake.B2Kielet')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox>
          <Field
            component={FormFieldSelect}
            name={`${name}.kielivalikoima.B3Kielet`}
            options={options}
            label={t('toteutuslomake.B3Kielet')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox width={0.5}>
          <Field
            component={FormFieldSelect}
            name={`${name}.kielivalikoima.aidinkielet`}
            options={options}
            label={t('toteutuslomake.valinnainenAidinkielenOpetus')}
            isMulti
          />
        </KielivalikoimaBox>

        <KielivalikoimaBox width={0.5}>
          <Field
            component={FormFieldSelect}
            name={`${name}.kielivalikoima.muutKielet`}
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
