import React, { useMemo } from 'react';
import get from 'lodash/get';
import { Field } from 'redux-form';

import { useOrganisaatio } from '../useOrganisaatio';
import useKoodisto from '../useKoodisto';
import parseKoodiUri from '../../utils/parseKoodiUri';
import useLanguage from '../useLanguage';
import getKoodiNimiTranslation from '../../utils/getKoodiNimiTranslation';
import useKoodiNimi from '../useKoodiNimi';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import Typography from '../Typography';
import Box from '../Box';
import DividerHeading from '../DividerHeading';
import { FormFieldInput } from '../FormFields';
import GridRow from '../GridRow';
import GridColumn from '../GridColumn';

const InfoLabel = props => (
  <Box flexGrow={0} pr={2} flexBasis="30%" {...props} />
);

const InfoValue = props => <Box flexGrow={1} {...props} />;

const useOpetuskielet = koodiUris => {
  const { koodisto, versio } = parseKoodiUri(koodiUris[0]);
  const language = useLanguage();

  const { data, ...rest } = useKoodisto({ koodisto, versio });

  const nimet = useMemo(() => {
    return data
      ? koodiUris
          .map(uri => {
            const { koodi } = parseKoodiUri(uri);
            const koodiMatch = data.find(({ koodiUri }) => koodiUri === koodi);

            return koodiMatch
              ? getKoodiNimiTranslation(koodiMatch, language)
              : undefined;
          })
          .filter(k => !!k)
      : [];
  }, [koodiUris, data, language]);

  return { opetuskielet: nimet, ...rest };
};

const TiedotSection = ({ name, t }) => {
  return (
    <>
      <Typography as="div" mb={2}>
        {t('oppilaitoslomake.perustiedotInfo')}
      </Typography>

      <GridRow gutter={2}>
        <GridColumn md={4}>
          <Field
            component={FormFieldInput}
            name={`${name}.numOpiskelijoita`}
            type="number"
            label={t('oppilaitoslomake.opiskelijoita')}
          />
        </GridColumn>
        <GridColumn md={4}>
          <Field
            component={FormFieldInput}
            name={`${name}.numKorkeakouluja`}
            type="number"
            label={t('oppilaitoslomake.korkeakouluja')}
          />
        </GridColumn>
        <GridColumn md={4}>
          <Field
            component={FormFieldInput}
            name={`${name}.numTiedekuntia`}
            type="number"
            label={t('oppilaitoslomake.tiedekuntia')}
          />
        </GridColumn>
        <GridColumn md={4}>
          <Field
            component={FormFieldInput}
            name={`${name}.numKampuksia`}
            type="number"
            label={t('oppilaitoslomake.kampuksia')}
          />
        </GridColumn>
        <GridColumn md={4}>
          <Field
            component={FormFieldInput}
            name={`${name}.numYksikoita`}
            type="number"
            label={t('oppilaitoslomake.yksikoita')}
          />
        </GridColumn>
        <GridColumn md={4}>
          <Field
            component={FormFieldInput}
            name={`${name}.numToimipisteita`}
            type="number"
            label={t('oppilaitoslomake.toimipisteita')}
          />
        </GridColumn>
        <GridColumn md={4}>
          <Field
            component={FormFieldInput}
            name={`${name}.numAkatemioita`}
            type="number"
            label={t('oppilaitoslomake.akatemioita')}
          />
        </GridColumn>
      </GridRow>
    </>
  );
};

const OrganisaatioSection = ({ organisaatio, t }) => {
  const language = useLanguage();
  const opetuskieletUris = get(organisaatio, 'kieletUris') || [];
  const paikkakuntaUri = get(organisaatio, 'kotipaikkaUri');
  const oppilaitostyyppiUri = get(organisaatio, 'oppilaitosTyyppiUri');
  const nimi = getFirstLanguageValue(get(organisaatio, 'nimi'), language);

  const { opetuskielet } = useOpetuskielet(opetuskieletUris);
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
          <Typography>{opetuskielet.join(', ')}</Typography>
        </InfoValue>
      </Box>
    </>
  );
};

const PerustiedotSection = ({ name, organisaatioOid }) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { t } = useTranslation();

  return (
    <>
      <OrganisaatioSection organisaatio={organisaatio} t={t} />
      <DividerHeading mt={4}>
        {t('oppilaitoslomake.syotaPerustiedot')}
      </DividerHeading>
      <TiedotSection name={name} t={t} />
    </>
  );
};

export default PerustiedotSection;
