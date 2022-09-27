import { useState } from 'react'
import PropTypes from 'prop-types'


const BlogSubmitForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogSubmit = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    createBlog(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleBlogSubmit}>
        <div>
          title:
          <input
            id="blogTitleTextbox"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
          author:
          <input
            id="blogAuthorTextbox"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
          url:
          <input
            id="blogUrlTextbox"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write url here'
          />
        </div>
        <button type="submit" id="blogSubmitButton"> create </button>
      </form>
    </div>
  )
}

BlogSubmitForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogSubmitForm