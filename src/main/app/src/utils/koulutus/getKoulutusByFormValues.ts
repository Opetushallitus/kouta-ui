import { get, pick } from 'lodash';

const getKielivalinta = values => get(values, 'kieliversiot') || [];

const getKoulutusByFormValues = values => {
  const { muokkaaja, tila } = values;
  const kielivalinta = getKielivalinta(values);
  const pohjanTarjoajat = get(values, 'pohja.tarjoajat');
  const kaytaPohjanJarjestajaa =
    get(values, 'tarjoajat.kaytaPohjanJarjestajaa') || false;
  const tarjoajat =
    pohjanTarjoajat && kaytaPohjanJarjestajaa
      ? pohjanTarjoajat
      : get(values, 'tarjoajat.tarjoajat') || [];

  const koulutusKoodiUri = get(values, 'information.koulutus.value') || null;
  const koulutustyyppi = get(values, 'koulutustyyppi') || null;
  const osiot = get(values, 'lisatiedot.osiot') || [];
  const osioKuvaukset = get(values, 'lisatiedot.osioKuvaukset') || {};

  const ePerusteId = get(values, 'information.eperuste.value');

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
    kielivalinta
  );

  const teemakuva = get(values, 'teemakuva');
  const esikatselu = get(values, 'esikatselu');

  const julkinen = Boolean(get(values, 'julkinen'));

  const tutkinnonOsat = (get(values, 'tutkinnonosat.osat') || []).map(
    ({
      eperuste: { value: eperusteId },
      koulutus: { value: koulutusId },
      tutkinnonosat: { value: tutkinnonosatId },
    }) => ({
      eperuste: eperusteId,
      tutkinnonosat: tutkinnonosatId,
      koulutus: koulutusId,
    })
  );
  console.log(tutkinnonOsat);

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
    esikatselu,
    ePerusteId,
    teemakuva,
    metadata: {
      tutkinnonOsat: tutkinnonOsat,
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
