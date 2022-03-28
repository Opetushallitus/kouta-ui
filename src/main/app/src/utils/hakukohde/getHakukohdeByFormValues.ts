import _fp from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { LIITTEEN_TOIMITUSTAPA, LUKIO_YLEISLINJA } from '#/src/constants';
import { HakukohdeFormValues } from '#/src/types/hakukohdeTypes';
import { maybeParseNumber, parseFloatComma, valueToArray } from '#/src/utils';
import { getAlkamiskausiData } from '#/src/utils/form/aloitusajankohtaHelpers';
import { getHakulomakeFieldsData } from '#/src/utils/form/getHakulomakeFieldsData';
import {
  getKokeetTaiLisanaytotData,
  getTilaisuusData,
} from '#/src/utils/form/getKokeetTaiLisanaytotData';
import { reduce, mapValues } from '#/src/utils/lodashFpUncapped';

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
    kuvaus: mapValues(
      serializeEditorState,
      values?.aloituspaikat?.aloituspaikkakuvaus
    ),
  };
}

function getPainotetutArvosanatData(arvosanat) {
  return (arvosanat || [])
    .map(arvosana => {
      return {
        koodiUrit: { oppiaine: arvosana.painotettuOppiaine?.value },
        painokerroin: arvosana.painokerroin
          ? parseFloatComma(arvosana.painokerroin)
          : null,
      };
    })
    .filter(
      arvosana => arvosana.painokerroin || !_fp.isEmpty(arvosana.koodiUrit)
    );
}

const getLiiteToimitusosoite = (toimitustapa, kielivalinta) => {
  const unpackOsoite = rivit => {
    if (rivit) {
      const { rivi1, rivi2 } = rivit;
      if (rivi1) {
        return _fp.reduce(
          (acc, kieli) => {
            const r1 = rivi1?.[kieli] ?? '';
            const r2 = rivi2?.[kieli] ?? '';
            acc[kieli] = `${r1}\n${r2}`.trim();
            return acc;
          },
          {},
          kielivalinta
        );
      }
    }
  };
  return {
    osoite: {
      osoite: unpackOsoite(toimitustapa?.paikka?.osoite || null),
      postinumeroKoodiUri: toimitustapa?.paikka?.postinumero?.value || null,
    },
    sahkoposti: toimitustapa?.paikka?.sahkoposti || null,
    verkkosivu: toimitustapa?.paikka?.verkkosivu || null,
  };
};

const getHakukohteenLinja = values => {
  if (!values?.hakukohteenLinja) {
    return null;
  }
  const { alinHyvaksyttyKeskiarvo, linja, lisatietoa, painotetutArvosanat } =
    values.hakukohteenLinja;

  return {
    linja: linja !== LUKIO_YLEISLINJA ? linja : null,
    alinHyvaksyttyKeskiarvo:
      (alinHyvaksyttyKeskiarvo && parseFloatComma(alinHyvaksyttyKeskiarvo)) ||
      null,
    lisatietoa: mapValues(serializeEditorState, lisatietoa),
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

  const liitteidenToimitusosoite = getLiiteToimitusosoite(
    values?.liitteet?.toimitustapa,
    kielivalinta
  );

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
            ? getLiiteToimitusosoite(toimitustapa, kielivalinta)
            : null,
        kuvaus: mapValues(serializeEditorState, pickTranslations(kuvaus || {})),
      };
    }
  );

  const nimi = pickTranslations(values?.perustiedot?.nimi);

  const hakukohdeKoodiUri =
    values?.perustiedot?.hakukohdeKoodiUri?.value ?? null;

  const toinenAsteOnkoKaksoistutkinto =
    !!values?.perustiedot?.voiSuorittaaKaksoistutkinnon;

  const valintakokeet = getKokeetTaiLisanaytotData({
    valintakoeValues: values?.valintakokeet,
    kielivalinta,
  });

  const pohjakoulutusvaatimusKoodiUrit = (
    values?.pohjakoulutus?.pohjakoulutusvaatimus || []
  ).map(({ value }) => value);

  const pohjakoulutusvaatimusTarkenne = pickTranslations(
    mapValues(serializeEditorState, values?.pohjakoulutus?.tarkenne || {})
  );

  const kaytetaanHakukohteenAlkamiskautta =
    values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta;

  // NOTE: Tässä muutetaan object {id: [tilaisuus1, tilaisuus2]} takaisin taulukkomuotoon [{id, tilaisuudet: [tilaisuus1, tilaisuus2]}]
  const valintaperusteenValintakokeidenLisatilaisuudet = reduce(
    (a, v, k) =>
      v?.length > 0
        ? [...a, { id: k, tilaisuudet: v.map(getTilaisuusData(kielivalinta)) }]
        : a,
    [],
    values?.valintakokeet?.valintaperusteenValintakokeidenLisatilaisuudet || {}
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
    nimi: _fp.isEmpty(hakukohdeKoodiUri) ? nimi : {},
    hakukohdeKoodiUri: hakukohdeKoodiUri,
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
      valintakokeidenYleiskuvaus: mapValues(
        kuvaus => serializeEditorState(kuvaus),
        values?.valintakokeet?.yleisKuvaus
      ),
      valintaperusteenValintakokeidenLisatilaisuudet,
      kynnysehto: mapValues(
        kuvaus => serializeEditorState(kuvaus),
        values?.valintaperusteenKuvaus?.kynnysehto
      ),
      aloituspaikat: getAloituspaikat(values),
      kaytetaanHaunAlkamiskautta: !kaytetaanHakukohteenAlkamiskautta,
      koulutuksenAlkamiskausi: kaytetaanHakukohteenAlkamiskautta
        ? getAlkamiskausiData(ajankohta, pickTranslations)
        : null,
      hakukohteenLinja: getHakukohteenLinja(values),
      uudenOpiskelijanUrl: values?.uudenOpiskelijanUrl,
    },
  };
};
