import _fp from 'lodash/fp';
import { ifAny, otherwise } from '#/src/utils';
import {
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  TOTEUTUKSEN_AJANKOHTA,
} from '#/src/constants';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';
import isErillishakuHakutapa from '#/src/utils/isErillishakuHakutapa';
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
import {
  validateExistence,
  validateExistenceOfDate,
} from '#/src/utils/form/createErrorBuilder';

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
        field: '.toteutuksenAjankohta',
        validate: validateIfJulkaistu(
          validateExistence('aikataulut.toteutuksenAjankohta')
        ),
      },
      {
        field: '.kausi',
        required: values => isYhteishakuHakutapa(getHakutapa(values)),
      },
      {
        field: '.vuosi',
        validate: (eb, values) =>
          validateIf(
            isYhteishakuHakutapa(getHakutapa(values)) &&
              values?.aikataulut?.toteutuksenAjankohta ===
                TOTEUTUKSEN_AJANKOHTA.ALKAMISKAUSI &&
              values?.tila === JULKAISUTILA.JULKAISTU,
            _fp.pipe(
              validateExistence('aikataulut.kausi'),
              validateExistence('aikataulut.vuosi')
            )
          )(eb),
      },
      {
        field: '.tiedossaTarkkaAjankohta',
      },
      {
        field: '.tarkkaAlkaa',
        required: true,
        validate: (eb, values) =>
          validateIf(
            values?.aikataulut?.toteutuksenAjankohta ===
              TOTEUTUKSEN_AJANKOHTA.ALKAMISKAUSI &&
              values?.aikataulut?.tiedossaTarkkaAjankohta &&
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
