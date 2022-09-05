import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { MaaraTyyppi, NDASH } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';

import useKoodisto from '../hooks/useKoodisto';
import {
  FormFieldAsyncKoodistoSelect,
  FormFieldFloatInput,
  FormFieldRadioGroup,
} from './formFields';
import { Box } from './virkailija';

export const OpintojenLaajuusFieldRange = ({
  name,
  disabled,
  required = false,
}) => {
  const { t } = useTranslation();
  const laajuusNumeroTyyppi = useFieldValue<MaaraTyyppi>(
    `${name}.laajuusNumeroTyyppi`
  );

  const { data: koodistoData } = useKoodisto({
    koodisto: 'opintojenlaajuusyksikko',
  });

  return (
    <Box {...getTestIdProps('laajuusNumero')}>
      <legend>{t('koulutuslomake.valitseOpintojenLaajuus')}</legend>
      <Box mt={1}>
        <Field
          name={`${name}.laajuusNumeroTyyppi`}
          component={FormFieldRadioGroup}
          options={[
            {
              label: t('toteutuslomake.yksiArvo'),
              value: MaaraTyyppi.YKSI_ARVO,
            },
            {
              label: t('toteutuslomake.vaihteluvali'),
              value: MaaraTyyppi.VAIHTELUVALI,
            },
          ]}
          disabled={disabled}
        />
      </Box>
      <Box
        display="flex"
        mt={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flexBasis="70px" flexGrow={0} data-testid="laajuusMin">
          <Field
            name={`${name}.opintojenLaajuusNumeroMin`}
            component={FormFieldFloatInput}
            type="number"
            fallbackValue={null}
            disabled={disabled}
          />
        </Box>
        {laajuusNumeroTyyppi === MaaraTyyppi.VAIHTELUVALI && (
          <>
            <Box style={{ textAlign: 'center', width: '20px', flexGrow: 0 }}>
              {NDASH}
            </Box>
            <Box flexBasis="70px" flexGrow={0} data-testid="laajuusMax">
              <Field
                name={`${name}.opintojenLaajuusNumeroMax`}
                component={FormFieldFloatInput}
                type="number"
                disabled={disabled}
                max={999}
              />
            </Box>
          </>
        )}
        <Box flexGrow={2} ml={1} data-testid="laajuusyksikko">
          <Field
            component={FormFieldAsyncKoodistoSelect}
            name={`${name}.opintojenLaajuusyksikko`}
            placeholder={t('yleiset.laajuusyksikko')}
            koodistoData={koodistoData}
            showAllOptions
          />
        </Box>
      </Box>
    </Box>
  );
};
