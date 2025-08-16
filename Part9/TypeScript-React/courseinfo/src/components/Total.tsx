import type { JSX } from 'react'


export const Total=({totalExercises}: {totalExercises:number}): JSX.Element => (
    <p>
        Number of exercises {totalExercises}
    </p>
)