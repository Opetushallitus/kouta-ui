import React from 'react';

import { transparentize } from 'polished';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { Alert } from '#/src/components/Alert';
import {
  createFormFieldComponent,
  FormFieldRadioGroup,
} from '#/src/components/formFields';
import SegmentTab from '#/src/components/SegmentTab';
import SegmentTabs from '#/src/components/SegmentTabs';
import { Box, Radio } from '#/src/components/virkailija';
import { Hakeutumistapa, HakukohteetToteutuksella } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { getThemeProp } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';

import { KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA } from '../ToteutusForm';
import HakeutumisTaiIlmoittautusmistapaFields from './HakeutumisTaiIlmoittautumistapaFields';

export const StyledGrayRadio = styled(Radio)`
  background-color: ${getThemeProp('colors.grayLighten6', transparentize(0.5))};
  padding: 19px 10px;
  margin-bottom: 10px;
`;

export const StyledBlueBox = styled(Box)`
  background-color: ${getThemeProp('colors.blueLighten4', transparentize(0.7))};
  padding: 30px;
  margin-bottom: 20px;
`;

const ValitseHakutapa = ({ hakuTapa, language, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box mb="30px">
        <Field
          label={t('toteutuslomake.valitseHakutapa')}
          component={HakutapaFormField}
          name={`${name}.hakuTapa`}
          required
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
            required
          />
        )}
      </Box>
    </>
  );
};

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

export const HakukohdeKaytossaFields = createFormFieldComponent(({ name }) => {
  const { t } = useTranslation();

  return (
    <Box
      marginTop={1}
      {...getTestIdProps('toteutuslomake.hakukohdeKaytossa')}
      width="200px"
    >
      <Box mt={1}>
        <Field
          name={`${name}.hakukohteetKaytossa`}
          component={FormFieldRadioGroup}
          options={[
            {
              label: t('yleiset.kylla'),
              value: HakukohteetToteutuksella.HAKUKOHTEET_KAYTOSSA,
            },
            {
              label: t('yleiset.ei'),
              value: HakukohteetToteutuksella.EI_HAKUKOHTEITA,
            },
          ]}
        />
      </Box>
    </Box>
  );
});

export const HakeutumisTaiIlmoittautumistapaSection = ({
  name = 'hakeutumisTaiIlmoittautumistapa',
  language,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();
  const hakuTapa = useFieldValue(`${name}.hakuTapa`);

  const hakukohteetKaytossaKoulutustyypille =
    !KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA.includes(
      koulutustyyppi
    );

  const hakukohteetKaytossaValinta = useFieldValue<HakukohteetToteutuksella>(
    `${name}.hakukohteetKaytossa`
  );

  const HakukohteetKaytossaInfoBox = () => {
    return (
      <Box>
        <Alert status="info">
          {t('toteutuslomake.hakukohteetKaytossaInfo')}
        </Alert>
      </Box>
    );
  };

  return (
    <Box flexDirection="column">
      {hakukohteetKaytossaKoulutustyypille ? (
        <HakukohteetKaytossaInfoBox />
      ) : (
        <>
          <Box mb="30px">
            <Field
              label={t('toteutuslomake.hakukohteetKaytossa')}
              component={HakukohdeKaytossaFields}
              name={`${name}.hakukohteetKaytossa`}
              required
            />
          </Box>
          {hakukohteetKaytossaValinta ===
          HakukohteetToteutuksella.EI_HAKUKOHTEITA ? (
            <ValitseHakutapa
              hakuTapa={hakuTapa}
              language={language}
              name={name}
            />
          ) : (
            <>
              <div>{hakukohteetKaytossaValinta}</div>
              <HakukohteetKaytossaInfoBox />
            </>
          )}
        </>
      )}
    </Box>
  );
};
