import type { JSX } from "react";
import { Header } from "./components/Header";
import  { Content } from "./components/Content"
import { Total } from "./components/Total"
import { courseParts } from "./data";

const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

const App = (): JSX.Element => {
  const courseName = "Half Stack application development";


  return (
    <div>
      <Header courseName={ courseName } />
      <Content courseParts={ courseParts } />
      <Total totalExercises={ totalExercises } />
    </div>
  );
};

export default App;