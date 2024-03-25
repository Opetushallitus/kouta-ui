import _fp from 'lodash/fp';

import { LIITTEEN_TOIMITUSTAPA, LUKIO_YLEISLINJA } from '#/src/constants';
import { HakukohdeFormValues } from '#/src/types/hakukohdeTypes';
import {
  maybeParseNumber,
  parseFloatComma,
  toKielistettyWithValueStr,
} from '#/src/utils';
import { getAlkamiskausiData } from '#/src/utils/form/aloitusajankohtaHelpers';
import { getHakulomakeFieldsData } from '#/src/utils/form/getHakulomakeFieldsData';
import {
  getKokeetTaiLisanaytotData,
  getTilaisuusData,
} from '#/src/utils/form/getKokeetTaiLisanaytotData';
import { reduce } from '#/src/utils/lodashFpUncapped';

import {
  getKielivalinta,
  getKieleistyksetFromValues,
  getSerializedKieleistykset,
  pickAndSerializeTranslations,
} from '../pickTranslations';

const getLiitteillaYhteinenToimitusaika = values =>
  Boolean(values?.liitteet?.yhteinenToimitusaika);

const getLiitteillaYhteinenToimitusosoite = values =>
  Boolean(values?.liitteet?.yhteinenToimituspaikka);

const getKaytetaanHaunAikataulua = values => !values?.hakuajat.eriHakuaika;

function getAloituspaikat(values: HakukohdeFormValues) {
  return {
    lukumaara: maybeParseNumber(values?.aloituspaikat?.aloituspaikkamaara),
    ensikertalaisille: maybeParseNumber(
      values?.aloituspaikat?.ensikertalaismaara
    ),
    kuvaus: pickAndSerializeTranslations(
      values?.aloituspaikat?.aloituspaikkakuvaus,
      getKielivalinta(values)
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
      arvosana =>
        arvosana.painokerroin || !_fp.isEmpty(arvosana.koodiUrit?.oppiaine)
    );
}

const getLiiteToimitusosoite = (toimitustapa, kielivalinta, kieleistykset) => {
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
      postinumeroKoodiUri: kieleistykset(
        toKielistettyWithValueStr(toimitustapa?.paikka?.postinumero)
      ),
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
    linja: linja === LUKIO_YLEISLINJA ? null : linja,
    alinHyvaksyttyKeskiarvo:
      (alinHyvaksyttyKeskiarvo && parseFloatComma(alinHyvaksyttyKeskiarvo)) ||
      null,
    lisatietoa: pickAndSerializeTranslations(
      lisatietoa,
      getKielivalinta(values)
    ),
    painotetutArvosanat: getPainotetutArvosanatData(painotetutArvosanat),
  };
};

export const getHakukohdeByFormValues = (values: HakukohdeFormValues) => {
  const {
    muokkaaja,
    tila,
    esikatselu = false,
    jarjestyspaikkaOid,
    jarjestaaUrheilijanAmmKoulutusta,
  } = values;
  const kielivalinta = getKielivalinta(values);

  const kieleistykset = getKieleistyksetFromValues(values);
  const kieleistyksetSerialized = getSerializedKieleistykset(values);
  const kaytetaanHaunHakulomaketta = !values?.hakulomake?.eriHakulomake;
  const {
    hakulomakeAtaruId,
    hakulomakeKuvaus,
    hakulomakeLinkki,
    hakulomaketyyppi,
  } = kaytetaanHaunHakulomaketta
    ? {
        hakulomakeAtaruId: null,
        hakulomakeKuvaus: {},
        hakulomakeLinkki: {},
        hakulomaketyyppi: null,
      }
    : getHakulomakeFieldsData({
        hakulomakeValues: values?.hakulomake,
        kieleistykset,
        kieleistyksetSerialized,
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
    kielivalinta,
    kieleistykset
  );

  const liitteidenToimitustapa = _fp.isEmpty(
    values?.liitteet?.toimitustapa?.tapa
  )
    ? null
    : values?.liitteet?.toimitustapa?.tapa;

  const liitteidenToimitusaika = values?.liitteet?.toimitusaika || null;

  const ajankohta = values?.ajankohta;

  const liiteValues = values?.liitteet?.liitteet || [];

  const liitteetOnkoSamaToimitusosoite =
    liiteValues.length > 0
      ? getLiitteillaYhteinenToimitusosoite(values)
      : false;

  const liitteetOnkoSamaToimitusaika =
    liiteValues.length > 0 ? getLiitteillaYhteinenToimitusaika(values) : false;

  const liitteet = liiteValues.map(
    ({ tyyppi, nimi, kuvaus, toimitusaika, toimitustapa }) => {
      const tapa = toimitustapa?.tapa || null;
      return {
        toimitustapa: tapa,
        tyyppiKoodiUri: tyyppi?.value || null,
        nimi: kieleistykset(nimi),
        toimitusaika: liitteetOnkoSamaToimitusaika
          ? null
          : toimitusaika || null,
        toimitusosoite:
          tapa === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
            ? getLiiteToimitusosoite(toimitustapa, kielivalinta, kieleistykset)
            : null,
        kuvaus: kieleistyksetSerialized(kuvaus),
      };
    }
  );

  console.log(JSON.stringify(liitteet, null, 2));
  const nimi = kieleistykset(values?.perustiedot?.nimi);

  const hakukohdeKoodiUri =
    values?.perustiedot?.hakukohdeKoodiUri?.value ?? null;

  const toinenAsteOnkoKaksoistutkinto = Boolean(
    values?.perustiedot?.voiSuorittaaKaksoistutkinnon
  );

  const valintakokeet = getKokeetTaiLisanaytotData({
    valintakoeValues: values?.valintakokeet,
    kieleistykset,
    kieleistyksetSerialized,
  });

  const pohjakoulutusvaatimusKoodiUrit = (
    values?.pohjakoulutus?.pohjakoulutusvaatimus || []
  ).map(({ value }) => value);

  const pohjakoulutusvaatimusTarkenne = kieleistyksetSerialized(
    values?.pohjakoulutus?.tarkenne
  );

  const kaytetaanHakukohteenAlkamiskautta =
    values?.ajankohta?.kaytetaanHakukohteenAlkamiskautta;

  // NOTE: Tässä muutetaan object {id: [tilaisuus1, tilaisuus2]} takaisin taulukkomuotoon [{id, tilaisuudet: [tilaisuus1, tilaisuus2]}]
  const valintaperusteenValintakokeidenLisatilaisuudet = reduce(
    (a, v, k) =>
      v?.length > 0
        ? [
            ...a,
            {
              id: k,
              tilaisuudet: v.map(
                getTilaisuusData(kieleistykset, kieleistyksetSerialized)
              ),
            },
          ]
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
    kaytetaanHaunHakulomaketta: kaytetaanHaunHakulomaketta,
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
    metadata: {
      jarjestaaUrheilijanAmmKoulutusta,
      valintakokeidenYleiskuvaus: kieleistyksetSerialized(
        values?.valintakokeet?.yleisKuvaus
      ),
      valintaperusteenValintakokeidenLisatilaisuudet,
      kynnysehto: kieleistyksetSerialized(
        values?.valintaperusteenKuvaus?.kynnysehto
      ),
      aloituspaikat: getAloituspaikat(values),
      kaytetaanHaunAlkamiskautta: !kaytetaanHakukohteenAlkamiskautta,
      koulutuksenAlkamiskausi: kaytetaanHakukohteenAlkamiskautta
        ? getAlkamiskausiData(ajankohta, kieleistyksetSerialized)
        : null,
      hakukohteenLinja: getHakukohteenLinja(values),
      uudenOpiskelijanUrl: values?.uudenOpiskelijanUrl,
    },
  };
};
