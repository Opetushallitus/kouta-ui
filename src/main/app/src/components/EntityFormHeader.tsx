import React from 'react';
import { useTranslation } from 'react-i18next';
import FormHeader from '#/src/components/FormHeader';
import StatusTag from '#/src/components/StatusTag';
import FormEditInfo from '#/src/components/FormEditInfo';

export default function EntityFormHeader({ entityType, entity, ...props }) {
  const { t } = useTranslation();
  const { modified, muokkaaja, tila } = entity || {};

  return (
    <FormHeader
      status={tila ? <StatusTag status={tila} large /> : null}
      editInfo={
        modified ? <FormEditInfo date={modified} editorOid={muokkaaja} /> : null
      }
      {...props}
    >
      {t(`yleiset.${entityType}`)}
    </FormHeader>
  );
}
