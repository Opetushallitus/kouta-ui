import React from 'react';
import { Redirect } from 'react-router-dom';
import useApiAsync from "../useApiAsync";
import getHakukohdeByOid from "../../utils/kouta/getHakukohdeByOid";

const getData = async ({ httpClient, apiUrls, oid: hakukohdeOid }) => {
  const hakukohde = await getHakukohdeByOid({
    httpClient,
    apiUrls,
    oid: hakukohdeOid,
  });
  return {hakukohde}
};

const RedirectHakukohdeFooter = props => {
  const {
    match: {
      params: {oid},
    }
  } = props;

  const watch = JSON.stringify([oid]);

  const {
    data: {hakukohde} = {},
  } = useApiAsync({
    promiseFn: getData,
    oid,
    watch,
  });
  return hakukohde ? <Redirect to={`/organisaatio/${hakukohde.organisaatioOid}/hakukohde/${oid}/muokkaus`} /> : null;
};

export default RedirectHakukohdeFooter;
