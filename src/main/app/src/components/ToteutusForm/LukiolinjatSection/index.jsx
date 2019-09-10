import React from 'react';
import { Field } from 'redux-form';

import Box from '../../Box';
import { FormFieldCheckbox } from '../../FormFields';
import LukionLinjatField from './LukionLinjatField';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';
import FormLabel from '../../FormLabel';
import DividerHeading from '../../DividerHeading';
import useFieldValue from '../../useFieldValue';
import ErityisetKoulutustehtavatField from './ErityisetKoulutustehtavatField';

export const LukiolinjatSection = ({ language, name }) => {
  const { t } = useTranslation();

  const showLukionLinjanTarkenteet = useFieldValue(
    `${name}.showLukionLinjanTarkenteet`,
  );

  const showErityisetKoulutustehtavat = useFieldValue(
    `${name}.showErityisetKoulutustehtavat`,
  );

  return (
    <>
      <Box
        mb={showLukionLinjanTarkenteet || showErityisetKoulutustehtavat ? 2 : 0}
      >
        <FormLabel>
          {t('toteutuslomake.valitseLisattavatLukionLinjat')}
        </FormLabel>

        <Box mb={0.5} {...getTestIdProps('showLukionLinjanTarkenteet')}>
          <Field
            component={FormFieldCheckbox}
            name={`${name}.showLukionLinjanTarkenteet`}
          >
            {t('toteutuslomake.lisattavaLukionLinjaLukio')}
          </Field>
        </Box>

        <Box {...getTestIdProps('showErityisetKoulutustehtavat')}>
          <Field
            component={FormFieldCheckbox}
            name={`${name}.showErityisetKoulutustehtavat`}
          >
            {t('toteutuslomake.lisattavaLukionLinjaErityinenKoulutustehtava')}
          </Field>
        </Box>
      </Box>

      <Box
        mb={
          showLukionLinjanTarkenteet || showErityisetKoulutustehtavat ? -4 : 0
        }
      >
        {showLukionLinjanTarkenteet && (
          <Box mb={4}>
            <DividerHeading>
              {t('toteutuslomake.lukionLinjanTarkenne')}
            </DividerHeading>

            <LukionLinjatField name={`${name}.lukionLinjanTarkenteet`} />
          </Box>
        )}

        {showErityisetKoulutustehtavat && (
          <Box mb={4}>
            <DividerHeading>
              {t('toteutuslomake.erityinenKoulutustehtava')}
            </DividerHeading>

            <ErityisetKoulutustehtavatField
              name={`${name}.erityisetKoulutustehtavat`}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default LukiolinjatSection;
