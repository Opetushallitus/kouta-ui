import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';
import { cond, constant } from 'lodash';
import { getThemeProp, spacing } from '../../theme';
import useTranslation from '../useTranslation';
import Typography from '../Typography';
import Flex, { FlexItem } from '../Flex';
import Icon from '../Icon';
import {
  noop,
  useMachine,
  getFileExtension,
  getImageFileDimensions,
} from '../../utils';
import Spin from '../Spin';
import Button from '../Button';
import { disabledStyle } from '../../system';
import prettyBytes from 'pretty-bytes';
import {
  createImageUploadMachine,
  actionTypes as AT,
  controlStates as CS,
} from './imageUploadMachine';

async function validateImageDimensions({
  dimensions,
  maxDimensions,
  minDimensions,
  t,
}) {
  return new Promise((resolve, reject) => {
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
    return error ? reject({ message: error }) : resolve();
  });
}

function validateFileExtension({ acceptedFileFormats, extension, t }) {
  return new Promise((resolve, reject) => {
    return acceptedFileFormats && !acceptedFileFormats.includes(`.${extension}`)
      ? reject({
          message: t('yleiset.kiellettyTiedostopaate', { extension }),
        })
      : resolve();
  });
}

function validateFileSize({ size, maxSize, t }) {
  return new Promise((resolve, reject) => {
    return maxSize && size > maxSize
      ? reject({
          message: t('yleiset.kuvanTiedostokokoLiianSuuri'),
        })
      : resolve();
  });
}

async function validateInput(
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
  if (files.length !== 1) {
    return Promise.reject({
      message: t('yleiset.liitaVainYksiTiedosto'),
    });
  }

  const file = files[0];
  const { size } = file;
  const extension = getFileExtension(file);
  let dimensions;

  await validateFileExtension({ acceptedFileFormats, extension, t });
  await validateFileSize({ maxSize, size });

  if (
    !noDimensionCheckForExtensions.includes(extension) &&
    (minDimensions || maxDimensions)
  ) {
    try {
      dimensions = await getImageFileDimensions(file);
    } catch (e) {
      console.error(e);
      return Promise.reject({
        message: t('yleiset.kuvanResoluutioTuntematon'),
      });
    }
  }

  await validateImageDimensions({
    dimensions,
    minDimensions,
    maxDimensions,
    t,
  });
}

const useMachineDropZone = ({ send }) => {
  const onDrop = useCallback(
    async files => {
      send({ type: AT.UPLOAD_FILE, files });
    },
    [send],
  );
  const onDragEnter = useCallback(() => send({ type: AT.DRAG_START }), [send]);
  const onDragLeave = useCallback(() => send({ type: AT.DRAG_STOP }), [send]);
  const onRemove = useCallback(() => send({ type: AT.REMOVE_FILE }), [send]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    noClick: true,
  });

  return {
    getRootProps,
    getInputProps,
    onDrop,
    onDragEnter,
    onDragLeave,
    onRemove,
    open,
  };
};

const DragActiveIcon = styled(Icon).attrs({ type: 'cloud_upload' })`
  color: ${getThemeProp('palette.primary.main')};
  font-size: 2rem;
`;

const PrimaryMessage = styled(Typography)`
  color: ${getThemeProp('palette.primary.main')};
  display: block;
`;

const ErrorMessage = styled(Typography)`
  color: ${getThemeProp('palette.danger.main')};
`;

const FileUploadedMessage = styled(Typography)`
  text-shadow: 0 0 0.5em black;
  color: white;
  background: transparent;
`;

const Container = styled.div`
  border: 1px dashed ${getThemeProp('palette.border')};
  border-radius: 2px;
  padding: ${spacing(3)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.25s, background-color 0.25s;
  min-height: 9rem;
  background-repeat: no-repeat;
  background-size: cover;
  &:focus {
    border-color: ${getThemeProp('palette.primary.main')};
    outline: none;
  }
  ${disabledStyle}
  ${({ nodrag, error }) =>
    (nodrag || error) &&
    css`
      border-color: ${getThemeProp('palette.danger.main')};
    `};
`;

const FlexWrapper = ({ children }) => (
  <Flex alignCenter column>
    {children.map((c, i) => (
      <FlexItem marginBottom={1} key={`item_${i}`}>
        {c}
      </FlexItem>
    ))}
  </Flex>
);

const ValueContent = ({ file, t, onRemove }) => (
  <FlexWrapper>
    <FileUploadedMessage>{file ? file.name : ''}</FileUploadedMessage>
    <Button color="danger" variant="contained" type="button" onClick={onRemove}>
      {t('yleiset.poista')}
    </Button>
  </FlexWrapper>
);

const DragActiveContent = ({ message }) => (
  <FlexWrapper>
    <DragActiveIcon />
    <PrimaryMessage>{message}</PrimaryMessage>
  </FlexWrapper>
);

const PlaceholderContent = ({ error, openDialog, t }) => (
  <FlexWrapper>
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <Typography>{t('yleiset.raahaaLiitettavaTiedosto')}</Typography>
    <Typography>{t('yleiset.tai')}</Typography>
    <Button
      color="primary"
      variant="outlined"
      type="button"
      onClick={openDialog}
    >
      {t('yleiset.selaaTiedostoja')}
    </Button>
  </FlexWrapper>
);

const Loader = ({ message }) => (
  <FlexWrapper>
    <Spin></Spin>
    <PrimaryMessage>{message}</PrimaryMessage>
  </FlexWrapper>
);

const InfoText = props => (
  <Typography variant="secondary" as="div" marginBottom={1} {...props} />
);

const ImageConstraints = ({
  acceptedFileFormats,
  maxSize,
  minDimensions,
  maxDimensions,
  t,
}) => (
  <>
    {acceptedFileFormats && (
      <InfoText>
        {t('yleiset.tuetutTiedostomuodot')}: {acceptedFileFormats.join(' ')}
      </InfoText>
    )}
    {maxSize && (
      <InfoText>
        {t('yleiset.tiedostonMaksimikoko')}: {prettyBytes(maxSize)}
      </InfoText>
    )}
    {minDimensions && (
      <InfoText>
        {t('yleiset.tiedostonMinimiresoluutio', minDimensions)}
      </InfoText>
    )}
    {maxDimensions && (
      <InfoText>
        {t('yleiset.tiedostonMaksimiresoluutio', maxDimensions)}
      </InfoText>
    )}
  </>
);

const c = constant;
const InputAreaContent = ({ file, machineError, state, open, onRemove, t }) => (
  <>
    {cond([
      [
        c([CS.empty, CS.error].some(state.matches)),
        c(<PlaceholderContent t={t} openDialog={open} error={machineError} />),
      ],
      [
        c(state.matches(CS.uploading)),
        c(<Loader message={t('yleiset.latausKaynnissa')} />),
      ],
      [
        c(state.matches(CS.draggingEnabled)),
        c(
          <DragActiveContent
            message={t('yleiset.pudotaTiedostoLadataksesi')}
          />,
        ),
      ],
      [
        c([CS.fileUploaded, CS.draggingDisabled].some(state.matches)),
        c(<ValueContent file={file} onRemove={onRemove} t={t} />),
      ],
      [
        c(true),
        () => {
          console.error(
            `ImageInput: Unknown control state ${JSON.stringify(state.value)}`,
          );
        },
      ],
    ])()}
  </>
);

export const ImageInput = props => {
  const {
    disabled = false,
    onChange = noop,
    error: externalError,
    upload,
    maxSize,
    minDimensions,
    maxDimensions,
    acceptedFileFormats,
    imageUploadUrl,
  } = props;
  const { t } = useTranslation();

  const fileUploadMachine = createImageUploadMachine({
    url: imageUploadUrl,
    externalError,
    t,
  });
  const [state, send] = useMachine(fileUploadMachine, {
    services: {
      upload(ctx, e) {
        const p = validateInput(e.files, { ...props, t }).then(() =>
          upload(e.files[0]),
        );
        // Log uncaught errors in validation/upload for easier debugging
        p.catch(console.error);
        return p;
      },
    },
  });

  const { file, url, error: machineError } = state.context;
  const { getInputProps, getRootProps, onRemove, open } = useMachineDropZone({
    send,
  });

  useEffect(() => onChange(url), [onChange, url]);

  return (
    <>
      <ImageConstraints
        {...{
          minDimensions,
          maxDimensions,
          maxSize,
          acceptedFileFormats,
          t,
        }}
      />
      <Container
        {...getRootProps()}
        active={state.matches(CS.draggingEnabled)}
        nodrag={state.matches(CS.draggingDisabled)}
        error={machineError}
        disabled={disabled}
        style={{ backgroundImage: `url(${url})` }}
        {...(state.matches(CS.draggingDisabled) ? { onDragOver: null } : {})}
      >
        <input
          {...getInputProps({
            accept: acceptedFileFormats,
            multiple: false,
            disabled,
          })}
        />
        <InputAreaContent
          {...{ file, open, onRemove, state, machineError, t }}
        />
      </Container>
    </>
  );
};

export default ImageInput;
