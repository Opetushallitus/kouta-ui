import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { MaaraTyyppi, NDASH } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useKoodisto from '#/src/hooks/useKoodisto';
import { getTestIdProps } from '#/src/utils';

import { useLanguageTab } from '../contexts/LanguageTabContext';
import useKoodi from '../hooks/useKoodi';
import getKoodiNimiTranslation from '../utils/getKoodiNimiTranslation';
import {
  createFormFieldComponent,
  FormFieldAsyncKoodistoSelect,
  FormFieldFloatInput,
  FormFieldRadioGroup,
} from './formFields';
import { Box, FormControl, Input } from './virkailija';

const OpintojenLaajuusRangeGroupInput = createFormFieldComponent(
  ({ disabled, section, forcedLaajuusYksikko }) => {
    const { t } = useTranslation();
    const selectedLanguage = useLanguageTab();
    const laajuusNumeroTyyppi = useFieldValue<MaaraTyyppi>(
      `${section}.laajuusNumeroTyyppi`
    );

    const { data: koodistoData } = useKoodisto({
      koodisto: 'opintojenlaajuusyksikko',
    });

    const { koodi: forcedLaajuusKoodi } = useKoodi(forcedLaajuusYksikko);

    const laajuusYksikkoTextValue = forcedLaajuusYksikko
      ? getKoodiNimiTranslation(forcedLaajuusKoodi, selectedLanguage) || ''
      : '';

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
          {forcedLaajuusYksikko ? (
            <Box flexGrow={2} ml={1} data-testid="forcedLaajuusyksikko">
              <FormControl disabled={true}>
                <Input value={laajuusYksikkoTextValue} />
              </FormControl>
            </Box>
          ) : (
            <Box flexGrow={2} ml={1} data-testid="laajuusyksikko">
              <Field
                component={FormFieldAsyncKoodistoSelect}
                name={`${section}.opintojenLaajuusyksikko`}
                placeholder={t('yleiset.laajuusyksikko')}
                koodistoData={koodistoData}
                selectedLanguage={selectedLanguage}
                showAllOptions
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);

type Props = {
  name: string;
  disabled?: boolean;
  required?: boolean;
  forcedLaajuusYksikko?: string;
};

export const OpintojenLaajuusFieldRange = ({
  name,
  disabled,
  forcedLaajuusYksikko,
}: Props) => (
  <Field
    component={OpintojenLaajuusRangeGroupInput}
    name={`${name}.opintojenLaajuusGroup`}
    disabled={disabled}
    section={name}
    forcedLaajuusYksikko={forcedLaajuusYksikko}
  />
);
