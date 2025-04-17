describe('Pruebas del Componente Community', () => {
    // Mock de los comentarios ya que no usamos backend para estas pruebs xd
    const mockPosts = [
      {
        id: 1,
        titulo: 'Mi experiencia con la meditación diaria',
        contenido: 'Hace tres meses comencé a meditar...',
        tema: 'Meditación',  
        fechaPublicacion: new Date('2023-05-15'),
        usuario: 'maria_g'   
      },
      {
        id: 2,
        titulo: 'Cómo manejar la ansiedad en reuniones sociales',
        contenido: 'Técnicas para controlar la ansiedad...',
        tema: 'Ansiedad',
        fechaPublicacion: new Date('2023-06-02'),
        usuario: 'carlos_23'
      }
    ];
  
  
    beforeEach(() => {
      // 1. Mockear ANTES de visitar la página
      cy.intercept('GET', '**/publicaciones', { 
        statusCode: 200,
        body: mockPosts
      }).as('getPosts');
      cy.visit('http://localhost:4200/community');
      cy.wait('@getPosts', { timeout: 10000 });
    });
  
    it('1. Debería mostrar el header correctamente', () => {
      cy.get('.logo-neuro').should('contain', 'NEURO');
      cy.get('.logo-health').should('contain', 'HEALTH');
      
      cy.get('.login-button')
        .should('be.visible')
        .and('contain', 'Login');
    });
  
    it('2. Debería mostrar la sección principal', () => {
      cy.get('.section-title')
        .should('contain', 'COMUNIDAD DE APOYO');
      
      cy.get('.posts-grid').should('exist');
    });
  
    it('3. Debería mostrar todos los posts inicialmente', () => {
      cy.get('.post-card').should('have.length', 2);
      
      cy.get('.post-card').first().within(() => {
        cy.get('.post-title').should('contain', 'meditación diaria');
        cy.get('.post-author').should('contain', '@maria_g');
      });
    });
  
    it('4. Debería filtrar posts por categoría', () => {
      cy.get('.filter-button').eq(4).click();
      
      cy.get('.post-card').should('have.length', 1);
      cy.get('.post-category').should('contain', 'Meditación');
  
      cy.get('.filter-button').first().click();
      cy.get('.post-card').should('have.length', 2);
    });
  
  
    it('5. Debería redirigir al detalle del post', () => {
      cy.get('.read-more').first().click();
      
      cy.url().should('include', '/community/1');
    });
  
    it('6. Debería abrir el modal de nueva publicación', () => {
      cy.get('.new-post-button').click();
      
      cy.get('form').should('exist');
    });
  });
  
  describe('Flujo de Nueva Publicación', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/publicaciones', {
        statusCode: 201,
        body: { success: true }
      }).as('postComment');
      
      cy.visit('http://localhost:4200/community');
      cy.get('.new-post-button').click();
    });
  
    it('1. Debería mostrar el diálogo de nueva publicación', () => {
      cy.get('mat-dialog-container').should('be.visible');
      cy.contains('Título').should('exist');
    });
  
    it('2. Debería validar el formulario para no mandar sin info', () => {
      cy.get('button[color="primary"]').click();
      cy.get('mat-error').should('have.length.at.least', 1);
    });
  
    
  });