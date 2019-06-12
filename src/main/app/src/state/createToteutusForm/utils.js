import get from 'lodash/get';
import toPairs from 'lodash/toPairs';
import pick from 'lodash/pick';

import { JULKAISUTILA, KORKEAKOULUKOULUTUSTYYPIT } from '../../constants';
import { ErrorBuilder } from '../../validation';
import { isNumeric } from '../../utils';

const getKielivalinta = values => get(values, 'kieliversiot.languages') || [];

const getOsaamisalatByValues = ({ osaamisalat, kielivalinta }) => {
  return (osaamisalat || []).map(
    ({ kuvaus = {}, nimi = {}, linkki = {}, otsikko = {} }) => ({
      kuvaus: pick(kuvaus, kielivalinta),
      nimi: pick(nimi, kielivalinta),
      linkki: pick(linkki, kielivalinta),
      otsikko: pick(otsikko, kielivalinta),
    }),
  );
};

export const getToteutusByValues = values => {
  const kielivalinta = getKielivalinta(values);
  const tarjoajat = get(values, 'jarjestamispaikat') || [];
  const nimi = pick(get(values, 'nimi.name') || {}, kielivalinta);
  const opetuskielet = get(values, 'jarjestamistiedot.opetuskieli') || [];
  const kuvaus = pick(get(values, 'kuvaus.kuvaus') || {}, kielivalinta);
  const osioKuvaukset = get(values, 'jarjestamistiedot.osioKuvaukset') || {};
  const opetustapaKoodiUrit = get(values, 'jarjestamistiedot.opetustapa') || [];
  const opetusaikaKoodiUrit = get(values, 'jarjestamistiedot.opetusaika') || [];

  const opetuskieliKuvaus = pick(
    get(values, 'jarjestamistiedot.opetuskieliKuvaus') || {},
    kielivalinta,
  );
  const opetusaikaKuvaus = pick(
    get(values, 'jarjestamistiedot.opetusaikaKuvaus') || {},
    kielivalinta,
  );
  const opetustapaKuvaus = pick(
    get(values, 'jarjestamistiedot.opetustapaKuvaus') || {},
    kielivalinta,
  );
  const maksullisuusKuvaus = pick(
    get(values, 'jarjestamistiedot.maksullisuusKuvaus') || {},
    kielivalinta,
  );
  const alkamiskausiKuvaus = pick(
    get(values, 'jarjestamistiedot.alkamiskausiKuvaus') || {},
    kielivalinta,
  );
  const alkamiskausiKoodiUri =
    get(values, 'jarjestamistiedot.alkamiskausi.kausi') || null;

  const alkamisvuosi =
    get(values, 'jarjestamistiedot.alkamiskausi.vuosi.value') || null;

  const osiot = (get(values, 'jarjestamistiedot.osiot') || []).map(
    ({ value }) => ({
      otsikkoKoodiUri: value,
      teksti: pick(osioKuvaukset[value] || {}, kielivalinta),
    }),
  );

  const maksullisuustyyppi = get(
    values,
    'jarjestamistiedot.maksullisuus.tyyppi',
  );

  const maksullisuusMaksu = get(values, 'jarjestamistiedot.maksullisuus.maksu');

  const onkoLukuvuosimaksua = maksullisuustyyppi === 'lukuvuosimaksu';

  const lukuvuosimaksu =
    onkoLukuvuosimaksua && isNumeric(maksullisuusMaksu)
      ? parseFloat(maksullisuusMaksu)
      : null;

  const onkoMaksullinen = maksullisuustyyppi === 'kylla';

  const maksunMaara =
    onkoMaksullinen && isNumeric(maksullisuusMaksu)
      ? parseFloat(maksullisuusMaksu)
      : null;

  const osaamisalaLinkit = get(values, 'osaamisalat.osaamisalaLinkit') || {};
  const osaamisalaLinkkiOtsikot =
    get(values, 'osaamisalat.osaamisalaLinkkiOtsikot') || {};

  const osaamisalat = (get(values, 'osaamisalat.osaamisalat') || []).map(
    osaamisala => ({
      koodi: osaamisala,
      linkki: osaamisalaLinkit[osaamisala] || {},
      otsikko: osaamisalaLinkkiOtsikot[osaamisala] || {},
    }),
  );

  const yhteyshenkilot = (get(values, 'yhteyshenkilot') || []).map(
    ({ nimi, titteli, sahkoposti, puhelinnumero, verkkosivu }) => ({
      nimi: pick(nimi || {}, kielivalinta),
      titteli: pick(titteli || {}, kielivalinta),
      sahkoposti: pick(sahkoposti || {}, kielivalinta),
      puhelinnumero: pick(puhelinnumero || {}, kielivalinta),
      wwwSivu: pick(verkkosivu || {}, kielivalinta),
    }),
  );

  const ammattinimikkeet = toPairs(
    pick(get(values, 'nayttamistiedot.ammattinimikkeet') || {}, kielivalinta),
  ).flatMap(([language, nimikkeet]) => {
    return (nimikkeet || []).map(({ value }) => ({
      kieli: language,
      arvo: value,
    }));
  });

  const asiasanat = toPairs(
    pick(get(values, 'nayttamistiedot.avainsanat') || {}, kielivalinta),
  ).flatMap(([language, sanat]) => {
    return (sanat || []).map(({ value }) => ({
      kieli: language,
      arvo: value,
    }));
  });

  const onkoStipendia = Boolean(get(values, 'jarjestamistiedot.onkoStipendia'));

  const stipendinKuvaus = pick(
    get(values, 'jarjestamistiedot.stipendinKuvaus') || {},
    kielivalinta,
  );

  const stipendinMaara = pick(
    get(values, 'jarjestamistiedot.stipendinMaara') || {},
    kielivalinta,
  );

  const ylemmanKorkeakoulututkinnonOsaamisalat = getOsaamisalatByValues({
    osaamisalat: get(values, 'ylemmanKorkeakoulututkinnonOsaamisalat'),
    kielivalinta,
  });

  const alemmanKorkeakoulututkinnonOsaamisalat = getOsaamisalatByValues({
    osaamisalat: get(values, 'alemmanKorkeakoulututkinnonOsaamisalat'),
    kielivalinta,
  });

  return {
    nimi,
    tarjoajat,
    kielivalinta,
    metadata: {
      opetus: {
        lisatiedot: osiot,
        opetuskieliKoodiUrit: opetuskielet,
        onkoMaksullinen,
        maksunMaara,
        opetustapaKoodiUrit,
        opetusaikaKoodiUrit,
        opetuskieletKuvaus: opetuskieliKuvaus,
        opetustapaKuvaus,
        opetusaikaKuvaus,
        maksullisuusKuvaus,
        alkamisaikaKuvaus: alkamiskausiKuvaus,
        alkamiskausiKoodiUri,
        alkamisvuosi,
        onkoLukuvuosimaksua,
        lukuvuosimaksu,
        onkoStipendia,
        stipendinKuvaus,
        stipendinMaara,
      },
      osaamisalat,
      yhteyshenkilot,
      ammattinimikkeet,
      asiasanat,
      ylemmanKorkeakoulututkinnonOsaamisalat,
      alemmanKorkeakoulututkinnonOsaamisalat,
      kuvaus,
    },
  };
};

export const getValuesByToteutus = toteutus => {
  const {
    kielivalinta = [],
    nimi = {},
    tarjoajat = [],
    metadata = {},
  } = toteutus;

  const {
    kuvaus = {},
    ammattinimikkeet = [],
    asiasanat = [],
    opetus = {},
    osaamisalat: osaamisalatArg = [],
    ylemmanKorkeakoulututkinnonOsaamisalat: ylemmanKorkeakoulututkinnonOsaamisalatArg = [],
    alemmanKorkeakoulututkinnonOsaamisalat: alemmanKorkeakoulututkinnonOsaamisalatArg = [],
    yhteyshenkilot = [],
  } = metadata;

  const osaamisalat = osaamisalatArg.map(({ koodi }) => koodi);

  const { osaamisalaLinkit, osaamisalaLinkkiOtsikot } = osaamisalatArg.reduce(
    (acc, curr) => {
      const { koodi, linkki = {}, otsikko = {} } = curr;

      if (koodi) {
        acc.osaamisalaLinkit[koodi] = linkki;
        acc.osaamisalaLinkkiOtsikot[koodi] = otsikko;
      }

      return acc;
    },
    { osaamisalaLinkit: {}, osaamisalaLinkkiOtsikot: {} },
  );

  const { lisatiedot = [] } = opetus;

  const osiot = lisatiedot
    .filter(({ otsikkoKoodiUri }) => !!otsikkoKoodiUri)
    .map(({ otsikkoKoodiUri }) => ({ value: otsikkoKoodiUri }));

  const osioKuvaukset = lisatiedot.reduce((acc, curr) => {
    if (curr.otsikkoKoodiUri) {
      acc[curr.otsikkoKoodiUri] = curr.teksti || {};
    }

    return acc;
  }, {});

  const maksullistyyppi = get(opetus, 'onkoLukuvuosimaksua')
    ? 'lukuvuosimaksu'
    : get(opetus, 'onkoMaksullinen')
    ? 'kylla'
    : 'ei';

  return {
    nimi: {
      name: nimi,
    },
    kieliversiot: {
      languages: kielivalinta,
    },
    jarjestamispaikat: tarjoajat,
    jarjestamistiedot: {
      kuvaus,
      maksullisuus: {
        tyyppi: maksullistyyppi,
        maksu: (maksullistyyppi === 'lukuvuosimaksu'
          ? get(opetus, 'lukuvuosimaksu') || ''
          : get(opetus, 'maksunMaara') || ''
        ).toString(),
      },
      maksumaara: get(opetus, 'maksunMaara') || {},
      opetustapa: get(opetus, 'opetustapaKoodiUrit') || [],
      opetusaika: get(opetus, 'opetusaikaKoodiUrit') || [],
      opetuskieli: get(opetus, 'opetuskieliKoodiUrit') || [],
      opetusaikaKuvaus: get(opetus, 'opetusaikaKuvaus') || {},
      opetustapaKuvaus: get(opetus, 'opetustapaKuvaus') || {},
      opetuskieliKuvaus: get(opetus, 'opetuskieletKuvaus') || {},
      maksullisuusKuvaus: get(opetus, 'maksullisuusKuvaus') || {},
      osiot,
      osioKuvaukset,
      alkamiskausi: {
        kausi: get(opetus, 'alkamiskausiKoodiUri') || '',
        vuosi: { value: get(opetus, 'alkamisvuosi') || '' },
      },
      alkamiskausiKuvaus: get(opetus, 'alkamisaikaKuvaus') || {},
      onkoLukuvuosimaksua: get(opetus, 'onkoLukuvuosimaksua'),
      lukuvuosimaksu: get(opetus, 'lukuvuosimaksu') || {},
      lukuvuosimaksuKuvaus: get(opetus, 'lukuvuosimaksuKuvaus') || {},
      onkoStipendia: get(opetus, 'onkoStipendia'),
      stipendinMaara: get(opetus, 'stipendinMaara') || {},
      stipendinKuvaus: get(opetus, 'stipendinKuvaus') || {},
    },
    nayttamistiedot: {
      ammattinimikkeet: ammattinimikkeet.reduce((acc, curr) => {
        if (get(curr, 'kieli') && get(curr, 'arvo')) {
          acc[curr.kieli] = acc[curr.kieli] || [];
          acc[curr.kieli] = [
            ...acc[curr.kieli],
            { label: curr.arvo, value: curr.arvo },
          ];
        }

        return acc;
      }, {}),
      avainsanat: asiasanat.reduce((acc, curr) => {
        if (get(curr, 'kieli') && get(curr, 'arvo')) {
          acc[curr.kieli] = acc[curr.kieli] || [];
          acc[curr.kieli] = [
            ...acc[curr.kieli],
            { label: curr.arvo, value: curr.arvo },
          ];
        }

        return acc;
      }, {}),
    },
    yhteyshenkilot: yhteyshenkilot.map(
      ({ nimi, titteli, sahkoposti, wwwSivu, puhelinnumero }) => ({
        nimi: nimi || {},
        titteli: titteli || {},
        sahkoposti: sahkoposti || {},
        verkkosivu: wwwSivu || {},
        puhelinnumero: puhelinnumero || {},
      }),
    ),
    osaamisalat: {
      osaamisalat,
      osaamisalaLinkit,
      osaamisalaLinkkiOtsikot,
    },
    ylemmanKorkeakoulututkinnonOsaamisalat: ylemmanKorkeakoulututkinnonOsaamisalatArg,
    alemmanKorkeakoulututkinnonOsaamisalat: alemmanKorkeakoulututkinnonOsaamisalatArg,
    kuvaus: {
      kuvaus,
    },
  };
};

const validateEssentials = ({ errorBuilder, values }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateArrayMinLength('kieliversiot.languages', 1)
    .validateTranslations('nimi.name', kielivalinta);
};

const validateCommon = ({ values, errorBuilder }) => {
  let enhancedErrorBuilder = errorBuilder
    .validateArrayMinLength('jarjestamispaikat', 1)
    .validateArrayMinLength('jarjestamistiedot.opetusaika', 1)
    .validateArrayMinLength('jarjestamistiedot.opetuskieli', 1)
    .validateExistence('jarjestamistiedot.maksullisuus.tyyppi');

  return enhancedErrorBuilder;
};

const validateKorkeakoulu = ({ values, errorBuilder }) => {
  const kielivalinta = getKielivalinta(values);

  return errorBuilder
    .validateArray('ylemmanKorkeakoulututkinnonOsaamisalat', eb => {
      return eb.validateTranslations('nimi', kielivalinta);
    })
    .validateArray('alemmanKorkeakoulututkinnonOsaamisalat', eb => {
      return eb.validateTranslations('nimi', kielivalinta);
    });
};

export const validate = ({ tila, koulutustyyppi, values }) => {
  let errorBuilder = new ErrorBuilder({ values });

  errorBuilder = validateEssentials({ errorBuilder, values });

  if (tila === JULKAISUTILA.TALLENNETTU) {
    return errorBuilder.getErrors();
  }

  errorBuilder = validateCommon({ values, errorBuilder });

  if (KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi)) {
    errorBuilder = validateKorkeakoulu({ values, errorBuilder });
  }

  return errorBuilder.getErrors();
};
