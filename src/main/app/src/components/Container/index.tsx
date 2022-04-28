import styled from 'styled-components';
import { MaxWidthProps } from 'styled-system';

import { spacing } from '#/src/theme';

type Props = MaxWidthProps;

const Container = styled.div`
  width: 100%;
  max-width: ${(props: Props) => props.maxWidth ?? '1200px'};
  margin: 0px auto;
  padding: 0px ${spacing(3)};
  box-sizing: border-box;
`;

export default Container;
