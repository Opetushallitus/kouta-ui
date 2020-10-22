import _ from 'lodash/fp';
import parseSisaltoField from '#/src/utils/form/parseSisaltoField';
import { parseEditorState } from '#/src/components/Editor/utils';

const toSelectValue = value => (_.isNil(value) ? null : { value });

const kieliArvoListToMultiSelectValue = _.reduce((acc, curr) => {
  if (curr?.kieli && curr?.arvo) {
    return {
      ...acc,
      [curr.kieli]: [
        ...(acc[curr.kieli] ?? []),
        { label: curr.arvo, value: curr.arvo },
      ],
    };
  }

  return acc;
}, {});

const getFormValuesByToteutus = toteutus => {
  const {
    kielivalinta,
    nimi,
    tarjoajat,
    metadata = {},
    tila,
    teemakuva,
    sorakuvausId,
  } = toteutus;

  const {
    kuvaus = {},
    ammattinimikkeet,
    asiasanat,
    opetus = {},
    osaamisalat,
    ylemmanKorkeakoulututkinnonOsaamisalat,
    alemmanKorkeakoulututkinnonOsaamisalat,
    yhteyshenkilot,
    lukiolinjaKoodiUri,
    laajuus,
    laajuusyksikkoKoodiUri,
    ilmoittautumislinkki,
    aloituspaikat,
    toteutusjaksot,
    tutkinnonOsat,
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
    lisatiedot,
  } = opetus;

  const { osaamisalaLinkit, osaamisalaLinkkiOtsikot } = _.reduce(
    (acc, curr) => {
      const { koodiUri, linkki = {}, otsikko = {} } = curr;

      if (koodiUri) {
        acc.osaamisalaLinkit[koodiUri] = linkki;
        acc.osaamisalaLinkkiOtsikot[koodiUri] = otsikko;
      }

      return acc;
    },
    { osaamisalaLinkit: {}, osaamisalaLinkkiOtsikot: {} }
  )(osaamisalat);

  const maksullisuustyyppi = opetus?.onkoLukuvuosimaksua
    ? 'lukuvuosimaksu'
    : opetus?.onkoMaksullinen
    ? 'kylla'
    : 'ei';

  return {
    tila,
    tiedot: {
      nimi: nimi ?? {},
      laajuus: _.isNumber(laajuus) ? laajuus.toString() : '',
      laajuusyksikko: toSelectValue(laajuusyksikkoKoodiUri),
      ilmoittautumislinkki: ilmoittautumislinkki || {},
      aloituspaikat: _.isNumber(aloituspaikat) ? aloituspaikat.toString() : '',
    },
    kuvaus: _.mapValues(parseEditorState, kuvaus || {}),
    kieliversiot: kielivalinta ?? [],
    tarjoajat: tarjoajat ?? [],
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
      osiot: _.pipe(
        _.filter(({ otsikkoKoodiUri }) => !!otsikkoKoodiUri),
        _.map(({ otsikkoKoodiUri }) => ({ value: otsikkoKoodiUri }))
      )(lisatiedot),
      osioKuvaukset: _.reduce((acc, curr) => {
        if (curr.otsikkoKoodiUri) {
          acc[curr.otsikkoKoodiUri] = curr.teksti || {};
        }
        return acc;
      }, {})(lisatiedot),
      onkoStipendia: opetus?.onkoStipendia ? 'kylla' : 'ei',
      stipendinMaara: opetus?.stipendinMaara,
      stipendinKuvaus: opetus?.stipendinKuvaus || {},
      diplomiTyypit: _.map(toSelectValue)(diplomiKoodiUrit),
      diplomiKuvaus: diplomiKuvaus ?? {},
      A1A2Kielet: _.map(toSelectValue)(A1JaA2Kielivalikoima),
      aidinkielet: _.map(toSelectValue)(aidinkieliKielivalikoima),
      B1Kielet: _.map(toSelectValue)(B1Kielivalikoima),
      B2Kielet: _.map(toSelectValue)(B2Kielivalikoima),
      B3Kielet: _.map(toSelectValue)(B3Kielivalikoima),
      muutKielet: _.map(toSelectValue)(muuKielivalikoima),
      koulutuksenAlkamispaivamaara: koulutuksenAlkamispaivamaara
        ? new Date(koulutuksenAlkamispaivamaara)
        : '',
      koulutuksenPaattymispaivamaara: koulutuksenPaattymispaivamaara
        ? new Date(koulutuksenPaattymispaivamaara)
        : '',
      koulutuksenTarkkaAlkamisaika: koulutuksenTarkkaAlkamisaika,
      koulutuksenAlkamiskausi: koulutuksenAlkamiskausi,
      koulutuksenAlkamisvuosi: toSelectValue(koulutuksenAlkamisvuosi),
    },
    nayttamistiedot: {
      ammattinimikkeet: kieliArvoListToMultiSelectValue(ammattinimikkeet),
      avainsanat: kieliArvoListToMultiSelectValue(asiasanat),
    },
    yhteyshenkilot: _.map(
      ({ nimi, titteli, sahkoposti, wwwSivu, puhelinnumero }) => ({
        nimi: nimi || {},
        titteli: titteli || {},
        sahkoposti: sahkoposti || {},
        verkkosivu: wwwSivu || {},
        puhelinnumero: puhelinnumero || {},
      })
    )(yhteyshenkilot),
    osaamisalat: {
      osaamisalat: _.map(({ koodiUri }) => koodiUri)(osaamisalat),
      osaamisalaLinkit,
      osaamisalaLinkkiOtsikot,
    },
    ylemmanKorkeakoulututkinnonOsaamisalat:
      ylemmanKorkeakoulututkinnonOsaamisalat ?? [],
    alemmanKorkeakoulututkinnonOsaamisalat:
      alemmanKorkeakoulututkinnonOsaamisalat ?? [],
    lukiolinjat: {
      lukiolinja: lukiolinjaKoodiUri
        ? { value: lukiolinjaKoodiUri }
        : undefined,
    },
    toteutusjaksot: _.map(
      ({
        nimi = {},
        koodi = '',
        laajuus = {},
        ilmoittautumislinkki = {},
        kuvaus = {},
        sisalto,
      }) => ({
        nimi,
        koodi,
        laajuus,
        ilmoittautumislinkki,
        kuvaus,
        sisalto: parseSisaltoField(sisalto),
      })
    )(toteutusjaksot),
    tutkinnonOsat: _.map(
      ({ tutkintoKoodiUri, osaamisalaKoodiUri, tutkinnonOsaKoodiUrit }) => ({
        tutkinto: toSelectValue(tutkintoKoodiUri),
        osaamisalaKoodiUri: toSelectValue(osaamisalaKoodiUri),
        tutkinnonOsat: _.map(toSelectValue)(tutkinnonOsaKoodiUrit),
      })
    )(tutkinnonOsat),
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
    soraKuvaus: toSelectValue(sorakuvausId),
  };
};

export default getFormValuesByToteutus;
