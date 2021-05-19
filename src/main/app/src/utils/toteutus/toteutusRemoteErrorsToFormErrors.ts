export const toteutusRemoteErrorsToFormErrors = {
  tila: ({ errorType, msg }) => {
    if (errorType === 'notYetJulkaistu') {
      if (/sora/i.test(msg)) {
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
      } else {
        return {
          field: 'tila',
          errorKey: t =>
            t('yleiset.riippuvuusEiJulkaistu', {
              entity: t('yleiset.koulutus'),
            }),
        };
      }
    }
  },
};
