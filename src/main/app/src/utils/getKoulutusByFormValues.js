import { get, pick } from 'lodash';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getKoulutusByFormValues = values => {
  const { muokkaaja, tila } = values;
  const kielivalinta = getKielivalinta(values);
  const tarjoajat = get(values, 'tarjoajat') || [];
  const koulutusKoodiUri = get(values, 'information.koulutus.value') || null;
  const koulutustyyppi = get(values, 'koulutustyyppi') || null;
  const osiot = get(values, 'lisatiedot.osiot') || [];
  const osioKuvaukset = get(values, 'lisatiedot.osioKuvaukset') || {};

  const osiotWithKuvaukset = osiot.map(({ value }) => ({
    otsikkoKoodiUri: value,
    teksti: pick(osioKuvaukset[value] || {}, kielivalinta),
  }));

  const kuvaus = pick(get(values, 'description.kuvaus') || {}, kielivalinta);
  const nimi = pick(get(values, 'information.nimi') || {}, kielivalinta);
  const opintojenLaajuusKoodiUri =
    get(values, 'information.opintojenLaajuus.value') || null;

  const tutkintonimikeKoodiUrit = (
    get(values, 'information.tutkintonimike') || []
  ).map(({ value }) => value);

  const koulutusalaKoodiUrit = (
    get(values, 'information.koulutusalat') || []
  ).map(({ value }) => value);

  const kuvauksenNimi = pick(
    get(values, 'description.nimi') || {},
    kielivalinta,
  );

  const teemakuva = get(values, 'teemakuva');

  const julkinen = Boolean(get(values, 'julkinen'));

  return {
    johtaaTutkintoon: true,
    muokkaaja,
    tila,
    kielivalinta,
    tarjoajat,
    koulutusKoodiUri,
    koulutustyyppi,
    nimi,
    julkinen,
    teemakuva,
    metadata: {
      tyyppi: koulutustyyppi,
      lisatiedot: osiotWithKuvaukset,
      kuvaus,
      opintojenLaajuusKoodiUri,
      tutkintonimikeKoodiUrit,
      kuvauksenNimi,
      koulutusalaKoodiUrit,
    },
  };
};

export default getKoulutusByFormValues;
