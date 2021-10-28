import _ from 'lodash';
import _fp from 'lodash/fp';

import { parseEditorState } from '#/src/components/Editor/utils';
import { LUKIO_YLEISLINJA } from '#/src/constants';
import { HakukohdeFormValues } from '#/src/types/hakukohdeTypes';
import { isNumeric, toSelectValue } from '#/src/utils';
import { getAjankohtaFields } from '#/src/utils/form/aloitusajankohtaHelpers';
import { getHakulomakeFieldsValues } from '#/src/utils/form/getHakulomakeFieldsValues';
import {
  getKokeetTaiLisanaytotValues,
  getTilaisuusValues,
} from '#/src/utils/form/getKokeetTaiLisanaytotValues';

const getToimitustapaValues = (toimitustapa, toimitusosoite) => ({
  tapa: toimitustapa || '',
  paikka: {
    osoite: toimitusosoite?.osoite?.osoite || {},
    postinumero: toimitusosoite?.osoite?.postinumeroKoodiUri
      ? { value: toimitusosoite?.osoite?.postinumeroKoodiUri }
      : undefined,
    sahkoposti: toimitusosoite?.sahkoposti || '',
  },
});

// Keskiarvossa halutaan näyttää aina vähintään yksi desimaali (e.g. 7,0)
export const parseKeskiarvo = v =>
  v ? parseFloat(v).toLocaleString('fi', { minimumFractionDigits: 1 }) : '';

const getHakukohteenLinjaValues = ({
  linja,
  alinHyvaksyttyKeskiarvo,
  lisatietoa,
  painotetutArvosanat,
}) => ({
  linja: !linja ? LUKIO_YLEISLINJA : linja,
  alinHyvaksyttyKeskiarvo: parseKeskiarvo(alinHyvaksyttyKeskiarvo),
  lisatietoa: _.mapValues(lisatietoa, parseEditorState),
  painotetutArvosanat: (painotetutArvosanat || []).map(arvosana => {
    return {
      painotettuOppiaine: {
        value: arvosana.koodiUrit?.oppiaine ?? '',
      },
      painokerroin: arvosana.painokerroin,
    };
  }),
});

export const getFormValuesByHakukohde = (
  hakukohde,
  nimiKoodista?: TranslatedField
): HakukohdeFormValues => {
  const {
    kaytetaanHaunAikataulua,
    kielivalinta = [],
    hakuajat = [],
    liitteetOnkoSamaToimitusaika,
    liitteetOnkoSamaToimitusosoite,
    liitteet = [],
    liitteidenToimitusosoite = {},
    liitteidenToimitusaika,
    liitteidenToimitustapa,
    nimi = {},
    hakukohdeKoodiUri,
    toinenAsteOnkoKaksoistutkinto,
    valintakokeet = [],
    pohjakoulutusvaatimusKoodiUrit = [],
    valintaperusteId,
    kaytetaanHaunHakulomaketta,
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeKuvaus,
    hakulomakeLinkki,
    jarjestyspaikkaOid,
    tila,
    esikatselu = false,
    pohjakoulutusvaatimusTarkenne,
    metadata = {},
    externalId,
    organisaatioOid,
  } = hakukohde;

  const {
    valintakokeidenYleiskuvaus,
    kynnysehto,
    kaytetaanHaunAlkamiskautta,
    koulutuksenAlkamiskausi = {},
    valintaperusteenValintakokeidenLisatilaisuudet = [],
    aloituspaikat,
    hakukohteenLinja,
  } = metadata;

  return {
    organisaatioOid: toSelectValue(organisaatioOid),
    externalId,
    tila,
    esikatselu,
    kieliversiot: kielivalinta,
    aloituspaikat: {
      aloituspaikkamaara: isNumeric(aloituspaikat?.lukumaara)
        ? aloituspaikat.lukumaara.toString()
        : '',
      ensikertalaismaara: isNumeric(aloituspaikat?.ensikertalaisille)
        ? aloituspaikat.ensikertalaisille.toString()
        : '',
      aloituspaikkakuvaus: _.mapValues(aloituspaikat?.kuvaus, parseEditorState),
    },
    hakuajat: {
      eriHakuaika: !kaytetaanHaunAikataulua,
      hakuajat: (hakuajat || []).map(({ alkaa = '', paattyy = '' }) => ({
        alkaa,
        paattyy,
      })),
    },
    perustiedot: {
      nimi: _fp.isEmpty(nimiKoodista) ? nimi : nimiKoodista,
      hakukohdeKoodiUri: toSelectValue(hakukohdeKoodiUri),
      voiSuorittaaKaksoistutkinnon: !!toinenAsteOnkoKaksoistutkinto,
    },
    ajankohta: {
      kaytetaanHakukohteenAlkamiskautta:
        kaytetaanHaunAlkamiskautta === undefined
          ? false
          : !kaytetaanHaunAlkamiskautta,
      ...getAjankohtaFields(koulutuksenAlkamiskausi),
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
    valintaperusteenKuvaus: {
      valintaperuste: valintaperusteId
        ? {
            value: valintaperusteId,
          }
        : undefined,
      kynnysehto: _.mapValues(kynnysehto, parseEditorState),
    },
    valintakokeet: {
      ...getKokeetTaiLisanaytotValues(
        valintakokeet,
        valintakokeidenYleiskuvaus
      ),
      // NOTE: tässä muutetaan taulukko [{id, tilaisuudet: [tilaisuus1, tilaisuus2]}] objektiksi {id: [tilaisuus1, tilaisuus2]} käsittelyn helpottamiseksi
      valintaperusteenValintakokeidenLisatilaisuudet: _fp.flow(
        _fp.keyBy('id'),
        _fp.mapValues(v => v.tilaisuudet.map(getTilaisuusValues))
      )(valintaperusteenValintakokeidenLisatilaisuudet),
    },
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
    hakukohteenLinja: hakukohteenLinja
      ? getHakukohteenLinjaValues(hakukohteenLinja)
      : undefined,
  };
};
