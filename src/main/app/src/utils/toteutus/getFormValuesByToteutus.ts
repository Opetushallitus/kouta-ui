import { isEmpty, isNumber, mapValues } from 'lodash';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import {
  MaaraTyyppi,
  ApurahaYksikko,
  HAKULOMAKETYYPPI,
  Hakeutumistapa,
  KOULUTUSTYYPPI,
  JULKAISUTILA,
} from '#/src/constants';
import {
  AnyToteutusMetadata,
  LukiodiplomiTieto,
  LukiolinjaTieto,
  ToteutusModel,
} from '#/src/types/domainTypes';
import {
  ToteutusFormValues,
  MaksullisuusTyyppi,
  LukiolinjatOsio,
  LukioDiplomiValues,
} from '#/src/types/toteutusTypes';
import {
  kieliArvoListToMultiSelectValue,
  toEnum,
  toSelectValue,
  toSelectValueList,
} from '#/src/utils';
import { getAjankohtaFields } from '#/src/utils/form/aloitusajankohtaHelpers';

const lukiolinjatiedotToFormValues = (
  lukiolinjatiedot: Array<LukiolinjaTieto> | undefined
): LukiolinjatOsio => {
  const result = {
    kaytossa: !isEmpty(lukiolinjatiedot),
    valinnat: [],
    kuvaukset: {},
  } as LukiolinjatOsio;

  lukiolinjatiedot?.forEach(({ koodiUri, kuvaus }) => {
    if (koodiUri === undefined) return;
    result.valinnat.push({ value: koodiUri });
    result.kuvaukset[koodiUri] = mapValues(kuvaus ?? {}, parseEditorState);
  });

  return result;
};

const diplomitToFormValues = (
  diplomit: Array<LukiodiplomiTieto> | undefined
): LukioDiplomiValues => {
  const result: LukioDiplomiValues = {
    valinnat: [],
    linkit: [],
  };
  diplomit?.forEach(diplomi => {
    result.valinnat.push({
      value: diplomi?.koodiUri,
    });
    result.linkit.push({
      url: diplomi?.linkki ?? {},
      alt: diplomi?.linkinAltTeksti ?? {},
    });
  });

  return result;
};

// fallback aiemmin tallennetuille toteutuksille joilta puuttuu isHakukohteetKaytossa-tieto
export const hakukohteetKaytossaToFormValues = (
  metadata: AnyToteutusMetadata
) => {
  return (
    metadata?.isHakukohteetKaytossa ??
    (metadata?.hakulomaketyyppi &&
      metadata?.hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU)
  );
};

const getFormValuesByToteutus = (
  toteutus: ToteutusModel
): ToteutusFormValues => {
  const {
    kielivalinta,
    nimi,
    tarjoajat,
    tila,
    teemakuva,
    sorakuvausId,
    esikatselu = false,
    externalId,
    organisaatioOid,
  } = toteutus;

  const metadata: AnyToteutusMetadata = toteutus.metadata ?? {};

  const {
    kuvaus = {},
    ammattinimikkeet,
    asiasanat,
    opetus = {},
    osaamisalat = [],
    yhteyshenkilot = [],
    opintojenLaajuusNumero,
    opintojenLaajuusNumeroMin,
    opintojenLaajuusNumeroMax,
    opintojenLaajuusyksikkoKoodiUri,
    aloituspaikat,
    aloituspaikkakuvaus,
    kielivalikoima = {},
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
    isPieniOsaamiskokonaisuus,
    suoritetaanNayttona,
    tunniste,
    opinnonTyyppiKoodiUri,
    taiteenalaKoodiUrit,
    tyyppi,
    osaamistavoitteet,
  } = metadata;

  const {
    lisatiedot = [],
    koulutuksenAlkamiskausi = {},
    maksullisuustyyppi = MaksullisuusTyyppi.MAKSUTON,
  } = opetus;

  const { osaamisalaLinkit, osaamisalaLinkkiOtsikot } = osaamisalat.reduce(
    (acc, curr: any) => {
      const { koodiUri, linkki = {}, otsikko = {} } = curr;

      if (koodiUri) {
        acc.osaamisalaLinkit[koodiUri] = linkki;
        acc.osaamisalaLinkkiOtsikot[koodiUri] = otsikko;
      }

      return acc;
    },
    { osaamisalaLinkit: {}, osaamisalaLinkkiOtsikot: {} }
  );

  return {
    organisaatioOid: toSelectValue(organisaatioOid),
    externalId,
    koulutustyyppi: toEnum(KOULUTUSTYYPPI, tyyppi),
    tila: toEnum(JULKAISUTILA, tila),
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
      suoritetaanNayttona: Boolean(suoritetaanNayttona),
      opintojenLaajuusNumero: isNumber(opintojenLaajuusNumero)
        ? opintojenLaajuusNumero.toString()
        : '',
      laajuusNumeroTyyppi:
        opintojenLaajuusNumeroMin === opintojenLaajuusNumeroMax
          ? MaaraTyyppi.YKSI_ARVO
          : MaaraTyyppi.VAIHTELUVALI,
      opintojenLaajuusNumeroMin: opintojenLaajuusNumeroMin?.toString(),
      opintojenLaajuusNumeroMax: opintojenLaajuusNumeroMax?.toString(),
      opintojenLaajuusyksikko: toSelectValue(opintojenLaajuusyksikkoKoodiUri),
      isAvoinKorkeakoulutus: Boolean(isAvoinKorkeakoulutus),
      isPieniOsaamiskokonaisuus: Boolean(isPieniOsaamiskokonaisuus),
      tunniste,
      opinnonTyyppi: {
        value: opinnonTyyppiKoodiUri,
      },
      taiteenalat: toSelectValueList(taiteenalaKoodiUrit),
    },
    description: {
      kuvaus: mapValues(kuvaus ?? {}, parseEditorState),
      osaamistavoitteet: mapValues(osaamistavoitteet ?? {}, parseEditorState),
    },
    kieliversiot: kielivalinta ?? [],
    tarjoajat: tarjoajat ?? [],
    jarjestamistiedot: {
      maksullisuustyyppi: toEnum(MaksullisuusTyyppi, maksullisuustyyppi),
      maksunMaara: opetus?.maksunMaara,
      opetustapa: opetus?.opetustapaKoodiUrit || [],
      opetusaika: opetus?.opetusaikaKoodiUrit || [],
      opetuskieli: opetus?.opetuskieliKoodiUrit || [],
      suunniteltuKestoKuvaus: mapValues(
        opetus?.suunniteltuKestoKuvaus ?? {},
        parseEditorState
      ),
      suunniteltuKesto: {
        vuotta: opetus?.suunniteltuKestoVuodet,
        kuukautta: opetus?.suunniteltuKestoKuukaudet,
      },
      opetusaikaKuvaus: mapValues(
        opetus?.opetusaikaKuvaus ?? {},
        parseEditorState
      ),
      opetustapaKuvaus: mapValues(
        opetus?.opetustapaKuvaus ?? {},
        parseEditorState
      ),
      opetuskieliKuvaus: mapValues(
        opetus?.opetuskieletKuvaus ?? {},
        parseEditorState
      ),
      maksullisuusKuvaus: mapValues(
        opetus?.maksullisuusKuvaus ?? {},
        parseEditorState
      ),
      osiot: lisatiedot.flatMap(({ otsikkoKoodiUri }) =>
        otsikkoKoodiUri === undefined ? [] : [{ value: otsikkoKoodiUri }]
      ),
      osioKuvaukset: lisatiedot.reduce((acc, curr) => {
        if (curr.otsikkoKoodiUri) {
          acc[curr.otsikkoKoodiUri] = mapValues(
            curr.teksti ?? {},
            parseEditorState
          );
        }
        return acc;
      }, {}),
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
      apurahaKuvaus: mapValues(opetus?.apuraha?.kuvaus ?? {}, parseEditorState),
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
    yhteyshenkilot: yhteyshenkilot?.map(
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
    ),
    osaamisalat: {
      osaamisalat: osaamisalat.map(({ koodiUri }) => koodiUri),
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
    teemakuva,
    hakeutumisTaiIlmoittautumistapa: {
      hakeutumisTaiIlmoittautumistapa: toEnum(
        HAKULOMAKETYYPPI,
        metadata?.hakulomaketyyppi
      ),
      isHakukohteetKaytossa: hakukohteetKaytossaToFormValues(metadata),
      hakuTapa: toEnum(Hakeutumistapa, metadata?.hakutermi),
      linkki: metadata?.hakulomakeLinkki,
      lisatiedot: mapValues(
        metadata?.lisatietoaHakeutumisesta ?? {},
        parseEditorState
      ),
      lisatiedotValintaperusteista: mapValues(
        metadata?.lisatietoaValintaperusteista ?? {},
        parseEditorState
      ),
      hakuaikaAlkaa: metadata?.hakuaika?.alkaa,
      hakuaikaPaattyy: metadata?.hakuaika?.paattyy,
      aloituspaikat: isNumber(aloituspaikat) ? aloituspaikat.toString() : '',
      aloituspaikkakuvaus: mapValues(
        aloituspaikkakuvaus ?? {},
        parseEditorState
      ),
    },
    soraKuvaus: toSelectValue(sorakuvausId),
    opintojaksojenLiittaminen: {
      opintojaksot: (metadata?.liitetytOpintojaksot ?? []).map(opintojakso => {
        return {
          opintojakso: {
            value: opintojakso,
          },
        };
      }),
    },
    osaamismerkkienLiittaminen: {
      osaamismerkit: (metadata?.liitetytOsaamismerkit ?? []).map(
        osaamismerkki => {
          return {
            osaamismerkki: {
              value: osaamismerkki,
            },
          };
        }
      ),
    },
  };
};

export default getFormValuesByToteutus;
