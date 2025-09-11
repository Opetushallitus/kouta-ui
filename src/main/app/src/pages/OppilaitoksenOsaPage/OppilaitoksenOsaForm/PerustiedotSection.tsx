import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import { Grid, Cell } from 'styled-css-grid';

import {
  FormFieldInput,
  FormFieldSwitch,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import Heading from '#/src/components/Heading';
import { Box, Typography } from '#/src/components/virkailija';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useKoodiNimet from '#/src/hooks/useKoodiNimet';
import useKoodiNimi from '#/src/hooks/useKoodiNimi';
import { OrganisaatioModel } from '#/src/types/domainTypes';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

const InfoLabel = props => (
  <Box flexGrow={0} pr={2} flexBasis="30%" {...props} />
);

const InfoValue = props => <Box flexGrow={1} {...props} />;

const TiedotSection = ({ name, t, language }) => {
  const isOphVirkailija = useIsOphVirkailija();
  return (
    <>
      <Typography as="div" mb={2}>
        {t('oppilaitoksenOsaLomake.perustiedotInfo')}
      </Typography>

      <Box m={-1} display="flex">
        <Box m={1} flexGrow={1} {...getTestIdProps('opiskelijoita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.opiskelijoita`}
            type="number"
            label={t('oppilaitoslomake.opiskelijoita')}
          />
        </Box>
        <Box m={1} flexGrow={1} {...getTestIdProps('kampus')}>
          <Field
            component={FormFieldInput}
            name={`${name}.kampus.${language}`}
            label={t('oppilaitoksenOsaLomake.kampus')}
          />
        </Box>
      </Box>
      <Grid>
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
      <Box mt={3} mb={3}>
        <Field
          component={FormFieldSwitch}
          name={`${name}.jarjestaaUrheilijanAmmKoulutusta`}
          disabled={!isOphVirkailija}
        >
          {t('oppilaitoksenOsaLomake.jarjestaaUrheilijanAmmKoulutusta')}
        </Field>
      </Box>
    </>
  );
};

const OrganisaatioSection = ({ organisaatio, t, language }) => {
  const opetuskieletUris = organisaatio?.kieletUris ?? [];
  const paikkakuntaUri = organisaatio?.kotipaikkaUri;

  const nimi = getFirstLanguageValue(organisaatio?.nimi, language);

  const { nimet: opetuskielet } = useKoodiNimet(opetuskieletUris);
  const { nimi: paikkakunta } = useKoodiNimi(paikkakuntaUri);

  return (
    <>
      <Box display="flex" mb={2}>
        <InfoLabel>
          <Typography color="text.dark">
            {t('oppilaitoksenOsaLomake.oppilaitoksenOsanNimi')}:
          </Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{nimi}</Typography>
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

export const PerustiedotSection = ({
  name,
  language,
  organisaatio,
}: {
  language: LanguageCode;
  name: string;
  organisaatio?: OrganisaatioModel;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <OrganisaatioSection
        organisaatio={organisaatio}
        t={t}
        language={language}
      />
      <Heading hasDivider mt={4}>
        {t('oppilaitoslomake.syotaPerustiedot')}
      </Heading>
      <TiedotSection name={name} t={t} language={language} />
    </>
  );
};
