import React from 'react';

import SmallStatusTag from './SmallStatusTag';

export default {
  title: 'SmallStatusTag',
};

export const Basic = () => <SmallStatusTag status="julkaistu" />;

export const WithStatus = () => (
  <>
    <SmallStatusTag status="julkaistu" />
    <SmallStatusTag status="tallennettu" />
    <SmallStatusTag status="arkistoitu" />
  </>
);

WithStatus.storyName = 'With status';

export const WithCustomLabel = () => <SmallStatusTag>Foo bar</SmallStatusTag>;

WithCustomLabel.storyName = 'With custom label';
