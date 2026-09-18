import "dotenv/config";

/**
 * Hand-written OpenAPI spec.
 *
 * NOTE: the request schemas below mirror the zod validators by hand. When you
 * change a validator, update the matching schema here too — each one names its
 * source file. Nothing enforces this automatically.
 */

const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
    },
  },
})

const jsonResponse = (description: string, ref: string) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: `#/components/schemas/${ref}` },
    },
  },
})

const jsonBody = (ref: string, example: Record<string, unknown>) => ({
  required: true,
  content: {
    'application/json': {
      schema: { $ref: `#/components/schemas/${ref}` },
      example,
    },
  },
})

const bearerAuth = [{ bearerAuth: [] }]

export const openapiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Bodyon API',
    version: '1.0.0',
    description: 'Backend API for the Bodyon gym platform.',
  },
  servers: [
    { url: 'https://api.ayrahcollections.com', description: 'production' },
    { url: `http://localhost:${process.env.PORT || 3000}`, description: 'local' },
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Gym' },
    { name: 'Upload' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      // ---- requests -------------------------------------------------------

      // mirrors signupSchema in modules/auth/auth.validation.ts
      SignupInput: {
        type: 'object',
        required: ['fullName', 'email', 'password'],
        properties: {
          fullName: { type: 'string', minLength: 2, example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: { type: 'string', minLength: 6, example: 'secret123' },
          role: {
            type: 'string',
            enum: ['customer', 'gym_owner'],
            default: 'customer',
            description: 'defaults to customer when omitted',
          },
          profileImage: {
            type: 'string',
            format: 'uri',
            description: 'S3 key or URL from /upload/url',
            example: 'profiles/abc123.jpg',
          },
        },
      },

      // mirrors signinSchema in modules/auth/auth.validation.ts
      SigninInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          password: { type: 'string', minLength: 1, example: 'secret123' },
        },
      },

      // mirrors createGymSchema in modules/gym/gym.validation.ts
      CreateGymInput: {
        type: 'object',
        required: ['gymName', 'address', 'city'],
        properties: {
          gymName: { type: 'string', minLength: 2, example: 'Iron Works Gym' },
          address: { type: 'string', minLength: 1, example: '12 Mall Road' },
          city: { type: 'string', minLength: 1, example: 'Lahore' },
          description: { type: 'string', example: '24/7 strength and cardio facility' },
          phone: { type: 'string', example: '+92 300 1234567' },
        },
      },

      // mirrors updateGymSchema in modules/gym/gym.validation.ts — all optional
      UpdateGymInput: {
        type: 'object',
        properties: {
          gymName: { type: 'string', minLength: 2, example: 'Iron Works Gym' },
          address: { type: 'string', minLength: 1, example: '12 Mall Road' },
          city: { type: 'string', minLength: 1, example: 'Lahore' },
          description: { type: 'string', example: 'Now with a new cardio floor' },
          phone: { type: 'string', example: '+92 300 1234567' },
        },
      },

      // mirrors uploadSchema in modules/upload/upload.validation.ts
      UploadInput: {
        type: 'object',
        required: ['folder', 'contentType'],
        properties: {
          folder: { type: 'string', enum: ['gyms', 'machines', 'profiles'] },
          contentType: {
            type: 'string',
            enum: ['image/jpeg', 'image/png', 'image/webp'],
          },
        },
      },

      // ---- responses ------------------------------------------------------

      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string', example: 'validation failed' },
          details: {
            type: 'array',
            items: { type: 'string' },
            description: 'present on validation errors only',
          },
        },
      },

      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fullName: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          role: { type: 'string', enum: ['customer', 'gym_owner', 'super_admin'] },
          profileImageUrl: {
            type: ['string', 'null'],
            description: 'presigned view URL, or null when no image is set',
          },
        },
      },

      AuthResult: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'JWT — send as: Authorization: Bearer <token>' },
          user: { $ref: '#/components/schemas/User' },
        },
      },

      Gym: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          gymName: { type: 'string', example: 'Iron Works Gym' },
          description: { type: ['string', 'null'] },
          address: { type: 'string', example: '12 Mall Road' },
          city: { type: 'string', example: 'Lahore' },
          phone: { type: ['string', 'null'] },
          gymStatus: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
          rejectionReason: { type: ['string', 'null'] },
          ownerId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      UploadUrl: {
        type: 'object',
        properties: {
          uploadUrl: { type: 'string', description: 'presigned S3 URL — PUT the file here' },
          key: { type: 'string', example: 'gyms/abc123.jpg' },
        },
      },

      Health: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          uptime: { type: 'number', description: 'process uptime in seconds' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },

  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check the server is running',
        responses: {
          200: jsonResponse('server is up', 'Health'),
        },
      },
    },

    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: jsonBody('SignupInput', {
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'secret123',
          role: 'customer',
        }),
        responses: {
          201: jsonResponse('user created', 'User'),
          400: errorResponse('validation failed'),
          409: errorResponse('email already in use'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/auth/signin': {
      post: {
        tags: ['Auth'],
        summary: 'Sign in and receive a JWT',
        requestBody: jsonBody('SigninInput', {
          email: 'john@example.com',
          password: 'secret123',
        }),
        responses: {
          200: jsonResponse('signed in', 'AuthResult'),
          400: errorResponse('validation failed'),
          401: errorResponse('invalid email or password'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/gym': {
      post: {
        tags: ['Gym'],
        summary: "Create the signed-in owner's gym",
        description: 'Requires the gym_owner role. One gym per owner.',
        security: bearerAuth,
        requestBody: jsonBody('CreateGymInput', {
          gymName: 'Iron Works Gym',
          address: '12 Mall Road',
          city: 'Lahore',
          description: '24/7 strength and cardio facility',
          phone: '+92 300 1234567',
        }),
        responses: {
          201: jsonResponse('gym created', 'Gym'),
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('forbidden: not a gym owner'),
          409: errorResponse('you already have a gym'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/gym/gymDetails': {
      get: {
        tags: ['Gym'],
        summary: "Get the signed-in owner's gym",
        security: bearerAuth,
        responses: {
          200: jsonResponse('the gym', 'Gym'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('forbidden: not a gym owner'),
          404: errorResponse('no gym found'),
          500: errorResponse('something went wrong'),
        },
      },
      patch: {
        tags: ['Gym'],
        summary: "Update the signed-in owner's gym",
        description: 'Send only the fields you want to change.',
        security: bearerAuth,
        requestBody: jsonBody('UpdateGymInput', {
          gymName: 'Iron Works Gym',
          city: 'Lahore',
        }),
        responses: {
          200: jsonResponse('gym updated', 'Gym'),
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('forbidden: not a gym owner'),
          404: errorResponse('no gym found'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/upload/url': {
      post: {
        tags: ['Upload'],
        summary: 'Get a presigned S3 upload URL',
        description:
          'Returns a URL to PUT the file to, plus the key to store on the record.',
        security: bearerAuth,
        requestBody: jsonBody('UploadInput', {
          folder: 'gyms',
          contentType: 'image/jpeg',
        }),
        responses: {
          200: jsonResponse('presigned url issued', 'UploadUrl'),
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          500: errorResponse('could not create upload url'),
        },
      },
    },
  },
}

export default openapiSpec
