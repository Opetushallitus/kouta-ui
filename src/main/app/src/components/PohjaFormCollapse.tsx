import React, { useCallback } from 'react';

import { isFunction } from 'lodash-es';
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
  const tapa = useFieldValue<string | undefined>('pohja.tapa');
  const valinta = useFieldValue<SelectOption<string> | undefined>(
    'pohja.valinta'
  );

  const fieldRegistry = useFieldRegistry();

  const { selectPohja } = usePohjaEntity(entityType);
  const onPohjaContinue = useCallback(() => {
    isFunction(onContinue) && onContinue();
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
