import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import {
  FormFieldRadioGroup,
  FormFieldInput,
} from '#/src/components/formFields';
import { InputIcon } from '#/src/components/virkailija';
import Spacing from '#/src/components/Spacing';
import { getTestIdProps } from '#/src/utils';

const MaksuInputWrapper = styled.div`
  width: 100%;
  max-width: 200px;
`;

export const MaksuField = ({ input: { value }, maksuName, t }) => {
  return ['kylla', 'lukuvuosimaksu'].includes(value) ? (
    <Spacing marginTop={2}>
      <MaksuInputWrapper {...getTestIdProps('maksu')}>
        <Field
          name={maksuName}
          component={FormFieldInput}
          placeholder={t('yleiset.maara')}
          helperText={t('yleiset.euroa')}
          suffix={<InputIcon type="euro_symbol" />}
          type="number"
        />
      </MaksuInputWrapper>
    </Spacing>
  ) : null;
};

export const MaksullisuusFields = ({ name, isKorkeakoulu, label }) => {
  const { t } = useTranslation();

  const options = useMemo(() => {
    return [
      { value: 'kylla', label: t('yleiset.kylla') },
      { value: 'ei', label: t('yleiset.ei') },
      ...(isKorkeakoulu
        ? [
            {
              value: 'lukuvuosimaksu',
              label: t('toteutuslomake.kaytossaLukuvuosimaksu'),
            },
          ]
        : []),
    ];
  }, [t, isKorkeakoulu]);

  const tyyppiName = `${name}.tyyppi`;

  return (
    <>
      <div {...getTestIdProps('tyyppi')}>
        <Field
          name={tyyppiName}
          component={FormFieldRadioGroup}
          options={options}
          label={label}
        />
      </div>
      <Field
        name={tyyppiName}
        component={MaksuField}
        maksuName={`${name}.maksu`}
        t={t}
      />
    </>
  );
};

export default MaksullisuusFields;
