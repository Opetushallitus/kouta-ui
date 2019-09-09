import get from 'lodash/get';

import { isNumeric } from './index';
import getValintakoeFieldsValues from './getValintakoeFieldsValues';
import getHakulomakeFieldsValues from './getHakulomakeFieldsValues';

const getFormValuesByHakukohde = hakukohde => {
  const {
    alkamiskausiKoodiUri = '',
    kaytetaanHaunAikataulua,
    kielivalinta = [],
    minAloituspaikat = '',
    maxAloituspaikat = '',
    hakuajat = [],
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteet = [],
    alkamisvuosi,
    liitteidenToimitusosoite = {},
    liitteidenToimitusaika,
    liitteidenToimitustapa,
    nimi = {},
    toinenAsteOnkoKaksoistutkinto,
    valintakokeet = [],
    pohjakoulutusvaatimusKoodiUrit = [],
    valintaperuste = '',
    minEnsikertalaisenAloituspaikat = '',
    maxEnsikertalaisenAloituspaikat = '',
    kaytetaanHaunHakulomaketta,
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeKuvaus,
    hakulomakeLinkki,
    kaytetaanHaunAlkamiskautta,
    tila,
  } = hakukohde;

  return {
    tila,
    alkamiskausi: {
      eriAlkamiskausi: !kaytetaanHaunAlkamiskautta,
      kausi: alkamiskausiKoodiUri,
      vuosi: {
        value: isNumeric(alkamisvuosi) ? alkamisvuosi.toString() : '',
      },
    },
    kieliversiot: kielivalinta,
    aloituspaikat: {
      minAloituspaikkamaara: isNumeric(minAloituspaikat)
        ? minAloituspaikat.toString()
        : '',
      maxAloituspaikkamaara: isNumeric(maxAloituspaikat)
        ? maxAloituspaikat.toString()
        : '',
      minEnsikertalaismaara: isNumeric(minEnsikertalaisenAloituspaikat)
        ? minEnsikertalaisenAloituspaikat.toString()
        : '',
      maxEnsikertalaismaara: isNumeric(maxEnsikertalaisenAloituspaikat)
        ? maxEnsikertalaisenAloituspaikat.toString()
        : '',
    },
    hakuajat: {
      eriHakuaika: !kaytetaanHaunAikataulua,
      hakuajat: (hakuajat || []).map(({ alkaa, paattyy }) => {
        return {
          alkaa: alkaa || '',
          paattyy: paattyy || '',
        };
      }),
    },
    perustiedot: {
      nimi,
      voiSuorittaaKaksoistutkinnon: !!toinenAsteOnkoKaksoistutkinto,
    },
    pohjakoulutus: (pohjakoulutusvaatimusKoodiUrit || []).map(value => ({
      value,
    })),
    valintaperusteenKuvaus: {
      value: valintaperuste,
    },
    valintakoe: getValintakoeFieldsValues(valintakokeet),
    liitteet: {
      toimitustapa: {
        tapa: liitteidenToimitustapa || '',
        paikka: {
          sahkoposti: get(liitteidenToimitusosoite, 'sahkoposti') || '',
          osoite: get(liitteidenToimitusosoite, 'osoite.osoite') || {},
          postinumero: get(
            liitteidenToimitusosoite,
            'osoite.postinumeroKoodiUri',
          )
            ? {
                value: liitteidenToimitusosoite.osoite.postinumeroKoodiUri,
              }
            : undefined,
        },
      },
      yhteinenToimituspaikka: Boolean(liitteetOnkoSamaToimitusosoite),
      yhteinenToimitusaika: Boolean(liitteetOnkoSamaToimitusaika),
      toimitusaika: liitteidenToimitusaika || '',
      liitteet: (liitteet || []).map(
        ({
          tyyppi,
          nimi = {},
          toimitusaika,
          toimitustapa,
          toimitusosoite,
          kuvaus = {},
        }) => {
          return {
            tyyppi: { value: tyyppi },
            nimi,
            kuvaus,
            toimitusaika: toimitusaika || '',
            toimitustapa: {
              tapa: toimitustapa || '',
              paikka: {
                osoite: get(toimitusosoite, 'osoite.osoite') || {},
                postinumero: get(toimitusosoite, 'osoite.postinumeroKoodiUri')
                  ? { value: toimitusosoite.osoite.postinumeroKoodiUri }
                  : undefined,
                sahkoposti: get(toimitusosoite, 'sahkoposti') || '',
              },
            },
          };
        },
      ),
    },
    hakulomake: {
      ...getHakulomakeFieldsValues({
        hakulomaketyyppi,
        hakulomakeAtaruId,
        hakulomakeKuvaus,
        hakulomakeLinkki,
      }),
      eriHakulomake: !kaytetaanHaunHakulomaketta,
    },
  };
};

export default getFormValuesByHakukohde;
