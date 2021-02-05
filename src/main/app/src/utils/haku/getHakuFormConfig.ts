import _fp from 'lodash/fp';

import {
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  Alkamiskausityyppi,
} from '#/src/constants';
import { HakuFormValues } from '#/src/types/hakuTypes';
import { ifAny, otherwise } from '#/src/utils';
import {
  validateExistence,
  validateExistenceOfDate,
} from '#/src/utils/form/createErrorBuilder';
import createFormConfigBuilder from '#/src/utils/form/createFormConfigBuilder';
import {
  validateIfJulkaistu,
  getKielivalinta,
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  tilaSectionConfig,
  validateIf,
  validateOptionalTranslatedField,
} from '#/src/utils/form/formConfigUtils';
import isErillishakuHakutapa from '#/src/utils/isErillishakuHakutapa';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

const getHakutapa = values => values?.hakutapa;

const config = createFormConfigBuilder().registerSections([
  kieliversiotSectionConfig,
  pohjaValintaSectionConfig,
  {
    section: 'nimi',
    parts: [
      {
        field: 'nimi',
        required: true,
        validate: (eb, values) =>
          eb.validateTranslations('nimi', getKielivalinta(values)),
      },
    ],
  },
  {
    section: 'kohdejoukko',
    parts: [
      {
        field: '.kohdejoukko',
        required: true,
        validate: validateIfJulkaistu(
          validateExistence('kohdejoukko.kohdejoukko')
        ),
      },
      {
        field: '.tarkenne',
      },
    ],
  },
  {
    section: 'hakutapa',
    parts: [
      {
        field: 'hakutapa',
        required: true,
        validate: validateIfJulkaistu(validateExistence('hakutapa')),
      },
    ],
  },
  {
    section: 'aikataulut',
    parts: [
      {
        field: '.hakuaikaGroup',
        required: true,
      },
      {
        field: '.ajankohtaTyyppi',
        validate: validateIfJulkaistu(
          validateExistence('aikataulut.ajankohtaTyyppi')
        ),
      },
      {
        field: '.kausi',
        required: values => isYhteishakuHakutapa(getHakutapa(values)),
      },
      {
        field: '.vuosi',
        validate: (eb, values: HakuFormValues) =>
          validateIf(
            values?.aikataulut?.ajankohtaTyyppi ===
              Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI &&
              values?.tila === JULKAISUTILA.JULKAISTU,
            _fp.pipe(
              validateExistence('aikataulut.kausi'),
              validateExistence('aikataulut.vuosi')
            )
          )(eb),
      },
      {
        field: '.tarkkaAlkaa',
        required: true,
        validate: (eb, values: HakuFormValues) =>
          validateIf(
            values?.aikataulut?.ajankohtaTyyppi ===
              Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA &&
              values?.tila === JULKAISUTILA.JULKAISTU,
            validateExistenceOfDate('aikataulut.tarkkaAlkaa')
          )(eb),
      },
      {
        field: '.tarkkaPaattyy',
      },
      {
        field: '.hakuaika',
        validate: validateIfJulkaistu((errorBuilder, values) =>
          errorBuilder
            .validateArrayMinLength('aikataulut.hakuaika', 1, {
              isFieldArray: true,
            })
            .validateArray('aikataulut.hakuaika', eb => {
              const hakutapa = getHakutapa(values);
              const isErillishaku = isErillishakuHakutapa(hakutapa);
              const isYhteishaku = isYhteishakuHakutapa(hakutapa);

              return _fp.flow([
                validateExistenceOfDate('alkaa'),
                validateIf(
                  isYhteishaku || isErillishaku,
                  validateExistenceOfDate('paattyy')
                ),
              ])(eb);
            })
        ),
      },
      {
        field: '.henkilokohtaisenSuunnitelmanLisatiedot',
        validate: validateOptionalTranslatedField(
          'aikataulut.henkilokohtaisenSuunnitelmanLisatiedot'
        ),
      },
      {
        field: '.hakuaika.alkaa',
        required: true,
      },
      {
        field: '.hakuaika.paattyy',
        required: values => {
          const hakutapa = getHakutapa(values);
          return (
            isYhteishakuHakutapa(hakutapa) || isErillishakuHakutapa(hakutapa)
          );
        },
      },
      {
        field: '.aikataulu',
      },
      {
        field: '.lisaamisenTakaraja',
      },
      {
        field: '.muokkauksenTakaraja',
      },
      {
        field: '.ajastettuJulkaisu',
      },
    ],
  },
  {
    section: 'hakulomake',
    parts: [
      {
        field: '.tyyppi',
        required: true,
        validate: validateIfJulkaistu(
          (eb, values) =>
            eb.validateExistence('hakulomake.tyyppi') &&
            _fp.cond([
              [
                ifAny(HAKULOMAKETYYPPI.ATARU),
                () => eb.validateExistence('hakulomake.lomake'),
              ],
              [
                ifAny(HAKULOMAKETYYPPI.MUU),
                () =>
                  eb.validateTranslations(
                    'hakulomake.linkki',
                    getKielivalinta(values)
                  ),
              ],
              [otherwise, () => eb],
            ])(tyyppi => values?.hakulomake?.tyyppi === tyyppi)
        ),
      },
      {
        field: '.lomake',
        required: true,
      },
      {
        field: '.linkki',
        required: true,
      },
      {
        field: '.kuvaus',
      },
    ],
  },
  {
    section: 'yhteyshenkilot',
    field: 'yhteyshenkilot',
  },
  tilaSectionConfig,
]);

const getHakuFormConfig = () => {
  return config.getConfig();
};

export default getHakuFormConfig;
