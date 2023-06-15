import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldEditor,
  createFormFieldComponent,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { HAKULOMAKETYYPPI } from '#/src/constants';

import {
  StyledBlueBox,
  StyledGrayRadio,
} from './HakeutumisTaiIlmoittautumistapaSection';
import MuuHakulomakeBox from './MuuhakulomakeBox';

const { MUU, EI_SAHKOISTA_HAKUA } = HAKULOMAKETYYPPI;

const HakeutumisTaiIlmoittautusmistapaFields = createFormFieldComponent(
  ({ hakuTapa, section, onChange, value, language }) => {
    const { t } = useTranslation();

    return (
      <Box display="flex" flexDirection="column" alignItems="stretch">
        <StyledGrayRadio
          checked={value === MUU}
          value={MUU}
          onChange={onChange}
        >
          {t('toteutuslomake.muuHakulomake')}
        </StyledGrayRadio>
        {value === MUU && (
          <MuuHakulomakeBox
            tapa={hakuTapa}
            section={section}
            language={language}
          />
        )}
        <StyledGrayRadio
          checked={value === EI_SAHKOISTA_HAKUA}
          value={EI_SAHKOISTA_HAKUA}
          onChange={onChange}
        >
          {t('toteutuslomake.eiSahkoistaHakua')}
        </StyledGrayRadio>
        {value === EI_SAHKOISTA_HAKUA && (
          <StyledBlueBox>
            <Field
              component={FormFieldEditor}
              label={t(`toteutuslomake.${hakuTapa}.lisatiedot`)}
              name={`${section}.lisatiedot.${language}`}
              hideHeaderSelect
            />
          </StyledBlueBox>
        )}
      </Box>
    );
  }
);

export default HakeutumisTaiIlmoittautusmistapaFields;
