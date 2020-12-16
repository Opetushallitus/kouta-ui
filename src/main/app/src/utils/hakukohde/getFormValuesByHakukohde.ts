import _ from 'lodash';

import { isNumeric } from '#/src/utils';
import { getKokeetTaiLisanaytotValues } from '#/src/utils/form/getKokeetTaiLisanaytotValues';
import { getHakulomakeFieldsValues } from '#/src/utils/form/getHakulomakeFieldsValues';
import { parseEditorState } from '#/src/components/Editor/utils';

export const getFormValuesByHakukohde = hakukohde => {
  const {
    alkamiskausiKoodiUri = '',
    kaytetaanHaunAikataulua,
    kielivalinta = [],
    aloituspaikat = '',
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
    valintaperusteId,
    ensikertalaisenAloituspaikat = '',
    kaytetaanHaunHakulomaketta,
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeKuvaus,
    hakulomakeLinkki,
    kaytetaanHaunAlkamiskautta,
    jarjestyspaikkaOid,
    tila,
    pohjakoulutusvaatimusTarkenne,
    metadata = {},
  } = hakukohde;

  const { valintakokeidenYleiskuvaus } = metadata;

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
      aloituspaikkamaara: isNumeric(aloituspaikat)
        ? aloituspaikat.toString()
        : '',
      ensikertalaismaara: isNumeric(ensikertalaisenAloituspaikat)
        ? ensikertalaisenAloituspaikat.toString()
        : '',
    },
    hakuajat: {
      eriHakuaika: !kaytetaanHaunAikataulua,
      hakuajat: (hakuajat || []).map(({ alkaa = '', paattyy = '' }) => ({
        alkaa,
        paattyy,
      })),
    },
    perustiedot: {
      nimi,
      voiSuorittaaKaksoistutkinnon: !!toinenAsteOnkoKaksoistutkinto,
    },
    pohjakoulutus: {
      pohjakoulutusvaatimus: (pohjakoulutusvaatimusKoodiUrit || []).map(
        value => ({
          value,
        })
      ),
      tarkenne: _.mapValues(
        pohjakoulutusvaatimusTarkenne || {},
        parseEditorState
      ),
    },
    valintaperusteenKuvaus: valintaperusteId
      ? {
          value: valintaperusteId,
        }
      : undefined,
    valintakokeet: getKokeetTaiLisanaytotValues(
      valintakokeet,
      valintakokeidenYleiskuvaus
    ),
    jarjestyspaikkaOid,
    liitteet: {
      toimitustapa: {
        tapa: liitteidenToimitustapa || '',
        paikka: {
          sahkoposti: liitteidenToimitusosoite?.sahkoposti || '',
          osoite: liitteidenToimitusosoite?.osoite?.osoite || {},
          postinumero: liitteidenToimitusosoite?.osoite?.postinumeroKoodiUri
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
          tyyppiKoodiUri,
          nimi = {},
          toimitusaika,
          toimitustapa,
          toimitusosoite,
          kuvaus = {},
        }) => ({
          tyyppi: { value: tyyppiKoodiUri },
          nimi,
          kuvaus: _.mapValues(kuvaus, parseEditorState),
          toimitusaika: toimitusaika || '',
          toimitustapa: {
            tapa: toimitustapa || '',
            paikka: {
              osoite: toimitusosoite?.osoite?.osoite || {},
              postinumero: toimitusosoite?.osoite?.postinumeroKoodiUri
                ? { value: toimitusosoite.osoite.postinumeroKoodiUri }
                : undefined,
              sahkoposti: toimitusosoite?.sahkoposti || '',
            },
          },
        })
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
