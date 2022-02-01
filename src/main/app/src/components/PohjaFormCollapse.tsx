import React, { useCallback } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import PohjaValintaSection from '#/src/components/PohjaValintaSection';
import { ENTITY } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { usePohjaEntity } from '#/src/hooks/usePohjaEntity';

import { FormCollapse } from './FormCollapse';

type PohjaFormCollapseProps = {
  entityType: ENTITY;
  createLabel: string;
  copyLabel: string;
  getCopyEntities: (any) => any;
  organisaatioOid: string;
  section?: string;
  infoText?: string;
  onContinue?: () => void;
  scrollOnActive?: boolean;
  disabled?: boolean | null;
};

export default function PohjaFormCollapse({
  onContinue,
  entityType,
  scrollOnActive = false,
  ...props
}: PohjaFormCollapseProps) {
  const { t } = useTranslation();
  const tapa = useFieldValue('pohja.tapa');
  const valinta = useFieldValue('pohja.valinta');

  const { selectPohja } = usePohjaEntity(entityType);
  const onPohjaContinue = useCallback(() => {
    _fp.isFunction(onContinue) && onContinue();
    selectPohja({
      tapa,
      valinta: valinta?.value,
    });
  }, [selectPohja, tapa, valinta, onContinue]);

  return (
    <FormCollapse
      section="pohja"
      header={t('yleiset.pohjanValinta')}
      onContinue={onPohjaContinue}
      Component={PohjaValintaSection}
      {...props}
    />
  );
}
