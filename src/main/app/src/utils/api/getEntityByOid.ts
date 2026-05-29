import type { AxiosResponse } from 'axios';
import { mapValues, isPlainObject, isArray } from 'lodash';

import { ENTITY } from '#/src/constants';
import { useApiQuery, KoutaApiQueryConfig } from '#/src/hooks/useApiQuery';
import { HttpClient } from '#/src/httpClient';
import { EntityTypeMap } from '#/src/types/domainTypes';
import { ApiUrls } from '#/src/urls';

type GetEntityTypeByOidProps<K extends ENTITY = ENTITY> = {
  entityType: K;
  oid: string;
  httpClient: HttpClient;
  apiUrls: ApiUrls;
  silent?: boolean;
};

const isEmptyParagraph = (value: unknown): boolean => value === '<p></p>';

const filterEmptyParagraphs = <T>(obj: T): T => {
  if (isArray(obj)) {
    return obj.map(filterEmptyParagraphs) as unknown as T;
  }

  if (isPlainObject(obj)) {
    return mapValues(obj as Record<string, unknown>, value =>
      isEmptyParagraph(value) ? '' : filterEmptyParagraphs(value)
    ) as unknown as T;
  }

  return obj;
};

const processEntityData = <T>(
  data: T,
  headers: AxiosResponse['headers']
): T & { lastModified: string | null } => {
  const lastModified: string | null = headers?.['x-last-modified'] ?? null;

  // Kouta-datassa on Lexical-editorin takia tyhjiä kappaleita, joita ei haluta sotkemaan lomakeen käsittelyä.
  const filteredData = filterEmptyParagraphs(data);

  return { lastModified, ...(filteredData as object) } as T & {
    lastModified: string | null;
  };
};

// NOTE: SORA-kuvaus and valintaperuste use "id" instead of "oid", but this works for them as well.
export async function getEntityByOid<K extends ENTITY>({
  entityType,
  oid,
  httpClient,
  apiUrls,
  silent = false,
}: GetEntityTypeByOidProps<K>) {
  const { data, headers } = await httpClient.get<EntityTypeMap[K]>(
    apiUrls.url(`kouta-backend.${entityType}-by-oid`, oid),
    {
      errorNotifier: {
        silent,
      },
    }
  );

  return processEntityData(data, headers);
}

export const useEntityByOid = <K extends ENTITY>(
  entityType: K,
  props?: { oid?: string | null; silent?: boolean },
  options: KoutaApiQueryConfig = {}
) =>
  useApiQuery<EntityTypeMap[K] & { lastModified: string | null }>(
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
