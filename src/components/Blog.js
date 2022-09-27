import { useState } from 'react'

const Blog = ({ blog,  username, handleLike, handleDelete }) => {
  const [show, setShow] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  const handleShowChange = () => {
    setShow(!show)
  }

  if (!show) {
    return (
      <div style={blogStyle} className="blog">
        <div>
          {blog.title} {blog.author} <button onClick={() => handleShowChange()}> show </button>
        </div>
      </div>
    )
  } else {
    return (
      <div style={blogStyle} className="blog">
        <div>
          {blog.title} {blog.author} <button onClick={() => handleShowChange()}> hide </button>
        </div>
        <p>{blog.url}</p>
        <p>{blog.likes.toString()}<button onClick={() => handleLike(blog)}> like </button></p>
        <p>{blog.author}</p>
        {username === blog.user.username ?
          <button onClick={() => handleDelete(blog)}>delete</button> :
          <></>
        }
      </div>
    )
  }
}

export default Blog