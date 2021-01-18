import React from 'react';
import _fp from 'lodash/fp';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import Spacing from '#/src/components/Spacing';
import { FormFieldSwitch } from '#/src/components/formFields';
import useKoodiNimi from '#/src/hooks/useKoodiNimi';
import { useFieldValue } from '#/src/hooks/form';
import { Alkamiskausityyppi, ICONS } from '#/src/constants';
import { KoulutuksenAloitusajankohtaFields } from '#/src/components/KoulutuksenAloitusajankohtaFields';
import FieldGroup from '#/src/components/FieldGroup';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';
import { InlineInfoBox } from '#/src/components/InlineInfoBox';
import { formatDateValue } from '#/src/utils';

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
            {formatDateValue(koulutuksenAlkamispaivamaara)}
            {' - '}
            {formatDateValue(koulutuksenPaattymispaivamaara)}
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
        value={t('hakulomake.aloitusHenkilokohtaisenSuunnitelmanMukaisesti')}
        iconType={iconType}
      />
    );
  } else {
    return <InlineInfoBox title={notFoundTitle} iconType={iconType} />;
  }
};

const AlkamiskausiSection = ({ name, toteutus, haku, language }) => {
  const { t } = useTranslation();
  const kaytetaanHakukohteenAlkamiskautta = useFieldValue(
    `${name}.kaytetaanHakukohteenAlkamiskautta`
  );

  const toteutuksenAjankohta =
    toteutus?.metadata?.opetus?.koulutuksenAlkamiskausiUUSI;

  const haunAjankohta = haku?.metadata?.koulutuksenAlkamiskausi;

  const isYhteishaku = isYhteishakuHakutapa(haku?.hakutapaKoodiUri);

  return (
    <FieldGroup title={t('toteutuslomake.koulutuksenAjankohta')}>
      <Spacing marginBottom={2}>
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
      </Spacing>
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

export default AlkamiskausiSection;
