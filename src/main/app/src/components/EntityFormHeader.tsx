import React from 'react';

import { useTranslation } from 'react-i18next';

import FormHeader from '#/src/components/FormHeader';
import { ENTITY, JULKAISUTILA } from '#/src/constants';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import LargeStatusTag from './StatusTag/LargeStatusTag';
import { UlkoinenTunniste } from './UlkoinenTunniste';

type EntityFormHeaderProps = {
  entityType: ENTITY;
  entity?: {
    tila?: JULKAISUTILA;
    nimi?: string;
  };
};

export default function EntityFormHeader({
  entityType,
  entity,
}: EntityFormHeaderProps) {
  const { t, i18n } = useTranslation();
  const { tila, nimi } = entity || {};
  const translatedNimi = getFirstLanguageValue(nimi, [i18n.language]);
  return (
    <FormHeader
      title={translatedNimi || t(`yleiset.${entityType}`)}
      status={tila ? <LargeStatusTag status={tila} /> : null}
    >
      {[
        ENTITY.KOULUTUS,
        ENTITY.TOTEUTUS,
        ENTITY.HAKU,
        ENTITY.HAKUKOHDE,
        ENTITY.VALINTAPERUSTE,
        ENTITY.SORA_KUVAUS,
      ].includes(entityType) && <UlkoinenTunniste />}
    </FormHeader>
  );
}
