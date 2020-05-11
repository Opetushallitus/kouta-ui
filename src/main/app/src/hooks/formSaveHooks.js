import { useCallback } from 'react';
import { useDispatch, batch, useStore } from 'react-redux';
import _ from 'lodash';
import {
  startSubmit as startSubmitAction,
  stopSubmit as stopSubmitAction,
} from 'redux-form';

import {
  openSavingErrorToast,
  openSavingSuccessToast,
} from '#/src/state/toaster';
import { useHttpClient, useURLs } from '#/src/hooks/context';
import { useFormName } from '#/src/hooks/form';
import useAuthorizedUser from '#/src/components/useAuthorizedUser';
import getKoulutusByOid from '#/src/utils/kouta/getKoulutusByOid';
import getToteutusByOid from '#/src/utils/kouta/getToteutusByOid';
import getHakuByOid from '#/src/utils/kouta/getHakuByOid';
import getValintaperusteByOid from '#/src/utils/kouta/getValintaperusteByOid';
import getSoraKuvausById from '#/src/utils/kouta/getSoraKuvausById';
import validateToteutusForm from '#/src/utils/validateToteutusForm';
import validateHakukohdeForm from '#/src/utils/validateHakukohdeForm';
import validateValintaperusteForm from '#/src/utils/validateValintaperusteForm';

export const useSaveForm = ({ form, validate, submit }) => {
  const dispatch = useDispatch();
  const user = useAuthorizedUser();
  const httpClient = useHttpClient();
  const apiUrls = useURLs();
  const store = useStore();

  const startSubmit = useCallback(() => {
    return dispatch(startSubmitAction(form));
  }, [form, dispatch]);

  const stopSubmit = useCallback(
    ({ errors, errorToast, successToast }) => {
      batch(() => {
        dispatch(stopSubmitAction(form, errors));

        if (errorToast) {
          errors && dispatch(openSavingErrorToast());
        } else if (successToast) {
          dispatch(openSavingSuccessToast());
        }
      });
    },
    [form, dispatch]
  );

  const save = useCallback(async () => {
    const values = _.get(store.getState(), ['form', form, 'values']) || {};
    const muokkaaja = _.get(user, 'oid');
    const enhancedValues = { muokkaaja, ...values };

    startSubmit();

    let errors = null;
    try {
      errors = await validate(enhancedValues);
    } catch (e) {
      console.error(e);
    }

    if (!_.isEmpty(errors)) {
      stopSubmit({ errors, errorToast: true });

      return;
    }

    try {
      await submit({ values: enhancedValues, httpClient, apiUrls });
    } catch (e) {
      stopSubmit({ errorToast: true });
      return;
    }

    stopSubmit({ successToast: true });
  }, [
    user,
    submit,
    startSubmit,
    stopSubmit,
    validate,
    httpClient,
    apiUrls,
    store,
    form,
  ]);

  return {
    save,
  };
};

export const useSaveToteutus = (
  submit,
  { koulutustyyppi, koulutus: oldKoulutus }
) => {
  const httpClient = useHttpClient();
  const apiUrls = useURLs();
  const form = useFormName();

  const { save } = useSaveForm({
    form,
    submit,
    validate: async values => {
      const koulutus = oldKoulutus
        ? await getKoulutusByOid({
            httpClient,
            apiUrls,
            oid: oldKoulutus.oid,
          })
        : oldKoulutus;
      return validateToteutusForm({
        ...values,
        koulutustyyppi,
        koulutus,
      });
    },
  });
  return save;
};

export const useSaveHakukohde = (
  submit,
  { haku: oldHaku, toteutus: oldToteutus }
) => {
  const httpClient = useHttpClient();
  const apiUrls = useURLs();
  const form = useFormName();

  const { save } = useSaveForm({
    form,
    submit,
    validate: async values => {
      const valintaperusteId = _.get(values, 'valintaperusteenKuvaus.value');
      const [toteutus, haku, valintaperuste] = await Promise.all([
        getToteutusByOid({ httpClient, apiUrls, oid: oldToteutus.oid }),
        getHakuByOid({ httpClient, apiUrls, oid: oldHaku.oid }),
        valintaperusteId
          ? getValintaperusteByOid({
              httpClient,
              apiUrls,
              oid: valintaperusteId,
            })
          : Promise.resolve(),
      ]);
      return validateHakukohdeForm({
        ...values,
        haku,
        toteutus,
        valintaperuste,
      });
    },
  });

  return save;
};

export const useSaveValintaperuste = submit => {
  const httpClient = useHttpClient();
  const apiUrls = useURLs();
  const form = useFormName();

  const { save } = useSaveForm({
    form,
    submit,
    validate: async values => {
      const soraKuvausId = _.get(values, 'soraKuvaus.value');
      const soraKuvaus = soraKuvausId
        ? await getSoraKuvausById({ httpClient, apiUrls, id: soraKuvausId })
        : null;
      return validateValintaperusteForm({ ...values, soraKuvaus });
    },
  });
  return save;
};
