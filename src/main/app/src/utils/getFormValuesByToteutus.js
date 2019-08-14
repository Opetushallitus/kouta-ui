import get from 'lodash/get';

const getFormValuesByToteutus = toteutus => {
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
    diplomiKoodiUrit,
    diplomiKuvaus,
    A1JaA2Kielivalikoima,
    aidinkieliKielivalikoima,
    B1Kielivalikoima,
    B2Kielivalikoima,
    B3Kielivalikoima,
    muuKielivalikoima,
    lukiolinjaKoodiUri,
    jaksonKuvaus,
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
    nimi: nimi,
    kieliversiot: kielivalinta,
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
      diplomiTyypit: (diplomiKoodiUrit || []).map(value => ({ value })),
      diplomiKuvaus: diplomiKuvaus || {},
      A1A2Kielet: (A1JaA2Kielivalikoima || []).map(value => ({ value })),
      aidinkielet: (aidinkieliKielivalikoima || []).map(value => ({
        value,
      })),
      B1Kielet: (B1Kielivalikoima || []).map(value => ({ value })),
      B2Kielet: (B2Kielivalikoima || []).map(value => ({ value })),
      B3Kielet: (B3Kielivalikoima || []).map(value => ({ value })),
      muutKielet: (muuKielivalikoima || []).map(value => ({ value })),
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
    kuvaus,
    lukiolinjat: {
      linja: lukiolinjaKoodiUri ? { value: lukiolinjaKoodiUri } : '',
      jaksonKuvaus: jaksonKuvaus || {},
    },
  };
};

export default getFormValuesByToteutus;
