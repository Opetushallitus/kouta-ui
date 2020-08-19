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

const MuuHakulomakeBox = ({ tapa, section, ...props }) => {
  const { t } = useTranslation();
  return (
    <StyledBlueBox {...props}>
      <Flex column>
        <FlexItem mb="20px">
          <Field
            component={FormFieldInput}
            label={t(`toteutuslomake.${tapa}.linkki`)}
            name={`${section}.linkki`}
          />
        </FlexItem>
        <FlexItem mb="20px">
          <Field
            component={FormFieldEditor}
            label={t(`toteutuslomake.${tapa}.lisatiedot`)}
            name={`${section}.lisatiedot`}
          />
        </FlexItem>
        <FlexItem mb="20px">
          <Field
            component={FormFieldEditor}
            label={t('toteutuslomake.lisatiedotValintaperusteista')}
            name={`${section}.lisatiedotValintaperusteista`}
          />
        </FlexItem>
        <FlexItem mb="20px">
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
        </FlexItem>
      </Flex>
    </StyledBlueBox>
  );
};

const HakeutumisTaiIlmoittautusmistapaFields = createFormFieldComponent(
  ({ hakuTapa, section, onChange, value }) => {
    const { t } = useTranslation();

    return hakuTapa ? (
      <Flex column>
        <StyledGrayRadio
          checked={value === 'muuHakulomake'}
          value="muuHakulomake"
          onChange={onChange}
        >
          {t('toteutuslomake.muuHakulomake')}
        </StyledGrayRadio>
        {value === 'muuHakulomake' && (
          <MuuHakulomakeBox tapa={hakuTapa} section={section} />
        )}
        <StyledGrayRadio
          checked={value === 'hakemuspalvelu'}
          value="hakemuspalvelu"
          onChange={onChange}
        >
          {t('toteutuslomake.hakemuspalvelu')}
        </StyledGrayRadio>
        <StyledGrayRadio
          checked={value === 'eiSahkoistaHakua'}
          value="eiSahkoistaHakua"
          onChange={onChange}
        >
          {t('toteutuslomake.eiSahkoistaHakua')}
        </StyledGrayRadio>
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
      <SegmentTab value="hakeutuminen" onClick={onChange}>
        {t('toteutuslomake.hakuTapa.hakeutuminen')}
      </SegmentTab>
      <SegmentTab value="ilmoittautuminen" onClick={onChange}>
        {t('toteutuslomake.hakuTapa.ilmoittautuminen')}
      </SegmentTab>
    </SegmentTabs>
  );
});

export const HakeutumisTaiIlmoittautumistapaSection = ({
  name = 'hakeutumisTaiIlmoittautumistapa',
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
          name={`${name}.ilmoittautumisTapa`}
          section={name}
          hakuTapa={hakuTapa}
        />
      </FlexItem>
    </Flex>
  );
};

export default HakeutumisTaiIlmoittautumistapaSection;
