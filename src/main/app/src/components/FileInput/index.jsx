import React, { useCallback, useMemo, Fragment, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';
import { setLightness, rem } from 'polished';

import { getThemeProp, spacing } from '../../theme';
import useTranslation from '../useTranslation';
import Typography from '../Typography';
import Flex, { FlexItem } from '../Flex';
import Icon from '../Icon';
import { noop } from '../../utils';
import Spin from '../Spin';
import Anchor from '../Anchor';
import Button from '../Button';
import { disabledStyle } from '../../system';
import {Machine, assign} from 'xstate';
import {useMachine} from '@xstate/react';

const Container = styled.div`
  border: 1px dashed ${getThemeProp('palette.border')};
  border-radius: 2px;
  padding: ${spacing(3)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.25s, background-color 0.25s;
  min-height: ${rem(4)};
  background-repeat: no-repeat;
  cursor: pointer;
  &:focus {
    border-color: ${getThemeProp('palette.primary.main')};
    outline: none;
  }
  ${disabledStyle}
  ${({ active }) =>
    active &&
    css`
      border-color: ${getThemeProp('palette.primary.main')}
    `
  }
  ${({ uploadError }) =>
    uploadError &&
    css`
      border-color: ${getThemeProp('palette.danger.main')};
      background-color: ${({ theme }) =>
        setLightness(0.95, theme.palette.danger.main)};
    `}
  
  ${({ error }) =>
    error &&
    css`
      border-color: ${getThemeProp('palette.danger.main')};
    `}
`;

const DragActiveIcon = styled(Icon).attrs({ type: 'cloud_upload' })`
  color: ${getThemeProp('palette.primary.main')};
  font-size: 2rem;
`;

const DragActiveMessage = styled(Typography)`
  color: ${getThemeProp('palette.primary.main')};
  display: block;
`;

const ErrorMessage = styled(Typography)`
  color: ${getThemeProp('palette.danger.main')};
`;

const getAccept = ({ accept, acceptImages }) => {
  if (accept) {
    return accept;
  }

  if (acceptImages) {
    return ['image/*'];
  }

  return undefined;
};

const CS = {
  fileUploaded: 'fileUploaded',
  empty: 'empty',
  uploading: 'uploading',
  error: 'error'
}
const AT = {
  UPLOAD_FILE: 'UPLOAD_FILE',
  REMOVE_FILE: 'REMOVE_FILE',
  RESET: 'RESET'
}

const fileUploadMachine = Machine({
  id: 'teemakuvaUpload',
  initial: 'empty',
  context: {
    files: [],
    urls: [],
  },
  states: {
    empty: {
      on: {
        UPLOAD_FILE: {
          target: 'uploading',
          actions: assign({
            files: (_, e) => e.files
          })
        }
      }
    },
    fileUploaded: {
      on: {
        REMOVE_FILE: {
          target: 'empty',
          actions: assign({
            files: _ => [],
            urls: _ => []
          })
        }
      }
    },
    uploading: {
      invoke: {
        id: 'uploadFile',
        src: 'upload',
        onDone: {
          target: 'fileUploaded',
          actions: assign({
            urls: (_, e) => e.data
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            urls: _ => [],
            files: _ => []
          })
        }
      }
    },
    error: {
      on: {
        RESET: 'empty',
        UPLOAD_FILE: 'uploading'
      }
    }
  }
})

const ValueContent = ({ urls = [], files = [], t, onRemove, message }) => {
  const links = useMemo(() => {
    return urls.map((url, index) => (
      <Fragment key={url}>
        <Anchor href={url} rel="nofollow" target="_blank">
          {files[index].name}
        </Anchor>
        {index < files.length - 1 ? ', ' : ''}
      </Fragment>
    ));
  }, [urls, files]);

  return (
    <Flex alignCenter column>
      <FlexItem>{links}</FlexItem>
      <FlexItem marginTop={2}>
        <Button
          size="small"
          color="danger"
          variant="outlined"
          type="button"
          onClick={onRemove}
        >
          {t('yleiset.poista')}
        </Button>
      </FlexItem>
    </Flex>
  );
};

const DragActiveContent = ({ message }) => {
  return (
    <Flex alignCenter column>
      <DragActiveIcon />
      <DragActiveMessage marginTop={1}>{message}</DragActiveMessage>
    </Flex>
  );
};

const PlaceholderContent = ({ message, onDrop, t }) => {
  return <Flex alignCenter column>
      <FlexItem marginBottom={1}>
        <Typography>{message}:</Typography>
      </FlexItem>
      <FlexItem marginTop={2}>
        <Button
          size="small"
          color="primary"
          variant="outlined"
          type="button"
        >
          {t('yleiset.selaaTiedostoja')}
        </Button>
      </FlexItem>
    </Flex>
};

const ErrorContent = ({ message }) => {
  return <ErrorMessage>{message}</ErrorMessage>;
};

export const FileInput = props => {
  const {
    multiple = false,
    disabled = false,
    onChange = noop,
    error = false,
    upload,
    dragActiveMessage,
    placeholderMessage,
    value,
  } = props;

  const [state, send] = useMachine(fileUploadMachine.withConfig({
    services: {
      upload(ctx, e) {
        return upload(e.files[0]);
      }
    }
  }), {
    devTools: true
  });

  const {urls, files} = state.context;

  const accept = getAccept(props);
  const { t } = useTranslation();

  const onDrop = useCallback(
    async files => {
      send({type: AT.UPLOAD_FILE, files})
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onRemove = useCallback(() => {
    send({type: AT.REMOVE_FILE})
  }, []);

  useEffect(() => onChange(urls), [urls])

  let content;
  let inputDisabled = false;
  if (state.value === CS.empty) {
    content = <PlaceholderContent
      message={placeholderMessage || t('yleiset.raahaaLiitettavaTiedosto')}
      onDrop={onDrop}
      t={t}
    />
    inputDisabled = false;
  } else if (state.value === CS.fileUploaded) {
    content = <ValueContent
      urls={urls}
      files={files}
      onRemove={onRemove}
      t={t}
    />
    inputDisabled = true;
  } else if (isDragActive) {
    content = <DragActiveContent
      message={dragActiveMessage || t('yleiset.pudotaTiedostoLadataksesi')}
    />
    inputDisabled = false;
  } else if (state.value === CS.uploading) {
    content = <Spin></Spin>
    inputDisabled = true;
  }

  const active = isDragActive;

  return (
    <Container
      {...getRootProps()}
      active={active}
      error={error}
      disabled={disabled}
      style={{backgroundImage: `url(${urls[0]})`}}
    >
      <input
        {...getInputProps({ accept, multiple, disabled: inputDisabled})}
      />
      {content}
    </Container>
  );
};

export default FileInput;
