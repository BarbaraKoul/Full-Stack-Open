import { useState } from 'react'

const Button = ({ setFunction, text }) => (
  <button onClick={setFunction}>{text}</button>
)
 
const StatisticsLine = ({ text, value }) => (
    <tr>
      <td>{text}</td>
      <td>{text === 'positive' ? `${value}%` : value}</td>
    </tr>
)

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={all} />
          <StatisticsLine text="average" value={average} />
          <StatisticsLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + bad + neutral
  const average = all > 0 ? (good - bad) / all : 0  
  const positive = all > 0 ? (good / all) * 100 : 0

  return (
    <div>
      <h1>give feedback</h1>
      <Button setFunction={() => setGood(good + 1)} text="good" />
      <Button setFunction={() => setNeutral(neutral + 1)} text="neutral" />
      <Button setFunction={() => setBad(bad + 1)} text="bad" />
      <Statistics 
        good={good} 
        neutral={neutral} 
        bad={bad} 
        all={all} 
        average={average} 
        positive={positive} 
      />
    </div>
  )
}

export default App