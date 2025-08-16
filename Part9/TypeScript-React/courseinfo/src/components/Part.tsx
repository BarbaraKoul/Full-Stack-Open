import type { JSX } from 'react';
import type { CoursePart } from '../types';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const Part = ({ part }: { part: CoursePart }): JSX.Element=> {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <strong>{part.name} {part.exerciseCount}</strong>
          <p>{part.description}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <strong>{part.name} {part.exerciseCount}</strong>
          <p>Group projects: {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <strong>{part.name} {part.exerciseCount}</strong>
          <p>{part.description}</p>
          <p>Background material: {part.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <strong>{part.name} {part.exerciseCount}</strong>
          <p>{part.description}</p>
          <p>Requirements: {part.requirements.join(", ")}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
