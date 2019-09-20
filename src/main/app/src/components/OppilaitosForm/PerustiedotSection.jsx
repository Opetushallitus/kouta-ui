import React from 'react';
import get from 'lodash/get';
import { Field } from 'redux-form';

import { useOrganisaatio } from '../useOrganisaatio';
import useLanguage from '../useLanguage';
import useKoodiNimi from '../useKoodiNimi';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import Typography from '../Typography';
import Box from '../Box';
import DividerHeading from '../DividerHeading';
import { FormFieldInput } from '../formFields';
import GridRow from '../GridRow';
import GridColumn from '../GridColumn';
import useKoodiNimet from '../useKoodiNimet';
import { getTestIdProps } from '../../utils';

const InfoLabel = props => (
  <Box flexGrow={0} pr={2} flexBasis="30%" {...props} />
);

const InfoValue = props => <Box flexGrow={1} {...props} />;

const TiedotSection = ({ name, t }) => {
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
    </>
  );
};

const OrganisaatioSection = ({ organisaatio, t }) => {
  const language = useLanguage();
  const opetuskieletUris = get(organisaatio, 'kieletUris') || [];
  const paikkakuntaUri = get(organisaatio, 'kotipaikkaUri');
  const oppilaitostyyppiUri = get(organisaatio, 'oppilaitosTyyppiUri');
  const nimi = getFirstLanguageValue(get(organisaatio, 'nimi'), language);

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
