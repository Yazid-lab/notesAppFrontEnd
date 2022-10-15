describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'yazid bougrine',
      username: 'yazid99',
      password: 'password',
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', function () {
    cy.contains('Notes')
  })
  it('login form can be open', () => {
    cy.contains('login').click()
  })
  it('user can login', () => {
    cy.contains('login').click()
    cy.get('#username').type('yazid99')
    cy.get('#password').type('password')
    cy.get('#login-button').click()
    cy.contains('yazid bougrine logged-in')
  })
  describe('when logged in ', function () {
    beforeEach(function () {
      cy.login({ username: 'yazid99', password: 'password' })
    })
    it('a new note can be created', function () {
      cy.contains('add new note').click()
      cy.get('#note').type('a new note is created by cypress')
      cy.contains('save').click()
      cy.contains('a new note is created by cypress')
    })

    describe('and when a note exists', function () {
      beforeEach(function () {
        cy.createNote({ content: 'another note cypress', important: false })
      })
      it('it can be made important', function () {
        cy.contains('another note cypress')
          .parent()
          .find('button')
          .as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain', 'make not important')
      })
    })
    describe('and when multiple notes exist', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })
      it('one of these can be made important', function () {
        cy.contains('second note').parent().find('button').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain', 'make not important')
      })
    })
  })
  it('login fails when the password is wrong', function () {
    cy.contains('login').click()
    cy.get('#username').type('yazid99')
    cy.get('#password').type('wrong_password')
    cy.get('#login-button').click()
    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')
    cy.get('.error').should('not.contain', 'yazid bougrine logged-in')
  })
  it('then example', function () {
    cy.get('button').then((buttons) => {
      console.log('number of buttons', buttons.length)
      cy.wrap(buttons[0].click())
    })
  })
})
