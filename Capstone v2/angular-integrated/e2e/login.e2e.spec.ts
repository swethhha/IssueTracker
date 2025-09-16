// Example E2E test using Cypress
// To run: npx cypress open

describe('Payroll360 Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.contains('Payroll360 Login');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty form', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.invalid-feedback').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.get('input[type="email"]').type('admin@payroll360.com');
    cy.get('input[type="password"]').type('Admin@123');
    cy.get('button[type="submit"]').click();
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    cy.get('.alert-danger').should('be.visible');
  });

  it('should navigate to payroll list after login', () => {
    // Login first
    cy.get('input[type="email"]').type('admin@payroll360.com');
    cy.get('input[type="password"]').type('Admin@123');
    cy.get('button[type="submit"]').click();
    
    // Navigate to payroll
    cy.get('a[href="/payroll"]').click();
    cy.url().should('include', '/payroll');
    cy.contains('Payroll Management').should('be.visible');
  });
});