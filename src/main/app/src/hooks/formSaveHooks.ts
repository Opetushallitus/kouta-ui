import { useCallback } from 'react';
import { useDispatch, batch } from 'react-redux';
import _ from 'lodash';
import {
  startSubmit as startSubmitAction,
  stopSubmit as stopSubmitAction,
} from 'redux-form';

import { useHttpClient, useUrls } from '#/src/contexts/contextHooks';
import useAuthorizedUser from '#/src/hooks/useAuthorizedUser';
import getKoulutusByOid from '#/src/utils/koulutus/getKoulutusByOid';
import getToteutusByOid from '#/src/utils/toteutus/getToteutusByOid';
import getHakuByOid from '#/src/utils/haku/getHakuByOid';
import getValintaperusteByOid from '#/src/utils/valintaperuste/getValintaperusteByOid';
import getSoraKuvausById from '#/src/utils/soraKuvaus/getSoraKuvausById';
import validateToteutusForm from '#/src/utils/toteutus/validateToteutusForm';
import validateHakukohdeForm from '#/src/utils/hakukohde/validateHakukohdeForm';
import validateValintaperusteForm from '#/src/utils/valintaperuste/validateValintaperusteForm';
import useToaster from '#/src/hooks/useToaster';
import { useForm } from '#/src/hooks/form';

export const useSaveForm = ({ form: formName, validate, submit }) => {
  const dispatch = useDispatch();
  const user = useAuthorizedUser();
  const httpClient = useHttpClient();
  const apiUrls = useUrls();
  const { openSavingSuccessToast, openSavingErrorToast } = useToaster();
  const form = useForm(formName);

  const startSubmit = useCallback(() => {
    return dispatch(startSubmitAction(formName));
  }, [formName, dispatch]);

  const stopSubmit = useCallback(
    ({ errors, errorToast, successToast }) => {
      batch(() => {
        dispatch(stopSubmitAction(formName, errors));

        if (errorToast) {
          errors && openSavingErrorToast();
        } else if (successToast) {
          openSavingSuccessToast();
        }
      });
    },
    [formName, dispatch, openSavingSuccessToast, openSavingErrorToast]
  );

  const save = useCallback(async () => {
    const muokkaaja = user?.oid;
    const currentValues = form?.values ?? {};
    const enhancedValues = { muokkaaja, ...currentValues };

    startSubmit();

    let errors = null;

    try {
      errors = await validate(enhancedValues);
      if (_.isEmpty(errors)) {
        await submit({ values: enhancedValues, httpClient, apiUrls }).then(() =>
          stopSubmit({ successToast: true })
        );
      } else {
        console.error(errors);
        stopSubmit({ errors, errorToast: true });
      }
    } catch (e) {
      console.error(e);
      stopSubmit({ errorToast: true });
    }
  }, [
    form,
    user,
    startSubmit,
    validate,
    submit,
    httpClient,
    apiUrls,
    stopSubmit,
  ]);

  return {
    save,
  };
};

export const useSaveToteutus = ({
  formName,
  submit,
  koulutustyyppi,
  koulutus: oldKoulutus,
}) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  const { save } = useSaveForm({
    form: formName,
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

export const useSaveHakukohde = ({
  formName,
  submit,
  haku: oldHaku,
  toteutus: oldToteutus,
}) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  const { save } = useSaveForm({
    form: formName,
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

export const useSaveValintaperuste = ({ submit, formName }) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  const { save } = useSaveForm({
    form: formName,
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
