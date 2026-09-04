import React, { useCallback } from 'react';

import _ from 'lodash';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode, KOULUTUSTYYPPI } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { KoulutusModel, ToteutusModel } from '#/src/types/domainTypes';
import { getValuesForSaving } from '#/src/utils';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { getTarjoajaOids } from '#/src/utils/getTarjoajaOids';
import { createToteutus } from '#/src/utils/toteutus/createToteutus';
import getToteutusByFormValues from '#/src/utils/toteutus/getToteutusByFormValues';
import { updateToteutus } from '#/src/utils/toteutus/updateToteutus';
import { validateToteutusForm } from '#/src/utils/toteutus/validateToteutusForm';

import { useTarjoajatHierarkia } from './useTarjoajatHierarkia';

type ToteutusFooterProps = {
  formMode: FormMode;
  organisaatioOid: string;
  koulutustyyppi: KOULUTUSTYYPPI;
  toteutus?: ToteutusModel;
  koulutus?: KoulutusModel;
  canUpdate?: boolean;
};

export const ToteutusFooter = ({
  formMode,
  toteutus,
  koulutustyyppi,
  organisaatioOid,
  koulutus,
  canUpdate,
}: ToteutusFooterProps) => {
  const { hierarkia = [] } = useTarjoajatHierarkia(
    organisaatioOid,
    toteutus?.tarjoajat
  );

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

  const dataSendFn =
    formMode === FormMode.CREATE ? createToteutus : updateToteutus;

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const valuesToSend = getValuesForSaving(
        values,
        form.registeredFields,
        form.unregisteredFields,
        initialValues
      );

      const { oid, warnings } = await dataSendFn({
        httpClient,
        apiUrls,
        toteutus:
          formMode === FormMode.CREATE
            ? {
                ...getToteutusByFormValues({
                  ...valuesToSend,
                  koulutustyyppi,
                }),
                koulutusOid: koulutus?.oid,
              }
            : {
                ..._.omit(toteutus, '_enrichedData'),
                ...getToteutusByFormValues({
                  ...valuesToSend,
                  koulutustyyppi,
                }),
                tarjoajat: getTarjoajaOids({
                  hierarkia,
                  existingTarjoajat: toteutus?.tarjoajat,
                  newTarjoajat: values?.tarjoajat,
                }),
              },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.TOTEUTUS, valuesToSend.tila);
      }
      return { warnings: warnings };
    },
    [
      dataSendFn,
      // form, EI form.registeredFields tai form.unregisteredFields. Molemmat ovat
      // gettereitä sovittimen lomaketilassa, ja riippuvuuslistassa mainitseminen
      // lukisi getterin RENDERIN AIKANA - vastoin sitä lukuhetki-semantiikkaa jonka
      // takia ne ovat gettereitä (rekisteri elää refeissä eikä provider renderöi
      // uudelleen kenttien mountatessa, joten renderin aikana luettu joukko on
      // helposti vanhentunut). form kattaa molemmat luvut ja vaientaa säännön
      // ilman suppressiota.
      form,
      formMode,
      hierarkia,
      navigate,
      initialValues,
      koulutus,
      koulutustyyppi,
      organisaatioOid,
      toteutus,
      queryClient,
    ]
  );

  const save = useSaveForm({
    formName,
    submit,
    validate: values =>
      validateToteutusForm(
        { ...values, koulutustyyppi, koulutus },
        form?.registeredFields
      ),
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.TOTEUTUS}
      entity={toteutus}
      save={save}
      canUpdate={canUpdate}
      esikatseluUrl={
        formMode === FormMode.EDIT &&
        apiUrls.url('konfo-ui.toteutus', toteutus?.oid)
      }
    />
  );
};
