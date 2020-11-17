import _ from 'lodash/fp';
import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT,
} from '#/src/constants';
import { maybeParseNumber } from '#/src/utils';

const osaamisalaKoodiToKoodiUri = value =>
  value ? `osaamisala_${value}` : null;

const getKoulutusByFormValues = values => {
  const { muokkaaja, tila } = values;
  const kielivalinta = values?.kieliversiot ?? [];
  const pickTranslations = _.pick(kielivalinta);

  const pohjanTarjoajat = values?.pohja?.tarjoajat;
  const kaytaPohjanJarjestajaa =
    values?.tarjoajat?.kaytaPohjanJarjestajaa ?? false;

  const koulutustyyppi = values?.koulutustyyppi || null;
  const osiot = values?.lisatiedot?.osiot ?? [];
  const osaamisala = values?.osaamisala;

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
    koulutusKoodiUri:
      values?.information?.koulutus?.value ||
      osaamisala?.koulutus?.value ||
      null,
    koulutustyyppi,
    nimi:
      koulutustyyppi === KOULUTUSTYYPPI.TUTKINNON_OSA
        ? pickTranslations(values?.tutkinnonosat?.nimi ?? {})
        : pickTranslations(values?.information?.nimi ?? {}),
    julkinen: Boolean(values?.julkinen),
    esikatselu: values?.esikatselu,
    ePerusteId: maybeParseNumber(
      values?.information?.eperuste?.value || osaamisala?.eperuste?.value
    ),
    teemakuva: values?.teemakuva,
    metadata: {
      tutkinnonOsat: _.reduce(
        (
          resultOsat,
          {
            eperuste: { value: ePerusteId },
            koulutus: { value: koulutusKoodiUri },
            osat,
          }
        ) => [
          ...resultOsat,
          ..._.map(({ value, viite }) => ({
            ePerusteId: maybeParseNumber(ePerusteId),
            koulutusKoodiUri,
            tutkinnonosaId: maybeParseNumber(value),
            tutkinnonosaViite: maybeParseNumber(viite),
          }))(osat),
        ],
        [] as Array<{
          ePerusteId: number;
          koulutusKoodiUri: string;
          tutkinnonosaId: number;
          tutkinnonosaViite: number;
        }>
      )(values?.tutkinnonosat?.osat),
      osaamisalaKoodiUri: osaamisalaKoodiToKoodiUri(
        osaamisala?.osaamisala?.value
      ),
      koulutustyyppi,
      lisatiedot: osiot.map(({ value }) => ({
        otsikkoKoodiUri: value,
        teksti: pickTranslations(
          values?.lisatiedot?.osioKuvaukset?.[value] ?? {}
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
