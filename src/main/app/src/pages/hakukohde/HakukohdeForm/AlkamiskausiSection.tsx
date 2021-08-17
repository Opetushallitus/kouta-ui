import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import { FormFieldSwitch } from '#/src/components/formFields';
import { InlineInfoBox } from '#/src/components/InlineInfoBox';
import { KoulutuksenAloitusajankohtaFields } from '#/src/components/KoulutuksenAloitusajankohtaFields';
import { Box } from '#/src/components/virkailija';
import { Alkamiskausityyppi, ICONS } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useKoodiNimi from '#/src/hooks/useKoodiNimi';
import { formatDateRange } from '#/src/utils';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

const InlineAjankohtaInfoBox = ({
  ajankohta = {},
  foundTitle,
  notFoundTitle,
  iconType,
}) => {
  const { t } = useTranslation();
  const {
    alkamiskausityyppi,
    koulutuksenAlkamiskausiKoodiUri,
    koulutuksenAlkamisvuosi,
    koulutuksenAlkamispaivamaara,
    koulutuksenPaattymispaivamaara,
  } = ajankohta as any;

  const { nimi: kausiKoodiNimi } = useKoodiNimi(
    koulutuksenAlkamiskausiKoodiUri
  );

  if (
    alkamiskausityyppi === Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI &&
    koulutuksenAlkamiskausiKoodiUri &&
    koulutuksenAlkamisvuosi
  ) {
    return (
      <InlineInfoBox
        title={`${foundTitle}:`}
        value={
          <>
            {kausiKoodiNimi} {koulutuksenAlkamisvuosi}
          </>
        }
        iconType={iconType}
      />
    );
  } else if (
    alkamiskausityyppi === Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA &&
    koulutuksenAlkamispaivamaara
  ) {
    return (
      <InlineInfoBox
        title={`${foundTitle}:`}
        value={
          <>
            {formatDateRange(
              koulutuksenAlkamispaivamaara,
              koulutuksenPaattymispaivamaara
            )}
          </>
        }
        iconType={iconType}
      />
    );
  } else if (
    alkamiskausityyppi === Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA
  ) {
    return (
      <InlineInfoBox
        title={`${foundTitle}:`}
        value={t('yleiset.aloitusHenkilokohtaisenSuunnitelmanMukaisesti')}
        iconType={iconType}
      />
    );
  } else {
    return <InlineInfoBox title={notFoundTitle} iconType={iconType} />;
  }
};

export const AlkamiskausiSection = ({ name, toteutus, haku, language }) => {
  const { t } = useTranslation();
  const kaytetaanHakukohteenAlkamiskautta = useFieldValue(
    `${name}.kaytetaanHakukohteenAlkamiskautta`
  );

  const toteutuksenAjankohta =
    toteutus?.metadata?.opetus?.koulutuksenAlkamiskausi;

  const haunAjankohta = haku?.metadata?.koulutuksenAlkamiskausi;

  const isYhteishaku = isYhteishakuHakutapa(haku?.hakutapaKoodiUri);

  return (
    <FieldGroup title={t('yleiset.koulutuksenAjankohta')}>
      <Box marginBottom={2}>
        <InlineAjankohtaInfoBox
          ajankohta={toteutuksenAjankohta}
          foundTitle={t('hakukohdelomake.toteutukseenLiitettyAlkamisajankohta')}
          notFoundTitle={t(
            'hakukohdelomake.toteutukseenEiOleLiitettyAlkamiskautta'
          )}
          iconType={ICONS.toteutus}
        />
        <InlineAjankohtaInfoBox
          ajankohta={haunAjankohta}
          foundTitle={t('hakukohdelomake.hakuunLiitettyAlkamisajankohta')}
          notFoundTitle={t('hakukohdelomake.hakuunEiOleLiitettyAlkamiskautta')}
          iconType={ICONS.haku}
        />
      </Box>
      <Field
        name={`${name}.kaytetaanHakukohteenAlkamiskautta`}
        component={FormFieldSwitch}
        disabled={isYhteishaku}
        helperText={
          isYhteishaku
            ? t('hakukohdelomake.eiVoiAsettaaAjankohtaaJosYhteishaku')
            : null
        }
      >
        {t('hakukohdelomake.hakukohteellaEriAlkamiskausi')}
      </Field>
      {!isYhteishaku && kaytetaanHakukohteenAlkamiskautta && (
        <KoulutuksenAloitusajankohtaFields
          name={`${name}.ajankohtaTyyppi`}
          section={name}
          language={language}
        />
      )}
    </FieldGroup>
  );
};
