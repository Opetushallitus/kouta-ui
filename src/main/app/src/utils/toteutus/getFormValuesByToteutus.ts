import _fp from 'lodash/fp';

import { parseEditorState } from '#/src/components/Editor/utils';
import { ApurahaMaaraTyyppi, ApurahaYksikko } from '#/src/constants';
import {
  ToteutusFormValues,
  MaksullisuusTyyppi,
} from '#/src/types/toteutusTypes';
import { toSelectValue, toSelectValueList } from '#/src/utils';
import { getAjankohtaFields } from '#/src/utils/form/aloitusajankohtaHelpers';
import parseSisaltoField from '#/src/utils/form/parseSisaltoField';

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

const getFormValuesByToteutus = (toteutus): ToteutusFormValues => {
  const {
    koulutustyyppi,
    kielivalinta,
    nimi,
    tarjoajat,
    metadata = {},
    tila,
    teemakuva,
    sorakuvausId,
    esikatselu = false,
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
    ammatillinenPerustutkintoErityisopetuksena,
  } = metadata;

  const {
    diplomiKoodiUrit,
    diplomiKuvaus,
    A1JaA2Kielivalikoima,
    aidinkieliKielivalikoima,
    B1Kielivalikoima,
    B2Kielivalikoima,
    B3Kielivalikoima,
    muuKielivalikoima,
    lisatiedot,
    koulutuksenAlkamiskausi = {},
    maksullisuustyyppi = MaksullisuusTyyppi.MAKSUTON,
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

  return {
    koulutustyyppi,
    tila,
    esikatselu,
    tiedot: {
      nimi: nimi ?? {},
      ammatillinenPerustutkintoErityisopetuksena: Boolean(
        ammatillinenPerustutkintoErityisopetuksena
      ),
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
      maksullisuustyyppi,
      maksunMaara: opetus?.maksunMaara,
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
      osiot: _fp.flow(
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
      onkoApuraha: opetus?.onkoApuraha,
      apurahaMin: opetus?.apuraha?.min,
      apurahaMax: opetus?.apuraha?.max,
      apurahaMaaraTyyppi:
        opetus?.apuraha?.min === opetus?.apuraha?.max
          ? ApurahaMaaraTyyppi.YKSI_ARVO
          : ApurahaMaaraTyyppi.VAIHTELUVALI,
      apurahaYksikko: toSelectValue(
        opetus?.apuraha?.yksikko ?? ApurahaYksikko.EURO
      ),
      apurahaKuvaus: _fp.mapValues(
        parseEditorState,
        opetus?.apuraha?.kuvaus || {}
      ),
      diplomiTyypit: toSelectValueList(diplomiKoodiUrit),
      diplomiKuvaus: _fp.mapValues(parseEditorState, diplomiKuvaus ?? {}),
      A1A2Kielet: toSelectValueList(A1JaA2Kielivalikoima),
      aidinkielet: toSelectValueList(aidinkieliKielivalikoima),
      B1Kielet: toSelectValueList(B1Kielivalikoima),
      B2Kielet: toSelectValueList(B2Kielivalikoima),
      B3Kielet: toSelectValueList(B3Kielivalikoima),
      muutKielet: toSelectValueList(muuKielivalikoima),
      ajankohta: getAjankohtaFields(koulutuksenAlkamiskausi),
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
