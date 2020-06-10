import _ from 'lodash';

import { isNumeric } from './index';
import getKokeetTaiLisanaytotData from './getKokeetTaiLisanaytotData';
import getHakulomakeFieldsData from './getHakulomakeFieldsData';
import serializeEditorState from './draft/serializeEditorState';
import { LIITTEEN_TOIMITUSTAPA } from '#/src/constants';

const getKieliversiot = values => _.get(values, 'kieliversiot') || [];

const getLiitteillaYhteinenToimitusaika = values =>
  !!_.get(values, 'liitteet.yhteinenToimitusaika');

const getLiitteillaYhteinenToimitusosoite = values =>
  !!_.get(values, 'liitteet.yhteinenToimituspaikka');

const getKaytetaanHaunAikataulua = values =>
  !_.get(values, 'hakuajat.eriHakuaika');

const getAsNumberOrNull = value => {
  return isNumeric(value) ? parseInt(value) : null;
};

const getHakukohdeByFormValues = values => {
  const { muokkaaja, tila } = values;
  const alkamiskausiKoodiUri = _.get(values, 'alkamiskausi.kausi') || null;
  const alkamisvuosi = getAsNumberOrNull(
    _.get(values, 'alkamiskausi.vuosi.value')
  );
  const kielivalinta = getKieliversiot(values);

  const aloituspaikat = getAsNumberOrNull(
    _.get(values, 'aloituspaikat.aloituspaikkamaara')
  );

  const eriHakulomake = Boolean(_.get(values, 'hakulomake.eriHakulomake'));

  const {
    hakulomakeAtaruId,
    hakulomakeKuvaus,
    hakulomakeLinkki,
    hakulomaketyyppi,
  } = getHakulomakeFieldsData({
    hakulomakeValues: _.get(values, 'hakulomake'),
    kielivalinta,
  });

  const kaytetaanHaunAikataulua = getKaytetaanHaunAikataulua(values);

  const hakuajat = kaytetaanHaunAikataulua
    ? []
    : (_.get(values, 'hakuajat.hakuajat') || []).map(({ alkaa, paattyy }) => ({
        alkaa: alkaa || null,
        paattyy: paattyy || null,
      }));

  const liitteidenToimitusosoite = {
    osoite: {
      osoite: _.pick(
        _.get(values, 'liitteet.toimitustapa.paikka.osoite') || null,
        kielivalinta
      ),
      postinumeroKoodiUri:
        _.get(values, 'liitteet.toimitustapa.paikka.postinumero.value') || null,
    },
    sahkoposti:
      _.get(values, 'liitteet.toimitustapa.paikka.sahkoposti') || null,
  };

  const liitteidenToimitustapa = _.get(values, 'liitteet.toimitustapa.tapa');

  const liitteidenToimitusaika = _.get(values, 'liitteet.toimitusaika') || null;

  const liitteetOnkoSamaToimitusosoite = getLiitteillaYhteinenToimitusosoite(
    values
  );

  const liitteetOnkoSamaToimitusaika = getLiitteillaYhteinenToimitusaika(
    values
  );

  const liitteet = (_.get(values, 'liitteet.liitteet') || []).map(
    ({ tyyppi, nimi, kuvaus, toimitusaika, toimitustapa }) => {
      const tapa = _.get(toimitustapa, 'tapa') || null;
      return {
        toimitustapa: tapa,
        tyyppiKoodiUri: _.get(tyyppi, 'value') || null,
        nimi: _.pick(nimi || null, kielivalinta),
        toimitusaika: !liitteetOnkoSamaToimitusaika
          ? toimitusaika || null
          : null,
        toimitusosoite:
          tapa === LIITTEEN_TOIMITUSTAPA.MUU_OSOITE
            ? {
                osoite: {
                  osoite: _.pick(
                    _.get(toimitustapa, 'paikka.osoite') || null,
                    kielivalinta
                  ),
                  postinumeroKoodiUri:
                    _.get(toimitustapa, 'paikka.postinumero.value') || null,
                },
                sahkoposti: _.get(toimitustapa, 'paikka.sahkoposti') || null,
              }
            : null,
        kuvaus: _.pick(kuvaus || {}, kielivalinta),
      };
    }
  );

  const nimi = _.pick(_.get(values, 'perustiedot.nimi') || null, kielivalinta);

  const toinenAsteOnkoKaksoistutkinto = !!_.get(
    values,
    'perustiedot.voiSuorittaaKaksoistutkinnon'
  );

  const valintakokeet = getKokeetTaiLisanaytotData({
    valintakoeValues: _.get(values, 'valintakokeet'),
    kielivalinta,
  });

  const pohjakoulutusvaatimusKoodiUrit = (
    _.get(values, 'pohjakoulutus.pohjakoulutusvaatimus') || []
  ).map(({ value }) => value);

  const pohjakoulutusvaatimusTarkenne = _.pick(
    _.mapValues(
      _.get(values, 'pohjakoulutus.tarkenne') || {},
      serializeEditorState
    ),
    kielivalinta
  );

  const valintaperuste = _.get(values, 'valintaperusteenKuvaus.value') || null;

  const valintakokeidenYleiskuvaus = _.mapValues(
    _.get(values, 'valintakokeet.yleisKuvaus'),
    kuvaus => serializeEditorState(kuvaus)
  );

  const ensikertalaisenAloituspaikat = getAsNumberOrNull(
    _.get(values, 'aloituspaikat.ensikertalaismaara')
  );

  const eriAlkamiskausi = Boolean(
    _.get(values, 'alkamiskausi.eriAlkamiskausi')
  );

  return {
    muokkaaja,
    tila,
    alkamiskausiKoodiUri,
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
    pohjakoulutusvaatimusTarkenne,
    valintaperusteId: valintaperuste,
    ensikertalaisenAloituspaikat,
    kaytetaanHaunHakulomaketta: !eriHakulomake,
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
    kaytetaanHaunAlkamiskautta: !eriAlkamiskausi,
    metadata: {
      valintakokeidenYleiskuvaus,
    },
  };
};

export default getHakukohdeByFormValues;
