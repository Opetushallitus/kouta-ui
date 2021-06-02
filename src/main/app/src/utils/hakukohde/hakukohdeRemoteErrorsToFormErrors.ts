import { RemoteErrorsToFormErrors } from '#/src/types/formTypes';

export const hakukohdeRemoteErrorsToFormErrors: RemoteErrorsToFormErrors = ({
  errorType,
  msg,
  path,
}) => {
  if (path === 'tila') {
    if (errorType === 'notYetJulkaistu') {
      const getErrorKey = key => t =>
        t('yleiset.riippuvuusEiJulkaistu', {
          entity: t(`yleiset.${key}`),
        });
      if (/toteutus/i.test(msg)) {
        return {
          field: 'tila',
          errorKey: getErrorKey('toteutus'),
        };
      } else if (/haku/i.test(msg)) {
        return {
          field: 'tila',
          errorKey: getErrorKey('haku'),
        };
      } else if (/valintaperuste/i.test(msg)) {
        return [
          {
            field: 'tila',
            errorKey: getErrorKey('valintaperuste'),
          },
          {
            field: 'valintaperusteenKuvaus.valintaperuste',
            errorKey: getErrorKey('valintaperuste'),
          },
        ];
      }
    }
  }
};
