import { LANGUAGES } from '#/src/constants';
import { RemoteErrorsToFormErrors } from '#/src/types/formTypes';

export const koulutusRemoteErrorsToFormErrors: RemoteErrorsToFormErrors = ({
  errorType,
  msg,
  path,
}) => {
  if (path === 'koulutustyyppi') {
    if (/sora/i.test(msg)) {
      return {
        field: 'soraKuvaus',
        errorKey:
          'validointivirheet.koulutustyyppiEiVastaaSorakuvauksenTyyppia',
      };
    }
  }
  if (path === 'koulutuksetKoodiUri') {
    if (errorType === 'valuesDontMatch' && /sora/i.test(msg)) {
      return [
        {
          field: 'soraKuvaus',
          errorKey:
            'validointivirheet.koulutusEiVastaaSoraKuvauksenKoulutuksia',
        },
        {
          field: 'information.koulutus',
          errorKey:
            'validointivirheet.koulutusEiVastaaSoraKuvauksenKoulutuksia',
        },
        {
          field: 'information.koulutukset',
          errorKey:
            'validointivirheet.koulutusEiVastaaSoraKuvauksenKoulutuksia',
        },
      ];
    }
  }
  if (path === 'tila') {
    if (errorType === 'notYetJulkaistu' && /sora/i.test(msg)) {
      const errorKey = t =>
        t('yleiset.riippuvuusEiJulkaistu', {
          entity: t('yleiset.soraKuvaus'),
        });
      return [
        {
          field: 'tila',
          errorKey,
        },
        {
          field: 'soraKuvaus',
          errorKey,
        },
      ];
    }
  }

  if (path === 'metadata.kuvaus') {
    return LANGUAGES.map(lng => ({
      field: `description.kuvaus.${lng}`,
      errorKey: 'validointivirheet.pakollisetKaannokset',
    }));
  }

  if (path === 'metadata.opintojenLaajuusKoodiUri') {
    return {
      field: `information.opintojenLaajuus`,
      errorKey: 'validointivirheet.pakollinen',
    };
  }
};
