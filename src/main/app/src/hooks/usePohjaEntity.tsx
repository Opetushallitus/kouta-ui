import _ from 'lodash';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

import { ENTITY } from '#/src/constants';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { useSelectBase } from '#/src/hooks/useSelectBase';
import { useEntityByOid } from '#/src/utils/api/getEntityByOid';

export const usePohjaEntity = (
  entityType: ENTITY,
  selector?: (data: any) => any
) => {
  const { search } = useLocation();

  const searchParams = queryString.parse(search);

  const kopioParam = `kopio${_.capitalize(entityType)}`;

  const copyId = searchParams[kopioParam] as string;

  const copyIdChanged = useHasChanged(copyId);
  const { data, isLoading } = useEntityByOid(
    entityType,
    { oid: copyId },
    {
      enabled: Boolean(copyId && copyIdChanged),
      select: selector,
    }
  );

  const selectPohja = useSelectBase({
    kopioParam,
  });

  return {
    data,
    isLoading,
    selectPohja,
  };
};
