import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import DateTimeRange from '#/src/components/DateTimeRange';
import {
  FormFieldEditor,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';

import { StyledBlueBox } from './HakeutumisTaiIlmoittautumistapaSection';

const MuuHakulomakeBox = ({ tapa, section, language, ...props }) => {
  const { t } = useTranslation();

  return (
    <StyledBlueBox {...props}>
      <Box display="flex" flexDirection="column">
        <Box mb="20px">
          <Field
            component={FormFieldUrlInput}
            label={t(`toteutuslomake.${tapa}.linkki`)}
            name={`${section}.linkki.${language}`}
            required
          />
        </Box>
        <Box mb="20px">
          <Field
            component={FormFieldEditor}
            label={t(`toteutuslomake.${tapa}.lisatiedot`)}
            name={`${section}.lisatiedot.${language}`}
            required
          />
        </Box>
        <Box mb="20px">
          <Field
            component={FormFieldEditor}
            label={t('toteutuslomake.lisatiedotValintaperusteista')}
            name={`${section}.lisatiedotValintaperusteista.${language}`}
          />
        </Box>
        <Box mb="20px">
          <DateTimeRange
            startProps={{
              label: t('toteutuslomake.hakuaikaAlkaa'),
              name: `${section}.hakuaikaAlkaa`,
            }}
            endProps={{
              label: t('toteutuslomake.hakuaikaPaattyy'),
              name: `${section}.hakuaikaPaattyy`,
            }}
          />
        </Box>
      </Box>
    </StyledBlueBox>
  );
};

export default MuuHakulomakeBox;
