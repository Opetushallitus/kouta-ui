import get from 'lodash/get';
import produce from 'immer';
import toPairs from 'lodash/toPairs';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

import { isObject, isArray, isNumeric } from '../../utils';
import {
  VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI,
  JULKAISUTILA,
} from '../../constants';
import { ErrorBuilder } from '../../validation';

import {
  serialize as serializeEditor,
  parse as parseEditor,
} from '../../components/Editor';

const kielitaitoMuuOsoitusKoodiUriRegExp = new RegExp(
  `^${VALINTAPERUSTEET_KIELITAITO_MUU_OSOITUS_KOODI_URI}`,
);

const getKieliversiot = values => get(values, 'kieliversiot.languages') || [];

const serializeTable = ({ table, kielivalinta }) => {
  if (!get(table, 'rows')) {
    return { rows: [] };
  }

  return produce(table, draft => {
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

const serializeSisalto = ({ sisalto, kielivalinta = [] }) => {
  if (!isArray(sisalto)) {
    return [];
  }

  return sisalto.map(({ tyyppi, data }) => {
    let serializedData = {};

    if (tyyppi === 'teksti') {
      serializedData = pick(
        isObject(data) ? mapValues(data, serializeEditor) : {},
        kielivalinta,
      );
    }

    if (tyyppi === 'taulukko') {
      serializedData = serializeTable({ table: data, kielivalinta });
    }

    return {
      tyyppi,
      data: serializedData,
    };
  });
};

const parseSisalto = ({ sisalto }) => {
  if (!isArray(sisalto)) {
    return [];
  }

  return sisalto.map(({ tyyppi, data }) => {
    if (tyyppi === 'teksti') {
      return {
        tyyppi,
        data: isObject(data) ? mapValues(data, parseEditor) : {},
      };
    }

    return { tyyppi, data };
  });
};

export const getValintaperusteByValues = values => {
  const hakutapaKoodiUri = get(values, 'hakutavanRajaus.hakutapa');

  const kielivalinta = get(values, 'kieliversiot.languages') || [];

  const kohdejoukkoKoodiUri = get(
    values,
    'kohdejoukonRajaus.kohdejoukko.value',
  );

  const nimi = pick(get(values, 'nimi.nimi'), kielivalinta);

  const valintatavat = (get(values, 'valintatapa.valintatavat') || []).map(
    ({
      tapa,
      kuvaus,
      nimi,
      kynnysehto,
      enimmaispistemaara,
      vahimmaispistemaara,
      sisalto,
    }) => ({
      kuvaus: pick(kuvaus || {}, kielivalinta),
      nimi: pick(nimi || {}, kielivalinta),
      valintatapaKoodiUri: get(tapa, 'value') || null,
      sisalto: serializeSisalto({ sisalto, kielivalinta }),
      kaytaMuuntotaulukkoa: false,
      kynnysehto: pick(kynnysehto || {}, kielivalinta),
      enimmaispisteet: isNumeric(enimmaispistemaara)
        ? parseFloat(enimmaispistemaara)
        : null,
      vahimmaispisteet: isNumeric(vahimmaispistemaara)
        ? parseFloat(vahimmaispistemaara)
        : null,
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
        kielitaitovaatimusKuvausKoodiUri: get(kuvaus, 'value') || null,
      })),
    }));

    return {
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

  const kuvaus = pick(
    mapValues(get(values, 'loppukuvaus.kuvaus') || {}, serializeEditor),
    kielivalinta,
  );

  const osaamistaustaKoodiUrit = (
    get(values, 'osaamistausta.osaamistausta') || []
  ).map(({ value }) => value);

  const koulutustyyppi = get(values, 'tyyppi.tyyppi') || null;

  return {
    kielivalinta,
    hakutapaKoodiUri,
    kohdejoukkoKoodiUri,
    nimi,
    koulutustyyppi,
    metadata: {
      koulutustyyppi,
      valintatavat,
      kielitaitovaatimukset,
      osaamistaustaKoodiUrit,
      kuvaus,
    },
  };
};

export const getValuesByValintaperuste = valintaperuste => {
  const {
    hakutapaKoodiUri = null,
    kielivalinta = [],
    kohdejoukkoKoodiUri = null,
    nimi = {},
    metadata = {},
    koulutustyyppi = null,
  } = valintaperuste;

  const {
    osaamistaustaKoodiUrit = [],
    kielitaitovaatimukset: kielitaitovaatimuksetArg = [],
    valintatavat = [],
    kuvaus = {},
  } = metadata;

  const kielitaitovaatimukset = (kielitaitovaatimuksetArg || []).map(
    ({
      kieliKoodiUri = null,
      vaatimukset = [],
      kielitaidonVoiOsoittaa = [],
    }) => {
      return {
        kieli: kieliKoodiUri ? { value: kieliKoodiUri } : null,
        ...(vaatimukset || []).reduce(
          (
            acc,
            { kielitaitovaatimusKoodiUri, kielitaitovaatimusKuvaukset },
          ) => {
            if (kielitaitovaatimusKoodiUri) {
              acc.tyyppi[kielitaitovaatimusKoodiUri] = true;
              acc.kuvaukset[kielitaitovaatimusKoodiUri] = (
                kielitaitovaatimusKuvaukset || []
              ).map(
                ({
                  kielitaitovaatimusTaso,
                  kielitaitovaatimusKuvausKoodiUri,
                }) => ({
                  taso: kielitaitovaatimusTaso || '',
                  kuvaus: kielitaitovaatimusKuvausKoodiUri
                    ? { value: kielitaitovaatimusKuvausKoodiUri }
                    : null,
                }),
              );
            }

            return acc;
          },
          { kuvaukset: {}, tyyppi: {} },
        ),
        osoitustavat: kielitaidonVoiOsoittaa
          .filter(
            ({ kielitaitoKoodiUri }) =>
              !kielitaitoMuuOsoitusKoodiUriRegExp.test(kielitaitoKoodiUri),
          )
          .map(({ kielitaitoKoodiUri }) => kielitaitoKoodiUri),
        muutOsoitustavat: kielitaidonVoiOsoittaa
          .filter(({ kielitaitoKoodiUri }) =>
            kielitaitoMuuOsoitusKoodiUriRegExp.test(kielitaitoKoodiUri),
          )
          .map(({ lisatieto = {} }) => ({ kuvaus: lisatieto })),
      };
    },
  );

  return {
    kieliversiot: {
      languages: kielivalinta,
    },
    hakutavanRajaus: {
      hakutapa: hakutapaKoodiUri,
    },
    kohdejoukonRajaus: {
      kohdejoukko: kohdejoukkoKoodiUri ? { value: kohdejoukkoKoodiUri } : null,
    },
    nimi: {
      nimi,
    },
    loppukuvaus: {
      kuvaus: mapValues(kuvaus || {}, parseEditor),
    },
    osaamistausta: {
      osaamistausta: (osaamistaustaKoodiUrit || []).map(value => ({ value })),
    },
    kielitaitovaatimukset: {
      kielet: kielitaitovaatimukset,
    },
    valintatapa: {
      valintatavat: (valintatavat || []).map(
        ({
          kuvaus,
          nimi,
          valintatapaKoodiUri,
          sisalto,
          kynnysehto,
          enimmaispisteet,
          vahimmaispisteet,
        }) => ({
          kuvaus: kuvaus || {},
          nimi: nimi || {},
          kynnysehto: kynnysehto || {},
          tapa: valintatapaKoodiUri ? { value: valintatapaKoodiUri } : null,
          enimmaispistemaara: enimmaispisteet || '',
          vahimmaispistemaara: vahimmaispisteet || '',
          sisalto: parseSisalto({ sisalto }),
        }),
      ),
    },
    tyyppi: {
      tyyppi: koulutustyyppi,
    },
  };
};

const validateEssentials = ({ errorBuilder, values }) => {
  const kieliversiot = getKieliversiot(values);

  return errorBuilder
    .validateArrayMinLength('kieliversiot.languages', 1)
    .validateTranslations('nimi.nimi', kieliversiot);
};

const validateCommon = ({ errorBuilder, values }) => {
  const kieliversiot = getKieliversiot(values);

  return errorBuilder
    .validateExistence('hakutavanRajaus.hakutapa')
    .validateExistence('kohdejoukonRajaus.kohdejoukko')
    .validateArrayMinLength('valintatapa.valintatavat', 1, {
      isFieldArray: true,
    })
    .validateArray('valintatapa.valintatavat', eb => {
      return eb
        .validateExistence('tapa')
        .validateTranslations('nimi', kieliversiot)
        .validateTranslations('kynnysehto', kieliversiot)
        .validateExistence('enimmaispistemaara')
        .validateExistence('vahimmaispistemaara');
    });
};

export const validate = ({ tila, values }) => {
  let errorBuilder = new ErrorBuilder({ values });

  errorBuilder = validateEssentials({ errorBuilder, values });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return {};
  }

  errorBuilder = validateCommon({ errorBuilder, values });

  return errorBuilder.getErrors();
};
