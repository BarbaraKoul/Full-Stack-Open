import type { JSX } from 'react'
import type { Diaries, Visibility, Weather } from './types'
import diaryService from './services/diaries'
import { useState, useEffect } from 'react';

const App=(): JSX.Element => {

  const [diary, setDiary]=useState<Diaries[]>([]);
  const [date, setDate] =useState('');
  const [visibility, setVisibility]= useState<Visibility| ''>('');
  const [weather, setWeather]= useState<Weather| ''>('');
  const [comment, setComment]= useState('');

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const diaryToAdd:Diaries = {
      id: diary.length + 1,
      date: date,
      weather: weather as Weather,
      visibility: visibility as Visibility,
      comment: comment
    }
    setDiary(diary.concat(diaryToAdd));
    setVisibility('');
    setComment('');
    setWeather('');
    setDate('');
  };


  useEffect(() => {
    diaryService.getAll().then(data => {
      setDiary(data)
    })
  }, []);

  return (
    <div>
      <h1>Add new entry</h1>
      <form onSubmit={diaryCreation}>
        <div>date <input value={ date } onChange={ (event) => setDate(event.target.value)}/></div>
        <div>visibility <input value={ visibility } onChange={ (event) => setVisibility(event.target.value as Visibility) }/></div>
        <div>weather <input value={ weather } onChange={ (event) => setWeather(event.target.value as Weather) }/></div>
        <button type="submit">add</button>
      </form>
      <h1>Diary Entries</h1>
    <ul>
      {diary.map(d =>
        <li key={d.id}>
          <h3>{d.date}</h3>
          <p>visibility: {d.visibility}</p>
          <p>weather: {d.weather}</p>
        </li>
      )}
    </ul>
    </div>
  )
}

export default App