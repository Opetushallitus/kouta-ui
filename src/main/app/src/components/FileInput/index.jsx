import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';

import { getThemeProp, spacing } from '../../theme';
import useTranslation from '../useTranslation';
import Typography from '../Typography';
import Flex, { FlexItem } from '../Flex';
import Icon from '../Icon';
import { noop, useMachine, getImageFileDimensions } from '../../utils';
import Spin from '../Spin';
import Button from '../Button';
import { disabledStyle } from '../../system';
import { Machine, assign } from 'xstate';
import prettyBytes from 'pretty-bytes';

const CS = {
  fileUploaded: 'fileUploaded',
  empty: 'empty',
  uploading: 'uploading',
  error: 'error',
  dragging: 'dragging',
};

const AT = {
  UPLOAD_FILE: 'UPLOAD_FILE',
  REMOVE_FILE: 'REMOVE_FILE',
  RESET: 'RESET',
  DRAG_START: 'DRAG_START',
  DRAG_STOP: 'DRAG_STOP',
};

const createFileUploadMachine = url => {
  return Machine({
    id: 'imageUpload',
    initial: url ? CS.fileUploaded : CS.empty,
    context: {
      file: null,
      url,
      error: null,
    },
    states: {
      [CS.empty]: {
        on: {
          [AT.UPLOAD_FILE]: CS.uploading,
          [AT.DRAG_START]: CS.dragging,
        },
      },
      [CS.fileUploaded]: {
        on: {
          [AT.REMOVE_FILE]: {
            target: CS.empty,
            actions: assign({
              url: _ => null,
            }),
          },
        },
      },
      [CS.uploading]: {
        entry: assign({
          file: (_, e) => {
            return e.files[0];
          },
        }),
        invoke: {
          id: 'uploadFile',
          src: 'upload',
          onDone: {
            target: CS.fileUploaded,
            actions: assign({
              url: (_, e) => e.data,
            }),
          },
          onError: {
            target: CS.error,
            actions: assign({
              file: () => null,
              url: () => null,
              error: (ctx, e) => e.data.validationError || '',
            }),
          },
        },
      },
      [CS.error]: {
        on: {
          [AT.UPLOAD_FILE]: CS.uploading,
          [AT.DRAG_START]: CS.dragging,
        },
        exit: assign({
          error: () => null,
        }),
      },
      [CS.dragging]: {
        on: {
          [AT.DRAG_STOP]: CS.empty,
          [AT.UPLOAD_FILE]: CS.uploading,
        },
      },
    },
  });
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
  &:focus {
    border-color: ${getThemeProp('palette.primary.main')};
    outline: none;
  }
  ${disabledStyle}
  ${({ active }) =>
    active &&
    css`
      border-color: ${getThemeProp('palette.primary.main')};
    `}
  
  ${({ error }) =>
    error &&
    css`
      border-color: ${getThemeProp('palette.danger.main')};
    `}
`;

const FlexWrapper = ({ children }) => (
  <Flex alignCenter column>
    {children.map(c => (
      <FlexItem marginBottom={1}>{c}</FlexItem>
    ))}
  </Flex>
);

const ValueContent = ({ file, t, onRemove }) => {
  return (
    <FlexWrapper>
      <FileUploadedMessage>{file ? file.name : ''}</FileUploadedMessage>
      <Button
        color="danger"
        variant="contained"
        type="button"
        onClick={onRemove}
      >
        {t('yleiset.poista')}
      </Button>
    </FlexWrapper>
  );
};

const DragActiveContent = ({ message }) => {
  return (
    <FlexWrapper>
      <DragActiveIcon />
      <PrimaryMessage>{message}</PrimaryMessage>
    </FlexWrapper>
  );
};

const PlaceholderContent = ({ error, openDialog, t }) => {
  return (
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
};

const Loader = ({ message }) => (
  <FlexWrapper>
    <Spin></Spin>
    <PrimaryMessage>{message}</PrimaryMessage>
  </FlexWrapper>
);

const InfoText = props => (
  <Typography variant="secondary" as="div" marginBottom={1} {...props} />
);

export const FileInput = props => {
  const {
    multiple = false,
    disabled = false,
    onChange = noop,
    error = false,
    upload,
    maxSize,
    minDimensions,
    accept,
    value,
  } = props;

  const { t } = useTranslation();

  const validate = useCallback(
    async file => {
      const { size } = file;
      const dimensions = await getImageFileDimensions(file);
      return new Promise((resolve, reject) => {
        if (size > maxSize) {
          return reject({
            validationError: t('yleiset.kuvanTiedostokokoLiianSuuri'),
          });
        } else if (
          dimensions.width < minDimensions.width &&
          dimensions.height < minDimensions.height
        ) {
          return reject({
            validationError: t('yleiset.kuvanResoluutioLiianPieni'),
          });
        }
        return resolve();
      });
    },
    [maxSize, minDimensions, t],
  );

  const fileUploadMachine = createFileUploadMachine(value);
  const [state, send] = useMachine(fileUploadMachine, {
    services: {
      upload(ctx, e) {
        const file = e.files[0];
        return validate(file).then(() => upload(file));
      },
    },
  });

  const { file, url, error: uploadError } = state.context;

  const onDrop = useCallback(
    async files => {
      send({ type: AT.UPLOAD_FILE, files });
    },
    [send],
  );

  const onDragEnter = useCallback(async () => send({ type: AT.DRAG_START }), [
    send,
  ]);
  const onDragLeave = useCallback(async () => send({ type: AT.DRAG_STOP }), [
    send,
  ]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    noClick: true,
  });

  const onRemove = useCallback(() => {
    send({ type: AT.REMOVE_FILE });
  }, [send]);

  useEffect(() => onChange(url), [onChange, url]);

  let content;
  let inputDisabled = false;
  switch (state.value) {
    case CS.empty:
    case CS.error:
      content = (
        <PlaceholderContent t={t} openDialog={open} error={uploadError} />
      );
      inputDisabled = false;
      break;
    case CS.uploading:
      content = <Loader message={t('yleiset.latausKaynnissa')} />;
      inputDisabled = true;
      break;
    case CS.dragging:
      content = (
        <DragActiveContent message={t('yleiset.pudotaTiedostoLadataksesi')} />
      );
      inputDisabled = false;
      break;
    case CS.fileUploaded:
      content = <ValueContent file={file} onRemove={onRemove} t={t} />;
      inputDisabled = true;
      break;
    default:
      console.error(`FileInput: Unknown control state "${state.value}"`);
  }

  return (
    <>
      <InfoText>
        {t('yleiset.tuetutTiedostomuodot')}:{' '}
        {accept ? accept.join(' ') : 'kaikki'}
      </InfoText>
      <InfoText>
        {t('yleiset.tiedostonMaksimikoko')}:{' '}
        {prettyBytes(maxSize, { locale: 'fi' })}
      </InfoText>
      <InfoText>
        {t('yleiset.tiedostonMinimiresoluutio', minDimensions)}
      </InfoText>
      <Container
        {...getRootProps()}
        active={state.value === CS.dragging}
        error={error || uploadError}
        disabled={disabled}
        style={{ backgroundImage: `url(${url})` }}
      >
        <input
          {...getInputProps({ accept, multiple, disabled: inputDisabled })}
        />
        {content}
      </Container>
    </>
  );
};

export default FileInput;
