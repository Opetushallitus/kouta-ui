import { RemoteErrorsToFormErrors } from '#/src/types/formTypes';

export const sorakuvausRemoteErrorsToFormErrors: RemoteErrorsToFormErrors = ({
  errorType,
  msg,
  path,
}) => {
  if (path === 'tila') {
    if (errorType === 'integrityViolation' && /koulutuksia/i.test(msg)) {
      return {
        field: 'tila',
        errorKey:
          'ilmoitukset.poistoEstettyRiippuvuuksienTakia.sorakuvauksellaKoulutuksia',
      };
    }
  }
};
