import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash/fp';
import { FormCollapse } from './FormCollapse';
import { useFieldValue } from '#/src/hooks/form';
import PohjaValintaSection from '#/src/components/PohjaValintaSection';

type PohjaFormCollapseProps = {
  section?: string;
  header?: React.ReactNode;
  infoText?: string;
  onContinue?: () => void;
  scrollOnActive?: boolean;
  onSelectBase?: ({ tapa, valinta }) => void;
  createLabel: string;
  copyLabel: string;
  getCopyEntities: (any) => any;
  organisaatioOid: string;
};

export default function PohjaFormCollapse({
  onContinue,
  onSelectBase,
  scrollOnActive = false,
  ...props
}: PohjaFormCollapseProps) {
  const { t } = useTranslation();
  const tapa = useFieldValue('pohja.tapa');
  const valinta = useFieldValue('pohja.valinta');
  const onPohjaContinue = useCallback(() => {
    _.isFunction(onContinue) && onContinue();
    _.isFunction(onSelectBase) &&
      onSelectBase({
        tapa,
        valinta: valinta?.value,
      });
  }, [onSelectBase, tapa, valinta, onContinue]);

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
