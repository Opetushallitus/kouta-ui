import get from 'lodash/get';
import toPairs from 'lodash/toPairs';
import pick from 'lodash/pick';

import { isNumeric, getKoutaDateString } from './index';
import serializeSisaltoField from './serializeSisaltoField';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getOsaamisalatByValues = ({ osaamisalat, kielivalinta }) => {
  return (osaamisalat || []).map(
    ({ kuvaus = {}, nimi = {}, linkki = {}, otsikko = {} }) => ({
      kuvaus: pick(kuvaus, kielivalinta),
      nimi: pick(nimi, kielivalinta),
      linkki: pick(linkki, kielivalinta),
      otsikko: pick(otsikko, kielivalinta),
    }),
  );
};

const getToteutusByFormValues = values => {
  const { koulutustyyppi, tila, muokkaaja } = values;
  const kielivalinta = getKielivalinta(values);
  const tarjoajat = get(values, 'tarjoajat') || [];
  const nimi = pick(get(values, 'tiedot.nimi') || {}, kielivalinta);
  const opetuskielet = get(values, 'jarjestamistiedot.opetuskieli') || [];
  const kuvaus = pick(
    get(values, 'tiedot.toteutuksenKuvaus') || {},
    kielivalinta,
  );
  const osioKuvaukset = get(values, 'jarjestamistiedot.osioKuvaukset') || {};
  const opetustapaKoodiUrit = get(values, 'jarjestamistiedot.opetustapa') || [];
  const opetusaikaKoodiUrit = get(values, 'jarjestamistiedot.opetusaika') || [];

  const diplomiKoodiUrit = (
    get(values, 'jarjestamistiedot.diplomiTyypit') || []
  ).map(({ value }) => value);

  const diplomiKuvaus = pick(
    get(values, 'jarjestamistiedot.diplomiKuvaus') || {},
    kielivalinta,
  );

  const A1JaA2Kielivalikoima = (
    get(values, 'jarjestamistiedot.A1A2Kielet') || []
  ).map(({ value }) => value);

  const B2Kielivalikoima = (
    get(values, 'jarjestamistiedot.B2Kielet') || []
  ).map(({ value }) => value);

  const aidinkieliKielivalikoima = (
    get(values, 'jarjestamistiedot.aidinkielet') || []
  ).map(({ value }) => value);

  const B1Kielivalikoima = (
    get(values, 'jarjestamistiedot.B1Kielet') || []
  ).map(({ value }) => value);

  const B3Kielivalikoima = (
    get(values, 'jarjestamistiedot.B3Kielet') || []
  ).map(({ value }) => value);

  const muuKielivalikoima = (
    get(values, 'jarjestamistiedot.muutKielet') || []
  ).map(({ value }) => value);

  const lukiolinjaKoodiUri =
    get(values, 'lukiolinjat.lukiolinja.value') || null;

  const opetuskieliKuvaus = pick(
    get(values, 'jarjestamistiedot.opetuskieliKuvaus') || {},
    kielivalinta,
  );
  const opetusaikaKuvaus = pick(
    get(values, 'jarjestamistiedot.opetusaikaKuvaus') || {},
    kielivalinta,
  );
  const opetustapaKuvaus = pick(
    get(values, 'jarjestamistiedot.opetustapaKuvaus') || {},
    kielivalinta,
  );
  const maksullisuusKuvaus = pick(
    get(values, 'jarjestamistiedot.maksullisuusKuvaus') || {},
    kielivalinta,
  );

  const osiot = (get(values, 'jarjestamistiedot.osiot') || []).map(
    ({ value }) => ({
      otsikkoKoodiUri: value,
      teksti: pick(osioKuvaukset[value] || {}, kielivalinta),
    }),
  );

  const maksullisuustyyppi = get(
    values,
    'jarjestamistiedot.maksullisuus.tyyppi',
  );

  const maksullisuusMaksu = get(values, 'jarjestamistiedot.maksullisuus.maksu');

  const onkoMaksullinen = maksullisuustyyppi === 'kylla';

  const maksunMaara =
    onkoMaksullinen && isNumeric(maksullisuusMaksu)
      ? parseFloat(maksullisuusMaksu)
      : null;

  const osaamisalaLinkit = get(values, 'osaamisalat.osaamisalaLinkit') || {};
  const osaamisalaLinkkiOtsikot =
    get(values, 'osaamisalat.osaamisalaLinkkiOtsikot') || {};

  const osaamisalat = (get(values, 'osaamisalat.osaamisalat') || []).map(
    osaamisala => ({
      koodiUri: osaamisala,
      linkki: osaamisalaLinkit[osaamisala] || {},
      otsikko: osaamisalaLinkkiOtsikot[osaamisala] || {},
    }),
  );

  const yhteyshenkilot = (get(values, 'yhteyshenkilot') || []).map(
    ({ nimi, titteli, sahkoposti, puhelinnumero, verkkosivu }) => ({
      nimi: pick(nimi || {}, kielivalinta),
      titteli: pick(titteli || {}, kielivalinta),
      sahkoposti: pick(sahkoposti || {}, kielivalinta),
      puhelinnumero: pick(puhelinnumero || {}, kielivalinta),
      wwwSivu: pick(verkkosivu || {}, kielivalinta),
    }),
  );

  const ammattinimikkeet = toPairs(
    pick(get(values, 'nayttamistiedot.ammattinimikkeet') || {}, kielivalinta),
  ).flatMap(([language, nimikkeet]) => {
    return (nimikkeet || []).map(({ value }) => ({
      kieli: language,
      arvo: value,
    }));
  });

  const asiasanat = toPairs(
    pick(get(values, 'nayttamistiedot.avainsanat') || {}, kielivalinta),
  ).flatMap(([language, sanat]) => {
    return (sanat || []).map(({ value }) => ({
      kieli: language,
      arvo: value,
    }));
  });

  const onkoStipendia = Boolean(get(values, 'jarjestamistiedot.onkoStipendia'));

  const stipendinKuvaus = pick(
    get(values, 'jarjestamistiedot.stipendinKuvaus') || {},
    kielivalinta,
  );

  const stipendinMaara =
    onkoStipendia && isNumeric(get(values, 'jarjestamistiedot.stipendinMaara'))
      ? parseFloat(values.jarjestamistiedot.stipendinMaara)
      : null;

  const ylemmanKorkeakoulututkinnonOsaamisalat = getOsaamisalatByValues({
    osaamisalat: get(values, 'ylemmanKorkeakoulututkinnonOsaamisalat'),
    kielivalinta,
  });

  const alemmanKorkeakoulututkinnonOsaamisalat = getOsaamisalatByValues({
    osaamisalat: get(values, 'alemmanKorkeakoulututkinnonOsaamisalat'),
    kielivalinta,
  });

  const koulutuksenAlkamispaivamaara = getKoutaDateString(
    get(values, 'jarjestamistiedot.koulutuksenAlkamispaivamaara'),
  );

  const koulutuksenPaattymispaivamaara = getKoutaDateString(
    get(values, 'jarjestamistiedot.koulutuksenPaattymispaivamaara'),
  );

  const koulutuksenAlkamiskausi = get(
    values,
    'jarjestamistiedot.koulutuksenAlkamiskausi',
  );
  const koulutuksenAlkamisvuosi = get(
    values,
    'jarjestamistiedot.koulutuksenAlkamisvuosi',
  );
  const koulutuksenTarkkaAlkamisaika =
    get(values, 'jarjestamistiedot.koulutuksenTarkkaAlkamisaika') || false;

  const ilmoittautumislinkki = pick(
    get(values, 'tiedot.ilmoittautumislinkki'),
    kielivalinta,
  );

  const laajuus = isNumeric(get(values, 'tiedot.laajuus'))
    ? parseInt(values.tiedot.laajuus)
    : null;

  const laajuusyksikkoKoodiUri =
    get(values, 'tiedot.laajuusyksikko.value') || null;

  const aloituspaikat = isNumeric(get(values, 'tiedot.aloituspaikat'))
    ? parseInt(values.tiedot.aloituspaikat)
    : null;

  const suunniteltuKesto = pick(get(values, 'tiedot.kesto'), kielivalinta);

  const toteutusjaksot = (get(values, 'toteutusjaksot') || []).map(
    ({ nimi, koodi, laajuus, ilmoittautumislinkki, kuvaus, sisalto }) => ({
      nimi: pick(nimi, kielivalinta),
      koodi: koodi || null,
      laajuus: pick(laajuus, kielivalinta),
      ilmoittautumislinkki: pick(ilmoittautumislinkki, kielivalinta),
      kuvaus: pick(kuvaus, kielivalinta),
      sisalto: serializeSisaltoField(sisalto, kielivalinta),
    }),
  );

  const tutkinnonOsat = (get(values, 'tutkinnonOsat') || []).map(
    ({ tutkinto, osaamisala, tutkinnonOsat }) => ({
      tutkintoKoodiUri: get(tutkinto, 'value') || null,
      osaamisalaKoodiUri: get(osaamisala, 'value') || null,
      tutkinnonOsaKoodiUrit: (tutkinnonOsat || []).map(({ value }) => value),
    }),
  );

  const teemakuva = get(values, 'teemakuva');

  return {
    nimi,
    tarjoajat,
    kielivalinta,
    tila,
    muokkaaja,
    metadata: {
      opetus: {
        lisatiedot: osiot,
        opetuskieliKoodiUrit: opetuskielet,
        onkoMaksullinen,
        maksunMaara,
        opetustapaKoodiUrit,
        opetusaikaKoodiUrit,
        opetuskieletKuvaus: opetuskieliKuvaus,
        opetustapaKuvaus,
        opetusaikaKuvaus,
        maksullisuusKuvaus,
        koulutuksenAlkamispaivamaara,
        koulutuksenPaattymispaivamaara,
        koulutuksenTarkkaAlkamisaika,
        koulutuksenAlkamiskausi,
        koulutuksenAlkamisvuosi,
        onkoStipendia,
        stipendinKuvaus,
        stipendinMaara,
        diplomiKoodiUrit,
        diplomiKuvaus,
        A1JaA2Kielivalikoima,
        aidinkieliKielivalikoima,
        B1Kielivalikoima,
        B2Kielivalikoima,
        B3Kielivalikoima,
        muuKielivalikoima,
      },
      lukiolinjaKoodiUri,
      osaamisalat,
      yhteyshenkilot,
      ammattinimikkeet,
      asiasanat,
      ylemmanKorkeakoulututkinnonOsaamisalat,
      alemmanKorkeakoulututkinnonOsaamisalat,
      kuvaus,
      tyyppi: koulutustyyppi,
      laajuus,
      laajuusyksikkoKoodiUri,
      ilmoittautumislinkki,
      aloituspaikat,
      suunniteltuKesto,
      toteutusjaksot,
      tutkinnonOsat,
      teemakuva,
    },
  };
};

export default getToteutusByFormValues;
