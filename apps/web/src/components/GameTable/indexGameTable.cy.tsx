import GameTable from './index';
import { mockGames } from './mocks';


describe('<GameTable />', () => {
  it('renders', () => {
    cy.mount(<GameTable games={mockGames} />)
    cy.get('tbody tr').should('have.length', 10)
    cy.get('[data-testid="pagination-btn-next"]').click()
    cy.get('[data-testid="pagination-page-count"]').contains('Page 2 of 6')
  })
})