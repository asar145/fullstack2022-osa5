import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders only the right content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'the author',
    url: 'theurl',
    likes: 2,
    user: 'userId'
  }

  render(<Blog blog={blog} />)

  const title = screen.getByText('Component testing is done with react-testing-library',{ exact: false })
  const author = screen.getByText('the author',{ exact: false })
  const url = screen.queryByText('theurl',{ exact: false })
  const likes = screen.queryByText('2',{ exact: false })
  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('renders more content when button is pressed', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'the author',
    url: 'theurl',
    likes: 2,
    user: 'userId'
  }

  render(
    <Blog blog={blog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('show',{ exact: false })
  await user.click(button)

  const title = screen.getByText('Component testing is done with react-testing-library',{ exact: false })
  const author = screen.getAllByText('the author',{ exact: false })
  const url = screen.getByText('theurl',{ exact: false })
  const likes = screen.getByText('2',{ exact: false })
  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('like button handler function is called correctly two times', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'the author',
    url: 'theurl',
    likes: 2,
    user: 'userId'
  }

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler}/>
  )



  const user = userEvent.setup()
  const showButton = screen.getByText('show',{ exact: false })
  await user.click(showButton)

  const likeButton = screen.getByText('like',{ exact: false })
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})