import React, { useCallback } from 'react';

import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { FormFooter } from '#/src/components/FormPage';
import { ENTITY, FormMode } from '#/src/constants';
import { useFormMode, useFormName } from '#/src/contexts/FormContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useFieldValue, useForm } from '#/src/hooks/form';
import { useSaveForm } from '#/src/hooks/useSaveForm';
import { KoulutusModel } from '#/src/types/domainTypes';
import { getValuesForSaving } from '#/src/utils';
import { afterUpdate } from '#/src/utils/afterUpdate';
import { createKoulutus } from '#/src/utils/koulutus/createKoulutus';
import getKoulutusByFormValues from '#/src/utils/koulutus/getKoulutusByFormValues';
import { updateKoulutus } from '#/src/utils/koulutus/updateKoulutus';
import { validateKoulutusForm } from '#/src/utils/koulutus/validateKoulutusForm';

type KoulutusFooterProps = {
  organisaatioOid: string;
  koulutus?: KoulutusModel;
  canUpdate?: boolean;
};

export const KoulutusFooter = ({
  organisaatioOid,
  koulutus,
  canUpdate,
}: KoulutusFooterProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // julkinen luetaan TÄSSÄ eikä sivulta. EditKoulutusPage luki sen aiemmin
  // useFieldValue('julkinen', ENTITY.KOULUTUS):lla lomakkeen ULKOPUOLELTA, mikä toimi
  // vain koska redux-formin tila oli globaali ja osoitettavissa lomakkeen nimellä.
  // react-final-formissa tila asuu lomakkeessa, joten lukijan pitää olla sen sisällä -
  // ja footer on. Ilman tätä koko sivu kaatui renderissä: 15 testiä punaisi.
  const isJulkinen = useFieldValue('julkinen');
  const form = useForm();
  const formName = useFormName();
  const formMode = useFormMode();
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
    formMode === FormMode.CREATE ? createKoulutus : updateKoulutus;

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
        koulutus:
          formMode === FormMode.CREATE
            ? {
                ...getKoulutusByFormValues(valuesToSend),
              }
            : {
                ...koulutus,
                ...getKoulutusByFormValues(valuesToSend),
              },
      });

      if (formMode === FormMode.CREATE) {
        navigate(`/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`);
      } else {
        afterUpdate(queryClient, navigate, ENTITY.KOULUTUS, valuesToSend.tila);
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
      navigate,
      initialValues,
      koulutus,
      organisaatioOid,
      queryClient,
    ]
  );

  const save = useSaveForm({
    formName,
    submit,
    validate: validateKoulutusForm,
  });

  const apiUrls = useUrls();

  return (
    <FormFooter
      entityType={ENTITY.KOULUTUS}
      save={save}
      canUpdate={canUpdate || isJulkinen}
      entity={koulutus}
      esikatseluUrl={
        FormMode.EDIT && apiUrls.url('konfo-ui.koulutus', koulutus?.oid)
      }
    />
  );
};

export default KoulutusFooter;
