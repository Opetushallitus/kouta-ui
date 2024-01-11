import React from 'react';

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import { Grid, Cell } from 'styled-css-grid';

import {
  FormFieldInput,
  FormFieldSwitch,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import Heading from '#/src/components/Heading';
import LogoSection from '#/src/components/LogoSection';
import { SomeFields } from '#/src/components/SomeFields';
import { Box, Typography } from '#/src/components/virkailija';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useKoodiNimet from '#/src/hooks/useKoodiNimet';
import useKoodiNimi from '#/src/hooks/useKoodiNimi';
import { Organisaatio } from '#/src/types/domainTypes';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

const InfoLabel = props => (
  <Box flexGrow={0} pr={2} flexBasis="30%" {...props} />
);

const InfoValue = props => <Box flexGrow={1} {...props} />;

type TiedotSectionProps = {
  language: LanguageCode;
  name: string;
  t: TFunction;
};

const TiedotSection = ({ language, name, t }: TiedotSectionProps) => {
  const isOphVirkailija = useIsOphVirkailija();
  return (
    <>
      <Typography as="div" mb={2}>
        {t('oppilaitoslomake.perustiedotInfo')}
      </Typography>

      <Grid style={{ marginBottom: '12px' }}>
        <Cell width={4} {...getTestIdProps('opiskelijoita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.opiskelijoita`}
            type="number"
            label={t('oppilaitoslomake.opiskelijoita')}
          />
        </Cell>
        <Cell width={4} {...getTestIdProps('korkeakouluja')}>
          <Field
            component={FormFieldInput}
            name={`${name}.korkeakouluja`}
            type="number"
            label={t('oppilaitoslomake.korkeakouluja')}
          />
        </Cell>
        <Cell width={4} {...getTestIdProps('tiedekuntia')}>
          <Field
            component={FormFieldInput}
            name={`${name}.tiedekuntia`}
            type="number"
            label={t('oppilaitoslomake.tiedekuntia')}
          />
        </Cell>
        <Cell width={4} {...getTestIdProps('kampuksia')}>
          <Field
            component={FormFieldInput}
            name={`${name}.kampuksia`}
            type="number"
            label={t('oppilaitoslomake.kampuksia')}
          />
        </Cell>
        <Cell width={4} {...getTestIdProps('yksikoita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.yksikoita`}
            type="number"
            label={t('oppilaitoslomake.yksikoita')}
          />
        </Cell>
        <Cell width={4} {...getTestIdProps('toimipisteita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.toimipisteita`}
            type="number"
            label={t('oppilaitoslomake.toimipisteita')}
          />
        </Cell>
        <Cell width={4} {...getTestIdProps('akatemioita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.akatemioita`}
            type="number"
            label={t('oppilaitoslomake.akatemioita')}
          />
        </Cell>
      </Grid>
      <Grid style={{ marginBottom: '12px' }}>
        <Cell width={6}>
          <Field
            component={FormFieldUrlInput}
            name={`${name}.wwwSivuUrl.${language}`}
            label={t('oppilaitoslomake.wwwSivu')}
            required
          />
        </Cell>
        <Cell width={6}>
          <Field
            component={FormFieldInput}
            name={`${name}.wwwSivuNimi.${language}`}
            label={t('oppilaitoslomake.wwwSivuNimi')}
          />
        </Cell>
      </Grid>
      <Grid>
        <Cell width={12} {...getTestIdProps('somefields')}>
          <SomeFields name={name} />
        </Cell>
      </Grid>
      <Grid>
        <Cell width={12} {...getTestIdProps('logo')}>
          <LogoSection
            name={`${name}.logo`}
            label={t('oppilaitoslomake.logo')}
          />
        </Cell>
      </Grid>
      <Box mt={3} mb={3}>
        <Field
          component={FormFieldSwitch}
          name={`${name}.jarjestaaUrheilijanAmmKoulutusta`}
          disabled={!isOphVirkailija}
        >
          {t('oppilaitoslomake.jarjestaaUrheilijanAmmKoulutusta')}
        </Field>
      </Box>
    </>
  );
};

const OrganisaatioSection = ({
  language,
  organisaatio,
  t,
}: {
  language: LanguageCode;
  organisaatio?: Organisaatio;
  t: TFunction;
}) => {
  const opetuskieletUris = organisaatio?.kieletUris || [];
  const paikkakuntaUri = organisaatio?.kotipaikkaUri;
  const oppilaitostyyppiUri = organisaatio?.oppilaitostyyppiUri;
  const nimi = getFirstLanguageValue(organisaatio?.nimi, language);

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
          <Typography>{opetuskielet.filter(Boolean).join(', ')}</Typography>
        </InfoValue>
      </Box>
    </>
  );
};

export const PerustiedotSection = ({ language, name, oppilaitos }) => {
  const organisaatio = oppilaitos?._enrichedData?.organisaatio;
  const { t } = useTranslation();

  return (
    <>
      <OrganisaatioSection
        organisaatio={organisaatio}
        language={language}
        t={t}
      />
      <Heading mt={4}>{t('oppilaitoslomake.syotaPerustiedot')}</Heading>
      <TiedotSection name={name} t={t} language={language} />
    </>
  );
};
