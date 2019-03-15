import get from 'lodash/get';
import pick from 'lodash/pick';

import {
  isArray,
  getKoutaDateString,
  isNumeric,
  formatKoutaDateString,
} from '../../utils';

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const getAsNumberOrNull = value => {
  return isNumeric(value) ? parseInt(value) : null;
};

const getDateTimeValues = dateString => {
  if (!dateString) {
    return { date: '', time: '' };
  }

  const formattedDate = formatKoutaDateString(dateString, DATE_FORMAT);

  const [d = '', t = ''] = formattedDate.split(' ');

  return { date: d, time: t };
};

const getKoutaDateStringByDateTime = ({ date = '', time = '' }) => {
  const [day, month, year] = date.split('.');

  if (!isNumeric(day) || !isNumeric(month) || !isNumeric(year)) {
    return null;
  }

  const [hour, minute] = time.split(':');

  return getKoutaDateString({
    day,
    month,
    year,
    hour: hour || 0,
    minute: minute || 0,
  });
};

export const getHakukohdeByValues = values => {
  const alkamiskausiKoodiUri = get(values, 'alkamiskausi.kausi') || null;
  const alkamisvuosi = getAsNumberOrNull(
    get(values, 'alkamiskausi.vuosi.value'),
  );
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
  const aloituspaikat = getAsNumberOrNull(
    get(values, 'aloituspaikat.aloituspaikkamaara'),
  );
  const kaytetaanHaunAikataulua = !get(values, 'hakuajat.eriHakuaika');

  const hakuajat = kaytetaanHaunAikataulua
    ? []
    : (get(values, 'hakuajat.hakuajat') || []).map(
        ({ fromDate, fromTime, toDate, toTime }) => ({
          alkaa: getKoutaDateStringByDateTime({
            date: fromDate,
            time: fromTime,
          }),
          paattyy: getKoutaDateStringByDateTime({ date: toDate, time: toTime }),
        }),
      );

  const liitteidenToimitusosoite = {
    osoite: {
      osoite: pick(
        get(values, 'liitteet.toimitusosoite') || null,
        kielivalinta,
      ),
      postinumero: get(values, 'liitteet.toimituspostinumero') || null,
      postitoimipaikka: pick(
        get(values, 'liitteet.toimituspostitoimipaikka') || null,
        kielivalinta,
      ),
    },
    sahkoposti: get(values, 'liitteet.toimitussahkoposti') || null,
  };

  const liitteidenToimitusaika =
    get(values, 'liitteet.deliverDate') && get(values, 'liitteet.deliverTime')
      ? getKoutaDateStringByDateTime({
          date: values.liitteet.deliverDate,
          time: values.liitteet.deliverTime,
        })
      : null;

  const liitteetOnkoSamaToimitusosoite = !!get(
    values,
    'liitteet.yhteinenToimituspaikka',
  );

  const liitteetOnkoSamaToimitusaika = !!get(
    values,
    'liitteet.yhteinenToimitusaika',
  );

  const liitteet = (get(values, 'liitteet.liitteet') || []).map(
    ({
      tyyppi,
      nimi,
      kuvaus,
      deliverDate,
      deliverTime,
      toimitusosoite,
      toimituspostinumero,
      toimituspostitoimipaikka,
      toimitussahkoposti,
    }) => ({
      tyyppi: get(tyyppi, 'value') || null,
      nimi: pick(nimi || null, kielivalinta),
      toimitusaika: liitteetOnkoSamaToimitusaika
        ? getKoutaDateStringByDateTime({ date: deliverDate, time: deliverTime })
        : null,
      toimitusosoite: {
        osoite: {
          osoite: pick(toimitusosoite || null, kielivalinta),
          postinumero: toimituspostinumero || null,
          postitoimipaikka: pick(
            toimituspostitoimipaikka || null,
            kielivalinta,
          ),
        },
        sahkoposti: toimitussahkoposti || null,
      },
      kuvaus: pick(kuvaus || null, kielivalinta),
    }),
  );

  const nimi = pick(get(values, 'perustiedot.nimi') || null, kielivalinta);

  const toinenAsteOnkoKaksoistutkinto = !!get(
    values,
    'perustiedot.voiSuorittaaKaksoistutkinnon',
  );
  const valintakoeTyypit = get(values, 'valintakoe.types') || [];
  const valintakokeetByTyyppi = get(values, 'valintakoe.kokeet') || {};

  const valintakokeet = valintakoeTyypit
    .map(tyyppi => ({ tyyppi, ...(valintakokeetByTyyppi[tyyppi] || {}) }))
    .map(({ tyyppi, kokeet }) => ({
      tyyppi,
      tilaisuudet: isArray(kokeet)
        ? kokeet.map(
            ({
              osoite,
              postinumero,
              postitoimipaikka,
              fromDate,
              fromTime,
              toDate,
              toTime,
              lisatietoja,
            }) => ({
              osoite: {
                osoite: pick(osoite || null, kielivalinta),
                postinumero: postinumero || null,
                postitoimipaikka: pick(postitoimipaikka || null, kielivalinta),
              },
              aika: {
                alkaa: getKoutaDateStringByDateTime({
                  date: fromDate,
                  time: fromTime,
                }),
                paattyy: getKoutaDateStringByDateTime({
                  date: toDate,
                  time: toTime,
                }),
              },
              lisatietoja: pick(lisatietoja || null, kielivalinta),
            }),
          )
        : [],
    }));

  const pohjakoulutusvaatimusKoodiUrit = (
    get(values, 'pohjakoulutus.koulutusvaatimukset') || []
  ).map(({ value }) => value);

  const valintaperuste =
    get(values, 'valintaperusteenKuvaus.valintaperuste.value') || null;

  const ensikertalaisenAloituspaikat = getAsNumberOrNull(
    get(values, 'aloituspaikat.ensikertalaismaara'),
  );

  return {
    alkamiskausiKoodiUri,
    kaytetaanHaunAikataulua,
    kielivalinta,
    aloituspaikat,
    hakuajat,
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteet,
    alkamisvuosi,
    liitteidenToimitusosoite,
    liitteidenToimitusaika,
    nimi,
    toinenAsteOnkoKaksoistutkinto,
    valintakokeet,
    pohjakoulutusvaatimusKoodiUrit,
    valintaperuste,
    ensikertalaisenAloituspaikat,
  };
};

export const getValuesByHakukohde = hakukohde => {
  const {
    alkamiskausiKoodiUri = '',
    kaytetaanHaunAikataulua,
    kielivalinta = [],
    aloituspaikat = '',
    hakuajat = [],
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteet = [],
    alkamisvuosi,
    liitteidenToimitusosoite = {},
    liitteidenToimitusaika,
    nimi = {},
    toinenAsteOnkoKaksoistutkinto,
    valintakokeet = [],
    pohjakoulutusvaatimusKoodiUrit = [],
    valintaperuste = '',
    ensikertalaisenAloituspaikat = '',
  } = hakukohde;

  const valintakoeTyypit = (valintakokeet || []).map(({ tyyppi }) => tyyppi);

  const valintakokeetByTyyppi = (valintakokeet || []).reduce(
    (acc, { tyyppi, tilaisuudet = [] }) => {
      if (tyyppi) {
        acc[tyyppi] = {
          kokeet: (tilaisuudet || []).map(
            ({
              aika: { alkaa, paattyy } = {},
              osoite: {
                osoite = {},
                postinumero = '',
                postitoimipaikka = {},
              } = {},
              lisatietoja = {},
            }) => {
              const { date: fromDate, time: fromTime } = getDateTimeValues(
                alkaa,
              );

              const { date: toDate, time: toTime } = getDateTimeValues(paattyy);

              return {
                osoite,
                postinumero,
                postitoimipaikka,
                lisatietoja,
                fromDate,
                fromTime,
                toDate,
                toTime,
              };
            },
          ),
        };
      }

      return acc;
    },
    {},
  );

  const {
    date: liitteetDeliverDate,
    time: liitteetDeliverTime,
  } = getDateTimeValues(liitteidenToimitusaika);

  return {
    alkamiskausi: {
      kausi: alkamiskausiKoodiUri,
      vuosi: {
        value: isNumeric(alkamisvuosi) ? alkamisvuosi.toString() : null,
      },
    },
    kieliversiot: {
      languages: kielivalinta,
    },
    aloituspaikat: {
      aloituspaikkamaara: isNumeric(aloituspaikat)
        ? aloituspaikat.toString()
        : '',
      ensikertalaismaara: isNumeric(ensikertalaisenAloituspaikat)
        ? ensikertalaisenAloituspaikat.toString()
        : '',
    },
    hakuajat: {
      eriHakuaika: !kaytetaanHaunAikataulua,
      hakuajat: (hakuajat || []).map(({ alkaa, paattyy }) => {
        const { date: fromDate, time: fromTime } = getDateTimeValues(alkaa);
        const { date: toDate, time: toTime } = getDateTimeValues(paattyy);

        return {
          fromDate,
          fromTime,
          toDate,
          toTime,
        };
      }),
    },
    perustiedot: {
      nimi,
      voiSuorittaaKaksoistutkinnon: !!toinenAsteOnkoKaksoistutkinto,
    },
    pohjakoulutus: {
      koulutusvaatimus: (pohjakoulutusvaatimusKoodiUrit || []).map(value => ({
        value,
      })),
    },
    valintaperusteenKuvaus: {
      valintaperuste: {
        value: valintaperuste,
      },
    },
    valintakoe: {
      types: valintakoeTyypit,
      kokeet: valintakokeetByTyyppi,
    },
    liitteet: {
      toimitusosoite: get(liitteidenToimitusosoite, 'osoite.osoite') || {},
      toimituspostinumero:
        get(liitteidenToimitusosoite, 'osoite.postinumero') || '',
      toimituspostitoimipaikka:
        get(liitteidenToimitusosoite, 'osoite.postitoimipaikka') || {},
      toimitussahkoposti: get(liitteidenToimitusosoite, 'sahkoposti') || '',
      yhteinenToimituspaikka: !!liitteetOnkoSamaToimitusosoite,
      yhteinenToimitusaika: !!liitteetOnkoSamaToimitusaika,
      deliverDate: liitteetDeliverDate,
      deliverTime: liitteetDeliverTime,
      liitteet: (liitteet || []).map(
        ({
          tyyppi,
          nimi = {},
          toimitusaika,
          toimitusosoite: {
            sahkoposti,
            osoite: { osoite, postinumero, postitoimipaikka } = {},
          } = {},
          kuvaus = {},
        }) => {
          const { date: deliverDate, time: deliverTime } = getDateTimeValues(
            toimitusaika,
          );

          return {
            tyyppi,
            nimi,
            kuvaus,
            deliverDate,
            deliverTime,
            toimitussahkoposti: sahkoposti || '',
            toimitusosoite: osoite || {},
            toimituspostinumero: postinumero || '',
            toimituspostitoimipaikka: postitoimipaikka || {},
          };
        },
      ),
    },
  };
};
