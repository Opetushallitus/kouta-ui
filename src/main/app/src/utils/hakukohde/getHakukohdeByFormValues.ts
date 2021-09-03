import _ from 'lodash';
import _fp from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { LIITTEEN_TOIMITUSTAPA, LUKIO_YLEISLINJA } from '#/src/constants';
import { HakukohdeFormValues } from '#/src/types/hakukohdeTypes';
import { maybeParseNumber, parseFloatComma } from '#/src/utils';
import { getAlkamiskausiData } from '#/src/utils/form/aloitusajankohtaHelpers';
import { getHakulomakeFieldsData } from '#/src/utils/form/getHakulomakeFieldsData';
import {
  getKokeetTaiLisanaytotData,
  getTilaisuusData,
} from '#/src/utils/form/getKokeetTaiLisanaytotData';

const getKielivalinta = values => values?.kieliversiot || [];

const getLiitteillaYhteinenToimitusaika = values =>
  !!values?.liitteet?.yhteinenToimitusaika;

const getLiitteillaYhteinenToimitusosoite = values =>
  !!values?.liitteet?.yhteinenToimituspaikka;

const getKaytetaanHaunAikataulua = values => !values?.hakuajat.eriHakuaika;

function getAloituspaikat(values: HakukohdeFormValues) {
  return {
    lukumaara: maybeParseNumber(values?.aloituspaikat?.aloituspaikkamaara),
    ensikertalaisille: maybeParseNumber(
      values?.aloituspaikat?.ensikertalaismaara
    ),
    kuvaus: _.mapValues(
      values?.aloituspaikat?.aloituspaikkakuvaus,
      serializeEditorState
    ),
  };
}

function getPainotetutArvosanatData(arvosanat) {
  return (arvosanat || [])
    .map(arvosana => {
      return {
        koodiUrit: arvosana.painotettuOppiaine
          ? arvosana.painotettuOppiaine.koodiUrit
          : null,
        painokerroin: arvosana.painokerroin
          ? parseFloatComma(arvosana.painokerroin)
          : null,
      };
    })
    .filter(arvosana => !_fp.isEmpty(arvosana));
}

const getHakukohteenLinja = values => {
  if (!values?.hakukohteenLinja) {
    return null;
  }
  const { alinHyvaksyttyKeskiarvo, linja, lisatietoa, painotetutArvosanat } =
    values.hakukohteenLinja;

  return {
    linja: linja !== LUKIO_YLEISLINJA ? linja : null,
    alinHyvaksyttyKeskiarvo:
      alinHyvaksyttyKeskiarvo && parseFloatComma(alinHyvaksyttyKeskiarvo),
    lisatietoa: _.mapValues(lisatietoa, serializeEditorState),
    painotetutArvosanat: getPainotetutArvosanatData(painotetutArvosanat),
  };
};

export const getHakukohdeByFormValues = (values: HakukohdeFormValues) => {
  const { muokkaaja, tila, esikatselu = false, jarjestyspaikkaOid } = values;
  const kielivalinta = getKielivalinta(values);
  const pickTranslations = _fp.pick(kielivalinta);

  const {
    hakulomakeAtaruId,
    hakulomakeKuvaus,
    hakulomakeLinkki,
    hakulomaketyyppi,
  } = getHakulomakeFieldsData({
    hakulomakeValues: values?.hakulomake,
    kielivalinta,
  });

  const kaytetaanHaunAikataulua = getKaytetaanHaunAikataulua(values);

  const hakuajat = kaytetaanHaunAikataulua
    ? []
    : (values?.hakuajat?.hakuajat || []).map(({ alkaa, paattyy }) => ({
        alkaa: alkaa || null,
        paattyy: paattyy || null,
      }));

  const liitteidenToimitusosoite = {
    osoite: {
      osoite: _.pick(
        values?.liitteet?.toimitustapa?.paikka?.osoite || null,
        kielivalinta
      ),
      postinumeroKoodiUri:
        values?.liitteet?.toimitustapa?.paikka?.postinumero?.value || null,
    },
    sahkoposti: values?.liitteet?.toimitustapa?.paikka?.sahkoposti || null,
  };

  const liitteidenToimitustapa = values?.liitteet?.toimitustapa?.tapa;

  const liitteidenToimitusaika = values?.liitteet?.toimitusaika || null;

  const liitteetOnkoSamaToimitusosoite =
    getLiitteillaYhteinenToimitusosoite(values);

  const liitteetOnkoSamaToimitusaika =
    getLiitteillaYhteinenToimitusaika(values);

  const ajankohta = values?.ajankohta;

  const liitteet = (values?.liitteet?.liitteet || []).map(
    ({ tyyppi, nimi, kuvaus, toimitusaika, toimitustapa }) => {
      const tapa = toimitustapa?.tapa || null;
      return {
        toimitustapa: tapa,
        tyyppiKoodiUri: tyyppi?.value || null,
        nimi: pickTranslations(nimi),
        toimitusaika: !liitteetOnkoSamaToimitusaika
          ? toimitusaika || null
          : null,
        toimitusosoite:
          tapa === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
            ? {
                osoite: {
                  osoite: pickTranslations(toimitustapa?.paikka?.osoite),
                  postinumeroKoodiUri:
                    toimitustapa?.paikka?.postinumero?.value || null,
                },
                sahkoposti: toimitustapa?.paikka?.sahkoposti || null,
              }
            : null,
        kuvaus: _.mapValues(
          pickTranslations(kuvaus || {}),
          serializeEditorState
        ),
      };
    }
  );

  const nimi = pickTranslations(values?.perustiedot?.nimi || null);

  const toinenAsteOnkoKaksoistutkinto =
    !!values?.perustiedot?.voiSuorittaaKaksoistutkinnon;

  const valintakokeet = getKokeetTaiLisanaytotData({
    valintakoeValues: values?.valintakokeet,
    kielivalinta,
  });

  const pohjakoulutusvaatimusKoodiUrit = (
    values?.pohjakoulutus?.pohjakoulutusvaatimus || []
  ).map(({ value }) => value);

  const pohjakoulutusvaatimusTarkenne = _.pick(
    _.mapValues(values?.pohjakoulutus?.tarkenne || {}, serializeEditorState),
    kielivalinta
  );

  const kaytetaanHaukukohteenAlkamiskautta =
    values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta;

  // NOTE: Tässä muutetaan object {id: [tilaisuus1, tilaisuus2]} takaisin taulukkomuotoon [{id, tilaisuudet: [tilaisuus1, tilaisuus2]}]
  const valintaperusteenValintakokeidenLisatilaisuudet = _.reduce(
    values?.valintakokeet?.valintaperusteenValintakokeidenLisatilaisuudet || {},
    (a, v, k) =>
      v?.length > 0
        ? [...a, { id: k, tilaisuudet: v.map(getTilaisuusData(kielivalinta)) }]
        : a,
    []
  );

  return {
    organisaatioOid: values?.organisaatioOid?.value,
    externalId: _fp.isEmpty(values?.externalId) ? null : values?.externalId,
    muokkaaja,
    tila,
    esikatselu,
    jarjestyspaikkaOid,
    kaytetaanHaunAikataulua,
    kielivalinta,
    hakuajat,
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteidenToimitustapa: liitteetOnkoSamaToimitusosoite
      ? liitteidenToimitustapa
      : null,
    liitteet,
    liitteidenToimitusosoite:
      liitteetOnkoSamaToimitusosoite &&
      liitteidenToimitustapa === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
        ? liitteidenToimitusosoite
        : null,
    liitteidenToimitusaika: liitteetOnkoSamaToimitusaika
      ? liitteidenToimitusaika
      : null,
    nimi,
    toinenAsteOnkoKaksoistutkinto,
    valintakokeet,
    pohjakoulutusvaatimusKoodiUrit,
    pohjakoulutusvaatimusTarkenne,
    valintaperusteId:
      values?.valintaperusteenKuvaus?.valintaperuste?.value || null,
    kaytetaanHaunHakulomaketta: !values?.hakulomake?.eriHakulomake,
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
    metadata: {
      valintakokeidenYleiskuvaus: _.mapValues(
        values?.valintakokeet?.yleisKuvaus,
        kuvaus => serializeEditorState(kuvaus)
      ),
      valintaperusteenValintakokeidenLisatilaisuudet,
      kynnysehto: _.mapValues(
        values?.valintaperusteenKuvaus?.kynnysehto,
        kuvaus => serializeEditorState(kuvaus)
      ),
      aloituspaikat: getAloituspaikat(values),
      kaytetaanHaunAlkamiskautta: !kaytetaanHaukukohteenAlkamiskautta,
      koulutuksenAlkamiskausi: kaytetaanHaukukohteenAlkamiskautta
        ? getAlkamiskausiData(ajankohta, pickTranslations)
        : null,
      hakukohteenLinja: getHakukohteenLinja(values),
    },
  };
};
