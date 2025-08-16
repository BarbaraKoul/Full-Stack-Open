import type { JSX } from 'react'

interface NotificationProps {
  message: string | null
  type?: 'error' | 'success'
}

const Notification = ({ message, type = 'error' }: NotificationProps): JSX.Element | null => {
  if (!message) return null

  const style = {
    color: type === 'error' ? 'red' : 'green',
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
