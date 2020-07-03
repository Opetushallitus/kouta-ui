import { useRef } from 'react';
import { useIntersection } from 'react-use';

export default function useInView(options = {}) {
  const ref = useRef(null);
  const intersection = useIntersection(ref, { threshold: 1.0, ...options });
  return [ref, intersection && intersection.intersectionRatio === 1];
}
