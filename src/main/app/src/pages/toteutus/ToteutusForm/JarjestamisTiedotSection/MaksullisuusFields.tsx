import { useMemo } from 'react';

import { isArray, some } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import {
  FormFieldRadioGroup,
  FormFieldFloatInput,
  createFormFieldComponent,
} from '#/src/components/formFields';
import { Box, CheckboxGroup, InputIcon } from '#/src/components/virkailija';
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

const MaksullisuustyypitCheckboxGroup = props => {
  const options = props;

  return <CheckboxGroup options={options} {...props} />;
};

const MaksullisuustyypitField = createFormFieldComponent(
  MaksullisuustyypitCheckboxGroup,
  ({ input: { value, ...input }, ...props }) => ({
    ...input,
    value: value || [],
    ...props,
  })
);

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

export const MaksullisuusFields = ({
  name,
  isLukuvuosimaksuVisible,
  label,
  koulutustyyppi,
  error,
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

  const tyyppiName = `${name}.maksullisuustyyppi`;
  const selectedMaksullisuustyypit = useFieldValue(tyyppiName);

  const isMaksunMaaraVisible = (
    selectedMaksullisuustyypit: MaksullisuusTyyppi | Array<MaksullisuusTyyppi>,
    predFunc: (s: MaksullisuusTyyppi) => boolean
  ): boolean => {
    return isArray(selectedMaksullisuustyypit)
      ? some(selectedMaksullisuustyypit, v => predFunc(v))
      : predFunc(selectedMaksullisuustyypit);
  };

  const maksunMaaraVisible = isMaksunMaaraVisible(
    selectedMaksullisuustyypit,
    v => v === MaksullisuusTyyppi.MAKSULLINEN
  );

  const lukuvuosimaksunMaaraVisible = isMaksunMaaraVisible(
    selectedMaksullisuustyypit,
    v => v === MaksullisuusTyyppi.LUKUVUOSIMAKSU
  );

  const koulutustyyppiWithMultipleMaksullisuustyyppi =
    isKoulutustyyppiWithMultipleMaksullisuustyyppi(koulutustyyppi);

  return (
    <>
      <div {...getTestIdProps('tyyppi')}>
        {koulutustyyppiWithMultipleMaksullisuustyyppi ? (
          <Field
            name={tyyppiName}
            component={MaksullisuustyypitField}
            options={options}
            label={label}
            error={error}
            required
          />
        ) : (
          <Field
            name={tyyppiName}
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
