import _fp from 'lodash/fp';

import { parseEditorState } from '#/src/components/Editor/utils';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { KoulutusFormValues } from '#/src/types/koulutusTypes';
import { isNumeric, toSelectValue } from '#/src/utils';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

const koodiUriToKoodi = koodiUri => {
  return parseKoodiUri(koodiUri)?.koodiArvo;
};

// Backendissä koulutuskoodiUrit on tallennettu vain yhteen listaan. Frontissa on helpompi käsitellä
// erikseen tapaus jossa koodiUreja voi olla vain yksi (muut kuin korkeakoulutukset) ja tapaus jossa
// niitä voi olla monta (korkeakoulutus)
function getKoulutusKoodiUrit(
  koulutustyyppi: KOULUTUSTYYPPI,
  koulutusKoodiUrit?: Array<string>
): { koulutusKoodiUri?: string; korkeakoulutusKoodiUrit: Array<string> } {
  const isKorkeakoulu = isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi);

  const firstElement = koulutusKoodiUrit?.[0];

  return {
    koulutusKoodiUri: isKorkeakoulu ? undefined : firstElement,
    korkeakoulutusKoodiUrit: isKorkeakoulu ? koulutusKoodiUrit || [] : [],
  };
}

export const getFormValuesByKoulutus = (koulutus): KoulutusFormValues => {
  const {
    kielivalinta = [],
    koulutustyyppi = '',
    tarjoajat = [],
    metadata = {},
    nimi = {},
    julkinen = false,
    esikatselu = false,
    tila,
    teemakuva,
    ePerusteId,
    sorakuvausId,
    externalId,
    organisaatioOid,
  } = koulutus;

  const { koulutusKoodiUri, korkeakoulutusKoodiUrit } = getKoulutusKoodiUrit(
    koulutustyyppi,
    koulutus.koulutuksetKoodiUri
  );

  const {
    lisatiedot = [],
    kuvaus = {},
    tutkinnonOsat = [],
    opintojenLaajuusKoodiUri = '',
    opintojenLaajuusyksikkoKoodiUri = '',
    opintojenLaajuusNumero,
    tutkintonimikeKoodiUrit = [],
    kuvauksenNimi = {},
    koulutusalaKoodiUrit = [],
    osaamisalaKoodiUri,
    linkkiEPerusteisiin = {},
  } = metadata;

  return {
    organisaatioOid: toSelectValue(organisaatioOid),
    externalId,
    tila,
    kieliversiot: kielivalinta,
    tarjoajat: { tarjoajat },
    information: {
      nimi,
      eperuste: {
        value: ePerusteId,
      },
      koulutus: {
        value: koulutusKoodiUri,
      },
      korkeakoulutukset: korkeakoulutusKoodiUrit.map(value => ({ value })),
      opintojenLaajuus: {
        value: opintojenLaajuusKoodiUri,
      },
      opintojenLaajuusyksikko: {
        value: opintojenLaajuusyksikkoKoodiUri,
      },
      opintojenLaajuusnumero: isNumeric(opintojenLaajuusNumero)
        ? opintojenLaajuusNumero.toString()
        : '',
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
      linkkiEPerusteisiin,
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
    soraKuvaus: sorakuvausId
      ? {
          value: sorakuvausId,
        }
      : null,
  };
};

export default getFormValuesByKoulutus;
