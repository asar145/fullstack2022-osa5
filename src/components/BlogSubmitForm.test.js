import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogSubmitForm from './BlogSubmitForm'

test('sends correct information on pressing create button', async () => {

  const createBlog = jest.fn()

  render(
    <BlogSubmitForm createBlog={createBlog}/>
  )

  const titleInput = screen.getByPlaceholderText('write title here',{ exact: false })
  const authorInput = screen.getByPlaceholderText('write author here',{ exact: false })
  const urlInput = screen.getByPlaceholderText('write url here',{ exact: false })
  const sendButton = screen.getByText('create',{ exact: true })

  await userEvent.type(titleInput, 'this is the title' )
  await userEvent.type(authorInput, 'the author' )
  await userEvent.type(urlInput, 'theurl' )
  await userEvent.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('this is the title' )
  expect(createBlog.mock.calls[0][0].author).toBe('the author' )
  expect(createBlog.mock.calls[0][0].url).toBe('theurl' )
})