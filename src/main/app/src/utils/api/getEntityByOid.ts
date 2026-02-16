import { AxiosInstance } from 'axios';
import { mapValues, isPlainObject, isArray, isObject } from 'lodash';

import { ENTITY } from '#/src/constants';
import { useApiQuery, KoutaApiQueryConfig } from '#/src/hooks/useApiQuery';

type GetEntityTypeByOidProps = {
  entityType: ENTITY;
  oid: string;
  httpClient: AxiosInstance;
  apiUrls: any;
  silent?: boolean;
};

const isEmptyParagraph = (value: any): boolean => value === '<p></p>';

const filterEmptyParagraphs = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map(filterEmptyParagraphs);
  }

  if (isPlainObject(obj)) {
    return mapValues(obj, value => {
      if (isEmptyParagraph(value)) {
        return '';
      } else {
        return filterEmptyParagraphs(value);
      }
    });
  }

  return obj;
};

const processEntityData = <T>(data: T, headers: any) => {
  const lastModified = headers?.['x-last-modified'] ?? null;

  // Kouta-datassa on Lexical-editorin takia tyhjiä kappaleita, joita ei haluta sotkemaan lomakeen käsittelyä.
  const filteredData = filterEmptyParagraphs(data);

  return isObject(filteredData)
    ? { lastModified, ...filteredData }
    : filteredData;
};

// NOTE: SORA-kuvaus and valintaperuste use "id" instead of "oid", but this works for them as well.
export async function getEntityByOid<T>({
  entityType,
  oid,
  httpClient,
  apiUrls,
  silent = false,
}: GetEntityTypeByOidProps) {
  const { data, headers } = await httpClient.get<T>(
    apiUrls.url(`kouta-backend.${entityType}-by-oid`, oid),
    {
      errorNotifier: {
        silent,
      },
    } as any
  );

  return processEntityData(data, headers);
}

export const useEntityByOid = <E>(
  entityType: ENTITY,
  props?: { oid?: string | null; silent?: boolean },
  options: KoutaApiQueryConfig = {}
) =>
  useApiQuery<E>(
    entityType,
    getEntityByOid,
    { entityType, ...props },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: Boolean(props?.oid),
      ...options,
    }
  );
