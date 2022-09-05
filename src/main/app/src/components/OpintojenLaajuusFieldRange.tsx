import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { MaaraTyyppi, NDASH } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useKoodisto from '#/src/hooks/useKoodisto';
import { getTestIdProps } from '#/src/utils';

import {
  createFormFieldComponent,
  FormFieldAsyncKoodistoSelect,
  FormFieldFloatInput,
  FormFieldRadioGroup,
} from './formFields';
import { Box } from './virkailija';

const OpintojenLaajuusRangeGroupInput = createFormFieldComponent(
  ({ disabled, section }) => {
    const { t } = useTranslation();
    const laajuusNumeroTyyppi = useFieldValue<MaaraTyyppi>(
      `${section}.laajuusNumeroTyyppi`
    );

    const { data: koodistoData } = useKoodisto({
      koodisto: 'opintojenlaajuusyksikko',
    });

    return (
      <Box {...getTestIdProps('laajuusNumero')}>
        <legend>{t('koulutuslomake.valitseOpintojenLaajuus')}</legend>
        <Box mt={1}>
          <Field
            name={`${section}.laajuusNumeroTyyppi`}
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
              name={`${section}.opintojenLaajuusNumeroMin`}
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
                  name={`${section}.opintojenLaajuusNumeroMax`}
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
              name={`${section}.opintojenLaajuusyksikko`}
              placeholder={t('yleiset.laajuusyksikko')}
              koodistoData={koodistoData}
              showAllOptions
            />
          </Box>
        </Box>
      </Box>
    );
  }
);

export const OpintojenLaajuusFieldRange = ({ name, disabled }) => (
  <Field
    component={OpintojenLaajuusRangeGroupInput}
    name={`${name}.opintojenLaajuusGroup`}
    disabled={disabled}
    section={name}
  />
);
