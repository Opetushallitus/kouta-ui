import { get, isNumber } from 'lodash';
import parseSisaltoField from '#/src/utils/form/parseSisaltoField';

const getFormValuesByToteutus = toteutus => {
  const {
    kielivalinta = [],
    nimi = {},
    tarjoajat = [],
    metadata = {},
    tila,
    teemakuva,
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
    lukiolinjaKoodiUri,
    laajuus,
    laajuusyksikkoKoodiUri,
    ilmoittautumislinkki,
    aloituspaikat,
    toteutusjaksot,
    tutkinnonOsat: tutkinnonOsatMetadata,
  } = metadata;

  const {
    koulutuksenAlkamispaivamaara,
    koulutuksenPaattymispaivamaara,
    koulutuksenAlkamiskausi,
    koulutuksenAlkamisvuosi,
    koulutuksenTarkkaAlkamisaika,
    diplomiKoodiUrit,
    diplomiKuvaus,
    A1JaA2Kielivalikoima,
    aidinkieliKielivalikoima,
    B1Kielivalikoima,
    B2Kielivalikoima,
    B3Kielivalikoima,
    muuKielivalikoima,
  } = opetus;

  const osaamisalat = osaamisalatArg.map(({ koodiUri }) => koodiUri);

  const { osaamisalaLinkit, osaamisalaLinkkiOtsikot } = osaamisalatArg.reduce(
    (acc, curr) => {
      const { koodiUri, linkki = {}, otsikko = {} } = curr;

      if (koodiUri) {
        acc.osaamisalaLinkit[koodiUri] = linkki;
        acc.osaamisalaLinkkiOtsikot[koodiUri] = otsikko;
      }

      return acc;
    },
    { osaamisalaLinkit: {}, osaamisalaLinkkiOtsikot: {} }
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

  const tutkinnonOsat = (tutkinnonOsatMetadata || []).map(
    ({ tutkintoKoodiUri, osaamisalaKoodiUri, tutkinnonOsaKoodiUrit }) => ({
      tutkinto: tutkintoKoodiUri ? { value: tutkintoKoodiUri } : undefined,
      osaamisalaKoodiUri: osaamisalaKoodiUri
        ? { value: osaamisalaKoodiUri }
        : undefined,
      tutkinnonOsat: (tutkinnonOsaKoodiUrit || []).map(value => ({ value })),
    })
  );

  return {
    tila,
    tiedot: {
      nimi,
      toteutuksenKuvaus: kuvaus,
      laajuus: isNumber(laajuus) ? laajuus.toString() : '',
      laajuusyksikko: laajuusyksikkoKoodiUri
        ? { value: laajuusyksikkoKoodiUri }
        : undefined,
      ilmoittautumislinkki: ilmoittautumislinkki || {},
      aloituspaikat: isNumber(aloituspaikat) ? aloituspaikat.toString() : '',
    },
    kieliversiot: kielivalinta,
    tarjoajat,
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
      suunniteltuKestoKuvaus: opetus?.suunniteltuKestoKuvaus || {},
      suunniteltuKesto: {
        vuotta: opetus?.suunniteltuKestoVuodet,
        kuukautta: opetus?.suunniteltuKestoKuukaudet,
      },
      opetusaikaKuvaus: get(opetus, 'opetusaikaKuvaus') || {},
      opetustapaKuvaus: get(opetus, 'opetustapaKuvaus') || {},
      opetuskieliKuvaus: get(opetus, 'opetuskieletKuvaus') || {},
      maksullisuusKuvaus: get(opetus, 'maksullisuusKuvaus') || {},
      osiot,
      osioKuvaukset,
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
      koulutuksenAlkamispaivamaara: koulutuksenAlkamispaivamaara
        ? new Date(koulutuksenAlkamispaivamaara)
        : '',
      koulutuksenPaattymispaivamaara: koulutuksenPaattymispaivamaara
        ? new Date(koulutuksenPaattymispaivamaara)
        : '',
      koulutuksenTarkkaAlkamisaika: koulutuksenTarkkaAlkamisaika,
      koulutuksenAlkamiskausi: koulutuksenAlkamiskausi,
      koulutuksenAlkamisvuosi: koulutuksenAlkamisvuosi
        ? { value: koulutuksenAlkamisvuosi }
        : undefined,
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
      })
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
      lukiolinja: lukiolinjaKoodiUri
        ? { value: lukiolinjaKoodiUri }
        : undefined,
    },
    toteutusjaksot: (toteutusjaksot || []).map(
      ({ nimi, koodi, laajuus, ilmoittautumislinkki, kuvaus, sisalto }) => ({
        nimi: nimi || {},
        koodi: koodi || '',
        laajuus: laajuus || {},
        ilmoittautumislinkki: ilmoittautumislinkki || {},
        kuvaus: kuvaus || {},
        sisalto: parseSisaltoField(sisalto),
      })
    ),
    tutkinnonOsat,
    teemakuva,
  };
};

export default getFormValuesByToteutus;
