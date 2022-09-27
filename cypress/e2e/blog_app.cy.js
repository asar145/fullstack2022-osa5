describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'A B',
      username: 'AABB',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('AABB')
      cy.get('#password').type('salasana')
      cy.get('#loginButton').click()

      cy.contains('A B logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('AABB')
      cy.get('#password').type('123456')
      cy.get('#loginButton').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'A B logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'AABB', password: 'salasana' })
    })

    it('A blog can be created', function() {
      cy.get('#toggleableShowButton').click()
      cy.get('#blogTitleTextbox').type('a new blog created by cypress')
      cy.get('#blogAuthorTextbox').type('A B')
      cy.get('#blogUrlTextbox').type('url')
      cy.get('#blogSubmitButton').click()

      cy.contains('a new blog created by cypress')
    })

    describe('and multiple blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'first blog cypress',
          author: 'A B',
          url: 'url'
        })
        cy.createBlog({
          title: 'second blog cypress',
          author: 'A B',
          url: 'url'
        })
        cy.createBlog({
          title: 'third blog cypress',
          author: 'A B',
          url: 'url'
        })
      })

      it('one of them can be liked', function () {
        cy.contains('second blog cypress')
          .contains('show')
          .click()
        cy.contains('second blog cypress')
          .parent()
          .contains('like')
          .click()

        cy.contains('second blog cypress')
          .parent()
          .should('contain', '1')
      })

      it('one of them can be deleted', function () {
        cy.contains('second blog cypress')
          .contains('show')
          .click()
        cy.contains('second blog cypress')
          .parent()
          .contains('delete')
          .click()

        cy.get('html').should('not.contain', 'second blog cypress')
      })

      it('they are sorted by highest likes', function () {
        cy.contains('second blog cypress')
          .contains('show')
          .click()
        cy.contains('second blog cypress')
          .parent()
          .contains('like')
          .as('secondLikeButton')
        cy.get('@secondLikeButton').click()
        cy.wait(1000)
        cy.get('@secondLikeButton').click()
        cy.wait(1000)
        cy.contains('third blog cypress')
          .contains('show')
          .click()
        cy.contains('third blog cypress')
          .parent()
          .contains('like')
          .click()
        cy.wait(1000)

        cy.get('.blog').eq(0).should('contain', 'second blog cypress')
        cy.get('.blog').eq(1).should('contain', 'third blog cypress')
        cy.get('.blog').eq(2).should('contain', 'first blog cypress')
      })
    })
  })
})