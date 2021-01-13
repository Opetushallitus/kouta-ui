import _ from 'lodash';

import { getKokeetTaiLisanaytotValues } from '#/src/utils/form/getKokeetTaiLisanaytotValues';
import { getHakulomakeFieldsValues } from '#/src/utils/form/getHakulomakeFieldsValues';
import { isNumeric, toSelectValue } from '#/src/utils';
import { parseEditorState } from '#/src/components/Editor/utils';
import { alkamiskausityyppiToAjankohtatyyppi } from '../form/alkamiskausityyppiHelpers';
import { Alkamiskausityyppi } from '#/src/constants';
import { HakukohdeFormValues } from '#/src/types/hakukohdeTypes';

const getToimitustapaValues = (toimitustapa, toimitusosoite) => ({
  tapa: toimitustapa || '',
  paikka: {
    osoite: toimitusosoite?.osoite.osoite || {},
    postinumero: toimitusosoite?.osoite?.postinumeroKoodiUri
      ? { value: toimitusosoite?.osoite?.postinumeroKoodiUri }
      : undefined,
    sahkoposti: toimitusosoite?.sahkoposti || '',
  },
});

export const getFormValuesByHakukohde = (hakukohde): HakukohdeFormValues => {
  const {
    kaytetaanHaunAikataulua,
    kielivalinta = [],
    aloituspaikat = '',
    hakuajat = [],
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteet = [],
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
    jarjestyspaikkaOid,
    tila,
    pohjakoulutusvaatimusTarkenne,
    metadata = {},
  } = hakukohde;

  const {
    valintakokeidenYleiskuvaus,
    kaytetaanHaunAlkamiskautta,
    koulutuksenAlkamiskausi = {},
  } = metadata;

  const {
    alkamiskausityyppi,
    koulutuksenAlkamiskausiKoodiUri = null,
    koulutuksenAlkamispaivamaara = null,
    koulutuksenPaattymispaivamaara = null,
    koulutuksenAlkamisvuosi = '',
    henkilokohtaisenSuunnitelmanLisatiedot,
  } = koulutuksenAlkamiskausi;

  return {
    tila,
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
    ajankohta: {
      kaytetaanHakukohteenAlkamiskautta: !kaytetaanHaunAlkamiskautta,
      ajankohtaTyyppi: alkamiskausityyppiToAjankohtatyyppi(alkamiskausityyppi),
      kausi: koulutuksenAlkamiskausiKoodiUri,
      vuosi: toSelectValue(koulutuksenAlkamisvuosi),
      tiedossaTarkkaAjankohta:
        alkamiskausityyppi === Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA,
      tarkkaAlkaa: koulutuksenAlkamispaivamaara,
      tarkkaPaattyy: koulutuksenPaattymispaivamaara,
      henkilokohtaisenSuunnitelmanLisatiedot: _.mapValues(
        henkilokohtaisenSuunnitelmanLisatiedot,
        parseEditorState
      ),
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
      toimitustapa: getToimitustapaValues(
        liitteidenToimitustapa,
        liitteidenToimitusosoite
      ),
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
          toimitustapa: getToimitustapaValues(toimitustapa, toimitusosoite),
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
