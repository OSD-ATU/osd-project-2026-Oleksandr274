const PORT = process.env.PORT || 3001;

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API",
      version: "1.0.0",
      description:
        "This is a REST API application made with Express and documented with Swagger"
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1/`,
        description: 'Development server'
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            phonenumber: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            dob: {
              type: 'string',
              format: 'date',
            },
            address: {
              type: 'string',
            },
            dateJoined: {
              type: 'string',
              format: 'date-time',
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time',
            },
          },
          example: {
            firstName: "Alex",
            lastName: "Ferguson",
            phonenumber: "+353871234567",
            email: "alex.ferguson@gmail.com",
            password: "password12345",
            dob: "12-31-1941",
            address: "The Manchester House"
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            title: {
              type: 'string',
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            category: {
              type: 'string',
            },
            price: {
              type: 'number',
              format: 'decimal'
            },
            brand: {
              type: 'string',
            },
            condition: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            datePosted: {
              type: 'string',
              format: 'date-time',
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time',
            },
          },
          example: {
            title: "Product title",
            images: ["https://placehold.co/600x400/EEE/31343C"],
            category: "placeholder category",
            price: 10.00,
            brand: "Placeholder",
            condition: "brand-new",
            description: "This is a short description"
          }
        }
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization'
        }
      }
    },
    security: [{
      ApiKeyAuth: []
    }]

  },
  apis: ['./src/routes/*.ts'], // Path to your API docss
}

