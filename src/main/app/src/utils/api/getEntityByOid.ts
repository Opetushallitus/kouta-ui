import { mapValues, isPlainObject, isArray } from 'lodash';

import { ENTITY } from '#/src/constants';
import { useApiQuery, KoutaApiQueryConfig } from '#/src/hooks/useApiQuery';
import { HttpClient } from '#/src/httpClient';

type GetEntityTypeByOidProps = {
  entityType: ENTITY;
  oid: string;
  httpClient: HttpClient;
  apiUrls: any;
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
  headers: any
): T & { lastModified: string | null } => {
  const lastModified: string | null = headers?.['x-last-modified'] ?? null;

  // Kouta-datassa on Lexical-editorin takia tyhjiä kappaleita, joita ei haluta sotkemaan lomakeen käsittelyä.
  const filteredData = filterEmptyParagraphs(data);

  return { lastModified, ...(filteredData as object) } as T & {
    lastModified: string | null;
  };
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
