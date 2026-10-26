import { mapValues, toString } from 'lodash';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { FormMode, JULKAISUTILA, KOULUTUSTYYPPI } from '#/src/constants';
import { ValintaperusteModel } from '#/src/types/domainTypes';
import { ValintaperusteFormValues } from '#/src/types/valintaperusteTypes';
import { toEnum, toSelectValue } from '#/src/utils';
import { getKokeetTaiLisanaytotValues } from '#/src/utils/form/getKokeetTaiLisanaytotValues';
import { parseSisaltoField } from '#/src/utils/form/parseSisaltoField';

export const getFormValuesByValintaperuste = (
  valintaperuste: ValintaperusteModel,
  formMode?: FormMode
): ValintaperusteFormValues => {
  const {
    hakutapaKoodiUri = null,
    kielivalinta = [],
    kohdejoukkoKoodiUri = null,
    nimi = {},
    metadata = {},
    koulutustyyppi = null,
    julkinen = false,
    tila,
    valintakokeet,
    esikatselu = false,
    externalId,
    organisaatioOid,
  } = valintaperuste;

  const {
    valintatavat = [],
    kuvaus = {},
    sisalto = [],
    valintakokeidenYleiskuvaus,
    hakukelpoisuus = {},
    lisatiedot = {},
  } = metadata;

  return {
    organisaatioOid: toSelectValue(organisaatioOid),
    externalId,
    tila: toEnum(JULKAISUTILA, tila),
    perustiedot: {
      tyyppi: toEnum(KOULUTUSTYYPPI, koulutustyyppi),
      kieliversiot: kielivalinta,
      hakutapa: hakutapaKoodiUri,
      kohdejoukko: kohdejoukkoKoodiUri ? { value: kohdejoukkoKoodiUri } : null,
    },
    julkinen,
    kuvaus: {
      nimi,
      kuvaus: mapValues(kuvaus || {}, parseEditorState),
      sisalto: parseSisaltoField(sisalto),
    },
    hakukelpoisuus: mapValues(hakukelpoisuus || {}, parseEditorState),
    lisatiedot: mapValues(lisatiedot || {}, parseEditorState),
    valintatavat: (valintatavat || []).map(
      ({
        nimi: valintatapaNimi,
        sisalto: valintatapaSisalto,
        valintatapaKoodiUri,
        kynnysehto,
        enimmaispisteet,
        vahimmaispisteet,
      }) => ({
        nimi: valintatapaNimi || {},
        sisalto: parseSisaltoField(valintatapaSisalto),
        tapa: valintatapaKoodiUri ? { value: valintatapaKoodiUri } : null,
        kynnysehto: mapValues(kynnysehto || {}, parseEditorState),
        enimmaispistemaara: toString(enimmaispisteet)?.replace('.', ',') || '',
        vahimmaispistemaara:
          toString(vahimmaispisteet)?.replace('.', ',') || '',
      })
    ),
    valintakokeet: getKokeetTaiLisanaytotValues(
      valintakokeet,
      valintakokeidenYleiskuvaus,
      formMode
    ),
    esikatselu,
  };
};
