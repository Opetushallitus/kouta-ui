import React from 'react';
import { CompositeDecorator } from 'draft-js';

import Anchor from '../../components/Anchor';

const Link = props => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return <Anchor href={url}>{props.children}</Anchor>;
};

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
};

const linkDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export default linkDecorator;
