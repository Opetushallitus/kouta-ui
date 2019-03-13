import get from 'lodash/get';
import toPairs from 'lodash/toPairs';
import flatMap from 'lodash/flatMap';
import pick from 'lodash/pick';

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
  const tarjoajat = get(values, 'jarjestamispaikat.jarjestajat') || [];
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
  const nimi = pick(get(values, 'nimi.name') || {}, kielivalinta);
  const opetuskielet = get(values, 'jarjestamistiedot.opetuskieli') || [];
  const kuvaus = pick(get(values, 'kuvaus.kuvaus') || {}, kielivalinta);
  const osioKuvaukset = get(values, 'jarjestamistiedot.osioKuvaukset') || {};
  const opetustapaKoodiUrit = get(values, 'jarjestamistiedot.opetustapa') || [];
  const opetusaikaKoodiUri = get(values, 'jarjestamistiedot.opetusaika');

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

  const onkoMaksullinen =
    get(values, 'jarjestamistiedot.maksullisuus') === 'kylla';

  const maksunMaara = pick(
    get(values, 'jarjestamistiedot.maksumaara') || {},
    kielivalinta,
  );

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

  const yhteystieto = {
    nimi: pick(get(values, 'yhteystiedot.name') || {}, kielivalinta),
    titteli: pick(get(values, 'yhteystiedot.title') || {}, kielivalinta),
    sahkoposti: pick(get(values, 'yhteystiedot.email') || {}, kielivalinta),
    puhelinnumero: pick(get(values, 'yhteystiedot.phone') || {}, kielivalinta),
    wwwSivu: pick(get(values, 'yhteystiedot.website') || {}, kielivalinta),
  };

  const ammattinimikkeet = flatMap(
    toPairs(
      pick(get(values, 'nayttamistiedot.ammattinimikkeet') || {}, kielivalinta),
    ),
    ([language, nimikkeet]) => {
      return (nimikkeet || []).map(({ value }) => ({
        kieli: language,
        arvo: value,
      }));
    },
  );

  const asiasanat = flatMap(
    toPairs(
      pick(get(values, 'nayttamistiedot.avainsanat') || {}, kielivalinta),
    ),
    ([language, sanat]) => {
      return (sanat || []).map(({ value }) => ({
        kieli: language,
        arvo: value,
      }));
    },
  );

  const onkoLukuvuosimaksua =
    get(values, 'jarjestamistiedot.onkoLukuvuosimaksua') === 'kylla';

  const lukuvuosimaksuKuvaus = pick(
    get(values, 'jarjestamistiedot.lukuvuosimaksuKuvaus') || {},
    kielivalinta,
  );

  const lukuvuosimaksu = pick(
    get(values, 'jarjestamistiedot.lukuvuosimaksu') || {},
    kielivalinta,
  );

  const onkoStipendia =
    get(values, 'jarjestamistiedot.onkoStipendia') === 'kylla';

  const stipendinKuvaus = pick(
    get(values, 'jarjestamistiedot.stipendinKuvaus') || {},
    kielivalinta,
  );

  const stipendinMaara = pick(
    get(values, 'jarjestamistiedot.stipendinMaara') || {},
    kielivalinta,
  );

  const ylemmanKorkeakoulututkinnonOsaamisalat = getOsaamisalatByValues({
    osaamisalat: get(
      values,
      'ylemmanKorkeakoulututkinnonOsaamisalat.osaamisalat',
    ),
    kielivalinta,
  });

  const alemmanKorkeakoulututkinnonOsaamisalat = getOsaamisalatByValues({
    osaamisalat: get(
      values,
      'alemmanKorkeakoulututkinnonOsaamisalat.osaamisalat',
    ),
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
        opetusaikaKoodiUri,
        opetuskieletKuvaus: opetuskieliKuvaus,
        opetustapaKuvaus,
        opetusaikaKuvaus,
        maksullisuusKuvaus,
        alkamisaikaKuvaus: alkamiskausiKuvaus,
        alkamiskausiKoodiUri,
        alkamisvuosi,
        onkoLukuvuosimaksua,
        lukuvuosimaksu,
        lukuvuosimaksuKuvaus,
        onkoStipendia,
        stipendinKuvaus,
        stipendinMaara,
      },
      osaamisalat,
      yhteystieto,
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
    yhteystieto = {},
    opetus = {},
    osaamisalat: osaamisalatArg = [],
    ylemmanKorkeakoulututkinnonOsaamisalat: ylemmanKorkeakoulututkinnonOsaamisalatArg = [],
    alemmanKorkeakoulututkinnonOsaamisalat: alemmanKorkeakoulututkinnonOsaamisalatArg = [],
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

  return {
    nimi: {
      name: nimi,
    },
    kieliversiot: {
      languages: kielivalinta,
    },
    jarjestamispaikat: {
      jarjestajat: tarjoajat,
    },
    jarjestamistiedot: {
      kuvaus,
      maksullisuus: get(opetus, 'onkoMaksullinen') ? 'kylla' : 'ei',
      maksumaara: get(opetus, 'maksunMaara') || {},
      opetustapa: get(opetus, 'opetustapaKoodiUrit') || [],
      opetusaika: get(opetus, 'opetusaikaKoodiUri') || '',
      opetuskieli: get(opetus, 'opetuskieliKoodiUrit') || [],
      opetusaikaKuvaus: get(opetus, 'opetusaikaKuvaus') || {},
      opetustapaKuvaus: get(opetus, 'opetustapaKuvaus') || {},
      opetuskieliKuvaus: get(opetus, 'opetuskieletKuvaus') || {},
      maksullisuusKuvaus: get(opetus, 'maksullisuusKuvaus') || {},
      osiot,
      osioKuvaukset,
      alkamiskausi: {
        kausi: get(opetus, 'alkamiskausiKoodiUri') || '',
        vuosi: get(opetus, 'alkamisvuosi') || '',
      },
      alkamiskausiKuvaus: get(opetus, 'alkamisaikaKuvaus') || {},
      onkoLukuvuosimaksua: get(opetus, 'onkoLukuvuosimaksua') ? 'kylla' : 'ei',
      lukuvuosimaksu: get(opetus, 'lukuvuosimaksu') || {},
      lukuvuosimaksuKuvaus: get(opetus, 'lukuvuosimaksuKuvaus') || {},
      onkoStipendia: get(opetus, 'onkoStipendia') ? 'kylla' : 'ei',
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
    yhteystiedot: {
      name: get(yhteystieto, 'nimi') || {},
      title: get(yhteystieto, 'titteli') || {},
      email: get(yhteystieto, 'sahkoposti') || {},
      phone: get(yhteystieto, 'puhelinnumero') || {},
      website: get(yhteystieto, 'wwwSivu') || {},
    },
    osaamisalat: {
      osaamisalat,
      osaamisalaLinkit,
      osaamisalaLinkkiOtsikot,
    },
    ylemmanKorkeakoulututkinnonOsaamisalat: {
      osaamisalat: ylemmanKorkeakoulututkinnonOsaamisalatArg,
    },
    alemmanKorkeakoulututkinnonOsaamisalat: {
      osaamisalat: alemmanKorkeakoulututkinnonOsaamisalatArg,
    },
    kuvaus: {
      kuvaus,
    },
  };
};
