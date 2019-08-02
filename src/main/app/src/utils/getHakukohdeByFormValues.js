import get from 'lodash/get';
import pick from 'lodash/pick';

import { isNumeric } from './index';
import getValintakoeFieldsData from './getValintakoeFieldsData';
import getHakulomakeFieldsData from './getHakulomakeFieldsData';
import { LIITTEEN_TOIMITUSTAPA } from '../constants';

const getKieliversiot = values => get(values, 'kieliversiot') || [];

const getLiitteillaYhteinenToimitusaika = values =>
  !!get(values, 'liitteet.yhteinenToimitusaika');

const getLiitteillaYhteinenToimitusosoite = values =>
  !!get(values, 'liitteet.yhteinenToimituspaikka');

const getKaytetaanHaunAikataulua = values =>
  !get(values, 'hakuajat.eriHakuaika');

const getAsNumberOrNull = value => {
  return isNumeric(value) ? parseInt(value) : null;
};

const getHakukohdeByFormValues = values => {
  const { muokkaaja, tila } = values;
  const alkamiskausiKoodiUri = get(values, 'alkamiskausi.kausi') || null;
  const alkamisvuosi = getAsNumberOrNull(
    get(values, 'alkamiskausi.vuosi.value'),
  );
  const kielivalinta = getKieliversiot(values);

  const minAloituspaikat = getAsNumberOrNull(
    get(values, 'aloituspaikat.minAloituspaikkamaara'),
  );

  const maxAloituspaikat = getAsNumberOrNull(
    get(values, 'aloituspaikat.maxAloituspaikkamaara'),
  );

  const eriHakulomake = Boolean(get(values, 'hakulomake.eriHakulomake'));

  const {
    hakulomakeAtaruId,
    hakulomakeKuvaus,
    hakulomakeLinkki,
    hakulomaketyyppi,
  } = getHakulomakeFieldsData({
    hakulomakeValues: get(values, 'hakulomake'),
    kielivalinta,
  });

  const kaytetaanHaunAikataulua = getKaytetaanHaunAikataulua(values);

  const hakuajat = kaytetaanHaunAikataulua
    ? []
    : (get(values, 'hakuajat.hakuajat') || []).map(({ alkaa, paattyy }) => ({
        alkaa: alkaa || null,
        paattyy: paattyy || null,
      }));

  const liitteidenToimitusosoite = {
    osoite: {
      osoite: pick(
        get(values, 'liitteet.toimitustapa.paikka.osoite') || null,
        kielivalinta,
      ),
      postinumero:
        get(values, 'liitteet.toimitustapa.paikka.postinumero') || null,
      postitoimipaikka: pick(
        get(values, 'liitteet.toimitustapa.paikka.postitoimipaikka') || null,
        kielivalinta,
      ),
    },
    sahkoposti: get(values, 'liitteet.toimitustapa.paikka.sahkoposti') || null,
  };

  const liitteidenToimitustapa = get(values, 'liitteet.toimitustapa.tapa');

  const liitteidenToimitusaika = get(values, 'liitteet.toimitusaika') || null;

  const liitteetOnkoSamaToimitusosoite = getLiitteillaYhteinenToimitusosoite(
    values,
  );

  const liitteetOnkoSamaToimitusaika = getLiitteillaYhteinenToimitusaika(
    values,
  );

  const liitteet = (get(values, 'liitteet.liitteet') || []).map(
    ({ tyyppi, nimi, kuvaus, toimitusaika, toimitustapa }) => ({
      toimitustapa: get(toimitustapa, 'tapa') || null,
      tyyppi: get(tyyppi, 'value') || null,
      nimi: pick(nimi || null, kielivalinta),
      toimitusaika: !liitteetOnkoSamaToimitusaika ? toimitusaika || null : null,
      toimitusosoite: {
        osoite: {
          osoite: pick(
            get(toimitustapa, 'paikka.osoite') || null,
            kielivalinta,
          ),
          postinumero: get(toimitustapa, 'paikka.postinumero') || null,
          postitoimipaikka: pick(
            get(toimitustapa, 'paikka.postitoimipaikka') || null,
            kielivalinta,
          ),
        },
        sahkoposti: get(toimitustapa, 'paikka.sahkoposti') || null,
      },
      kuvaus: pick(kuvaus || {}, kielivalinta),
    }),
  );

  const nimi = pick(get(values, 'perustiedot.nimi') || null, kielivalinta);

  const toinenAsteOnkoKaksoistutkinto = !!get(
    values,
    'perustiedot.voiSuorittaaKaksoistutkinnon',
  );

  const valintakokeet = getValintakoeFieldsData({
    valintakoeValues: get(values, 'valintakoe'),
    kielivalinta,
  });

  const pohjakoulutusvaatimusKoodiUrit = (
    get(values, 'pohjakoulutus') || []
  ).map(({ value }) => value);

  const valintaperuste = get(values, 'valintaperusteenKuvaus.value') || null;

  const minEnsikertalaisenAloituspaikat = getAsNumberOrNull(
    get(values, 'aloituspaikat.minEnsikertalaismaara'),
  );

  const maxEnsikertalaisenAloituspaikat = getAsNumberOrNull(
    get(values, 'aloituspaikat.maxEnsikertalaismaara'),
  );

  const eriAlkamiskausi = Boolean(get(values, 'alkamiskausi.eriAlkamiskausi'));

  return {
    muokkaaja,
    tila,
    alkamiskausiKoodiUri,
    kaytetaanHaunAikataulua,
    kielivalinta,
    minAloituspaikat,
    maxAloituspaikat,
    hakuajat,
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteidenToimitustapa: liitteetOnkoSamaToimitusosoite
      ? liitteidenToimitustapa
      : null,
    liitteet,
    alkamisvuosi,
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
    valintaperuste,
    minEnsikertalaisenAloituspaikat,
    maxEnsikertalaisenAloituspaikat,
    kaytetaanHaunHakulomaketta: !eriHakulomake,
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
    kaytetaanHaunAlkamiskautta: !eriAlkamiskausi,
  };
};

export default getHakukohdeByFormValues;
