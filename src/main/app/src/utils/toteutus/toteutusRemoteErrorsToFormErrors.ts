import { LANGUAGES } from '#/src/constants';
import { RemoteErrorsToFormErrors } from '#/src/types/formTypes';

export const toteutusRemoteErrorsToFormErrors: RemoteErrorsToFormErrors = ({
  errorType,
  msg,
  path,
}) => {
  if (path.endsWith('kuvaus') && errorType === 'InvalidKielistetty') {
    const painotusIndex = path.match(/painotukset\[(\d+)\]/)?.[1];
    const erityinenKoulutustehtavaIndex = path.match(
      /erityisetKoulutustehtavat\[(\d+)\]/
    )?.[1];

    if (painotusIndex) {
      return LANGUAGES.map(lng => ({
        field: `lukiolinjat.painotukset.kuvaukset[${painotusIndex}].${lng}`,
        errorKey: 'validointivirheet.kaikkiKaannoksetJosAinakinYksi',
      }));
    } else if (erityinenKoulutustehtavaIndex) {
      return LANGUAGES.map(lng => ({
        field: `lukiolinjat.erityisetKoulutustehtavat.kuvaukset[${erityinenKoulutustehtavaIndex}].${lng}`,
        errorKey: 'validointivirheet.kaikkiKaannoksetJosAinakinYksi',
      }));
    }
  }

  const diplomiIndex = path.match(/diplomit\[(\d+)\]/)?.[1];

  if (diplomiIndex) {
    if (path.endsWith('linkinAltTeksti')) {
      return LANGUAGES.map(lng => ({
        field: `jarjestamistiedot.diplomit.linkit[${diplomiIndex}].alt.${lng}`,
        errorKey: 'validointivirheet.kaikkiKaannoksetJosAinakinYksi',
      }));
    } else if (path.endsWith('linkki')) {
      return LANGUAGES.map(lng => ({
        field: `jarjestamistiedot.diplomit.linkit[${diplomiIndex}].url.${lng}`,
        errorKey: 'validointivirheet.kaikkiKaannoksetJosAinakinYksi',
      }));
    }
  }

  if (path === 'tila') {
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

    if (errorType === 'integrityViolation' && /hakukohteita/i.test(msg)) {
      return {
        field: 'tila',
        errorKey:
          'ilmoitukset.poistoEstettyRiippuvuuksienTakia.toteutuksellaHakukohteita',
      };
    }
  }

  if (path === 'metadata.kuvaus' && errorType === 'invalidKielistetty') {
    return LANGUAGES.map(lng => ({
      field: `kuvaus.${lng}`,
      errorKey: 'validointivirheet.pakollisetKaannokset',
    }));
  }

  if (path === 'metadata.laajuus' && errorType === 'notInTheRangeMsg') {
    return {
      field: 'tiedot.opintojenLaajuusnumero',
      errorKey: 'validointivirheet.laajuusEiOleValilla',
    };
  }
};
