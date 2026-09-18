import { type TFunction } from 'i18next';

import { getFileExtension, getImageFileDimensions } from '#/src/utils';

export interface Dimensions {
  width: number;
  height: number;
}

export interface ValidationError {
  message: string;
}

export interface ValidateInputOptions {
  acceptedFileFormats?: Array<string>;
  maxSize?: number;
  minDimensions?: Dimensions;
  maxDimensions?: Dimensions;
  noDimensionCheckForFormats?: Array<string>;
  t: TFunction;
}

type ValidationResult = ValidationError | null | undefined | false;

const promisifyValidate = (validate: () => ValidationResult) =>
  new Promise<void>((resolve, reject) => {
    const error = validate();
    return error ? reject(error) : resolve();
  });

const validateFileCount = ({
  files,
  t,
}: {
  files: Array<File>;
  t: TFunction;
}) =>
  promisifyValidate(
    () =>
      files.length !== 1 && {
        message: t('yleiset.liitaVainYksiTiedosto'),
      }
  );

const validateFileExtension = ({
  acceptedFileFormats,
  extension,
  t,
}: {
  acceptedFileFormats?: Array<string>;
  extension: string;
  t: TFunction;
}) =>
  promisifyValidate(
    () =>
      acceptedFileFormats &&
      !acceptedFileFormats.includes(`.${extension}`) && {
        message: t('yleiset.kiellettyTiedostopaate', { extension }),
      }
  );

const validateFileSize = ({
  maxSize,
  size,
  t,
}: {
  maxSize?: number;
  size: number;
  t: TFunction;
}) =>
  promisifyValidate(
    () =>
      maxSize != null &&
      size > maxSize && {
        message: t('yleiset.kuvanTiedostokokoLiianSuuri'),
      }
  );

const maybeReadImageDimensions = async ({
  extension,
  file,
  minDimensions,
  maxDimensions,
  noDimensionCheckForFormats,
  t,
}: {
  extension: string;
  file: File;
  minDimensions?: Dimensions;
  maxDimensions?: Dimensions;
  noDimensionCheckForFormats: Array<string>;
  t: TFunction;
}): Promise<Dimensions | undefined> => {
  if (
    !noDimensionCheckForFormats.includes(`.${extension}`) &&
    (minDimensions || maxDimensions)
  ) {
    try {
      return await getImageFileDimensions(file);
    } catch (e) {
      console.error(e);
      return Promise.reject({
        message: t('yleiset.kuvanResoluutioTuntematon'),
      });
    }
  }
  return undefined;
};

const validateImageDimensions = ({
  dimensions,
  minDimensions,
  maxDimensions,
  t,
}: {
  dimensions?: Dimensions;
  minDimensions?: Dimensions;
  maxDimensions?: Dimensions;
  t: TFunction;
}) =>
  promisifyValidate(() => {
    let error: string | null = null;
    if (dimensions) {
      if (maxDimensions) {
        if (dimensions.width > maxDimensions.width) {
          error = t('yleiset.kuvanLeveysLiianSuuri', { ...dimensions });
        } else if (dimensions.height > maxDimensions.height) {
          error = t('yleiset.kuvanKorkeusLiianSuuri', { ...dimensions });
        }
      }
      if (minDimensions) {
        if (dimensions.width < minDimensions.width) {
          error = t('yleiset.kuvanLeveysLiianPieni', { ...dimensions });
        } else if (dimensions.height < minDimensions.height) {
          error = t('yleiset.kuvanKorkeusLiianPieni', { ...dimensions });
        }
      }
    }
    return error ? { message: error } : null;
  });

export default async function validateInput(
  files: Array<File>,
  {
    acceptedFileFormats,
    maxSize,
    minDimensions,
    maxDimensions,
    noDimensionCheckForFormats = [],
    t,
  }: ValidateInputOptions
) {
  await validateFileCount({ files, t });

  const file = files[0] as File;
  const { size } = file;
  const extension = getFileExtension(file);

  await validateFileExtension({ acceptedFileFormats, extension, t });
  await validateFileSize({ maxSize, size, t });

  const dimensions = await maybeReadImageDimensions({
    extension,
    file,
    minDimensions,
    maxDimensions,
    noDimensionCheckForFormats,
    t,
  });

  await validateImageDimensions({
    dimensions,
    minDimensions,
    maxDimensions,
    t,
  });
}
