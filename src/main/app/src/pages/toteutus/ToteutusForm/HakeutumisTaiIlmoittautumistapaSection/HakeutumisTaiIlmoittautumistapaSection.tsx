import React from 'react';

import { transparentize } from 'polished';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { Alert } from '#/src/components/Alert';
import { FieldGroup } from '#/src/components/FieldGroup';
import {
  createFormFieldComponent,
  FormFieldEditor,
  FormFieldIntegerInput,
} from '#/src/components/formFields';
import { SegmentTab } from '#/src/components/SegmentTab';
import { SegmentTabs } from '#/src/components/SegmentTabs';
import { Box, Radio } from '#/src/components/virkailija';
import { Hakeutumistapa } from '#/src/constants';
import { useFieldValue, useSetFieldValue } from '#/src/hooks/form';
import { getThemeProp } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';

import HakeutumisTaiIlmoittautusmistapaFields from './HakeutumisTaiIlmoittautumistapaFields';
import { HakukohteetKaytossaChoice } from './HakukohteetKaytossaChoice';

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

export const HakeutumisTaiIlmoittautumistapaSection = ({
  name = 'hakeutumisTaiIlmoittautumistapa',
  language,
  hasHakukohdeAttached,
}) => {
  const { t } = useTranslation();
  const hakuTapa = useFieldValue(`${name}.hakuTapa`);

  const hakukohteetKaytossaValinta = useFieldValue(
    `${name}.isHakukohteetKaytossa`
  );

  // aiemmin tallennettujen fallback:
  // jos toteutuksella on kiinnitettynä hakukohteita, asetetaan isHakukohteetKaytossa-valinta arvoon kyllä
  useSetFieldValue(
    `${name}.isHakukohteetKaytossa`,
    true,
    hakukohteetKaytossaValinta !== true && hasHakukohdeAttached
  );

  const showHakeutumisTapaFieldsJaAloituspaikat =
    hakukohteetKaytossaValinta === false;

  const showHakukohteetKaytossaInfobox = hakukohteetKaytossaValinta === true;

  return (
    <Box flexDirection="column">
      <Box mb={2} {...getTestIdProps(`${name}.isHakukohteetKaytossa`)}>
        <HakukohteetKaytossaChoice
          name={`${name}.isHakukohteetKaytossa`}
          disabled={hasHakukohdeAttached}
        />
      </Box>
      {showHakukohteetKaytossaInfobox && (
        <Box mb={2}>
          <Alert status="info">
            {hasHakukohdeAttached
              ? t('toteutuslomake.hakukohteetKaytossaJaLiitettynaInfo')
              : t('toteutuslomake.hakukohteetKaytossaInfo')}
          </Alert>
        </Box>
      )}
      {showHakeutumisTapaFieldsJaAloituspaikat && (
        <>
          <Box mb="30px">
            <Field
              label={t('toteutuslomake.valitseHakutapa')}
              component={HakutapaFormField}
              name={`${name}.hakuTapa`}
              required
            />
          </Box>
          <Box mb={2}>
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
          <FieldGroup title={t('toteutuslomake.aloituspaikkatiedot')}>
            <Box display="flex">
              <Box
                flexGrow={0}
                flexBasis="30%"
                {...getTestIdProps('aloituspaikat')}
              >
                <Field
                  name={`${name}.aloituspaikat`}
                  component={FormFieldIntegerInput}
                  min={0}
                  label={t('toteutuslomake.aloituspaikat')}
                  type="number"
                />
              </Box>
              <Box
                flexGrow={1}
                paddingLeft={4}
                {...getTestIdProps('aloituspaikkakuvaus')}
              >
                <Field
                  name={`${name}.aloituspaikkakuvaus.${language}`}
                  component={FormFieldEditor}
                  label={t('toteutuslomake.aloituspaikkojenKuvaus')}
                />
              </Box>
            </Box>
          </FieldGroup>
        </>
      )}
    </Box>
  );
};
