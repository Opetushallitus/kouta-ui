import get from 'lodash/get';
import toPairs from 'lodash/toPairs';
import flatMap from 'lodash/flatMap';

export const getToteutusByValues = values => {
  const tarjoajat = get(values, 'jarjestamispaikat.jarjestajat') || [];
  const kielivalinta = get(values, 'kieliversiot.languages') || [];
  const nimi = get(values, 'nimi.name') || {};
  const opetuskielet = get(values, 'jarjestamistiedot.opetuskieli') || [];
  const kuvaus = get(values, 'jarjestamistiedot.kuvaus') || {};
  const osioKuvaukset = get(values, 'jarjestamistiedot.osioKuvaukset') || {};
  const opetustapaKoodiUri = get(values, 'jarjestamistiedot.opetustapa');
  const opetusaikaKoodiUri = get(values, 'jarjestamistiedot.opetusaika');

  const osiot = (get(values, 'jarjestamistiedot.osiot') || []).map(osio => ({
    otsikko: {
      fi: osio.label,
    },
    teksti: osioKuvaukset[osio.value] || {},
  }));

  const onkoMaksullinen =
    get(values, 'jarjestamistiedot.maksullisuus') === 'kylla';
  const maksunMaara = get(values, 'jarjestamistiedot.maksumaara') || {};

  const osaamisalaLinkit = get(values, 'osaamisalat.osaamisalaLinkit') || {};
  const osaamisalaLinkkiOtsikot =
    get(values, 'osaamisalat.osaamisalaLinkkiOtsikot') || {};

  const osaamisalat = (get(values, 'osaamisalat.osaamisalat') || []).map(
    osaamisala => ({
      koodi: osaamisala,
      linkki: osaamisalaLinkit[osaamisala] || {},
      otsikko: osaamisalaLinkkiOtsikot[osaamisala] || {},
    }),
  );

  const yhteystieto = {
    nimi: get(values, 'yhteystiedot.name') || {},
    titteli: get(values, 'yhteystiedot.title') || {},
    sahkoposti: get(values, 'yhteystiedot.email') || {},
    puhelinnumero: get(values, 'yhteystiedot.phone') || {},
    wwwSivu: get(values, 'yhteystiedot.website') || {},
  };

  const ammattinimikkeet = flatMap(
    toPairs(get(values, 'nayttamistiedot.ammattinimikkeet') || {}),
    ([language, nimikkeet]) => {
      return (nimikkeet || []).map(({ value }) => ({
        kieli: language,
        arvo: value,
      }));
    },
  );

  const asiasanat = flatMap(
    toPairs(get(values, 'nayttamistiedot.avainsanat') || {}),
    ([language, sanat]) => {
      return (sanat || []).map(({ value }) => ({
        kieli: language,
        arvo: value,
      }));
    },
  );

  return {
    nimi,
    tarjoajat,
    kielivalinta,
    metadata: {
      opetus: {
        osiot,
        opetuskielet,
        kuvaus,
        onkoMaksullinen,
        maksunMaara,
        opetustapaKoodiUri,
        opetusaikaKoodiUri,
      },
      osaamisalat,
      yhteystieto,
      ammattinimikkeet,
      asiasanat,
    },
  };
};

export const getValuesByToteutus = toteutus => {
  const {
    kielivalinta = [],
    nimi = {},
    tarjoajat = [],
    metadata = {},
  } = toteutus;
  const {
    kuvaus = {},
    ammattinimikkeet = [],
    asiasanat = [],
    yhteystieto = {},
    opetus = {},
  } = metadata;

  return {
    nimi: {
      name: nimi,
    },
    kieliversiot: {
      languages: kielivalinta,
    },
    jarjestamispaikat: {
      jarjestajat: [...tarjoajat, 'a', 'b'],
    },
    jarjestamistiedot: {
      kuvaus,
      maksullisuus: get(opetus, 'onkoMaksullinen') ? 'kylla' : 'ei',
      maksumaara: get(opetus, 'maksunMaara') || {},
      opetustapa: get(opetus, 'opetustapaKoodiUri') || '',
      opetusaika: get(opetus, 'opetusaikaKoodiUri') || '',
      opetuskieli: get(opetus, 'opetuskieliKoodiUrit') || [],
    },
    nayttamistiedot: {
      ammattinimikkeet: ammattinimikkeet.reduce((acc, curr) => {
        if (get(curr, 'kieli') && get(curr, 'arvo')) {
          acc[curr.kieli] = acc[curr.kieli] || [];
          acc[curr.kieli] = [
            ...acc[curr.kieli],
            { label: curr.arvo, value: curr.arvo },
          ];
        }

        return acc;
      }, {}),
      avainsanat: asiasanat.reduce((acc, curr) => {
        if (get(curr, 'kieli') && get(curr, 'arvo')) {
          acc[curr.kieli] = acc[curr.kieli] || [];
          acc[curr.kieli] = [
            ...acc[curr.kieli],
            { label: curr.arvo, value: curr.arvo },
          ];
        }

        return acc;
      }, {}),
    },
    yhteystiedot: {
      name: get(yhteystieto, 'nimi') || {},
      title: get(yhteystieto, 'titteli') || {},
      email: get(yhteystieto, 'sahkoposti') || {},
      phone: get(yhteystieto, 'puhelinnumero') || {},
      website: get(yhteystieto, 'wwwSivu') || {},
    },
  };
};
