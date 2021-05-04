import _fp from 'lodash/fp';

import { JULKAISUTILA } from '#/src/constants';
import createErrorBuilder, {
  validateArrayMinLength,
  validateExistence,
  validateTranslations,
} from '#/src/utils/form/createErrorBuilder';
import {
  getKielivalinta,
  validateIf,
  validateOptionalTranslatedField,
  validatePohja,
  validateRelations,
} from '#/src/utils/form/formConfigUtils';
import isOphOrganisaatio from '#/src/utils/organisaatio/isOphOrganisaatio';

const validateCommonFields = _fp.flow(
  validateExistence('koulutustyyppi'),
  validatePohja,
  validateExistence('tila')
);

const oneAndOnlyOneTutkinnonOsa = values =>
  values?.tutkinnonosat?.osat?.length === 1;

const validateKoulutusForm = (values, registeredFields) => {
  const { organisaatioOid } = values;
  const minTarjoajat = isOphOrganisaatio(organisaatioOid) ? 0 : 1;

  const { tila } = values;
  const isJulkaistu = tila === JULKAISUTILA.JULKAISTU;
  const kieliversiot = getKielivalinta(values);

  // NOTE: Only visible fields will be validated!
  return _fp
    .flow(
      validateCommonFields,
      validateArrayMinLength('kieliversiot', 1),
      validateTranslations('information.nimi'),
      validateExistence('information.koulutus'),
      validateExistence('osaamisala.koulutus'),
      validateExistence('osaamisala.eperuste'),
      validateExistence('osaamisala.osaamisala'),
      validateOptionalTranslatedField('description.kuvaus'),
      eb =>
        eb.validateArray('tutkinnonosat.osat', eb => {
          return _fp.flow([
            eb => eb.validateExistence('eperuste'),
            eb => eb.validateExistence('koulutus'),
            eb => eb.validateArrayMinLength('osat', 1),
          ])(eb);
        }),
      eb =>
        oneAndOnlyOneTutkinnonOsa(values)
          ? eb
          : eb.validateTranslations('tutkinnonosat.nimi'),
      validateExistence('tila'),
      validateRelations([
        {
          key: 'soraKuvaus',
          t: 'yleiset.soraKuvaus',
        },
      ]),
      validateIf(
        isJulkaistu,
        _fp.flow(
          validateTranslations('description.nimi'),
          validateExistence('information.eperuste'),
          validateArrayMinLength('information.korkeakoulutukset', 1),
          validateArrayMinLength('tarjoajat.tarjoajat', minTarjoajat),
          validateArrayMinLength('information.korkeakoulutukset', 1)
        )
      )
    )(createErrorBuilder(values, kieliversiot, registeredFields))
    .getErrors();
};

export default validateKoulutusForm;
