import React from 'react';

import _ from 'lodash';
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
import { useOrganisaatio } from '#/src/hooks/useOrganisaatio';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
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

const OrganisaatioSection = ({ organisaatio, t }) => {
  const language = useUserLanguage();
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

export const PerustiedotSection = ({ name, organisaatioOid, language }) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { t } = useTranslation();

  return (
    <>
      <OrganisaatioSection organisaatio={organisaatio} t={t} />
      <Heading hasDivider mt={4}>
        {t('oppilaitoslomake.syotaPerustiedot')}
      </Heading>
      <TiedotSection name={name} t={t} language={language} />
    </>
  );
};
