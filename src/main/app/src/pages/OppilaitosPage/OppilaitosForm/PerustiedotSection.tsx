import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import DividerHeading from '#/src/components/DividerHeading';
import { FormFieldInput, FormFieldUrlInput } from '#/src/components/formFields';
import GridColumn from '#/src/components/GridColumn';
import GridRow from '#/src/components/GridRow';
import LogoSection from '#/src/components/LogoSection';
import { Box, Typography } from '#/src/components/virkailija';
import useKoodiNimet from '#/src/hooks/useKoodiNimet';
import useKoodiNimi from '#/src/hooks/useKoodiNimi';
import { useOrganisaatio } from '#/src/hooks/useOrganisaatio';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

const InfoLabel = props => (
  <Box flexGrow={0} pr={2} flexBasis="30%" {...props} />
);

const InfoValue = props => <Box flexGrow={1} {...props} />;

const TiedotSection = ({ language, name, t }) => {
  return (
    <>
      <Typography as="div" mb={2}>
        {t('oppilaitoslomake.perustiedotInfo')}
      </Typography>

      <GridRow gutter={2}>
        <GridColumn md={4} {...getTestIdProps('opiskelijoita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.opiskelijoita`}
            type="number"
            label={t('oppilaitoslomake.opiskelijoita')}
          />
        </GridColumn>
        <GridColumn md={4} {...getTestIdProps('korkeakouluja')}>
          <Field
            component={FormFieldInput}
            name={`${name}.korkeakouluja`}
            type="number"
            label={t('oppilaitoslomake.korkeakouluja')}
          />
        </GridColumn>
        <GridColumn md={4} {...getTestIdProps('tiedekuntia')}>
          <Field
            component={FormFieldInput}
            name={`${name}.tiedekuntia`}
            type="number"
            label={t('oppilaitoslomake.tiedekuntia')}
          />
        </GridColumn>
        <GridColumn md={4} {...getTestIdProps('kampuksia')}>
          <Field
            component={FormFieldInput}
            name={`${name}.kampuksia`}
            type="number"
            label={t('oppilaitoslomake.kampuksia')}
          />
        </GridColumn>
        <GridColumn md={4} {...getTestIdProps('yksikoita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.yksikoita`}
            type="number"
            label={t('oppilaitoslomake.yksikoita')}
          />
        </GridColumn>
        <GridColumn md={4} {...getTestIdProps('toimipisteita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.toimipisteita`}
            type="number"
            label={t('oppilaitoslomake.toimipisteita')}
          />
        </GridColumn>
        <GridColumn md={4} {...getTestIdProps('akatemioita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.akatemioita`}
            type="number"
            label={t('oppilaitoslomake.akatemioita')}
          />
        </GridColumn>
      </GridRow>
      <GridRow gutter={2}>
        <GridColumn md={6}>
          <Field
            component={FormFieldUrlInput}
            name={`${name}.wwwSivuUrl.${language}`}
            label={t('oppilaitoslomake.wwwSivu')}
          />
        </GridColumn>
        <GridColumn md={6}>
          <Field
            component={FormFieldInput}
            name={`${name}.wwwSivuNimi.${language}`}
            label={t('oppilaitoslomake.wwwSivuNimi')}
          />
        </GridColumn>
      </GridRow>
      <GridRow gutter={2}>
        <GridColumn md={12} {...getTestIdProps('logo')}>
          <LogoSection
            name={`${name}.logo`}
            label={t('oppilaitoslomake.logo')}
          />
        </GridColumn>
      </GridRow>
    </>
  );
};

const OrganisaatioSection = ({ language, organisaatio, t }) => {
  const opetuskieletUris = _.get(organisaatio, 'kieletUris') || [];
  const paikkakuntaUri = _.get(organisaatio, 'kotipaikkaUri');
  const oppilaitostyyppiUri = _.get(organisaatio, 'oppilaitosTyyppiUri');
  const nimi = getFirstLanguageValue(_.get(organisaatio, 'nimi'), language);

  const { nimet: opetuskielet } = useKoodiNimet(opetuskieletUris);
  const { nimi: paikkakunta } = useKoodiNimi(paikkakuntaUri);
  const { nimi: oppilaitostyyppi } = useKoodiNimi(oppilaitostyyppiUri);

  return (
    <>
      <Box display="flex" mb={2}>
        <InfoLabel>
          <Typography color="text.dark">
            {t('oppilaitoslomake.oppilaitoksenNimi')}:
          </Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{nimi}</Typography>
        </InfoValue>
      </Box>
      <Box display="flex" mb={2}>
        <InfoLabel>
          <Typography color="text.dark">
            {t('oppilaitoslomake.tyyppi')}:
          </Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{oppilaitostyyppi}</Typography>
        </InfoValue>
      </Box>
      <Box display="flex" mb={2}>
        <InfoLabel>
          <Typography color="text.dark">
            {t('oppilaitoslomake.paikkakunta')}:
          </Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{paikkakunta}</Typography>
        </InfoValue>
      </Box>
      <Box display="flex">
        <InfoLabel>
          <Typography color="text.dark">
            {t('oppilaitoslomake.opetuskielet')}:
          </Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{opetuskielet.filter(k => !!k).join(', ')}</Typography>
        </InfoValue>
      </Box>
    </>
  );
};

const PerustiedotSection = ({ name, organisaatioOid }) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { t } = useTranslation();
  const language = useLanguage();

  return (
    <>
      <OrganisaatioSection
        organisaatio={organisaatio}
        language={language}
        t={t}
      />
      <DividerHeading mt={4}>
        {t('oppilaitoslomake.syotaPerustiedot')}
      </DividerHeading>
      <TiedotSection name={name} t={t} language={language} />
    </>
  );
};

export default PerustiedotSection;
