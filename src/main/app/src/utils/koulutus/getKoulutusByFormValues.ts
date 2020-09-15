import _ from 'lodash/fp';
import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT,
} from '#/src/constants';

const pickNimiFromSelectedTutkinnonOsat = (values, kielivalinta) => {
  const osat = values?.tutkinnonosat?.osat ?? [];
  return osat.length === 1
    ? _.pick(kielivalinta, osat[0].selectedTutkinnonosat?.nimi)
    : null;
};

const getKoulutusByFormValues = values => {
  const { muokkaaja, tila } = values;
  const kielivalinta = values?.kieliversiot ?? [];
  const pickTranslations = _.pick(kielivalinta);

  const pohjanTarjoajat = values?.pohja?.tarjoajat;
  const kaytaPohjanJarjestajaa =
    values?.tarjoajat?.kaytaPohjanJarjestajaa ?? false;

  const koulutustyyppi = values?.koulutustyyppi || null;
  const osiot = values?.lisatiedot?.osiot ?? [];

  return {
    johtaaTutkintoon: TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT.includes(
      koulutustyyppi
    ),
    muokkaaja,
    tila,
    kielivalinta,
    tarjoajat:
      pohjanTarjoajat && kaytaPohjanJarjestajaa
        ? pohjanTarjoajat
        : values?.tarjoajat?.tarjoajat || [],
    koulutusKoodiUri: values?.information?.koulutus?.value || null,
    koulutustyyppi,
    nimi:
      koulutustyyppi === KOULUTUSTYYPPI.TUTKINNON_OSA
        ? pickNimiFromSelectedTutkinnonOsat(values, kielivalinta) ??
          pickTranslations(values?.tutkinnonosat?.nimi ?? {})
        : pickTranslations(values?.information?.nimi ?? {}),
    julkinen: Boolean(values?.julkinen),
    esikatselu: values?.esikatselu,
    ePerusteId: values?.information?.eperuste?.value || null,
    teemakuva: values?.teemakuva,
    metadata: {
      tutkinnonOsat: (values?.tutkinnonosat?.osat ?? []).map(
        ({
          eperuste: { value: ePerusteId },
          koulutus: { value: koulutusKoodiUri },
          tutkinnonosa: { value: tutkinnonosaId },
          tutkinnonosaviite: tutkinnonosaViite,
        }) => ({
          ePerusteId: Number(ePerusteId),
          koulutusKoodiUri,
          tutkinnonosaId: Number(tutkinnonosaId),
          tutkinnonosaViite: Number(tutkinnonosaViite),
        })
      ),
      tyyppi: koulutustyyppi,
      lisatiedot: osiot.map(({ value }) => ({
        otsikkoKoodiUri: value,
        teksti: pickTranslations(
          values?.lisatiedot?.osioKuvaukset?.[value] ?? {},
          kielivalinta
        ),
      })),
      kuvaus: pickTranslations(values?.description?.kuvaus ?? {}),
      opintojenLaajuusKoodiUri:
        values?.information?.opintojenLaajuus?.value || null,
      tutkintonimikeKoodiUrit: (values?.information?.tutkintonimike ?? []).map(
        ({ value }) => value
      ),
      kuvauksenNimi: pickTranslations(values?.description?.nimi ?? {}),
      koulutusalaKoodiUrit: (values?.information?.koulutusalat ?? []).map(
        ({ value }) => value
      ),
    },
  };
};

export default getKoulutusByFormValues;
