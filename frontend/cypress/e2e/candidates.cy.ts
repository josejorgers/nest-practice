describe('Candidate Management', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '**/candidates', { fixture: 'candidates.json' }).as('getCandidates');
    cy.intercept('POST', '**/candidates/upload', { statusCode: 201, fixture: 'candidate.json' }).as('uploadCandidate');
    
    cy.visit('/');
  });

  it('should display the candidate management page', () => {
    cy.get('mat-toolbar').should('contain', 'Candidate Management');
    cy.get('app-candidate-form').should('be.visible');
    cy.get('app-candidate-list').should('be.visible');
  });

  it('should load and display candidates', () => {
    cy.wait('@getCandidates');
    
    cy.get('table').should('be.visible');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });
});
