import type { JSX } from 'react';
import type { CoursePart } from '../types';
import Part from './Part';

export const Content = ({courseParts}: {courseParts: CoursePart[]}): JSX.Element => (
  <div>
    {courseParts.map((part, index) => (
      <Part key={index} part={part} />
    ))}
  </div>
);


