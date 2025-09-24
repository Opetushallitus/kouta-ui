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
import { getTestIdProps } from '#/src/utils';
import {
  getFirstLanguageValue,
  getKielistettyOsoite,
} from '#/src/utils/languageUtils';

import { OrganisaatioModel } from '../types/domainTypes';

export const YhteystietoSection = ({ description, name, language }) => {
  const { t } = useTranslation();

  return (
    <Grid>
      {description && (
        <Cell style={{ marginTop: '24px' }} width={12}>
          {description}
        </Cell>
      )}
      <Cell style={{ marginTop: '24px' }} width={12}>
        <Field
          component={FormFieldInput}
          name={`${name}.nimi.${language}`}
          label={t('oppilaitoslomake.yhteystiedonNimi')}
        />
      </Cell>
      <Cell style={{ marginTop: '24px' }} width={12}>
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
          name={`${name}.postinumero.${language}`}
          label={t('yleiset.postinumero')}
        />
      </Cell>
      <Cell style={{ marginTop: '24px' }} width={12}>
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
          name={`${name}.kayntiosoitePostinumero.${language}`}
          label={t('yleiset.postinumero')}
        />
      </Cell>
      <Cell style={{ marginTop: '24px' }} width={12}>
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

export const YhteystiedotSection = ({
  language = 'fi',
  organisaatioOid,
  organisaatio,
}: {
  language: LanguageCode;
  organisaatioOid: string;
  organisaatio: OrganisaatioModel;
}) => {
  const { t } = useTranslation();

  const yhteystiedot = organisaatio?.yhteystiedot;
  const organisaationNimet = organisaatio?.nimi;

  const nimi = getFirstLanguageValue(organisaationNimet, language);

  const kayntiosoitePostinumeroKoodiUri =
    yhteystiedot?.kayntiosoite?.postinumeroKoodiUri?.[language] ||
    yhteystiedot?.kayntiosoite?.postinumeroKoodiUri?.['fi'];

  const { koodi: kayntiosoitePostinumeroKoodi } = useKoodi(
    kayntiosoitePostinumeroKoodiUri
  );

  const kayntiosoiteInSelectedLang = getKielistettyOsoite(
    yhteystiedot?.kayntiosoite,
    kayntiosoitePostinumeroKoodi,
    language
  );

  const postiosoitePostinumeroKoodiUri =
    yhteystiedot?.postiosoite?.postinumeroKoodiUri?.[language] ||
    yhteystiedot?.postiosoite?.postinumeroKoodiUri?.['fi'];
  const { koodi: postiosoitePostinumeroKoodi } = useKoodi(
    postiosoitePostinumeroKoodiUri
  );

  const postiosoiteInSelectedLang = getKielistettyOsoite(
    yhteystiedot?.postiosoite,
    postiosoitePostinumeroKoodi,
    language
  );

  const sahkopostiInSelectedLang = getFirstLanguageValue(
    yhteystiedot?.sahkoposti,
    language
  );

  const puhelinnumeroInSelectedLang = getFirstLanguageValue(
    yhteystiedot?.puhelinnumero,
    language
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
