import { useNotification } from './notContext'

const Notification = () => {
  const style= {
    padding: 10,
    border: 'solid',
    borderwidth: 1
  }
  const [notification] = useNotification()
  return notification && <div style={style}>{notification}</div>
}

export default Notification