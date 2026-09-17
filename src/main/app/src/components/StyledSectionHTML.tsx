import { flow, get, mapValues, pick } from 'lodash-es';
import styled, { css } from 'styled-components';

const StyledKuvaus = styled.div<{ noChildMargin?: boolean }>`
  ${({ noChildMargin }) =>
    noChildMargin &&
    css`
      & * {
        margin: 0;
        line-height: inherit;
      }
    `}
  ${({ theme }) => ({
    ...flow(
      t => get(t, 'typography'),
      t => pick(t, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
      t =>
        mapValues(t, headingStyle => ({
          ...headingStyle,
          marginBottom: 0,
          marginTop: '20px',
        }))
    )(theme),
    ...get(theme, 'typography.body'),
    maxWidth: '750px',
  })}
`;

export default function StyledSectionHTML({ html, ...props }) {
  return (
    <StyledKuvaus
      {...props}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
