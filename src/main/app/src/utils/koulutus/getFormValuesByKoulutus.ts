import _fp from 'lodash/fp';

import { parseEditorState } from '#/src/components/Editor/utils';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

const koodiUriToKoodi = koodiUri => {
  return parseKoodiUri(koodiUri)?.koodiArvo;
};

export const getFormValuesByKoulutus = koulutus => {
  const {
    kielivalinta = [],
    koulutusKoodiUri = '',
    koulutustyyppi = '',
    tarjoajat = [],
    metadata = {},
    nimi = {},
    julkinen = false,
    esikatselu = true,
    tila,
    teemakuva,
    ePerusteId,
  } = koulutus;

  const {
    lisatiedot = [],
    kuvaus = {},
    tutkinnonOsat = [],
    opintojenLaajuusKoodiUri = '',
    tutkintonimikeKoodiUrit = [],
    kuvauksenNimi = {},
    koulutusalaKoodiUrit = [],
    osaamisalaKoodiUri,
  } = metadata;

  return {
    tila,
    kieliversiot: kielivalinta,
    tarjoajat: { tarjoajat, kaytaPohjanJarjestajaa: true },
    information: {
      nimi,
      eperuste: {
        value: ePerusteId,
      },
      koulutus: {
        value: koulutusKoodiUri,
      },
      opintojenLaajuus: {
        value: opintojenLaajuusKoodiUri,
      },
      tutkintonimike: tutkintonimikeKoodiUrit.map(value => ({ value })),
      koulutusalat: koulutusalaKoodiUrit.map(value => ({ value })),
    },
    koulutustyyppi,
    lisatiedot: {
      osioKuvaukset: lisatiedot.reduce((acc, curr) => {
        if (curr.otsikkoKoodiUri) {
          acc[curr.otsikkoKoodiUri] = _fp.mapValues(
            parseEditorState,
            curr.teksti
          );
        }
        return acc;
      }, {}),
      osiot: lisatiedot
        .filter(({ otsikkoKoodiUri }) => !!otsikkoKoodiUri)
        .map(({ otsikkoKoodiUri }) => ({ value: otsikkoKoodiUri })),
    },
    tutkinnonosat: {
      osat: _fp.values(
        _fp.reduce(
          (
            grouped,
            { ePerusteId, koulutusKoodiUri, tutkinnonosaId, tutkinnonosaViite }
          ) => ({
            ...grouped,
            [`${koulutusKoodiUri}_${ePerusteId}`]: {
              koulutus: { value: koulutusKoodiUri },
              eperuste: { value: ePerusteId },
              osat: [
                ...(grouped?.[`${koulutusKoodiUri}_${ePerusteId}`]?.osat || []),
                {
                  value: _fp.toString(tutkinnonosaId),
                  viite: _fp.toString(tutkinnonosaViite),
                },
              ],
            },
          }),
          {}
        )(tutkinnonOsat)
      ),
      nimi,
    },
    description: {
      kuvaus: _fp.mapValues(parseEditorState, kuvaus),
      nimi: kuvauksenNimi,
    },
    esikatselu,
    julkinen,
    teemakuva,
    osaamisala: osaamisalaKoodiUri
      ? {
          osaamisala: {
            value: koodiUriToKoodi(osaamisalaKoodiUri),
          },
          eperuste: { value: ePerusteId },
          koulutus: { value: koulutusKoodiUri },
        }
      : null,
  };
};

export default getFormValuesByKoulutus;
