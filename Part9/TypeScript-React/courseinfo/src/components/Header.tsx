import type { JSX } from "react";

export const Header=({ courseName }: { courseName: string }): JSX.Element => (
    <h1>{courseName}</h1>
);