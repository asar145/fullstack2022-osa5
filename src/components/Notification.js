const Notification = ({ message, cssClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={cssClass} >
      {message}
    </div>
  )
}

export default Notification