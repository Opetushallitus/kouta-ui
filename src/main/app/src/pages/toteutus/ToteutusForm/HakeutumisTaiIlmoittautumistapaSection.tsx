import React from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { transparentize } from 'polished';

import { getThemeProp } from '#/src/theme';
import { FormFieldInput, FormFieldEditor } from '#/src/components/formFields';
import { Box, Radio } from '#/src/components/virkailija';
import SegmentTabs from '#/src/components/SegmentTabs';
import SegmentTab from '#/src/components/SegmentTab';
import DateTimeRange from '#/src/components/DateTimeRange';
import { createFormFieldComponent } from '#/src/components/formFields';
import { useFieldValue } from '#/src/hooks/form';
import { HAKULOMAKETYYPPI, Hakeutumistapa } from '#/src/constants';

const { MUU, ATARU, EI_SAHKOISTA_HAKUA } = HAKULOMAKETYYPPI;

const StyledGrayRadio = styled(Radio)`
  background-color: ${getThemeProp('colors.grayLighten6', transparentize(0.5))};
  padding: 19px 10px;
  margin-bottom: 10px;
`;

const StyledBlueBox = styled(Box)`
  background-color: ${getThemeProp('colors.blueLighten4', transparentize(0.7))};
  padding: 30px;
  margin-bottom: 20px;
`;

const MuuHakulomakeBox = ({ tapa, section, language, ...props }) => {
  const { t } = useTranslation();

  return (
    <StyledBlueBox {...props}>
      <Box display="flex" flexDirection="column">
        <Box mb="20px">
          <Field
            component={FormFieldInput}
            label={t(`toteutuslomake.${tapa}.linkki`)}
            name={`${section}.linkki.${language}`}
          />
        </Box>
        <Box mb="20px">
          <Field
            component={FormFieldEditor}
            label={t(`toteutuslomake.${tapa}.lisatiedot`)}
            name={`${section}.lisatiedot.${language}`}
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
          checked={value === ATARU}
          value={ATARU}
          onChange={onChange}
        >
          {t('toteutuslomake.hakemuspalvelu')}
        </StyledGrayRadio>
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

const HakutapaFormField = createFormFieldComponent(({ onChange, value }) => {
  const { t } = useTranslation();
  return (
    <SegmentTabs value={value}>
      <SegmentTab value={Hakeutumistapa.HAKEUTUMINEN} onClick={onChange}>
        {t('toteutuslomake.hakuTapa.hakeutuminen')}
      </SegmentTab>
      <SegmentTab value={Hakeutumistapa.ILMOITTAUTUMINEN} onClick={onChange}>
        {t('toteutuslomake.hakuTapa.ilmoittautuminen')}
      </SegmentTab>
    </SegmentTabs>
  );
});

export const HakeutumisTaiIlmoittautumistapaSection = ({
  name = 'hakeutumisTaiIlmoittautumistapa',
  language,
}) => {
  const { t } = useTranslation();
  const hakuTapa = useFieldValue(`${name}.hakuTapa`);

  return (
    <Box flexDirection="column">
      <Box mb="30px">
        <Field
          label={t('toteutuslomake.valitseHakutapa')}
          component={HakutapaFormField}
          name={`${name}.hakuTapa`}
        />
      </Box>
      <Box>
        {hakuTapa && (
          <Field
            label={hakuTapa && t(`toteutuslomake.${hakuTapa}.valitseTapa`)}
            component={HakeutumisTaiIlmoittautusmistapaFields}
            name={`${name}.hakeutumisTaiIlmoittautumistapa`}
            section={name}
            hakuTapa={hakuTapa}
            language={language}
          />
        )}
      </Box>
    </Box>
  );
};

export default HakeutumisTaiIlmoittautumistapaSection;
