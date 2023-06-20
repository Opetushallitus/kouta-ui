import React from 'react';

import { transparentize } from 'polished';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { Alert } from '#/src/components/Alert';
import {
  createFormFieldComponent,
  FormFieldEditor,
  FormFieldInput,
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
      mb={2}
      {...getTestIdProps(`${name}.hakukohteetKaytossa`)}
      width="200px"
    >
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
  );
});

export const HakeutumisTaiIlmoittautumistapaSection = ({
  name = 'hakeutumisTaiIlmoittautumistapa',
  language,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();
  const hakuTapa = useFieldValue(`${name}.hakuTapa`);

  const hakukohteidenKaytonVoiValita =
    KOULUTUSTYYPIT_WITH_HAKEUTUMIS_TAI_ILMOITTAUTUMISTAPA.includes(
      koulutustyyppi
    );

  const hakukohteetAinaKaytossaKoulutustyypille = !hakukohteidenKaytonVoiValita;

  const hakukohteetKaytossaValinta = useFieldValue(
    `${name}.hakukohteetKaytossa`
  );

  const showAloituspaikatJaHakeutumisTapaFields =
    hakukohteetKaytossaValinta === HakukohteetToteutuksella.EI_HAKUKOHTEITA;

  const showHakukohteetKaytossaInfobox =
    hakukohteetAinaKaytossaKoulutustyypille ||
    hakukohteetKaytossaValinta ===
      HakukohteetToteutuksella.HAKUKOHTEET_KAYTOSSA;

  return (
    <Box flexDirection="column">
      {hakukohteidenKaytonVoiValita && (
        <Box>
          <Field
            label={t('toteutuslomake.hakukohteetKaytossa')}
            component={HakukohdeKaytossaFields}
            name={name}
            required
          />
        </Box>
      )}
      {showHakukohteetKaytossaInfobox && (
        <Box mb={2}>
          <Alert status="info">
            {t('toteutuslomake.hakukohteetKaytossaInfo')}
          </Alert>
        </Box>
      )}
      <Box mb="30px">
        <Field
          label={t('toteutuslomake.valitseHakutapa')}
          component={HakutapaFormField}
          name={`${name}.hakuTapa`}
          required
        />
      </Box>
      {showAloituspaikatJaHakeutumisTapaFields && (
        <>
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
          <Box display="flex">
            <Box mr={2} {...getTestIdProps('aloituspaikat')}>
              <Field
                name={`${name}.aloituspaikat`}
                component={FormFieldInput}
                label={t('toteutuslomake.aloituspaikat')}
                type="number"
              />
            </Box>
            <Box {...getTestIdProps('aloituspaikkakuvaus')}>
              <Field
                name={`${name}.aloituspaikkakuvaus.${language}`}
                component={FormFieldEditor}
                label={t('toteutuslomake.aloituspaikkojenKuvaus')}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};
