import _fp from 'lodash/fp';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { KOULUTUSTYYPPI, MaaraTyyppi } from '#/src/constants';
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
    opintojenLaajuusyksikkoKoodiUri = '',
    opintojenLaajuusNumero,
    opintojenLaajuusNumeroMin,
    opintojenLaajuusNumeroMax,
    tutkintonimikeKoodiUrit = [],
    koulutusalaKoodiUrit = [],
    osaamisalaKoodiUri,
    linkkiEPerusteisiin = {},
    isAvoinKorkeakoulutus,
    tunniste,
    opinnonTyyppiKoodiUri,
    erikoistumiskoulutusKoodiUri = '',
    osaamismerkkiKoodiUri,
    luokittelutermit,
    osaamistavoitteet,
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
      opintojenLaajuusyksikko: {
        value: opintojenLaajuusyksikkoKoodiUri,
      },
      opintojenLaajuusNumero: isNumeric(opintojenLaajuusNumero)
        ? opintojenLaajuusNumero.toString()
        : '',
      laajuusNumeroTyyppi:
        opintojenLaajuusNumeroMin === opintojenLaajuusNumeroMax
          ? MaaraTyyppi.YKSI_ARVO
          : MaaraTyyppi.VAIHTELUVALI,
      opintojenLaajuusNumeroMin: opintojenLaajuusNumeroMin,
      opintojenLaajuusNumeroMax: opintojenLaajuusNumeroMax,
      tutkintonimike: tutkintonimikeKoodiUrit.map(value => ({ value })),
      koulutusalat: koulutusalaKoodiUrit.map(value => ({ value })),
      isAvoinKorkeakoulutus: Boolean(isAvoinKorkeakoulutus),
      tunniste,
      opinnonTyyppi: {
        value: opinnonTyyppiKoodiUri,
      },
      erikoistumiskoulutus: {
        value: erikoistumiskoulutusKoodiUri,
      },
      osaamismerkki: { value: osaamismerkkiKoodiUri },
      ...(![KOULUTUSTYYPPI.OSAAMISALA, KOULUTUSTYYPPI.TUTKINNON_OSA].includes(
        koulutustyyppi
      ) && {
        luokittelutermit: luokittelutermit?.map(
          (value: string): { label: string; value: string } => {
            return {
              label: value,
              value: value,
            };
          }
        ),
      }),
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
        .filter(({ otsikkoKoodiUri }) => Boolean(otsikkoKoodiUri))
        .map(({ otsikkoKoodiUri }) => ({ value: otsikkoKoodiUri })),
      ...([KOULUTUSTYYPPI.OSAAMISALA, KOULUTUSTYYPPI.TUTKINNON_OSA].includes(
        koulutustyyppi
      ) && {
        luokittelutermit: luokittelutermit?.map(
          (value: string): { label: string; value: string } => {
            return {
              label: value,
              value: value,
            };
          }
        ),
      }),
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
      osaamistavoitteet: _fp.mapValues(parseEditorState, osaamistavoitteet),
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
