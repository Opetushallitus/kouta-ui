import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import FormCollapse from './FormCollapse';
import useFieldValue from './useFieldValue';
import PohjaValintaSection from '#/src/components/PohjaValintaSection';

export default function PohjaFormCollapse({
  children,
  onContinue,
  onSelectBase,
  ...props
}) {
  const { t } = useTranslation();
  const tapa = useFieldValue('pohja.tapa');
  const valinta = useFieldValue('pohja.valinta');

  const onPohjaContinue = useCallback(() => {
    onContinue();
    onSelectBase({
      tapa,
      valinta: get(valinta, 'value'),
    });
  }, [onSelectBase, tapa, valinta, onContinue]);

  return (
    <FormCollapse
      section="pohja"
      header={t('yleiset.pohjanValinta')}
      onContinue={onPohjaContinue}
      Component={PohjaValintaSection}
      {...props}
    >
      {children}
    </FormCollapse>
  );
}
