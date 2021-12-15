import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import { Grid, Cell } from 'styled-css-grid';

import {
  FormFieldInput,
  FormFieldPostinumeroSelect,
} from '#/src/components/formFields';
import { Box, Divider, Typography } from '#/src/components/virkailija';
import { useOrganisaatio } from '#/src/hooks/useOrganisaatio';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import getOrganisaatioContactInfo from '#/src/utils/organisaatio/getOrganisaatioContactInfo';

export const YhteystietoSection = ({ description, name, language }) => {
  const { t } = useTranslation();

  return (
    <Grid>
      {description && (
        <Cell css={'margin-top: 24px'} width={12}>
          {description}
        </Cell>
      )}
      <Cell css={'margin-top: 24px'} width={12}>
        <Field
          required
          component={FormFieldInput}
          name={`${name}.nimi.${language}`}
          label={t('oppilaitoslomake.yhteystiedonNimi')}
        />
      </Cell>
      <Cell css={'margin-top: 24px'} width={12}>
        {t('yleiset.postiosoite')}
      </Cell>
      <Cell width={12}>
        <Divider margin={1} />
      </Cell>
      <Cell width={6}>
        <Field
          component={FormFieldInput}
          name={`${name}.postiosoite.${language}`}
          label={t('yleiset.postiosoite')}
        />
      </Cell>
      <Cell width={6} {...getTestIdProps('postinumero')}>
        <Field
          component={FormFieldPostinumeroSelect}
          name={`${name}.postinumero`}
          label={t('yleiset.postinumero')}
        />
      </Cell>
      <Cell css={'margin-top: 24px'} width={12}>
        {t('yleiset.kayntiosoite')}
      </Cell>
      <Cell width={12}>
        <Divider margin={1} />
      </Cell>
      <Cell width={6}>
        <Field
          component={FormFieldInput}
          name={`${name}.kayntiosoite.${language}`}
          label={t('yleiset.kayntiosoite')}
        />
      </Cell>
      <Cell width={6} {...getTestIdProps('kayntiosoitePostinumero')}>
        <Field
          component={FormFieldPostinumeroSelect}
          name={`${name}.kayntiosoitePostinumero`}
          label={t('yleiset.postinumero')}
        />
      </Cell>
      <Cell css={'margin-top: 24px'} width={12}>
        {t('oppilaitoslomake.muutYhteystiedot')}
      </Cell>
      <Cell width={12}>
        <Divider margin={1} />
      </Cell>
      <Cell width={6}>
        <Field
          component={FormFieldInput}
          name={`${name}.sahkoposti.${language}`}
          label={t('yleiset.sahkoposti')}
        />
      </Cell>
      <Cell width={6}>
        <Field
          component={FormFieldInput}
          name={`${name}.puhelinnumero.${language}`}
          label={t('yleiset.puhelinnumero')}
        />
      </Cell>
    </Grid>
  );
};

const InfoLabel = props => (
  <Box flexGrow={0} pr={2} flexBasis="30%" {...props} />
);

const InfoValue = props => <Box flexGrow={1} {...props} />;

export const YhteystiedotSection = ({ language = 'fi', organisaatioOid }) => {
  const { t } = useTranslation();
  const { organisaatio } = useOrganisaatio(organisaatioOid);

  const nimi = getFirstLanguageValue(_.get(organisaatio, 'nimi'), language);
  const contactInfo = getOrganisaatioContactInfo(organisaatio);

  const {
    osoite: postiosoite,
    postinumero,
    postitoimipaikka,
  } = contactInfo?.posti;

  const {
    osoite: kayntiosoite,
    postinumero: kayntipostinumero,
    postitoimipaikka: kayntipostitoimipaikka,
  } = contactInfo?.kaynti;

  const kayntiosoiteInSelectedLang = getFirstLanguageValue(
    kayntiosoite,
    language
  );
  const kayntipostitoimipaikkaInSelectedLang = getFirstLanguageValue(
    kayntipostitoimipaikka,
    language
  );

  const osoiteInSelectedLang = getFirstLanguageValue(postiosoite, language);
  const postitoimipaikkaInSelectedLang = getFirstLanguageValue(
    postitoimipaikka,
    language
  );

  const postiosoiteStr = `${osoiteInSelectedLang}, ${postinumero} ${postitoimipaikkaInSelectedLang}`;
  let kayntiosoiteStr;
  if (
    kayntiosoiteInSelectedLang &&
    kayntipostinumero &&
    kayntipostitoimipaikkaInSelectedLang
  ) {
    kayntiosoiteStr = `${kayntiosoiteInSelectedLang}, ${kayntipostinumero} ${kayntipostitoimipaikkaInSelectedLang}`;
  }

  return (
    <>
      <Box display="flex" mb={2}>
        <InfoLabel>
          <Typography color="text.dark">
            {t('oppilaitoslomake.yhteystiedonNimi')}:
          </Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{nimi}</Typography>
        </InfoValue>
      </Box>
      <Box display="flex" mb={2}>
        <InfoLabel>
          <Typography color="text.dark">{t('yleiset.postiosoite')}:</Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{postiosoiteStr}</Typography>
        </InfoValue>
      </Box>
      <Box display="flex" mb={2}>
        <InfoLabel>
          <Typography color="text.dark">
            {t('yleiset.kayntiosoite')}:
          </Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{kayntiosoiteStr}</Typography>
        </InfoValue>
      </Box>
      <Box display="flex" mb={2}>
        <InfoLabel>
          <Typography color="text.dark">{t('yleiset.sahkoposti')}:</Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{contactInfo?.sahkoposti}</Typography>
        </InfoValue>
      </Box>
      <Box display="flex" mb={2}>
        <InfoLabel>
          <Typography color="text.dark">
            {t('yleiset.puhelinnumero')}:
          </Typography>
        </InfoLabel>
        <InfoValue>
          <Typography>{contactInfo?.puhelinnumero}</Typography>
        </InfoValue>
      </Box>
    </>
  );
};
