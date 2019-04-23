import React, { useCallback, useState, useMemo, Fragment } from 'react';
import { useDropzone } from 'react-dropzone';
import styled, { css } from 'styled-components';
import { setLightness } from 'polished';

import { getThemeProp, spacing } from '../../theme';
import useTranslation from '../useTranslation';
import Typography from '../Typography';
import Flex, { FlexItem } from '../Flex';
import Icon from '../Icon';
import { noop, isArray, isString } from '../../utils';
import Spin from '../Spin';
import Anchor from '../Anchor';
import Button from '../Button';

const Container = styled.div`
  border: 1px dashed ${getThemeProp('palette.border')};
  border-radius: 2px;
  padding: ${spacing(3)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.25s, background-color 0.25s;
  min-height: 4rem;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}

  ${({ active }) =>
    active &&
    css`
      border-color: ${getThemeProp('palette.primary.main')};
      background-color: ${({ theme }) =>
        setLightness(0.95, theme.palette.primary.main)};
    `}

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

const getFilename = url => {
  if (!isString(url)) {
    return null;
  }

  const parts = url.split('/');

  return parts[parts.length - 1] || null;
};

const ValueContent = ({ value, t, onRemove, message }) => {
  const links = useMemo(() => {
    const files = value
      .map(url => ({ url, filename: getFilename(url) }))
      .filter(({ filename }) => !!filename);

    return files.map(({ url, filename }, index) => (
      <Fragment key={url}>
        <Anchor href={url} rel="nofollow" target="_blank">
          {filename}
        </Anchor>
        {index < files.length - 1 ? ', ' : ''}
      </Fragment>
    ));
  }, [value]);

  return (
    <Flex alignCenter column>
      <FlexItem marginBottom={1}>
        <Typography>{message}:</Typography>
      </FlexItem>
      <FlexItem>{links}</FlexItem>
      <FlexItem marginTop={2}>
        <Button size="small" color="danger" type="button" onClick={onRemove}>
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
    disabled = false,
    onChange = noop,
    error = false,
    upload,
    dragActiveMessage,
    placeholderMessage,
    value,
  } = props;

  const accept = getAccept(props);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const { t } = useTranslation();

  const onDrop = useCallback(
    async files => {
      setLoading(true);
      setUploadError(false);

      try {
        const binaries = await getBinaries(files);
        const values = await upload(binaries);

        setLoading(false);
        onChange(values);
      } catch (e) {
        setLoading(false);
        setUploadError(true);

        setTimeout(() => {
          setUploadError(false);
        }, 2000);
      }
    },
    [onChange, upload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const hasValue = isArray(value) && value.length > 0;

  const onRemove = useCallback(() => {
    onChange([]);
  }, [onChange]);

  let content = hasValue ? (
    <ValueContent
      value={value}
      onRemove={onRemove}
      t={t}
      message={t('yleiset.ladatutTiedostot')}
    />
  ) : (
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
  } else if (uploadError) {
    content = (
      <ErrorContent message={t('yleiset.tiedostonLataaminenEpaonnistui')} />
    );
  }

  const active = isDragActive || loading;
  const inputDisabled = hasValue || disabled;

  return (
    <Container
      {...getRootProps()}
      active={active}
      uploadError={uploadError}
      error={error}
      disabled={disabled}
    >
      <input
        {...getInputProps({ accept, multiple, disabled: inputDisabled })}
      />
      {content}
    </Container>
  );
};

export default FileInput;
