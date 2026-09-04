import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { HakuModel } from '#/src/types/domainTypes';
import { getValuesForSaving } from '#/src/utils';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { createHaku } from '#/src/utils/haku/createHaku';
import { getHakuByFormValues } from '#/src/utils/haku/getHakuByFormValues';
import { updateHaku } from '#/src/utils/haku/updateHaku';
import validateHakuForm from '#/src/utils/haku/validateHakuForm';

type HakuFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  haku?: HakuModel;
  canUpdate?: boolean;
};

export const HakuFooter = ({
  formMode,
  organisaatioOid,
  haku = {},
  canUpdate,
}: HakuFooterProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm();
  const formName = useFormName();

  // Alkuarvot sovittimelta, EI redux-formin storesta suoraan. Siirretyllä
  // lomakkeella state.form[formName] ei ole olemassa lainkaan, jolloin
  // initialValues olisi undefined ja getValuesForSaving rakentaisi rungon tyhjän
  // pohjan päälle - eli kaikki kentät, joita käyttäjä ei koskenut, katoaisivat
  // rungosta. Molemmat sovittimet palauttavat initialin lomaketilassa.
  const initialValues = form?.initial;

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn = formMode === FormMode.CREATE ? createHaku : updateHaku;

      const valuesToSend = getValuesForSaving(
        values,
        form.registeredFields,
        form.unregisteredFields,
        initialValues
      );

      const { oid, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        haku: {
          ...haku,
          ...getHakuByFormValues(valuesToSend),
        },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.HAKU, valuesToSend.tila);
      }
      return { warnings: warnings };
    },
    [
      organisaatioOid,
      // form, EI form.registeredFields tai form.unregisteredFields. Molemmat ovat
      // gettereitä sovittimen lomaketilassa, ja riippuvuuslistassa mainitseminen
      // lukisi getterin RENDERIN AIKANA - vastoin sitä lukuhetki-semantiikkaa jonka
      // takia ne ovat gettereitä (rekisteri elää refeissä eikä provider renderöi
      // uudelleen kenttien mountatessa, joten renderin aikana luettu joukko on
      // helposti vanhentunut). form kattaa molemmat luvut ja vaientaa säännön
      // ilman suppressiota.
      form,
      formMode,
      haku,
      navigate,
      initialValues,
      queryClient,
    ]
  );

  const save = useSaveForm({
    formName,
    submit,
    validate: validateHakuForm,
  });

  return (
    <FormFooter
      hideEsikatselu
      entityType={ENTITY.HAKU}
      entity={haku}
      save={save}
      canUpdate={canUpdate}
    />
  );
};
