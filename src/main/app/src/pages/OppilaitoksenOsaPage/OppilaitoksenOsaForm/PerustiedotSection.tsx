import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import DividerHeading from '#/src/components/DividerHeading';
import { FormFieldInput } from '#/src/components/formFields';
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

const TiedotSection = ({ name, t, language }) => {
  return (
    <>
      <Typography as="div" mb={2}>
        {t('oppilaitoksenOsaLomake.perustiedotInfo')}
      </Typography>

      <Box m={-1} display="flex">
        <Box m={1} flexGrow="1" {...getTestIdProps('opiskelijoita')}>
          <Field
            component={FormFieldInput}
            name={`${name}.opiskelijoita`}
            type="number"
            label={t('oppilaitoslomake.opiskelijoita')}
          />
        </Box>
        <Box m={1} flexGrow="1" {...getTestIdProps('kampus')}>
          <Field
            component={FormFieldInput}
            name={`${name}.kampus.${language}`}
            label={t('oppilaitoksenOsaLomake.kampus')}
          />
        </Box>
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

const PerustiedotSection = ({ name, organisaatioOid, language }) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { t } = useTranslation();

  return (
    <>
      <OrganisaatioSection organisaatio={organisaatio} t={t} />
      <DividerHeading mt={4}>
        {t('oppilaitoslomake.syotaPerustiedot')}
      </DividerHeading>
      <TiedotSection name={name} t={t} language={language} />
    </>
  );
};

export default PerustiedotSection;
