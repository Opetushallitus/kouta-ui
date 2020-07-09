import _ from 'lodash';

import { isNumeric } from '#/src/utils';
import getKokeetTaiLisanaytotValues from '#/src/utils/form/getKokeetTaiLisanaytotValues';
import getHakulomakeFieldsValues from '#/src/utils/form/getHakulomakeFieldsValues';
import { parseEditorState } from '#/src/components/Editor/utils';

const getFormValuesByHakukohde = hakukohde => {
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
          sahkoposti: _.get(liitteidenToimitusosoite, 'sahkoposti') || '',
          osoite: _.get(liitteidenToimitusosoite, 'osoite.osoite') || {},
          postinumero: _.get(
            liitteidenToimitusosoite,
            'osoite.postinumeroKoodiUri'
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
          tyyppiKoodiUri,
          nimi = {},
          toimitusaika,
          toimitustapa,
          toimitusosoite,
          kuvaus = {},
        }) => {
          return {
            tyyppi: { value: tyyppiKoodiUri },
            nimi,
            kuvaus,
            toimitusaika: toimitusaika || '',
            toimitustapa: {
              tapa: toimitustapa || '',
              paikka: {
                osoite: _.get(toimitusosoite, 'osoite.osoite') || {},
                postinumero: _.get(toimitusosoite, 'osoite.postinumeroKoodiUri')
                  ? { value: toimitusosoite.osoite.postinumeroKoodiUri }
                  : undefined,
                sahkoposti: _.get(toimitusosoite, 'sahkoposti') || '',
              },
            },
          };
        }
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
