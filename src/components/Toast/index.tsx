import './Toast.css'

import React, { useEffect, useState } from 'react'

interface ToastItem {
  id: number
  title: string
  description: string
  backgroundColor: string
  icon: string
}

interface Props {
  toastList: ToastItem[]
  position: string
  autoDelete: boolean
  dismissTime: number
}

export const Toast = ({
  toastList,
  position,
  autoDelete,
  dismissTime,
}: Props) => {
  const [list, setList] = useState<ToastItem[]>(toastList)

  useEffect(() => {
    setList([...toastList])
  }, [toastList])

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoDelete && toastList.length && list.length) {
        deleteToast(toastList[0].id)
      }
    }, dismissTime)

    return () => {
      clearInterval(interval)
    }
  }, [toastList, autoDelete, dismissTime, list])

  const deleteToast = (id: number) => {
    const listItemIndex = list.findIndex(item => item.id === id)
    const toastListItem = toastList.findIndex(item => item.id === id)
    list.splice(listItemIndex, 1)
    toastList.splice(toastListItem, 1)
    setList([...list])
  }

  return (
    <div className={`notification-container ${position}`}>
      {list.map((toast, i) => (
        <div
          key={i}
          className={`notification toast ${position}`}
          style={{ backgroundColor: toast.backgroundColor }}>
          <button onClick={() => deleteToast(toast.id)}>x</button>
          <div className="notification-image">
            <img alt="" src={toast.icon} />
          </div>
          <div>
            <p className="notification-title">{toast.title}</p>
            <p className="notification-message">{toast.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
