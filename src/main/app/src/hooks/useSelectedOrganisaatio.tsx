import { useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  setOrganisaatio,
  selectOrganisaatio,
} from '#/src/state/organisaatioSelection';

export const useSelectedOrganisaatio = () => {
  const dispatch = useDispatch();
  const selectedOrganisaatio = useSelector(selectOrganisaatio);

  return useMemo(
    () => [selectedOrganisaatio, () => dispatch(setOrganisaatio())],
    [dispatch, selectedOrganisaatio]
  );
};
