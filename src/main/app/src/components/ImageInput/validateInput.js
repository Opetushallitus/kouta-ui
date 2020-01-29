import { getFileExtension, getImageFileDimensions } from '../../utils';

const promisifyValidate = validate =>
  new Promise((resolve, reject) => {
    const error = validate();
    return error ? reject(error) : resolve();
  });

const validateFileCount = ({ files, t }) =>
  promisifyValidate(
    () =>
      files.length !== 1 && {
        message: t('yleiset.liitaVainYksiTiedosto'),
      },
  );

const validateFileExtension = ({ acceptedFileFormats, extension, t }) =>
  promisifyValidate(
    () =>
      acceptedFileFormats &&
      !acceptedFileFormats.includes(`.${extension}`) && {
        message: t('yleiset.kiellettyTiedostopaate', { extension }),
      },
  );

const validateFileSize = ({ maxSize, size, t }) =>
  promisifyValidate(
    () =>
      maxSize &&
      size > maxSize && {
        message: t('yleiset.kuvanTiedostokokoLiianSuuri'),
      },
  );

const maybeReadImageDimensions = async ({
  extension,
  file,
  minDimensions,
  maxDimensions,
  noDimensionCheckForExtensions,
  t,
}) => {
  if (
    !noDimensionCheckForExtensions.includes(extension) &&
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
};

const validateImageDimensions = ({
  dimensions,
  minDimensions,
  maxDimensions,
  t,
}) =>
  promisifyValidate(() => {
    let error = null;
    if (dimensions) {
      if (maxDimensions) {
        if (dimensions.width > maxDimensions.width) {
          error = t('yleiset.kuvanLeveysLiianSuuri', dimensions);
        } else if (dimensions.height > maxDimensions.height) {
          error = t('yleiset.kuvanKorkeusLiianSuuri', dimensions);
        }
      }
      if (minDimensions) {
        if (dimensions.width < minDimensions.width) {
          error = t('yleiset.kuvanLeveysLiianPieni', dimensions);
        } else if (dimensions.height < minDimensions.height) {
          error = t('yleiset.kuvanKorkeusLiianPieni', dimensions);
        }
      }
    }
    return error && { message: error };
  });

export default async function validateInput(
  files,
  {
    acceptedFileFormats,
    maxSize,
    minDimensions,
    maxDimensions,
    noDimensionCheckForExtensions = [],
    t,
  },
) {
  await validateFileCount({ files, t });

  const file = files[0];
  const { size } = file;
  const extension = getFileExtension(file);

  await validateFileExtension({ acceptedFileFormats, extension, t });
  await validateFileSize({ maxSize, size, t });

  const dimensions = await maybeReadImageDimensions({
    extension,
    file,
    minDimensions,
    maxDimensions,
    noDimensionCheckForExtensions,
    t,
  });

  await validateImageDimensions({
    dimensions,
    minDimensions,
    maxDimensions,
    t,
  });
}
