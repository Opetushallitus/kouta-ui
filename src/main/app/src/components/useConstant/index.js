import { useRef } from 'react';

const useConstant = getValue => {
  const ref = useRef();

  if (!ref.current) {
    ref.current = getValue();
  }

  return ref.current;
};

export default useConstant;
