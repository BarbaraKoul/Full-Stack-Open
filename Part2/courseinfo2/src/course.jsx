const Course=(props)=>{
  return(
    <div>
      <Header course={props.course.name}/>
      <Content parts={props.course.parts}/>
      <Total parts={props.course.parts}/>
    </div>
  )
}

const Header=(props)=>{
  return(<div>
    <h1>{props.course}</h1>
  </div>
  )}

const Part=(props)=>{
  return(
    <p>{props.part} {props.exercises}</p>
  )
}

const Content=(props)=>{
  return(
    <div>
      {props.parts.map((part)=> <Part key={part.id} part={part.name} exercises={part.exercises}/>)}
    </div>
  )
}

const Total=(props)=>{
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return(
    <div>
      <p> <b>total of {total} exercises</b> </p>
    </div>
  )
}

export default Course