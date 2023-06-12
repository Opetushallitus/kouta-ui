import _fp from 'lodash/fp';

import { HakuFormValues } from '#/src/types/hakuTypes';
import { isPartialDate } from '#/src/utils';
import { getAlkamiskausiData } from '#/src/utils/form/aloitusajankohtaHelpers';
import { getHakulomakeFieldsData } from '#/src/utils/form/getHakulomakeFieldsData';
import isKorkeakoulutusKohdejoukkoKoodiUri from '#/src/utils/isKorkeakoulutusKohdejoukkoKoodiUri';

import { pickTranslations } from '../pickTranslations';

const getKielivalinta = values => values?.kieliversiot || [];

export const getHakuByFormValues = (values: HakuFormValues) => {
  const kielivalinta = getKielivalinta(values);

  const {
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  } = getHakulomakeFieldsData({
    hakulomakeValues: values?.hakulomake,
    kielivalinta,
  });

  const kohdejoukkoKoodiUri = values?.kohdejoukko?.kohdejoukko || null;

  return {
    organisaatioOid: values?.organisaatioOid?.value,
    externalId: _fp.isEmpty(values?.externalId) ? null : values?.externalId,
    muokkaaja: values?.muokkaaja,
    tila: values?.tila,
    kielivalinta,
    hakutapaKoodiUri: values?.hakutapa || null,
    hakuajat: (values?.aikataulut?.hakuaika || []).map(
      ({ alkaa, paattyy }) => ({
        alkaa: isPartialDate(alkaa) ? null : alkaa,
        paattyy: isPartialDate(paattyy) ? null : paattyy,
      })
    ),
    hakukohteenLiittamisenTakaraja:
      values?.aikataulut?.lisaamisenTakaraja || null,
    nimi: pickTranslations(values?.nimi, kielivalinta),
    kohdejoukkoKoodiUri,
    kohdejoukonTarkenneKoodiUri: isKorkeakoulutusKohdejoukkoKoodiUri(
      kohdejoukkoKoodiUri
    )
      ? values?.kohdejoukko?.tarkenne?.value || null
      : null,
    hakulomaketyyppi,
    metadata: {
      koulutuksenAlkamiskausi: getAlkamiskausiData(
        values?.aikataulut,
        kielivalinta
      ),
      tulevaisuudenAikataulu: (values?.aikataulut?.aikataulu || []).map(
        ({ alkaa, paattyy }) => ({
          alkaa: alkaa || null,
          paattyy: paattyy || null,
        })
      ),
      yhteyshenkilot: (values?.yhteyshenkilot || []).map(
        ({
          nimi,
          titteli,
          puhelinnumero,
          sahkoposti,
          verkkosivu,
          verkkosivuTeksti,
        }) => ({
          nimi: pickTranslations(nimi, kielivalinta),
          titteli: pickTranslations(titteli, kielivalinta),
          puhelinnumero: pickTranslations(puhelinnumero, kielivalinta),
          wwwSivu: pickTranslations(verkkosivu, kielivalinta),
          wwwSivuTeksti: pickTranslations(verkkosivuTeksti, kielivalinta),
          sahkoposti: pickTranslations(sahkoposti, kielivalinta),
        })
      ),
    },
    hakukohteenMuokkaamisenTakaraja:
      values?.aikataulut?.muokkauksenTakaraja || null,
    ajastettuJulkaisu: values?.aikataulut?.ajastettuJulkaisu || null,
    ajastettuHaunJaHakukohteidenArkistointi:
      values?.aikataulut?.ajastettuHaunJaHakukohteidenArkistointi || null,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};
