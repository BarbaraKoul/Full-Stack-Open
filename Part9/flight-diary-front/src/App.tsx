import type { JSX } from 'react'
import type { Diaries, Visibility, Weather } from './types'
import diaryService from './services/diaries'
import { useState, useEffect } from 'react';
import Notification from './Notification';

const App=(): JSX.Element => {

  const [diary, setDiary]=useState<Diaries[]>([]);
  const [date, setDate] =useState('');
  const [visibility, setVisibility]= useState<Visibility| ''>('');
  const [weather, setWeather]= useState<Weather| ''>('');
  const [comment, setComment]= useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

  const showNotification = (message: string, type: 'error' | 'success' = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!date || !visibility || !weather || !comment) {
      showNotification('All fields are required!', 'error');
      return;
    }
    try{
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
      showNotification('Diary entry added successfully!', 'success');
    } catch (e) {
      showNotification('Failed to add diary entry', 'error');
      console.error(e);
    }
  };


  useEffect(() => {
    diaryService.getAll().then(data => {
      setDiary(data)
    }).catch(err => {
        showNotification('Failed to fetch diaries', 'error')
        console.error(err)
      })
  }, []);

  return (
    <div>
      <h1>Add new entry</h1>
      <Notification message={notification?.message ?? null} type={notification?.type} />
      <form onSubmit={diaryCreation}>
        <div>date <input type="date" value={ date } onChange={ (event) => setDate(event.target.value)}/></div>
        <div>
          visibility great <input type="radio" value={ visibility } onChange={ () => setVisibility("great") }/>
          good <input type="radio" value={ visibility } onChange={ () => setVisibility("good") }/>
          ok <input type="radio" value={ visibility } onChange={ () => setVisibility("ok") }/>
          poor <input type="radio" value={ visibility } onChange={ () => setVisibility("poor") }/>
        </div>
        <div>
          weather sunny <input type="radio" value={ weather } onChange={ () => setWeather("sunny") }/>
          rainy <input type="radio" value={ weather } onChange={ () => setWeather("rainy") }/>
          cloudy <input type="radio" value={ weather } onChange={ () => setWeather("cloudy") }/>
          stormy <input type="radio" value={ weather } onChange={ () => setWeather("stormy") }/>
          windy <input type="radio" value={ weather } onChange={ () => setWeather("windy") }/>
        </div>
        <div>comment <input value={ comment } onChange={(event) => setComment(event.target.value)}/></div>
        <button type="submit">add</button>
      </form>
      <h1>Diary Entries</h1>
    <ul>
      {diary.map(d =>
        <li key={ d.id }>
          <h3>{ d.date }</h3>
          <p>visibility: { d.visibility }</p>
          <p>weather: { d.weather }</p>
          <p>comment: { d.comment }</p>
        </li>
      )}
    </ul>
    </div>
  )
}

export default App