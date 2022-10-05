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
import { mapValues } from '#/src/utils/lodashFpUncapped';

const getToimitustapaValues = (toimitustapa, toimitusosoite) => ({
  tapa: toimitustapa || '',
  paikka: {
    osoite: _fp.reduce(
      (acc, [kieli, osoite]) => {
        const [r1, r2] = `${osoite || ''}`.split('\n');
        acc.rivi1[kieli] = r1;
        acc.rivi2[kieli] = r2;
        return acc;
      },
      { rivi1: {}, rivi2: {} },
      Object.entries(toimitusosoite?.osoite?.osoite || {})
    ),
    postinumero: toimitusosoite?.osoite?.postinumeroKoodiUri
      ? { value: toimitusosoite?.osoite?.postinumeroKoodiUri }
      : undefined,
    sahkoposti: toimitusosoite?.sahkoposti || '',
    verkkosivu: toimitusosoite?.verkkosivu || '',
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
  linja: linja || LUKIO_YLEISLINJA,
  alinHyvaksyttyKeskiarvo: parseKeskiarvo(alinHyvaksyttyKeskiarvo),
  lisatietoa: mapValues(parseEditorState, lisatietoa),
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
  formMode,
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
    uudenOpiskelijanUrl,
  } = metadata;
  return {
    organisaatioOid: toSelectValue(organisaatioOid),
    externalId,
    uudenOpiskelijanUrl,
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
      aloituspaikkakuvaus: mapValues(parseEditorState, aloituspaikat?.kuvaus),
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
      voiSuorittaaKaksoistutkinnon: Boolean(toinenAsteOnkoKaksoistutkinto),
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
        valintakokeidenYleiskuvaus,
        formMode
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
