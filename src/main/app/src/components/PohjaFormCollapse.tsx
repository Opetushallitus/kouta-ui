import React, { useCallback } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { useFieldRegistry } from '#/src/components/formFields/FieldRegistry';
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
  ...props
}: PohjaFormCollapseProps) {
  const { t } = useTranslation();
  const tapa = useFieldValue('pohja.tapa');
  const valinta = useFieldValue('pohja.valinta');

  const fieldRegistry = useFieldRegistry();

  const { selectPohja } = usePohjaEntity(entityType);
  const onPohjaContinue = useCallback(() => {
    _fp.isFunction(onContinue) && onContinue();
    // Pohjan valinta alustaa lomakkeen uudelleen: kopio haetaan, initialValues
    // vaihtuu, ja osiot mountautuvat uudelleen uusien arvojen mukaan. Vanhan
    // lomakkeen piilotukset eivät kuulu enää mihinkään, joten ne pudotetaan tässä -
    // kentät, jotka uusi lomake piilottaa, kirjautuvat poistuneiksi vasta kopion
    // saapumisen jälkeen.
    fieldRegistry?.clearUnregisteredFields();
    selectPohja({
      tapa,
      valinta: valinta?.value,
    });
  }, [fieldRegistry, selectPohja, tapa, valinta, onContinue]);

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
