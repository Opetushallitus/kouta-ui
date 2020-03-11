import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';
import { cond, noop } from 'lodash';
import prettyBytes from 'pretty-bytes';
import { getThemeProp, spacing } from '../../theme';
import useTranslation from '../useTranslation';
import Typography from '../Typography';
import Flex, { FlexItem } from '../Flex';
import Icon from '../Icon';
import { useMachine, ifAny, otherwise } from '../../utils';
import Spin from '../Spin';
import Button from '../Button';
import { disabledStyle } from '../../system';
import {
  createImageUploadMachine,
  actionTypes as AT,
  controlStates as CS,
} from './imageUploadMachine';
import validateInput from './validateInput';

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
  ${({ backgroundSize }) =>
    backgroundSize &&
    css`
      background-size: ${backgroundSize || 'cover'};
    `};
  ${({ url }) =>
    css`
      background-image: ${url ? `url(${url})` : 'none'};
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

const InputAreaContent = ({ file, machineError, state, open, onRemove, t }) => (
  <>
    {cond([
      [
        ifAny([CS.empty, CS.error]),
        () => (
          <PlaceholderContent t={t} openDialog={open} error={machineError} />
        ),
      ],
      [
        ifAny(CS.uploading),
        () => <Loader message={t('yleiset.latausKaynnissa')} />,
      ],
      [
        ifAny(CS.draggingEnabled),
        () => (
          <DragActiveContent message={t('yleiset.pudotaTiedostoLadataksesi')} />
        ),
      ],
      [
        ifAny([CS.fileUploaded, CS.draggingDisabled]),
        () => <ValueContent file={file} onRemove={onRemove} t={t} />,
      ],
      [
        otherwise,
        () => {
          console.error(
            `ImageInput: Unknown control state ${JSON.stringify(state.value)}`,
          );
        },
      ],
    ])(state.matches)}
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
    backgroundSize,
    uploadedImageUrl,
  } = props;
  const { t } = useTranslation();

  const fileUploadMachine = createImageUploadMachine({
    url: uploadedImageUrl,
    externalError,
    t,
  });
  const [state, send] = useMachine(fileUploadMachine, {
    services: {
      upload(_, e) {
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
        url={url}
        backgroundSize={backgroundSize}
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
