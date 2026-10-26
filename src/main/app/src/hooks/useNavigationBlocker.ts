import { useCallback } from 'react';

import {
  type BlockerFunction,
  useBeforeUnload,
  useBlocker,
} from 'react-router';

export const useNavigationBlocker = (when: boolean | BlockerFunction) => {
  const blocker = useBlocker(when);

  useBeforeUnload(
    useCallback(
      event => {
        const shouldBlock =
          typeof when === 'function'
            ? // @ts-expect-error beforeunload has no location info to evaluate against
              when()
            : when;
        if (shouldBlock) {
          event.preventDefault();
          event.returnValue = '';
        }
      },
      [when]
    ),
    { capture: true }
  );

  const isActive = blocker.state === 'blocked';

  return {
    isActive,
    nextLocation: isActive ? blocker.location : undefined,
    onConfirm: useCallback(() => {
      if (blocker.state === 'blocked') {
        blocker.proceed();
      }
    }, [blocker]),
    onCancel: useCallback(() => {
      if (blocker.state === 'blocked') {
        blocker.reset();
      }
    }, [blocker]),
  };
};
