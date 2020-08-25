import _ from 'lodash/fp';
import parseSisaltoField from '#/src/utils/form/parseSisaltoField';
import { parseEditorState } from '#/src/components/Editor/utils';

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
    diplomiKoodiUrit = [],
    diplomiKuvaus = {},
    A1JaA2Kielivalikoima = [],
    aidinkieliKielivalikoima = [],
    B1Kielivalikoima = [],
    B2Kielivalikoima = [],
    B3Kielivalikoima = [],
    muuKielivalikoima = [],
    lisatiedot = [],
  } = opetus;

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

  const maksullisuustyyppi = opetus?.onkoLukuvuosimaksua
    ? 'lukuvuosimaksu'
    : opetus?.onkoMaksullinen
    ? 'kylla'
    : 'ei';

  return {
    tila,
    tiedot: {
      nimi,
      laajuus: _.isNumber(laajuus) ? laajuus.toString() : '',
      laajuusyksikko: laajuusyksikkoKoodiUri
        ? { value: laajuusyksikkoKoodiUri }
        : undefined,
      ilmoittautumislinkki: ilmoittautumislinkki || {},
      aloituspaikat: _.isNumber(aloituspaikat) ? aloituspaikat.toString() : '',
    },
    kuvaus: _.mapValues(parseEditorState, kuvaus || {}),
    kieliversiot: kielivalinta,
    tarjoajat,
    jarjestamistiedot: {
      maksullisuus: {
        tyyppi: maksullisuustyyppi,
        maksu: (maksullisuustyyppi === 'lukuvuosimaksu'
          ? opetus?.lukuvuosimaksu || ''
          : opetus?.maksunMaara || ''
        ).toString(),
      },
      maksumaara: opetus?.maksunMaara || {},
      opetustapa: opetus?.opetustapaKoodiUrit || [],
      opetusaika: opetus?.opetusaikaKoodiUrit || [],
      opetuskieli: opetus?.opetuskieliKoodiUrit || [],
      suunniteltuKestoKuvaus: opetus?.suunniteltuKestoKuvaus || {},
      suunniteltuKesto: {
        vuotta: opetus?.suunniteltuKestoVuodet,
        kuukautta: opetus?.suunniteltuKestoKuukaudet,
      },
      opetusaikaKuvaus: opetus?.opetusaikaKuvaus || {},
      opetustapaKuvaus: opetus?.opetustapaKuvaus || {},
      opetuskieliKuvaus: opetus?.opetuskieletKuvaus || {},
      maksullisuusKuvaus: opetus?.maksullisuusKuvaus || {},
      osiot: lisatiedot
        .filter(({ otsikkoKoodiUri }) => !!otsikkoKoodiUri)
        .map(({ otsikkoKoodiUri }) => ({ value: otsikkoKoodiUri })),
      osioKuvaukset: lisatiedot.reduce((acc, curr) => {
        if (curr.otsikkoKoodiUri) {
          acc[curr.otsikkoKoodiUri] = curr.teksti || {};
        }
        return acc;
      }, {}),
      onkoStipendia: opetus?.onkoStipendia ? 'kylla' : 'ei',
      stipendinMaara: opetus?.stipendinMaara,
      stipendinKuvaus: opetus?.stipendinKuvaus || {},
      diplomiTyypit: diplomiKoodiUrit.map(value => ({ value })),
      diplomiKuvaus,
      A1A2Kielet: A1JaA2Kielivalikoima.map(value => ({ value })),
      aidinkielet: aidinkieliKielivalikoima.map(value => ({
        value,
      })),
      B1Kielet: B1Kielivalikoima.map(value => ({ value })),
      B2Kielet: B2Kielivalikoima.map(value => ({ value })),
      B3Kielet: B3Kielivalikoima.map(value => ({ value })),
      muutKielet: muuKielivalikoima.map(value => ({ value })),
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
        if (curr?.kieli && curr?.arvo) {
          acc[curr.kieli] = acc[curr.kieli] || [];
          acc[curr.kieli] = [
            ...acc[curr.kieli],
            { label: curr.arvo, value: curr.arvo },
          ];
        }

        return acc;
      }, {}),
      avainsanat: asiasanat.reduce((acc, curr) => {
        if (curr?.kieli && curr?.arvo) {
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
      osaamisalat: osaamisalatArg.map(({ koodiUri }) => koodiUri),
      osaamisalaLinkit,
      osaamisalaLinkkiOtsikot,
    },
    ylemmanKorkeakoulututkinnonOsaamisalat: ylemmanKorkeakoulututkinnonOsaamisalatArg,
    alemmanKorkeakoulututkinnonOsaamisalat: alemmanKorkeakoulututkinnonOsaamisalatArg,
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
    tutkinnonOsat: (tutkinnonOsatMetadata || []).map(
      ({ tutkintoKoodiUri, osaamisalaKoodiUri, tutkinnonOsaKoodiUrit }) => ({
        tutkinto: tutkintoKoodiUri ? { value: tutkintoKoodiUri } : undefined,
        osaamisalaKoodiUri: osaamisalaKoodiUri
          ? { value: osaamisalaKoodiUri }
          : undefined,
        tutkinnonOsat: (tutkinnonOsaKoodiUrit || []).map(value => ({ value })),
      })
    ),
    teemakuva,
    hakeutumisTaiIlmoittautumistapa: {
      hakeutumisTaiIlmoittautumistapa: metadata?.hakulomaketyyppi,
      hakuTapa: metadata?.hakutermi,
      linkki: metadata?.hakulomakeLinkki,
      lisatiedot: _.mapValues(
        parseEditorState,
        metadata?.lisatietoaHakeutumisesta
      ),
      lisatiedotValintaperusteista: _.mapValues(
        parseEditorState,
        metadata?.lisatietoaValintaperusteista
      ),
      hakuaikaAlkaa: metadata?.hakuaika?.alkaa,
      hakuaikaPaattyy: metadata?.hakuaika?.paattyy,
    },
  };
};

export default getFormValuesByToteutus;
