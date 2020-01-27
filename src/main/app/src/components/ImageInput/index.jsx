import React, { useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';
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

const validateInput = async (
  files,
  {
    accept,
    maxSize,
    minDimensions,
    maxDimensions,
    noDimensionCheckForExtensions = [],
    t,
  },
) => {
  if (files.length !== 1) {
    return Promise.reject({
      message: t('yleiset.liitaVainYksiTiedosto'),
    });
  }

  const file = files[0];

  const { size } = file;
  const extension = getFileExtension(file);
  let dimensions;

  if (accept && !accept.includes(`.${extension}`)) {
    return Promise.reject({
      message: t('yleiset.kiellettyTiedostopaate', { extension }),
    });
  } else if (maxSize && size > maxSize) {
    return Promise.reject({
      message: t('yleiset.kuvanTiedostokokoLiianSuuri'),
    });
  }

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
};

export const ImageInput = props => {
  const {
    disabled = false,
    onChange = noop,
    error,
    upload,
    maxSize,
    minDimensions,
    maxDimensions,
    accept,
    value,
  } = props;
  const { t } = useTranslation();

  const fileUploadMachine = createImageUploadMachine({ url: value, error, t });
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

  const onDrop = useCallback(
    async files => {
      send({ type: AT.UPLOAD_FILE, files });
    },
    [send],
  );
  const onDragEnter = useCallback(() => send({ type: AT.DRAG_START }), [send]);

  const onDragLeave = useCallback(() => send({ type: AT.DRAG_STOP }), [send]);

  const onRemove = useCallback(() => {
    send({ type: AT.REMOVE_FILE });
  }, [send]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    noClick: true,
  });

  useEffect(() => onChange(url), [onChange, url]);

  let content;
  if (state.matches(CS.empty) || state.matches(CS.error)) {
    content = (
      <PlaceholderContent t={t} openDialog={open} error={machineError} />
    );
  } else if (state.matches(CS.uploading)) {
    content = <Loader message={t('yleiset.latausKaynnissa')} />;
  } else if (state.matches(CS.draggingEnabled)) {
    content = (
      <DragActiveContent message={t('yleiset.pudotaTiedostoLadataksesi')} />
    );
  } else if (
    state.matches(CS.fileUploaded) ||
    state.matches(CS.draggingDisabled)
  ) {
    content = <ValueContent file={file} onRemove={onRemove} t={t} />;
  } else {
    console.error(
      `ImageInput: Unknown control state "${JSON.stringify(state.value)}"`,
    );
  }

  return (
    <>
      {accept && (
        <InfoText>
          {t('yleiset.tuetutTiedostomuodot')}: {accept.join(' ')}
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
            accept,
            multiple: false,
            disabled,
          })}
        />
        {content}
      </Container>
    </>
  );
};

export default ImageInput;
