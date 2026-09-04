import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import {
  ToteutusModel,
  HakuModel,
  HakukohdeModel,
} from '#/src/types/domainTypes';
import { getValuesForSaving } from '#/src/utils';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { createHakukohde } from '#/src/utils/hakukohde/createHakukohde';
import { getHakukohdeByFormValues } from '#/src/utils/hakukohde/getHakukohdeByFormValues';
import { updateHakukohde } from '#/src/utils/hakukohde/updateHakukohde';
import { validateHakukohdeForm } from '#/src/utils/hakukohde/validateHakukohdeForm';

type HakukohdeFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  hakukohde?: HakukohdeModel;
  koulutustyyppi: string;
  haku?: HakuModel;
  toteutus?: ToteutusModel;
  canUpdate?: boolean;
  infoTextTranslationKey?: string;
};

export const HakukohdeFooter = ({
  formMode,
  organisaatioOid,
  hakukohde = {},
  koulutustyyppi,
  haku,
  toteutus,
  canUpdate,
  infoTextTranslationKey,
}: HakukohdeFooterProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm();
  const formName = useFormName();
  // Alkuarvot sovittimelta, EI redux-formin storesta suoraan. Ks. HakuFooter -
  // sama korjaus tehtiin siellä siirron yhteydessä, ja se tehdään tänne nyt, koska
  // vika on näkymätön: siirretyllä lomakkeella state.form[formName] puuttuu,
  // initialValues on undefined, ja getValuesForSaving rakentaa rungon tyhjän pohjan
  // päälle - jolloin jokainen kenttä jota käyttäjä ei koskenut katoaa rungosta
  // hiljaa. Mitattu: yksikään testi ei huomaa tätä, koska kokoontaittuva osio
  // renderöi kenttänsä myös kiinni ollessaan ja rekisteri kattaa ne.
  //
  // Redux-form-polulla form.initial on sama arvo kuin storesta luettuna, joten
  // muutos on turvallinen jo ennen tämän lomakkeen siirtoa.
  const initialValues = form?.initial;

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const dataSendFn =
        formMode === FormMode.CREATE ? createHakukohde : updateHakukohde;

      const valuesToSend = getValuesForSaving(
        values,
        form.registeredFields,
        form.unregisteredFields,
        initialValues
      );

      const { oid, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        hakukohde:
          formMode === FormMode.CREATE
            ? {
                ...getHakukohdeByFormValues(valuesToSend),
                hakuOid: haku?.oid,
                toteutusOid: toteutus?.oid,
              }
            : {
                ...hakukohde,
                ...getHakukohdeByFormValues(valuesToSend),
              },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.HAKUKOHDE, valuesToSend.tila);
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
      hakukohde,
      navigate,
      initialValues,
      toteutus,
      queryClient,
    ]
  );

  const save = useSaveForm({
    formName,
    submit,
    validate: validateHakukohdeForm(koulutustyyppi),
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.HAKUKOHDE}
      entity={hakukohde}
      save={save}
      canUpdate={canUpdate}
      esikatseluUrl={apiUrls.url('konfo-ui.toteutus', hakukohde?.toteutusOid)}
      infoTextTranslationKey={infoTextTranslationKey}
    />
  );
};
