import _fp from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { MaaraTyyppi, HAKULOMAKETYYPPI } from '#/src/constants';
import { ToteutusFormValues } from '#/src/types/toteutusTypes';
import { isPartialDate, maybeParseNumber } from '#/src/utils';
import { getAlkamiskausiData } from '#/src/utils/form/aloitusajankohtaHelpers';
import { serializeSisaltoField } from '#/src/utils/form/serializeSisaltoField';

import { isApurahaVisible } from './toteutusVisibilities';

const { MUU, EI_SAHKOISTA_HAKUA } = HAKULOMAKETYYPPI;

const getLukiolinjatByValues = (linjaValues, pickTranslations) =>
  (linjaValues?.kaytossa &&
    linjaValues?.valinnat?.map(({ value }) => ({
      koodiUri: value,
      kuvaus: _fp.flow(
        pickTranslations,
        _fp.mapValues(serializeEditorState)
      )(linjaValues.kuvaukset[value] ?? {}),
    }))) ||
  [];

const getDiplomitByValues = (diplomiValues, pickTranslations) =>
  diplomiValues?.valinnat?.map(({ value }, index) => ({
    koodiUri: value,
    linkki: pickTranslations(diplomiValues?.linkit[index]?.url ?? {}),
    linkinAltTeksti: pickTranslations(diplomiValues?.linkit[index]?.alt ?? {}),
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
  const kielivalinta = values?.kieliversiot || [];
  const pickTranslations = _fp.flow(
    _fp.pickBy(value => !_fp.isEmpty(value)),
    _fp.pick(kielivalinta)
  );

  const osioKuvaukset = values?.jarjestamistiedot?.osioKuvaukset || {};

  const maksullisuustyyppi = values?.jarjestamistiedot?.maksullisuustyyppi;
  const maksunMaara = values?.jarjestamistiedot?.maksunMaara;

  const osaamisalaLinkit = values?.osaamisalat?.osaamisalaLinkit || {};
  const osaamisalaLinkkiOtsikot =
    values?.osaamisalat?.osaamisalaLinkkiOtsikot || {};

  const opetuskielet = values?.jarjestamistiedot?.opetuskieli;
  const kielivalikoima = values?.jarjestamistiedot?.kielivalikoima;

  const ajankohta = values?.jarjestamistiedot?.ajankohta;
  const onkoApuraha = values?.jarjestamistiedot?.onkoApuraha;
  const apurahaMaaraTyyppi = values?.jarjestamistiedot?.apurahaMaaraTyyppi;
  const apurahaVisible = isApurahaVisible(maksullisuustyyppi);

  const apurahaMin = values?.jarjestamistiedot?.apurahaMin;
  const apurahaMax = values?.jarjestamistiedot?.apurahaMax;

  const isLaajuusRange =
    values?.tiedot?.laajuusNumeroTyyppi === MaaraTyyppi.VAIHTELUVALI;

  return {
    organisaatioOid: values?.organisaatioOid?.value,
    externalId: _fp.isEmpty(values?.externalId) ? null : values?.externalId,
    nimi:
      koulutustyyppi === 'lk'
        ? {}
        : pickTranslations(values?.tiedot?.nimi || {}),
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
            teksti: _fp.flow(
              pickTranslations,
              _fp.mapValues(serializeEditorState)
            )(osioKuvaukset[value] || {}),
          })
        ),
        opetuskieliKoodiUrit: opetuskielet || [],
        maksullisuustyyppi,
        maksunMaara: maybeParseNumber(maksunMaara),
        opetustapaKoodiUrit: values?.jarjestamistiedot?.opetustapa || [],
        opetusaikaKoodiUrit: values?.jarjestamistiedot?.opetusaika || [],
        opetuskieletKuvaus: _fp.flow(
          pickTranslations,
          _fp.mapValues(serializeEditorState)
        )(values?.jarjestamistiedot?.opetuskieliKuvaus || {}),
        opetustapaKuvaus: _fp.flow(
          pickTranslations,
          _fp.mapValues(serializeEditorState)
        )(values?.jarjestamistiedot?.opetustapaKuvaus || {}),
        opetusaikaKuvaus: _fp.flow(
          pickTranslations,
          _fp.mapValues(serializeEditorState)
        )(values?.jarjestamistiedot?.opetusaikaKuvaus || {}),
        maksullisuusKuvaus: _fp.flow(
          pickTranslations,
          _fp.mapValues(serializeEditorState)
        )(values?.jarjestamistiedot?.maksullisuusKuvaus || {}),
        onkoApuraha,
        apuraha:
          apurahaVisible && onkoApuraha
            ? {
                kuvaus: _fp.flow(
                  pickTranslations,
                  _fp.mapValues(serializeEditorState)
                )(values?.jarjestamistiedot?.apurahaKuvaus || {}),
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
        suunniteltuKestoKuvaus: _fp.flow(
          pickTranslations,
          _fp.mapValues(serializeEditorState)
        )(jarjestamistiedot?.suunniteltuKestoKuvaus || {}),
        koulutuksenAlkamiskausi: getAlkamiskausiData(
          ajankohta,
          pickTranslations
        ),
      },
      diplomit: getDiplomitByValues(
        values?.jarjestamistiedot?.diplomit,
        pickTranslations
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
        pickTranslations
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
        pickTranslations
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
          nimi: pickTranslations(nimi || {}),
          titteli: pickTranslations(titteli || {}),
          sahkoposti: pickTranslations(sahkoposti || {}),
          puhelinnumero: pickTranslations(puhelinnumero || {}),
          wwwSivu: pickTranslations(verkkosivu || {}),
          wwwSivuTeksti: pickTranslations(verkkosivuTeksti || {}),
        })
      ),
      ammattinimikkeet: _fp
        .toPairs(
          pickTranslations(values?.nayttamistiedot?.ammattinimikkeet || {})
        )
        .flatMap(([language, nimikkeet]) => {
          return (nimikkeet || []).map(({ value }) => ({
            kieli: language,
            arvo: value,
          }));
        }),
      asiasanat: _fp
        .toPairs(pickTranslations(values?.nayttamistiedot?.avainsanat || {}))
        .flatMap(([language, sanat]) => {
          return (sanat || []).map(({ value }) => ({
            kieli: language,
            arvo: value,
          }));
        }),
      kuvaus: _fp.flow(
        pickTranslations,
        _fp.mapValues(serializeEditorState)
      )(values?.kuvaus || {}),
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
      ilmoittautumislinkki: pickTranslations(
        values?.tiedot?.ilmoittautumislinkki
      ),
      aloituspaikat: maybeParseNumber(values?.tiedot?.aloituspaikat),
      toteutusjaksot: (values?.toteutusjaksot || []).map(
        ({ nimi, koodi, laajuus, ilmoittautumislinkki, kuvaus, sisalto }) => ({
          nimi: pickTranslations(nimi),
          koodi: koodi || null,
          laajuus: pickTranslations(laajuus),
          ilmoittautumislinkki: pickTranslations(ilmoittautumislinkki),
          kuvaus: _fp.flow(
            pickTranslations,
            _fp.mapValues(serializeEditorState)
          )(kuvaus),
          sisalto: serializeSisaltoField(sisalto, kielivalinta),
        })
      ),
      hakutermi: HTIT?.hakuTapa,
      hakulomaketyyppi,
      hakulomakeLinkki:
        hakulomaketyyppi === MUU ? pickTranslations(HTIT?.linkki) : {},
      lisatietoaHakeutumisesta:
        hakulomaketyyppi === MUU || hakulomaketyyppi === EI_SAHKOISTA_HAKUA
          ? _fp.flow(
              pickTranslations,
              _fp.mapValues(serializeEditorState)
            )(HTIT?.lisatiedot)
          : {},
      lisatietoaValintaperusteista:
        hakulomaketyyppi === MUU
          ? _fp.flow(
              pickTranslations,
              _fp.mapValues(serializeEditorState)
            )(HTIT?.lisatiedotValintaperusteista)
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
