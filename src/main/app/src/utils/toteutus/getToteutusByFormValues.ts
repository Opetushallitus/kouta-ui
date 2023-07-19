import _fp from 'lodash/fp';

import { MaaraTyyppi, HAKULOMAKETYYPPI } from '#/src/constants';
import { ToteutusFormValues } from '#/src/types/toteutusTypes';
import { isPartialDate, maybeParseNumber } from '#/src/utils';
import { getAlkamiskausiData } from '#/src/utils/form/aloitusajankohtaHelpers';
import { serializeSisaltoField } from '#/src/utils/form/serializeSisaltoField';

import {
  getSerializedKieleistykset,
  getKieleistyksetFromValues,
  getKielivalinta,
} from '../pickTranslations';
import { isHakukohteetKaytossa } from './hakukohteetKaytossaUtil';
import { isApurahaVisible } from './toteutusVisibilities';

const { MUU, EI_SAHKOISTA_HAKUA } = HAKULOMAKETYYPPI;

const getLukiolinjatByValues = (linjaValues, kieleistyksetSerialized) =>
  (linjaValues?.kaytossa &&
    linjaValues?.valinnat?.map(({ value }) => ({
      koodiUri: value,
      kuvaus: kieleistyksetSerialized(linjaValues.kuvaukset[value]),
    }))) ||
  [];

const getDiplomitByValues = (diplomiValues, kieleistykset) =>
  diplomiValues?.valinnat?.map(({ value }, index) => ({
    koodiUri: value,
    linkki: kieleistykset(diplomiValues?.linkit[index]?.url),
    linkinAltTeksti: kieleistykset(diplomiValues?.linkit[index]?.alt),
  })) || [];

const getToteutusByFormValues = (values: ToteutusFormValues) => {
  const {
    koulutustyyppi,
    tila,
    esikatselu = false,
    muokkaaja,
    jarjestamistiedot,
    hakeutumisTaiIlmoittautumistapa: HTIT,
  } = values;
  const hakulomaketyyppi = HTIT?.hakeutumisTaiIlmoittautumistapa;
  const kieleistykset = getKieleistyksetFromValues(values);
  const kieleistyksetSerialized = getSerializedKieleistykset(values);
  const kielivalinta = getKielivalinta(values);

  const osioKuvaukset = values?.jarjestamistiedot?.osioKuvaukset || {};

  const maksullisuustyyppi = values?.jarjestamistiedot?.maksullisuustyyppi;
  const maksunMaara = values?.jarjestamistiedot?.maksunMaara;

  const osaamisalaLinkit = values?.osaamisalat?.osaamisalaLinkit || {};
  const osaamisalaLinkkiOtsikot =
    values?.osaamisalat?.osaamisalaLinkkiOtsikot || {};

  const opetuskielet = values?.jarjestamistiedot?.opetuskieli;
  const kielivalikoima = values?.jarjestamistiedot?.kielivalikoima;

  const ajankohta = values?.jarjestamistiedot?.ajankohta;
  const apurahaVisible = isApurahaVisible(maksullisuustyyppi);
  const onkoApuraha = apurahaVisible
    ? values?.jarjestamistiedot?.onkoApuraha
    : false;
  const apurahaMaaraTyyppi = values?.jarjestamistiedot?.apurahaMaaraTyyppi;

  const apurahaMin = values?.jarjestamistiedot?.apurahaMin;
  const apurahaMax = values?.jarjestamistiedot?.apurahaMax;

  const isLaajuusRange =
    values?.tiedot?.laajuusNumeroTyyppi === MaaraTyyppi.VAIHTELUVALI;

  return {
    organisaatioOid: values?.organisaatioOid?.value,
    externalId: _fp.isEmpty(values?.externalId) ? null : values?.externalId,
    nimi: koulutustyyppi === 'lk' ? {} : kieleistykset(values?.tiedot?.nimi),
    tarjoajat: values?.tarjoajat || [],
    kielivalinta,
    tila,
    muokkaaja,
    teemakuva: values?.teemakuva,
    sorakuvausId: values?.soraKuvaus?.value || null,
    esikatselu,
    metadata: {
      opetus: {
        lisatiedot: (values?.jarjestamistiedot?.osiot || []).map(
          ({ value }) => ({
            otsikkoKoodiUri: value,
            teksti: kieleistyksetSerialized(osioKuvaukset[value]),
          })
        ),
        opetuskieliKoodiUrit: opetuskielet || [],
        maksullisuustyyppi,
        maksunMaara: maybeParseNumber(maksunMaara),
        opetustapaKoodiUrit: values?.jarjestamistiedot?.opetustapa || [],
        opetusaikaKoodiUrit: values?.jarjestamistiedot?.opetusaika || [],
        opetuskieletKuvaus: kieleistyksetSerialized(
          values?.jarjestamistiedot?.opetuskieliKuvaus
        ),
        opetustapaKuvaus: kieleistyksetSerialized(
          values?.jarjestamistiedot?.opetustapaKuvaus
        ),
        opetusaikaKuvaus: kieleistyksetSerialized(
          values?.jarjestamistiedot?.opetusaikaKuvaus
        ),
        maksullisuusKuvaus: kieleistyksetSerialized(
          values?.jarjestamistiedot?.maksullisuusKuvaus
        ),
        onkoApuraha,
        apuraha:
          apurahaVisible && onkoApuraha
            ? {
                kuvaus: kieleistyksetSerialized(
                  values?.jarjestamistiedot?.apurahaKuvaus
                ),
                ...(onkoApuraha
                  ? {
                      min: maybeParseNumber(apurahaMin),
                      max: maybeParseNumber(
                        apurahaMaaraTyyppi === MaaraTyyppi.YKSI_ARVO
                          ? apurahaMin
                          : apurahaMax
                      ),
                      yksikko: values?.jarjestamistiedot?.apurahaYksikko?.value,
                    }
                  : {}),
              }
            : null,
        suunniteltuKestoVuodet: maybeParseNumber(
          jarjestamistiedot?.suunniteltuKesto?.vuotta
        ),
        suunniteltuKestoKuukaudet: maybeParseNumber(
          jarjestamistiedot?.suunniteltuKesto?.kuukautta
        ),
        suunniteltuKestoKuvaus: kieleistyksetSerialized(
          jarjestamistiedot?.suunniteltuKestoKuvaus
        ),
        koulutuksenAlkamiskausi: getAlkamiskausiData(
          ajankohta,
          kieleistyksetSerialized
        ),
      },
      diplomit: getDiplomitByValues(
        values?.jarjestamistiedot?.diplomit,
        kieleistykset
      ),
      ammatillinenPerustutkintoErityisopetuksena:
        values?.tiedot?.ammatillinenPerustutkintoErityisopetuksena,
      jarjestetaanErityisopetuksena:
        values?.tiedot?.jarjestetaanErityisopetuksena,
      hasJotpaRahoitus: values?.tiedot?.hasJotpaRahoitus,
      isTaydennyskoulutus: values?.tiedot?.isTaydennyskoulutus,
      isTyovoimakoulutus: values?.tiedot?.isTyovoimakoulutus,
      yleislinja: values?.lukiolinjat?.yleislinja,
      painotukset: getLukiolinjatByValues(
        values?.lukiolinjat?.painotukset,
        kieleistyksetSerialized
      ),
      kielivalikoima: {
        A1Kielet: (kielivalikoima?.A1Kielet || []).map(_fp.prop('value')),
        A2Kielet: (kielivalikoima?.A2Kielet || []).map(_fp.prop('value')),
        aidinkielet: (kielivalikoima?.aidinkielet || []).map(_fp.prop('value')),
        B1Kielet: (kielivalikoima?.B1Kielet || []).map(_fp.prop('value')),
        B2Kielet: (kielivalikoima?.B2Kielet || []).map(_fp.prop('value')),
        B3Kielet: (kielivalikoima?.B3Kielet || []).map(_fp.prop('value')),
        muutKielet: (kielivalikoima?.muutKielet || []).map(_fp.prop('value')),
      },
      erityisetKoulutustehtavat: getLukiolinjatByValues(
        values?.lukiolinjat?.erityisetKoulutustehtavat,
        kieleistyksetSerialized
      ),
      osaamisalat: (values?.osaamisalat?.osaamisalat || []).map(osaamisala => ({
        koodiUri: osaamisala,
        linkki: osaamisalaLinkit[osaamisala] || {},
        otsikko: osaamisalaLinkkiOtsikot[osaamisala] || {},
      })),
      yhteyshenkilot: (values?.yhteyshenkilot || []).map(
        ({
          nimi,
          titteli,
          sahkoposti,
          puhelinnumero,
          verkkosivu,
          verkkosivuTeksti,
        }) => ({
          nimi: kieleistykset(nimi),
          titteli: kieleistykset(titteli),
          sahkoposti: kieleistykset(sahkoposti),
          puhelinnumero: kieleistykset(puhelinnumero),
          wwwSivu: kieleistykset(verkkosivu),
          wwwSivuTeksti: kieleistykset(verkkosivuTeksti),
        })
      ),
      ammattinimikkeet: _fp
        .toPairs(kieleistykset(values?.nayttamistiedot?.ammattinimikkeet))
        .flatMap(([language, nimikkeet]) => {
          return (nimikkeet || []).map(({ value }) => ({
            kieli: language,
            arvo: value,
          }));
        }),
      asiasanat: _fp
        .toPairs(kieleistykset(values?.nayttamistiedot?.avainsanat))
        .flatMap(([language, sanat]) => {
          return (sanat || []).map(({ value }) => ({
            kieli: language,
            arvo: value,
          }));
        }),
      kuvaus: kieleistyksetSerialized(values?.kuvaus),
      tyyppi: koulutustyyppi,
      opintojenLaajuusyksikkoKoodiUri:
        values?.tiedot?.opintojenLaajuusyksikko?.value || null,
      opintojenLaajuusNumero: maybeParseNumber(
        values?.tiedot?.opintojenLaajuusNumero
      ),
      opintojenLaajuusNumeroMin: maybeParseNumber(
        values?.tiedot?.opintojenLaajuusNumeroMin
      ),
      opintojenLaajuusNumeroMax: isLaajuusRange
        ? maybeParseNumber(values?.tiedot?.opintojenLaajuusNumeroMax)
        : maybeParseNumber(values?.tiedot?.opintojenLaajuusNumeroMin),
      ilmoittautumislinkki: kieleistykset(values?.tiedot?.ilmoittautumislinkki),
      toteutusjaksot: (values?.toteutusjaksot || []).map(
        ({ nimi, koodi, laajuus, ilmoittautumislinkki, kuvaus, sisalto }) => ({
          nimi: kieleistykset(nimi),
          koodi: koodi || null,
          laajuus: kieleistykset(laajuus),
          ilmoittautumislinkki: kieleistykset(ilmoittautumislinkki),
          kuvaus: kieleistyksetSerialized(kuvaus),
          sisalto: serializeSisaltoField(sisalto, kielivalinta),
        })
      ),
      isHakukohteetKaytossa: isHakukohteetKaytossa(HTIT?.isHakukohteetKaytossa),
      hakutermi: HTIT?.hakuTapa,
      hakulomaketyyppi,
      hakulomakeLinkki:
        hakulomaketyyppi === MUU ? kieleistykset(HTIT?.linkki) : {},
      lisatietoaHakeutumisesta:
        hakulomaketyyppi === MUU || hakulomaketyyppi === EI_SAHKOISTA_HAKUA
          ? kieleistyksetSerialized(HTIT?.lisatiedot)
          : {},
      lisatietoaValintaperusteista:
        hakulomaketyyppi === MUU
          ? kieleistyksetSerialized(HTIT?.lisatiedotValintaperusteista)
          : {},
      hakuaika:
        hakulomaketyyppi === MUU &&
        !(_fp.isNil(HTIT?.hakuaikaAlkaa) && _fp.isNil(HTIT?.hakuaikaPaattyy))
          ? {
              alkaa: isPartialDate(HTIT?.hakuaikaAlkaa)
                ? null
                : HTIT?.hakuaikaAlkaa,
              paattyy: isPartialDate(HTIT?.hakuaikaPaattyy)
                ? null
                : HTIT?.hakuaikaPaattyy,
            }
          : null,
      aloituspaikat: maybeParseNumber(
        values?.hakeutumisTaiIlmoittautumistapa?.aloituspaikat
      ),
      aloituspaikkakuvaus: kieleistyksetSerialized(
        values?.hakeutumisTaiIlmoittautumistapa?.aloituspaikkakuvaus
      ),
      liitetytOpintojaksot: values?.opintojaksojenLiittaminen?.opintojaksot
        ?.map(opintojakso => opintojakso?.opintojakso?.value)
        .filter(Boolean),
      isAvoinKorkeakoulutus: values?.tiedot?.isAvoinKorkeakoulutus || false,
      tunniste: values?.tiedot?.tunniste || null,
      opinnonTyyppiKoodiUri: values?.tiedot?.opinnonTyyppi?.value || null,
      taiteenalaKoodiUrit: (values?.tiedot?.taiteenalat ?? []).map(
        _fp.prop('value')
      ),
    },
  };
};

export default getToteutusByFormValues;
