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

    if (errorType === 'integrityViolation' && /toteutuksia/i.test(msg)) {
      return {
        field: 'tila',
        errorKey:
          'ilmoitukset.poistoEstettyRiippuvuuksienTakia.koulutuksellaToteutuksia',
      };
    }
  }

  if (path === 'metadata.kuvaus' && errorType === 'invalidKielistetty') {
    return LANGUAGES.map(lng => ({
      field: `description.kuvaus.${lng}`,
      errorKey: 'validointivirheet.pakollisetKaannokset',
    }));
  }

  if (
    path === 'metadata.opintojenLaajuusNumeroMin' ||
    path === 'metadata.opintojenLaajuusNumeroMax'
  ) {
    return [
      {
        field: 'information.opintojenLaajuusGroup',
        errorKey: `validointivirheet.${errorType}`, // Virheteksti group-tasolla
      },
      {
        field: 'information.opintojenLaajuusNumeroMin',
        errorKey: null, // Kenttä punaiseksi (ei virhetekstiä)
      },
      {
        field: 'information.opintojenLaajuusNumeroMax',
        errorKey: null, // Kenttä punaiseksi (ei virhetekstiä)
      },
    ];
  }

  if (path === 'metadata.opintojenLaajuusyksikkoKoodiUri') {
    return [
      {
        field: `information.opintojenLaajuusGroup`,
        errorKey: `validointivirheet.${errorType}`, // Virheteksti group-tasolla
      },
      {
        field: 'information.opintojenLaajuusyksikko',
        errorKey: null, // Kenttä punaiseksi (ei virhetekstiä)
      },
    ];
  }

  if (errorType === 'cannotChangeIsAvoinKorkeakoulutus') {
    return {
      field: 'information.isAvoinKorkeakoulutus',
      errorKey: `validointivirheet.${errorType}`,
    };
  }

  if (errorType === 'cannotRemoveTarjoajaFromAvoinKorkeakoulutus') {
    return {
      field: 'tarjoajat.tarjoajat',
      errorKey: `validointivirheet.${errorType}`,
    };
  }
};
