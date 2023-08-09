import { useRef } from 'react';

import { config, useSpring, animated } from '@react-spring/web';
import { useMeasure } from 'react-use';

const collapseConfig = {
  ...config.gentle,
  precision: 0.02,
  clamp: true,
};

export const CollapseContent = ({ open = false, children }) => {
  const initializedRef = useRef<boolean>(false);
  const [measureRef, { height }] = useMeasure<HTMLDivElement>();

  const style = useSpring({
    config: collapseConfig,
    maxHeight: open ? `${height}px` : '0px',
    opacity: open ? 1 : 0,
    immediate: !initializedRef.current,
  });

  // Ei animoida ensimmäisellä kerralla
  if (!initializedRef.current && open ? height > 0 : true) {
    initializedRef.current = true;
  }

  return (
    <animated.div
      style={{
        ...style,
        overflow: style.opacity.get() === 1 ? 'visible' : 'hidden',
      }}
    >
      <div ref={measureRef}>{children}</div>
    </animated.div>
  );
};
