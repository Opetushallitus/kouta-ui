import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import {
  FormFieldRadioGroup,
  FormFieldFloatInput,
  FormFieldCheckboxGroup,
} from '#/src/components/formFields';
import { Box, InputIcon } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';
import {
  getTestIdProps,
  isKoulutustyyppiWithMultipleMaksullisuustyyppi,
} from '#/src/utils';

const MaksuInputWrapper = styled.div`
  width: 100%;
  max-width: 200px;
`;

export const MaksuField = ({ name, t, label }) => {
  return (
    <Box marginTop={2}>
      <MaksuInputWrapper>
        <Field
          name={name}
          label={label}
          component={FormFieldFloatInput}
          placeholder={t('yleiset.maara')}
          helperText={t('yleiset.euroa')}
          suffix={<InputIcon type="euro_symbol" />}
          decimals={2}
        />
      </MaksuInputWrapper>
    </Box>
  );
};

const isMaksunMaaraVisible = (
  selectedMaksullisuustyyppiValue:
    | MaksullisuusTyyppi
    | Array<MaksullisuusTyyppi>,
  maksullisuustyyppiForMaksunMaara: MaksullisuusTyyppi
): boolean => {
  return Array.isArray(selectedMaksullisuustyyppiValue)
    ? selectedMaksullisuustyyppiValue.includes(maksullisuustyyppiForMaksunMaara)
    : selectedMaksullisuustyyppiValue === maksullisuustyyppiForMaksunMaara;
};

export const MaksullisuusFields = ({
  name,
  isLukuvuosimaksuVisible,
  label,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();

  const options = useMemo(() => {
    return [
      { value: MaksullisuusTyyppi.MAKSULLINEN, label: t('yleiset.kylla') },
      { value: MaksullisuusTyyppi.MAKSUTON, label: t('yleiset.ei') },
      ...(isLukuvuosimaksuVisible
        ? [
            {
              value: MaksullisuusTyyppi.LUKUVUOSIMAKSU,
              label: t('toteutuslomake.kaytossaLukuvuosimaksu'),
            },
          ]
        : []),
    ];
  }, [t, isLukuvuosimaksuVisible]);

  const koulutustyyppiWithMultipleMaksullisuustyyppi =
    isKoulutustyyppiWithMultipleMaksullisuustyyppi(koulutustyyppi);

  const maksullisuustyyppiFieldName =
    koulutustyyppiWithMultipleMaksullisuustyyppi
      ? `${name}.maksullisuustyypit`
      : `${name}.maksullisuustyyppi`;

  const selectedMaksullisuustyyppiValue = useFieldValue<
    MaksullisuusTyyppi | Array<MaksullisuusTyyppi>
  >(maksullisuustyyppiFieldName);

  const maksunMaaraVisible = isMaksunMaaraVisible(
    selectedMaksullisuustyyppiValue,
    MaksullisuusTyyppi.MAKSULLINEN
  );

  const lukuvuosimaksunMaaraVisible = isMaksunMaaraVisible(
    selectedMaksullisuustyyppiValue,
    MaksullisuusTyyppi.LUKUVUOSIMAKSU
  );

  return (
    <>
      <div {...getTestIdProps('tyyppi')}>
        {koulutustyyppiWithMultipleMaksullisuustyyppi ? (
          <Field
            name={maksullisuustyyppiFieldName}
            component={FormFieldCheckboxGroup}
            options={options}
            label={label}
            required
          />
        ) : (
          <Field
            name={maksullisuustyyppiFieldName}
            component={FormFieldRadioGroup}
            options={options}
            label={label}
            required
          />
        )}
      </div>
      {maksunMaaraVisible && (
        <MaksuField
          name={`${name}.maksunMaara`}
          t={t}
          label={t('toteutuslomake.maksunMaara')}
        />
      )}
      {lukuvuosimaksunMaaraVisible && (
        <MaksuField
          name={`${name}.lukuvuosimaksunMaara`}
          t={t}
          label={t('toteutuslomake.lukuvuosimaksunMaara')}
        />
      )}
    </>
  );
};

export default MaksullisuusFields;
