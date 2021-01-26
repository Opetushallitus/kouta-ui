import _fp from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';
import { HAKULOMAKETYYPPI } from '#/src/constants';
import { ToteutusFormValues } from '#/src/types/toteutusTypes';
import { isNumeric, isPartialDate, maybeParseNumber } from '#/src/utils';
import { getAlkamiskausiData } from '#/src/utils/form/aloitusajankohtaHelpers';
import serializeSisaltoField from '#/src/utils/form/serializeSisaltoField';

import { isStipendiVisible } from './toteutusVisibilities';

const { MUU, EI_SAHKOISTA_HAKUA } = HAKULOMAKETYYPPI;

const getOsaamisalatByValues = ({ osaamisalat, pickTranslations }) => {
  return (osaamisalat || []).map(
    ({ kuvaus = {}, nimi = {}, linkki = {}, otsikko = {} }) => ({
      kuvaus: _fp.flow(
        pickTranslations,
        _fp.mapValues(serializeEditorState)
      )(kuvaus),
      nimi: pickTranslations(nimi),
      linkki: pickTranslations(linkki),
      otsikko: pickTranslations(otsikko),
    })
  );
};

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
  const pickTranslations = _fp.pick(kielivalinta);

  const osioKuvaukset = values?.jarjestamistiedot?.osioKuvaukset || {};

  const maksullisuustyyppi = values?.jarjestamistiedot?.maksullisuus?.tyyppi;
  const onkoMaksullinen = maksullisuustyyppi === 'kylla';
  const maksullisuusMaksu = values?.jarjestamistiedot?.maksullisuus?.maksu;

  const osaamisalaLinkit = values?.osaamisalat?.osaamisalaLinkit || {};
  const osaamisalaLinkkiOtsikot =
    values?.osaamisalat?.osaamisalaLinkkiOtsikot || {};

  const opetuskielet = values?.jarjestamistiedot?.opetuskieli;
  const stipendiVisible = isStipendiVisible(koulutustyyppi, opetuskielet);
  const onkoStipendia = values?.jarjestamistiedot?.onkoStipendia === 'kylla';

  const ajankohta = values?.jarjestamistiedot?.ajankohta;

  return {
    nimi: pickTranslations(values?.tiedot?.nimi || {}),
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
        onkoMaksullinen,
        maksunMaara: onkoMaksullinen
          ? maybeParseNumber(maksullisuusMaksu)
          : null,
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
        onkoStipendia: stipendiVisible && onkoStipendia,
        stipendinKuvaus: _fp.flow(
          pickTranslations,
          _fp.mapValues(serializeEditorState)
        )(
          (stipendiVisible && values?.jarjestamistiedot?.stipendinKuvaus) || {}
        ),
        stipendinMaara:
          stipendiVisible &&
          onkoStipendia &&
          isNumeric(values?.jarjestamistiedot?.stipendinMaara)
            ? maybeParseNumber(values.jarjestamistiedot.stipendinMaara)
            : null,
        diplomiKoodiUrit: (values?.jarjestamistiedot?.diplomiTyypit || []).map(
          _fp.prop('value')
        ),
        diplomiKuvaus: _fp.flow(
          pickTranslations,
          _fp.mapValues(serializeEditorState)
        )(values?.jarjestamistiedot?.diplomiKuvaus || {}),
        A1JaA2Kielivalikoima: (values?.jarjestamistiedot?.A1A2Kielet || []).map(
          _fp.prop('value')
        ),
        aidinkieliKielivalikoima: (
          values?.jarjestamistiedot?.aidinkielet || []
        ).map(_fp.prop('value')),
        B1Kielivalikoima: (values?.jarjestamistiedot?.B1Kielet || []).map(
          _fp.prop('value')
        ),
        B2Kielivalikoima: (values?.jarjestamistiedot?.B2Kielet || []).map(
          _fp.prop('value')
        ),
        B3Kielivalikoima: (values?.jarjestamistiedot?.B3Kielet || []).map(
          _fp.prop('value')
        ),
        muuKielivalikoima: (values?.jarjestamistiedot?.muutKielet || []).map(
          _fp.prop('value')
        ),
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
        koulutuksenAlkamiskausiUUSI: getAlkamiskausiData(
          ajankohta,
          pickTranslations
        ),
      },
      lukiolinjaKoodiUri: values?.lukiolinjat?.lukiolinja?.value || null,
      osaamisalat: (values?.osaamisalat?.osaamisalat || []).map(osaamisala => ({
        koodiUri: osaamisala,
        linkki: osaamisalaLinkit[osaamisala] || {},
        otsikko: osaamisalaLinkkiOtsikot[osaamisala] || {},
      })),
      yhteyshenkilot: (values?.yhteyshenkilot || []).map(
        ({ nimi, titteli, sahkoposti, puhelinnumero, verkkosivu }) => ({
          nimi: pickTranslations(nimi || {}),
          titteli: pickTranslations(titteli || {}),
          sahkoposti: pickTranslations(sahkoposti || {}),
          puhelinnumero: pickTranslations(puhelinnumero || {}),
          wwwSivu: pickTranslations(verkkosivu || {}),
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
      ylemmanKorkeakoulututkinnonOsaamisalat: getOsaamisalatByValues({
        osaamisalat: values?.ylemmanKorkeakoulututkinnonOsaamisalat,
        pickTranslations,
      }),
      alemmanKorkeakoulututkinnonOsaamisalat: getOsaamisalatByValues({
        osaamisalat: values?.alemmanKorkeakoulututkinnonOsaamisalat,
        pickTranslations,
      }),
      kuvaus: _fp.flow(
        pickTranslations,
        _fp.mapValues(serializeEditorState)
      )(values?.kuvaus || {}),
      tyyppi: koulutustyyppi,
      laajuus: maybeParseNumber(values?.tiedot?.laajuus),
      laajuusyksikkoKoodiUri: values?.tiedot?.laajuusyksikko?.value || null,
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
    },
  };
};

export default getToteutusByFormValues;
