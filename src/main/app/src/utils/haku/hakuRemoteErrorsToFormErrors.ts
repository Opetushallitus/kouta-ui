import { RemoteErrorsToFormErrors } from '#/src/types/formTypes';

export const hakuRemoteErrorsToFormErrors: RemoteErrorsToFormErrors = ({
  errorType,
  msg,
  path,
}) => {
  if (path === 'tila') {
    if (errorType === 'integrityViolation' && /hakukohteita/i.test(msg)) {
      return {
        field: 'tila',
        errorKey:
          'ilmoitukset.poistoEstettyRiippuvuuksienTakia.haullaHakukohteita',
      };
    }
  }
};
