import { parseEditorState } from '#/src/components/Editor/utils';
import { toSelectValue } from '#/src/utils';
import parseSisaltoField from '#/src/utils/form/parseSisaltoField';
import _fp from 'lodash/fp';

const kieliArvoListToMultiSelectValue = _fp.reduce((acc, curr: any) => {
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

  const { osaamisalaLinkit, osaamisalaLinkkiOtsikot } = _fp.reduce(
    (acc, curr: any) => {
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
      laajuus: _fp.isNumber(laajuus) ? laajuus.toString() : '',
      laajuusyksikko: toSelectValue(laajuusyksikkoKoodiUri),
      ilmoittautumislinkki: ilmoittautumislinkki || {},
      aloituspaikat: _fp.isNumber(aloituspaikat)
        ? aloituspaikat.toString()
        : '',
    },
    kuvaus: _fp.mapValues(parseEditorState, kuvaus || {}),
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
      suunniteltuKestoKuvaus: _fp.mapValues(
        parseEditorState,
        opetus?.suunniteltuKestoKuvaus || {}
      ),
      suunniteltuKesto: {
        vuotta: opetus?.suunniteltuKestoVuodet,
        kuukautta: opetus?.suunniteltuKestoKuukaudet,
      },
      opetusaikaKuvaus: _fp.mapValues(
        parseEditorState,
        opetus?.opetusaikaKuvaus || {}
      ),
      opetustapaKuvaus: _fp.mapValues(
        parseEditorState,
        opetus?.opetustapaKuvaus || {}
      ),
      opetuskieliKuvaus: _fp.mapValues(
        parseEditorState,
        opetus?.opetuskieletKuvaus || {}
      ),
      maksullisuusKuvaus: _fp.mapValues(
        parseEditorState,
        opetus?.maksullisuusKuvaus || {}
      ),
      osiot: _fp.pipe(
        _fp.filter(({ otsikkoKoodiUri }) => !!otsikkoKoodiUri),
        _fp.map(({ otsikkoKoodiUri }) => ({ value: otsikkoKoodiUri }))
      )(lisatiedot),
      osioKuvaukset: _fp.reduce((acc, curr: any) => {
        if (curr.otsikkoKoodiUri) {
          acc[curr.otsikkoKoodiUri] = _fp.mapValues(
            parseEditorState,
            curr.teksti || {}
          );
        }
        return acc;
      }, {})(lisatiedot),
      onkoStipendia: opetus?.onkoStipendia ? 'kylla' : 'ei',
      stipendinMaara: opetus?.stipendinMaara,
      stipendinKuvaus: _fp.mapValues(
        parseEditorState,
        opetus?.stipendinKuvaus || {}
      ),
      diplomiTyypit: _fp.map(toSelectValue)(diplomiKoodiUrit),
      diplomiKuvaus: _fp.mapValues(parseEditorState, diplomiKuvaus ?? {}),
      A1A2Kielet: _fp.map(toSelectValue)(A1JaA2Kielivalikoima),
      aidinkielet: _fp.map(toSelectValue)(aidinkieliKielivalikoima),
      B1Kielet: _fp.map(toSelectValue)(B1Kielivalikoima),
      B2Kielet: _fp.map(toSelectValue)(B2Kielivalikoima),
      B3Kielet: _fp.map(toSelectValue)(B3Kielivalikoima),
      muutKielet: _fp.map(toSelectValue)(muuKielivalikoima),
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
    yhteyshenkilot: _fp.map(
      ({ nimi, titteli, sahkoposti, wwwSivu, puhelinnumero }) => ({
        nimi: nimi || {},
        titteli: titteli || {},
        sahkoposti: sahkoposti || {},
        verkkosivu: wwwSivu || {},
        puhelinnumero: puhelinnumero || {},
      })
    )(yhteyshenkilot),
    osaamisalat: {
      osaamisalat: _fp.map(({ koodiUri }) => koodiUri)(osaamisalat),
      osaamisalaLinkit,
      osaamisalaLinkkiOtsikot,
    },
    ylemmanKorkeakoulututkinnonOsaamisalat:
      _fp.map(({ kuvaus, nimi, linkki, otsikko }) => ({
        kuvaus: _fp.mapValues(parseEditorState, kuvaus),
        nimi,
        linkki,
        otsikko,
      }))(ylemmanKorkeakoulututkinnonOsaamisalat) ?? [],
    alemmanKorkeakoulututkinnonOsaamisalat:
      _fp.map(({ kuvaus, nimi, linkki, otsikko }) => ({
        kuvaus: _fp.mapValues(parseEditorState, kuvaus),
        nimi,
        linkki,
        otsikko,
      }))(alemmanKorkeakoulututkinnonOsaamisalat) ?? [],
    lukiolinjat: {
      lukiolinja: lukiolinjaKoodiUri
        ? { value: lukiolinjaKoodiUri }
        : undefined,
    },
    toteutusjaksot: _fp.map(
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
        kuvaus: _fp.mapValues(parseEditorState, kuvaus),
        sisalto: parseSisaltoField(sisalto),
      })
    )(toteutusjaksot),
    tutkinnonOsat: _fp.map(
      ({ tutkintoKoodiUri, osaamisalaKoodiUri, tutkinnonOsaKoodiUrit }) => ({
        tutkinto: toSelectValue(tutkintoKoodiUri),
        osaamisalaKoodiUri: toSelectValue(osaamisalaKoodiUri),
        tutkinnonOsat: _fp.map(toSelectValue)(tutkinnonOsaKoodiUrit),
      })
    )(tutkinnonOsat),
    teemakuva,
    hakeutumisTaiIlmoittautumistapa: {
      hakeutumisTaiIlmoittautumistapa: metadata?.hakulomaketyyppi,
      hakuTapa: metadata?.hakutermi,
      linkki: metadata?.hakulomakeLinkki,
      lisatiedot: _fp.mapValues(
        parseEditorState,
        metadata?.lisatietoaHakeutumisesta
      ),
      lisatiedotValintaperusteista: _fp.mapValues(
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
