import get from 'lodash/get';
import produce from 'immer';
import toPairs from 'lodash/toPairs';
import pick from 'lodash/pick';

import { isObject } from '../../utils';
import { VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI } from '../../constants';

const formatTaulukko = ({ taulukko, kielivalinta }) => {
  if (!get(taulukko, 'rows')) {
    return { rows: [] };
  }

  return produce(taulukko, draft => {
    (draft.rows || []).forEach((row, rowIndex) => {
      if (isObject(row)) {
        row.index = rowIndex;

        (row.columns || []).forEach((column, columnIndex) => {
          if (isObject(column)) {
            column.index = columnIndex;

            if (isObject(column.text)) {
              column.text = pick(column.text, kielivalinta);
            }
          }
        });
      }
    });
  });
};

export const getValintaperusteetByValues = values => {
  const hakutapaKoodiUri = get(values, 'hakutavanRajaus.hakutapa');

  const kielivalinta = get(values, 'kieliversiot.languages') || [];

  const kohdejoukkoKoodiUri = get(
    values,
    'kohdejoukonRajaus.kohdejoukko.value',
  );

  const nimi = pick(get(values, 'nimi.nimi'), kielivalinta);

  const valintavat = (get(values, 'valintatapa.valintatavat') || []).map(
    ({
      tapa,
      kuvaus,
      taulukot,
      kynnysehto,
      enimmaispistemaara,
      vahimmaispistemaara,
    }) => ({
      kuvaus: pick(kuvaus, kielivalinta),
      valintapaKoodiUri: get(tapa, 'value'),
      taulukot: (taulukot || []).map(({ taulukko, otsikko }) => ({
        nimi: pick(otsikko, kielivalinta),
        ...formatTaulukko({ taulukko, kielivalinta }),
      })),
      kaytaMuuntotaulukkoa: false,
      kynnysehto: pick(kynnysehto, kielivalinta),
      enimmaispisteet: enimmaispistemaara,
      vahimmaispiteet: vahimmaispistemaara,
    }),
  );

  const kielitaitovaatimukset = (
    get(values, 'kielitaitovaatimukset.kielet') || []
  ).map(({ kieli, tyyppi, kuvaukset, osoitustavat, muutOsoitustavat }) => {
    const activeTyypit = toPairs(tyyppi || {})
      .filter(([uri, value]) => !!value)
      .map(([uri]) => uri);

    const vaatimukset = activeTyypit.map(kielitaitovaatimusKoodiUri => ({
      kielitaitovaatimusKoodiUri,
      kielitaitovaatimusKuvaukset: (
        get(kuvaukset, kielitaitovaatimusKoodiUri) || []
      ).map(({ kuvaus, taso }) => ({
        kielitaitovaatimusTaso: taso,
        kielitaitovaatimusKuvausKoodiUri: get(kuvaus, 'value'),
      })),
    }));

    return {
      kielivalinta,
      kieliKoodiUri: get(kieli, 'value'),
      vaatimukset,
      kielitaidonVoiOsoittaa: [
        ...(osoitustavat || []).map(kielitaitoKoodiUri => ({
          kielitaitoKoodiUri,
          lisatieto: {},
        })),
        ...(muutOsoitustavat || []).map(({ kuvaus }) => ({
          kielitaitoKoodiUri: `${VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI}#1`,
          lisatieto: pick(kuvaus, kielivalinta),
        })),
      ],
    };
  });

  return {
    kielivalinta,
    hakutapaKoodiUri,
    kohdejoukkoKoodiUri,
    nimi,
    metadata: {
      valintavat,
      kielitaitovaatimukset,
    },
  };
};
