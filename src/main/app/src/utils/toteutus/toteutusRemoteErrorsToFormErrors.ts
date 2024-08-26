import { capitalize, map, findIndex } from 'lodash';
import { match } from 'ts-pattern';

import { LANGUAGES, KOULUTUSTYYPPI } from '#/src/constants';
import { RemoteErrorsToFormErrors } from '#/src/types/formTypes';

export const toteutusRemoteErrorsToFormErrors: RemoteErrorsToFormErrors = (
  { errorType, msg, path, meta },
  formValues = {}
) => {
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

  if (
    path === 'metadata.opintojenLaajuusNumero' &&
    errorType === 'notInTheRangeMsg'
  ) {
    return {
      field: 'tiedot.opintojenLaajuusNumero',
      errorKey:
        'validointivirheet.invalidToteutusOpintojenLaajuusNumeroIntegrity',
    };
  }

  if (
    path === 'metadata.opintojenLaajuusyksikkoKoodiUri' &&
    errorType === 'invalidToteutusOpintojenLaajuusyksikkoIntegrity'
  ) {
    return {
      field: 'tiedot.opintojenLaajuusyksikko',
      errorKey: `validointivirheet.${errorType}`,
    };
  }

  if (path === 'metadata.opintojenLaajuusNumeroMax') {
    const errorKey =
      errorType === 'invalidToteutusOpintojenLaajuusMin'
        ? 'invalidToteutusOpintojenLaajuusNumeroIntegrity'
        : errorType;
    return [
      {
        field: 'tiedot.opintojenLaajuusGroup',
        errorKey: `validointivirheet.${errorKey}`, // Virheteksti group-tasolla
      },
      {
        field: 'tiedot.opintojenLaajuusNumeroMax',
        errorKey: null, // Kenttä punaiseksi (ei virhetekstiä)
      },
    ];
  }

  if (path === 'metadata.opintojenLaajuusNumeroMin') {
    const errorKey =
      errorType === 'invalidToteutusOpintojenLaajuusMin'
        ? 'invalidToteutusOpintojenLaajuusNumeroIntegrity'
        : errorType;
    return [
      {
        field: 'tiedot.opintojenLaajuusGroup',
        errorKey: `validointivirheet.${errorKey}`, // Virheteksti group-tasolla
      },
      {
        field: 'tiedot.opintojenLaajuusNumeroMin',
        errorKey: null, // Kenttä punaiseksi (ei virhetekstiä)
      },
    ];
  }

  if (
    /metadata.liitetytEntiteetit.julkaisutila/.test(path) &&
    errorType === 'invalidTilaForLiitettyOnJulkaisu'
  ) {
    const koulutustyyppi = formValues.koulutustyyppi;

    const [liitetytEntiteetit, koulutustyyppiName] = match(koulutustyyppi)
      .with(KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS, () => [
        formValues?.opintojaksojenLiittaminen?.opintojaksot,
        'opintojakso',
      ])
      .with(
        KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
        KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
        () => [
          formValues?.osaamismerkkienLiittaminen?.osaamismerkit,
          'osaamismerkki',
        ]
      )
      .otherwise(() => []);

    const indicesForOpintojaksotWithInvalidTila = map(meta.entiteetit, oid =>
      findIndex(liitetytEntiteetit, [`${koulutustyyppiName}.value`, oid])
    ).filter(i => i >= 0);

    const fieldValue = index => {
      return match(koulutustyyppi)
        .with(
          KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS,
          () => `opintojaksojenLiittaminen.opintojaksot[${index}].opintojakso`
        )
        .with(
          KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
          KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
          () =>
            `osaamismerkkienLiittaminen.osaamismerkit[${index}].osaamismerkki`
        )
        .otherwise(() => []);
    };

    return indicesForOpintojaksotWithInvalidTila.map(index => {
      return {
        field: fieldValue(index),
        errorKey: `validointivirheet.invalidTilaForLiitetty${capitalize(
          koulutustyyppiName
        )}OnJulkaisu`,
      };
    });
  }

  if (errorType === 'invalidIsAvoinKorkeakoulutusIntegrity') {
    return {
      field: 'tiedot.isAvoinKorkeakoulutus',
      errorKey: `validointivirheet.${errorType}`,
    };
  }

  if (errorType === 'invalidJarjestajaForAvoinKorkeakoulutus') {
    return {
      field: 'tarjoajat',
      errorKey: `validointivirheet.${errorType}`,
    };
  }

  if (
    path === 'metadata.opetus.maksullisuustyyppi' &&
    errorType === 'invalidOpetuskieliWithLukuvuosimaksu'
  ) {
    return {
      field: 'jarjestamistiedot.maksullisuustyyppi',
      errorKey: `validointivirheet.${errorType}`,
    };
  }
};
