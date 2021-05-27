import { LANGUAGES } from '#/src/constants';
import { FormError, RemoteErrorsToFormErrors } from '#/src/types/formTypes';

export const toteutusRemoteErrorsToFormErrors: RemoteErrorsToFormErrors = ({
  errorType,
  msg,
  path,
}) => {
  const errors: Array<FormError> = [];
  const painotusIndex = path.match(/painotukset\[(\d+)\]/)?.[1];
  const erityinenKoulutustehtavaIndex = path.match(
    /erityisetKoulutustehtavat\[(\d+)\]/
  )?.[1];

  if (path.endsWith('kuvaus') && errorType === 'InvalidKielistetty') {
    if (painotusIndex) {
      LANGUAGES.forEach(lng => {
        errors.push({
          field: `lukiolinjat.painotukset.kuvaukset[${painotusIndex}].${lng}`,
          errorKey: 'validointivirheet.kaikkiKaannoksetJosAinakinYksi',
        });
      });
    }
    if (erityinenKoulutustehtavaIndex) {
      LANGUAGES.forEach(lng => {
        errors.push({
          field: `lukiolinjat.erityisetKoulutustehtavat.kuvaukset[${erityinenKoulutustehtavaIndex}].${lng}`,
          errorKey: 'validointivirheet.kaikkiKaannoksetJosAinakinYksi',
        });
      });
    }
  }

  if (path === 'tila') {
    if (errorType === 'notYetJulkaistu') {
      if (/sora/i.test(msg)) {
        const errorKey = t =>
          t('yleiset.riippuvuusEiJulkaistu', {
            entity: t('yleiset.soraKuvaus'),
          });
        errors.concat([
          {
            field: 'tila',
            errorKey,
          },
          {
            field: 'soraKuvaus',
            errorKey,
          },
        ]);
      } else {
        errors.push({
          field: 'tila',
          errorKey: t =>
            t('yleiset.riippuvuusEiJulkaistu', {
              entity: t('yleiset.koulutus'),
            }),
        });
      }
    }
  }

  return errors;
};
