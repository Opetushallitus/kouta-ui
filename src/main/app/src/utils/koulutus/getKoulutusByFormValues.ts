import _fp from 'lodash/fp';

import { serializeEditorState } from '#/src/components/Editor/utils';
import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT,
} from '#/src/constants';
import {
  InformationSectionValues,
  KoulutusFormValues,
  TutkinnonOsa,
} from '#/src/types/koulutusTypes';
import { maybeParseNumber, parseFloatComma, valueToArray } from '#/src/utils';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

const osaamisalaKoodiToKoodiUri = value =>
  value ? `osaamisala_${value}` : null;

function getKoulutuksetKoodiUri(
  osaamisala,
  koulutustyyppi: KOULUTUSTYYPPI,
  information?: InformationSectionValues
): Array<string> {
  if (isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi)) {
    return _fp.map(koodi => koodi.value, information?.korkeakoulutukset);
  }

  if (koulutustyyppi === KOULUTUSTYYPPI.OSAAMISALA) {
    return valueToArray(osaamisala?.koulutus?.value);
  }

  return valueToArray(information?.koulutus?.value);
}

const getKoulutusByFormValues = (values: KoulutusFormValues) => {
  const { muokkaaja, tila, esikatselu = false } = values;
  const kielivalinta = values?.kieliversiot ?? [];
  const pickTranslations = _fp.pick(kielivalinta);

  const pohjanTarjoajat = values?.pohja?.tarjoajat;
  const kaytaPohjanJarjestajaa =
    values?.tarjoajat?.kaytaPohjanJarjestajaa ?? false;

  const koulutustyyppi = values?.koulutustyyppi || null;
  const osiot = values?.lisatiedot?.osiot ?? [];
  const osaamisala = values?.osaamisala;

  const sorakuvausId = values?.soraKuvaus?.value || null;

  return {
    organisaatioOid: values?.organisaatioOid?.value,
    externalId: _fp.isEmpty(values?.externalId) ? null : values?.externalId,
    johtaaTutkintoon:
      TUTKINTOON_JOHTAVAT_KOULUTUSTYYPIT.includes(koulutustyyppi),
    muokkaaja,
    tila,
    kielivalinta,
    tarjoajat:
      pohjanTarjoajat && kaytaPohjanJarjestajaa
        ? pohjanTarjoajat
        : values?.tarjoajat?.tarjoajat || [],
    koulutuksetKoodiUri: getKoulutuksetKoodiUri(
      osaamisala,
      koulutustyyppi,
      values?.information
    ),
    koulutustyyppi,
    nimi:
      koulutustyyppi === KOULUTUSTYYPPI.TUTKINNON_OSA
        ? pickTranslations(values?.tutkinnonosat?.nimi ?? {})
        : pickTranslations(values?.information?.nimi ?? {}),
    julkinen: Boolean(values?.julkinen),
    esikatselu,
    ePerusteId: maybeParseNumber(
      values?.information?.eperuste?.value || osaamisala?.eperuste?.value
    ),
    teemakuva: values?.teemakuva,
    sorakuvausId,
    metadata: {
      tyyppi: koulutustyyppi,
      tutkinnonOsat: _fp.reduce(
        (
          resultOsat,
          {
            eperuste: { value: ePerusteId },
            koulutus: { value: koulutusKoodiUri },
            osat,
          }: TutkinnonOsa
        ) => [
          ...resultOsat,
          ..._fp.map(({ value, viite }) => ({
            ePerusteId: maybeParseNumber(ePerusteId),
            koulutusKoodiUri,
            tutkinnonosaId: maybeParseNumber(value),
            tutkinnonosaViite: maybeParseNumber(viite),
          }))(osat),
        ],
        [] as Array<{
          ePerusteId: number;
          koulutusKoodiUri?: string;
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
        teksti: _fp.flow(
          pickTranslations,
          _fp.mapValues(serializeEditorState)
        )(values?.lisatiedot?.osioKuvaukset?.[value] ?? {}),
      })),
      kuvaus: _fp.flow(
        pickTranslations,
        _fp.mapValues(serializeEditorState)
      )(values?.description?.kuvaus ?? {}),
      opintojenLaajuusKoodiUri:
        values?.information?.opintojenLaajuus?.value || null,
      opintojenLaajuusyksikkoKoodiUri:
        values?.information?.opintojenLaajuusyksikko?.value || null,
      opintojenLaajuusNumero: values?.information?.opintojenLaajuusnumero
        ? parseFloatComma(values.information.opintojenLaajuusnumero)
        : null,

      tutkintonimikeKoodiUrit: (values?.information?.tutkintonimike ?? []).map(
        ({ value }) => value
      ),
      koulutusalaKoodiUrit: (values?.information?.koulutusalat ?? []).map(
        ({ value }) => value
      ),
      linkkiEPerusteisiin: pickTranslations(
        values?.description?.linkkiEPerusteisiin ?? {}
      ),
    },
  };
};

export default getKoulutusByFormValues;
