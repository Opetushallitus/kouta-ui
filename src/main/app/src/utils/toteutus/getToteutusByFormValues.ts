import _ from 'lodash/fp';

import { isNumeric, getKoutaDateString, isPartialDate } from '#/src/utils';
import serializeSisaltoField from '#/src/utils/form/serializeSisaltoField';
import { serializeEditorState } from '#/src/components/Editor/utils';
import { HAKULOMAKETYYPPI } from '#/src/constants';
const { MUU, EI_SAHKOISTA_HAKUA } = HAKULOMAKETYYPPI;

const RADIX = 10;

const getOsaamisalatByValues = ({ osaamisalat, pickTranslations }) => {
  return (osaamisalat || []).map(
    ({ kuvaus = {}, nimi = {}, linkki = {}, otsikko = {} }) => ({
      kuvaus: pickTranslations(kuvaus),
      nimi: pickTranslations(nimi),
      linkki: pickTranslations(linkki),
      otsikko: pickTranslations(otsikko),
    })
  );
};

const toOptionalInteger = value => {
  const integerValue = _.parseInt(RADIX, value);
  if (value === '') {
    return null;
  }
  return _.isNaN(integerValue) ? value : integerValue;
};

const getToteutusByFormValues = values => {
  const {
    koulutustyyppi,
    tila,
    muokkaaja,
    jarjestamistiedot,
    hakeutumisTaiIlmoittautumistapa: HTIT = {},
  } = values;
  const hakulomaketyyppi = HTIT?.hakeutumisTaiIlmoittautumistapa;
  const kielivalinta = values?.kieliversiot || [];
  const pickTranslations = _.pick(kielivalinta);

  const osioKuvaukset = values?.jarjestamistiedot?.osioKuvaukset || {};

  const maksullisuustyyppi = values?.jarjestamistiedot?.maksullisuus?.tyyppi;
  const onkoMaksullinen = maksullisuustyyppi === 'kylla';
  const maksullisuusMaksu = values?.jarjestamistiedot?.maksullisuus?.maksu;

  const osaamisalaLinkit = values?.osaamisalat?.osaamisalaLinkit || {};
  const osaamisalaLinkkiOtsikot =
    values?.osaamisalat?.osaamisalaLinkkiOtsikot || {};

  const onkoStipendia = values?.jarjestamistiedot?.onkoStipendia === 'kylla';

  const koulutuksenTarkkaAlkamisaika =
    values?.jarjestamistiedot?.koulutuksenTarkkaAlkamisaika || false;

  return {
    nimi: pickTranslations(values?.tiedot?.nimi || {}),
    tarjoajat: values?.tarjoajat || [],
    kielivalinta,
    tila,
    muokkaaja,
    teemakuva: values?.teemakuva,
    metadata: {
      opetus: {
        lisatiedot: (values?.jarjestamistiedot?.osiot || []).map(
          ({ value }) => ({
            otsikkoKoodiUri: value,
            teksti: pickTranslations(osioKuvaukset[value] || {}),
          })
        ),
        opetuskieliKoodiUrit: values?.jarjestamistiedot?.opetuskieli || [],
        onkoMaksullinen,
        maksunMaara:
          onkoMaksullinen && isNumeric(maksullisuusMaksu)
            ? parseFloat(maksullisuusMaksu)
            : null,
        opetustapaKoodiUrit: values?.jarjestamistiedot?.opetustapa || [],
        opetusaikaKoodiUrit: values?.jarjestamistiedot?.opetusaika || [],
        opetuskieletKuvaus: pickTranslations(
          values?.jarjestamistiedot?.opetuskieliKuvaus || {}
        ),
        opetustapaKuvaus: pickTranslations(
          values?.jarjestamistiedot?.opetustapaKuvaus || {}
        ),
        opetusaikaKuvaus: pickTranslations(
          values?.jarjestamistiedot?.opetusaikaKuvaus || {}
        ),
        maksullisuusKuvaus: pickTranslations(
          values?.jarjestamistiedot?.maksullisuusKuvaus || {}
        ),
        koulutuksenAlkamispaivamaara: koulutuksenTarkkaAlkamisaika
          ? getKoutaDateString(
              values?.jarjestamistiedot?.koulutuksenAlkamispaivamaara
            )
          : null,
        koulutuksenPaattymispaivamaara: koulutuksenTarkkaAlkamisaika
          ? getKoutaDateString(
              values?.jarjestamistiedot?.koulutuksenPaattymispaivamaara
            )
          : null,
        koulutuksenTarkkaAlkamisaika,
        koulutuksenAlkamiskausi: !koulutuksenTarkkaAlkamisaika
          ? values?.jarjestamistiedot?.koulutuksenAlkamiskausi
          : null,
        koulutuksenAlkamisvuosi: !koulutuksenTarkkaAlkamisaika
          ? _.parseInt(
              RADIX,
              values?.jarjestamistiedot?.koulutuksenAlkamisvuosi?.value
            )
          : null,
        onkoStipendia,
        stipendinKuvaus: pickTranslations(
          values?.jarjestamistiedot?.stipendinKuvaus || {}
        ),
        stipendinMaara:
          onkoStipendia && isNumeric(values?.jarjestamistiedot?.stipendinMaara)
            ? parseFloat(values.jarjestamistiedot.stipendinMaara)
            : null,
        diplomiKoodiUrit: (values?.jarjestamistiedot?.diplomiTyypit || []).map(
          ({ value }) => value
        ),
        diplomiKuvaus: pickTranslations(
          values?.jarjestamistiedot?.diplomiKuvaus || {}
        ),
        A1JaA2Kielivalikoima: (values?.jarjestamistiedot?.A1A2Kielet || []).map(
          ({ value }) => value
        ),
        aidinkieliKielivalikoima: (
          values?.jarjestamistiedot?.aidinkielet || []
        ).map(({ value }) => value),
        B1Kielivalikoima: (values?.jarjestamistiedot?.B1Kielet || []).map(
          ({ value }) => value
        ),
        B2Kielivalikoima: (values?.jarjestamistiedot?.B2Kielet || []).map(
          ({ value }) => value
        ),
        B3Kielivalikoima: (values?.jarjestamistiedot?.B3Kielet || []).map(
          ({ value }) => value
        ),
        muuKielivalikoima: (values?.jarjestamistiedot?.muutKielet || []).map(
          ({ value }) => value
        ),
        suunniteltuKestoVuodet: toOptionalInteger(
          jarjestamistiedot?.suunniteltuKesto?.vuotta
        ),
        suunniteltuKestoKuukaudet: toOptionalInteger(
          jarjestamistiedot?.suunniteltuKesto?.kuukautta
        ),
        suunniteltuKestoKuvaus: pickTranslations(
          jarjestamistiedot?.suunniteltuKestoKuvaus || {}
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
      ammattinimikkeet: _.toPairs(
        pickTranslations(values?.nayttamistiedot?.ammattinimikkeet || {})
      ).flatMap(([language, nimikkeet]) => {
        return (nimikkeet || []).map(({ value }) => ({
          kieli: language,
          arvo: value,
        }));
      }),
      asiasanat: _.toPairs(
        pickTranslations(values?.nayttamistiedot?.avainsanat || {})
      ).flatMap(([language, sanat]) => {
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
      kuvaus: _.pipe(
        pickTranslations,
        _.mapValues(serializeEditorState)
      )(values?.kuvaus || {}),
      tyyppi: koulutustyyppi,
      laajuus: isNumeric(values?.tiedot?.laajuus)
        ? _.parseInt(RADIX, values.tiedot.laajuus)
        : null,
      laajuusyksikkoKoodiUri: values?.tiedot?.laajuusyksikko?.value || null,
      ilmoittautumislinkki: pickTranslations(
        values?.tiedot?.ilmoittautumislinkki
      ),
      aloituspaikat: isNumeric(values?.tiedot?.aloituspaikat)
        ? _.parseInt(RADIX, values.tiedot.aloituspaikat)
        : null,
      toteutusjaksot: (values?.toteutusjaksot || []).map(
        ({ nimi, koodi, laajuus, ilmoittautumislinkki, kuvaus, sisalto }) => ({
          nimi: pickTranslations(nimi),
          koodi: koodi || null,
          laajuus: pickTranslations(laajuus),
          ilmoittautumislinkki: pickTranslations(ilmoittautumislinkki),
          kuvaus: pickTranslations(kuvaus),
          sisalto: serializeSisaltoField(sisalto, kielivalinta),
        })
      ),
      tutkinnonOsat: (values?.tutkinnonOsat || []).map(
        ({ tutkinto, osaamisala, tutkinnonOsat }) => ({
          tutkintoKoodiUri: tutkinto?.value || null,
          osaamisalaKoodiUri: osaamisala?.value || null,
          tutkinnonOsaKoodiUrit: (tutkinnonOsat || []).map(
            ({ value }) => value
          ),
        })
      ),
      hakutermi: HTIT?.hakuTapa,
      hakulomaketyyppi,
      hakulomakeLinkki:
        hakulomaketyyppi === MUU ? pickTranslations(HTIT?.linkki) : {},
      lisatietoaHakeutumisesta:
        hakulomaketyyppi === MUU || hakulomaketyyppi === EI_SAHKOISTA_HAKUA
          ? _.pipe(
              pickTranslations,
              _.mapValues(serializeEditorState)
            )(HTIT?.lisatiedot)
          : {},
      lisatietoaValintaperusteista:
        hakulomaketyyppi === MUU
          ? _.pipe(
              pickTranslations,
              _.mapValues(serializeEditorState)
            )(HTIT?.lisatiedotValintaperusteista)
          : {},
      hakuaika:
        hakulomaketyyppi === MUU &&
        !(_.isNil(HTIT?.hakuaikaAlkaa) && _.isNil(HTIT?.hakuaikaPaattyy))
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
