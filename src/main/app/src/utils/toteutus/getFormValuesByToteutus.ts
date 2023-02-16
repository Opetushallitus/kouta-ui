import _fp from 'lodash/fp';

import { parseEditorState } from '#/src/components/Editor/utils';
import { MaaraTyyppi, ApurahaYksikko } from '#/src/constants';
import {
  ToteutusFormValues,
  MaksullisuusTyyppi,
  LukiolinjatOsio,
  LukioDiplomiValues,
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

const lukiolinjatiedotToFormValues = (lukiolinjatiedot): LukiolinjatOsio => {
  const result = {
    kaytossa: !_fp.isEmpty(lukiolinjatiedot),
    valinnat: [],
    kuvaukset: {},
  } as LukiolinjatOsio;

  lukiolinjatiedot?.forEach(lukiolinjatieto => {
    result.valinnat.push({ value: lukiolinjatieto.koodiUri });
    result.kuvaukset[lukiolinjatieto.koodiUri] = _fp.mapValues(
      parseEditorState,
      lukiolinjatieto.kuvaus ?? {}
    );
  });

  return result;
};

const diplomitToFormValues = diplomit => {
  const result: LukioDiplomiValues = {
    valinnat: [],
    linkit: [],
  };
  diplomit?.forEach(diplomi => {
    result.valinnat.push({
      value: diplomi?.koodiUri,
    });
    result.linkit.push({
      url: diplomi?.linkki,
      alt: diplomi?.linkinAltTeksti,
    });
  });

  return result;
};

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
    externalId,
    organisaatioOid,
  } = toteutus;

  const {
    kuvaus = {},
    ammattinimikkeet,
    asiasanat,
    opetus = {},
    osaamisalat,
    yhteyshenkilot,
    opintojenLaajuusNumero,
    opintojenLaajuusNumeroMin,
    opintojenLaajuusNumeroMax,
    opintojenLaajuusyksikkoKoodiUri,
    ilmoittautumislinkki,
    aloituspaikat,
    kielivalikoima = {},
    toteutusjaksot,
    ammatillinenPerustutkintoErityisopetuksena,
    jarjestetaanErityisopetuksena,
    painotukset,
    erityisetKoulutustehtavat,
    diplomit,
    yleislinja,
    hasJotpaRahoitus,
    isTaydennyskoulutus,
    isTyovoimakoulutus,
    isAvoinKorkeakoulutus,
    tunniste,
    opinnonTyyppiKoodiUri,
    taiteenalaKoodiUrit,
  } = metadata;

  const {
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
    organisaatioOid: toSelectValue(organisaatioOid),
    externalId,
    koulutustyyppi,
    tila,
    esikatselu,
    tiedot: {
      nimi: nimi ?? {},
      ammatillinenPerustutkintoErityisopetuksena: Boolean(
        ammatillinenPerustutkintoErityisopetuksena
      ),
      jarjestetaanErityisopetuksena: Boolean(jarjestetaanErityisopetuksena),
      hasJotpaRahoitus: Boolean(hasJotpaRahoitus),
      isTaydennyskoulutus: Boolean(isTaydennyskoulutus),
      isTyovoimakoulutus: Boolean(isTyovoimakoulutus),
      opintojenLaajuusNumero: _fp.isNumber(opintojenLaajuusNumero)
        ? opintojenLaajuusNumero.toString()
        : '',
      laajuusNumeroTyyppi:
        opintojenLaajuusNumeroMin === opintojenLaajuusNumeroMax
          ? MaaraTyyppi.YKSI_ARVO
          : MaaraTyyppi.VAIHTELUVALI,
      opintojenLaajuusNumeroMin: opintojenLaajuusNumeroMin,
      opintojenLaajuusNumeroMax: opintojenLaajuusNumeroMax,
      opintojenLaajuusyksikko: toSelectValue(opintojenLaajuusyksikkoKoodiUri),
      ilmoittautumislinkki: ilmoittautumislinkki || {},
      aloituspaikat: _fp.isNumber(aloituspaikat)
        ? aloituspaikat.toString()
        : '',
      isAvoinKorkeakoulutus: Boolean(isAvoinKorkeakoulutus),
      tunniste,
      opinnonTyyppi: {
        value: opinnonTyyppiKoodiUri,
      },
      taiteenalat: toSelectValueList(taiteenalaKoodiUrit),
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
        _fp.filter(({ otsikkoKoodiUri }) => Boolean(otsikkoKoodiUri)),
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
          ? MaaraTyyppi.YKSI_ARVO
          : MaaraTyyppi.VAIHTELUVALI,
      apurahaYksikko: toSelectValue(
        opetus?.apuraha?.yksikko ?? ApurahaYksikko.EURO
      ),
      apurahaKuvaus: _fp.mapValues(
        parseEditorState,
        opetus?.apuraha?.kuvaus || {}
      ),
      diplomit: diplomitToFormValues(diplomit),
      kielivalikoima: {
        A1Kielet: toSelectValueList(kielivalikoima.A1Kielet),
        A2Kielet: toSelectValueList(kielivalikoima.A2Kielet),
        aidinkielet: toSelectValueList(kielivalikoima.aidinkielet),
        B1Kielet: toSelectValueList(kielivalikoima.B1Kielet),
        B2Kielet: toSelectValueList(kielivalikoima.B2Kielet),
        B3Kielet: toSelectValueList(kielivalikoima.B3Kielet),
        muutKielet: toSelectValueList(kielivalikoima.muutKielet),
      },
      ajankohta: getAjankohtaFields(koulutuksenAlkamiskausi),
    },
    nayttamistiedot: {
      ammattinimikkeet: kieliArvoListToMultiSelectValue(ammattinimikkeet),
      avainsanat: kieliArvoListToMultiSelectValue(asiasanat),
    },
    yhteyshenkilot: _fp.map(
      ({
        nimi,
        titteli,
        sahkoposti,
        wwwSivu,
        wwwSivuTeksti,
        puhelinnumero,
      }) => ({
        nimi: nimi || {},
        titteli: titteli || {},
        sahkoposti: sahkoposti || {},
        verkkosivu: wwwSivu || {},
        verkkosivuTeksti: wwwSivuTeksti || {},
        puhelinnumero: puhelinnumero || {},
      })
    )(yhteyshenkilot),
    osaamisalat: {
      osaamisalat: _fp.map(({ koodiUri }) => koodiUri)(osaamisalat),
      osaamisalaLinkit,
      osaamisalaLinkkiOtsikot,
    },
    lukiolinjat: {
      yleislinja,
      painotukset: lukiolinjatiedotToFormValues(painotukset),
      erityisetKoulutustehtavat: lukiolinjatiedotToFormValues(
        erityisetKoulutustehtavat
      ),
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
    opintojaksojenLiittaminen: {
      opintojaksot: (metadata?.liitetytOpintojaksot || []).map(opintojakso => {
        return {
          opintojakso: {
            value: opintojakso,
          },
        };
      }),
    },
  };
};

export default getFormValuesByToteutus;
