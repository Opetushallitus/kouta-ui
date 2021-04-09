import _ from 'lodash';
import _fp from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { LIITTEEN_TOIMITUSTAPA } from '#/src/constants';
import { HakukohdeFormValues } from '#/src/types/hakukohdeTypes';
import { maybeParseNumber } from '#/src/utils';
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

export const getHakukohdeByFormValues = (values: HakukohdeFormValues) => {
  const { muokkaaja, tila, esikatselu = false, jarjestyspaikkaOid } = values;
  const kielivalinta = getKielivalinta(values);
  const pickTranslations = _fp.pick(kielivalinta);

  const aloituspaikat = maybeParseNumber(
    values?.aloituspaikat?.aloituspaikkamaara
  );

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

  const liitteetOnkoSamaToimitusosoite = getLiitteillaYhteinenToimitusosoite(
    values
  );

  const liitteetOnkoSamaToimitusaika = getLiitteillaYhteinenToimitusaika(
    values
  );

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

  const toinenAsteOnkoKaksoistutkinto = !!values?.perustiedot
    ?.voiSuorittaaKaksoistutkinnon;

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
    muokkaaja,
    tila,
    esikatselu,
    jarjestyspaikkaOid,
    kaytetaanHaunAikataulua,
    kielivalinta,
    aloituspaikat,
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
    ensikertalaisenAloituspaikat: maybeParseNumber(
      values?.aloituspaikat?.ensikertalaismaara
    ),
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
      kaytetaanHaunAlkamiskautta: !kaytetaanHaukukohteenAlkamiskautta,
      koulutuksenAlkamiskausi: kaytetaanHaukukohteenAlkamiskautta
        ? getAlkamiskausiData(ajankohta, pickTranslations)
        : null,
    },
  };
};
