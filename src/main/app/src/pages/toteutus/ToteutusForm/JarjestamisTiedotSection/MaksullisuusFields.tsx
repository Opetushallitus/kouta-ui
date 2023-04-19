import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import {
  FormFieldRadioGroup,
  FormFieldFloatInput,
} from '#/src/components/formFields';
import { Box, InputIcon } from '#/src/components/virkailija';
import { MaksullisuusTyyppi } from '#/src/types/toteutusTypes';
import { getTestIdProps } from '#/src/utils';

const MaksuInputWrapper = styled.div`
  width: 100%;
  max-width: 200px;
`;

export const MaksuField = ({ input: { value }, maksuName, t }) => {
  return [
    MaksullisuusTyyppi.LUKUVUOSIMAKSU,
    MaksullisuusTyyppi.MAKSULLINEN,
  ].includes(value) ? (
    <Box marginTop={2}>
      <MaksuInputWrapper>
        <Field
          name={maksuName}
          component={FormFieldFloatInput}
          placeholder={t('yleiset.maara')}
          helperText={t('yleiset.euroa')}
          suffix={<InputIcon type="euro_symbol" />}
          decimals={2}
        />
      </MaksuInputWrapper>
    </Box>
  ) : null;
};

export const MaksullisuusFields = ({
  name,
  isTutkintoonJohtavaKorkeakoulu,
  label,
}) => {
  const { t } = useTranslation();

  const options = useMemo(() => {
    return [
      { value: MaksullisuusTyyppi.MAKSULLINEN, label: t('yleiset.kylla') },
      { value: MaksullisuusTyyppi.MAKSUTON, label: t('yleiset.ei') },
      ...(isTutkintoonJohtavaKorkeakoulu
        ? [
            {
              value: MaksullisuusTyyppi.LUKUVUOSIMAKSU,
              label: t('toteutuslomake.kaytossaLukuvuosimaksu'),
            },
          ]
        : []),
    ];
  }, [t, isTutkintoonJohtavaKorkeakoulu]);

  const tyyppiName = `${name}.maksullisuustyyppi`;

  return (
    <>
      <div {...getTestIdProps('tyyppi')}>
        <Field
          name={tyyppiName}
          component={FormFieldRadioGroup}
          options={options}
          label={label}
          required
        />
      </div>
      <Field
        name={tyyppiName}
        component={MaksuField}
        maksuName={`${name}.maksunMaara`}
        t={t}
      />
    </>
  );
};

export default MaksullisuusFields;
