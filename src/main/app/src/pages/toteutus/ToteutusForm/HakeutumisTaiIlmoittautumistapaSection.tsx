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
import { Flex, FlexItem } from '#/src/components/Flex';
import { createFormFieldComponent } from '#/src/components/formFields';
import { useFieldValue } from '#/src/hooks/form';
import {
  HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA,
  HAKEUTUMINEN,
  ILMOITTAUTUMINEN,
} from '#/src/constants';

const {
  MUU_HAKULOMAKE,
  HAKEMUSPALVELU,
  EI_SAHKOISTA_HAKUA,
} = HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA;

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
      <Flex column>
        <FlexItem mb="20px">
          <Field
            component={FormFieldInput}
            label={t(`toteutuslomake.${tapa}.linkki`)}
            name={`${section}.linkki.${language}`}
          />
        </FlexItem>
        <FlexItem mb="20px">
          <Field
            component={FormFieldEditor}
            label={t(`toteutuslomake.${tapa}.lisatiedot`)}
            name={`${section}.lisatiedot.${language}`}
          />
        </FlexItem>
        <FlexItem mb="20px">
          <Field
            component={FormFieldEditor}
            label={t('toteutuslomake.lisatiedotValintaperusteista')}
            name={`${section}.lisatiedotValintaperusteista.${language}`}
          />
        </FlexItem>
        <FlexItem mb="20px">
          <DateTimeRange
            startProps={{
              label: t('toteutuslomake.hakuaikaAlkaa'),
              name: `${section}.hakuaikaAlkaa.${language}`,
            }}
            endProps={{
              label: t('toteutuslomake.hakuaikaPaattyy'),
              name: `${section}.hakuaikaPaattyy.${language}`,
            }}
          />
        </FlexItem>
      </Flex>
    </StyledBlueBox>
  );
};

const HakeutumisTaiIlmoittautusmistapaFields = createFormFieldComponent(
  ({ hakuTapa, section, onChange, value, language }) => {
    const { t } = useTranslation();

    return hakuTapa ? (
      <Flex column>
        <StyledGrayRadio
          checked={value === MUU_HAKULOMAKE}
          value={MUU_HAKULOMAKE}
          onChange={onChange}
        >
          {t('toteutuslomake.muuHakulomake')}
        </StyledGrayRadio>
        {value === MUU_HAKULOMAKE && (
          <MuuHakulomakeBox
            tapa={hakuTapa}
            section={section}
            language={language}
          />
        )}
        <StyledGrayRadio
          checked={value === HAKEMUSPALVELU}
          value={HAKEMUSPALVELU}
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
            />
          </StyledBlueBox>
        )}
      </Flex>
    ) : (
      <div />
    );
  }
);

const HakutapaFormField = createFormFieldComponent(({ onChange, value }) => {
  const { t } = useTranslation();
  return (
    <SegmentTabs value={value}>
      <SegmentTab value={HAKEUTUMINEN} onClick={onChange}>
        {t('toteutuslomake.hakuTapa.hakeutuminen')}
      </SegmentTab>
      <SegmentTab value={ILMOITTAUTUMINEN} onClick={onChange}>
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
    <Flex column>
      <FlexItem mb="30px">
        <Field
          label={t('toteutuslomake.valitseHakutapa')}
          component={HakutapaFormField}
          name={`${name}.hakuTapa`}
        />
      </FlexItem>
      <FlexItem>
        <Field
          label={hakuTapa && t(`toteutuslomake.${hakuTapa}.valitseTapa`)}
          component={HakeutumisTaiIlmoittautusmistapaFields}
          name={`${name}.hakeutumisTaiIlmoittautumistapa.${language}`}
          section={name}
          hakuTapa={hakuTapa}
          language={language}
        />
      </FlexItem>
    </Flex>
  );
};

export default HakeutumisTaiIlmoittautumistapaSection;
