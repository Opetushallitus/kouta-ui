import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import { Grid, Cell } from 'styled-css-grid';

import {
  FormFieldInput,
  FormFieldPostinumeroSelect,
} from '#/src/components/formFields';
import { Box, Divider, Typography } from '#/src/components/virkailija';
import { YhteystiedotMuokkausButton } from '#/src/components/YhteystiedotMuokkausButton';
import useKoodi from '#/src/hooks/useKoodi';
import useKoodiNimi from '#/src/hooks/useKoodiNimi';
import { useOrganisaatio } from '#/src/hooks/useOrganisaatio';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

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
  <Box flexGrow={0} pr={2} flexBasis="30%" id={props.id} {...props} />
);

const InfoValue = props => <Box flexGrow={1} {...props} />;

const Yhteystieto = ({ label, value, id }) => (
  <Box display="flex" mb={2}>
    <InfoLabel id={id}>
      <Typography color="text.dark">{label}:</Typography>
    </InfoLabel>
    <InfoValue aria-labelledby={id}>
      <Typography>{value}</Typography>
    </InfoValue>
  </Box>
);

const getValueForSelectedLang = (lang, valueObject) => {
  return valueObject?.[lang];
};

const OsoiteForSelectedLang = (lang, osoiteObject) => {
  const postinumeroKoodiUri = getValueForSelectedLang(
    lang,
    osoiteObject?.postinumeroKoodiUri
  );
  const postitoimipaikka = useKoodiNimi(postinumeroKoodiUri, lang)?.nimi;
  const postinumero = useKoodi(postinumeroKoodiUri)?.koodi?.koodiArvo;
  const osoite = getValueForSelectedLang(lang, osoiteObject?.osoite);
  return [osoite, postinumero, postitoimipaikka].filter(Boolean).join(', ');
};

export const YhteystiedotSection = ({ language = 'fi', organisaatioOid }) => {
  const { t } = useTranslation();

  const { organisaatio } = useOrganisaatio(organisaatioOid);

  const nimi = getFirstLanguageValue(organisaatio?.nimi, language);

  const yhteystiedot = organisaatio?.yhteystiedot;

  const kayntiosoiteInSelectedLang = OsoiteForSelectedLang(
    language,
    yhteystiedot?.kayntiosoite
  );
  const postiosoiteInSelectedLang = OsoiteForSelectedLang(
    language,
    yhteystiedot?.postiosoite
  );
  const sahkopostiInSelectedLang = getValueForSelectedLang(
    language,
    yhteystiedot?.sahkoposti
  );
  const puhelinnumeroInSelectedLang = getValueForSelectedLang(
    language,
    yhteystiedot?.puhelinnumero
  );
  return (
    <>
      <Yhteystieto
        label={t('oppilaitoslomake.yhteystiedonNimi')}
        value={nimi}
        id="organisaationNimi"
      />
      <Yhteystieto
        label={t('yleiset.postiosoite')}
        value={postiosoiteInSelectedLang}
        id="postiosoite"
      />
      <Yhteystieto
        label={t('yleiset.kayntiosoite')}
        value={kayntiosoiteInSelectedLang}
        id="kayntiosoite"
      />
      <Yhteystieto
        label={t('yleiset.sahkoposti')}
        value={sahkopostiInSelectedLang}
        id="sahkoposti"
      />
      <Yhteystieto
        label={t('yleiset.puhelinnumero')}
        value={puhelinnumeroInSelectedLang}
        id="puhelinnumero"
      />
      <YhteystiedotMuokkausButton organisaatioOid={organisaatioOid} />
    </>
  );
};
