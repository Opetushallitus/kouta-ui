import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';
import { setLightness } from 'polished';

import { getThemeProp, spacing } from '../../theme';
import useTranslation from '../useTranslation';
import Typography from '../Typography';
import Flex from '../Flex';
import Icon from '../Icon';
import { noop } from '../../utils';
import Spin from '../Spin';

const Container = styled.div`
  border: 1px dashed ${getThemeProp('palette.border')};
  border-radius: 2px;
  padding: ${spacing(3)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.25s, background-color 0.25s;
  min-height: 4rem;

  ${({ active }) =>
    active &&
    css`
      border-color: ${getThemeProp('palette.primary.main')};
      background-color: ${({ theme }) =>
        setLightness(0.95, theme.palette.primary.main)};
    `}

  ${({ error }) =>
    error &&
    css`
      border-color: ${getThemeProp('palette.danger.main')};
      background-color: ${({ theme }) =>
        setLightness(0.95, theme.palette.danger.main)};
    `}
`;

const getBinary = file => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onabort = () => reject();
    reader.onerror = () => reject();
    reader.onload = () => {
      resolve(reader.result);
    };

    reader.readAsBinaryString(file);
  });
};

const getBinaries = files => {
  return Promise.all(files.map(file => getBinary(file)));
};

const getAccept = ({ accept, acceptImages }) => {
  if (accept) {
    return accept;
  }

  if (acceptImages) {
    return ['image/*'];
  }

  return undefined;
};

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

const DragActiveContent = ({ message }) => {
  return (
    <Flex alignCenter column>
      <DragActiveIcon />
      <DragActiveMessage marginTop={1}>{message}</DragActiveMessage>
    </Flex>
  );
};

const PlaceholderContent = ({ message }) => {
  return <Typography>{message}</Typography>;
};

const UploadingContent = () => {
  return <Spin />;
};

const ErrorContent = ({ message }) => {
  return <ErrorMessage>{message}</ErrorMessage>;
};

export const FileInput = props => {
  const {
    multiple = false,
    upload,
    onChange = noop,
    dragActiveMessage,
    placeholderMessage,
  } = props;
  const accept = getAccept(props);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  const onDrop = useCallback(async files => {
    setLoading(true);
    setError(false);

    try {
      const binaries = await getBinaries(files);
      const values = await upload(binaries);

      setLoading(false);
      onChange(values);
    } catch (e) {
      setLoading(false);
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let content = (
    <PlaceholderContent
      message={placeholderMessage || t('yleiset.raahaaLiitettavaTiedosto')}
    />
  );

  if (isDragActive) {
    content = (
      <DragActiveContent
        message={dragActiveMessage || t('yleiset.pudotaTiedostoLadataksesi')}
      />
    );
  } else if (loading) {
    content = <UploadingContent />;
  } else if (error) {
    content = (
      <ErrorContent message={t('yleiset.tiedostonLataaminenEpaonnistui')} />
    );
  }

  const active = isDragActive || loading;

  return (
    <Container {...getRootProps()} active={active} error={error}>
      <input {...getInputProps({ accept, multiple })} />
      {content}
    </Container>
  );
};

export default FileInput;
