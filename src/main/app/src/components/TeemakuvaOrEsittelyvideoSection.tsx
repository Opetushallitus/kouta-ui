import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import {
  FormFieldRadioGroup,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import TeemakuvaSection from '#/src/components/TeemakuvaSection';
import { Box, Radio } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { spacing } from '#/src/theme';

const StyledRadio = styled(Radio)`
  margin-bottom: ${spacing(0.2)};
`;

const ActionArea = styled(Box)`
  margin-top: ${spacing(3)};
`;

export const TeemakuvaOrEsittelyvideoSection = props => {
  const { name, disabled, language } = props;
  const { t } = useTranslation();
  const mediaType = useFieldValue<string>(`${name}.mediaType`);

  return (
    <>
      <Field
        disabled={disabled}
        name={`${name}.mediaType`}
        label={t('yleiset.teemakuvaInfo')}
        component={FormFieldRadioGroup}
      >
        <StyledRadio value="teemakuva">{t('yleiset.teemakuva')}</StyledRadio>
        <StyledRadio value="esittelyvideo">
          {t('yleiset.esittelyvideo')}
        </StyledRadio>
      </Field>
      {mediaType === 'teemakuva' && (
        <ActionArea>
          <TeemakuvaSection name={`${name}.teemakuvaUrl`} disabled={disabled} />
        </ActionArea>
      )}
      {mediaType === 'esittelyvideo' && (
        <ActionArea>
          <Field
            component={FormFieldUrlInput}
            type="url"
            name={`${name}.esittelyvideoUrl.${language}`}
            label={t('yleiset.esittelyvideo')}
            info={t('yleiset.esittelyvideoInfo')}
          />
        </ActionArea>
      )}
    </>
  );
};
