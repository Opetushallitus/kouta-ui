export const koulutusRemoteErrorsToFormErrors = {
  koulutustyyppi: ({ msg }) => {
    if (/sora/i.test(msg)) {
      return [
        {
          field: 'soraKuvaus',
          errorKey:
            'validointivirheet.koulutustyyppiEiVastaaSorakuvauksenTyyppia',
        },
      ];
    }
  },
  koulutuksetKoodiUri: ({ msg, errorType }) => {
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
  },
  tila: ({ errorType, msg }) => {
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
  },
};
