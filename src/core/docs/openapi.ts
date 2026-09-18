import { z } from 'zod'
import { signinSchema, signupSchema } from '../../modules/auth/auth.validation'
import { createGymSchema, updateGymSchema } from '../../modules/gym/gym.validation'
import { uploadSchema } from '../../modules/upload/upload.validation'
import "dotenv/config";

// zod emits a $schema key that OpenAPI has no use for — drop it
function jsonSchema(schema: z.ZodType) {
  const { $schema, ...rest } = z.toJSONSchema(schema) as Record<string, unknown>
  return rest
}

const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
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
      // request bodies derived from the zod validators the routes already use
      SignupInput: jsonSchema(signupSchema),
      SigninInput: jsonSchema(signinSchema),
      CreateGymInput: jsonSchema(createGymSchema),
      UpdateGymInput: jsonSchema(updateGymSchema),
      UploadInput: jsonSchema(uploadSchema),

      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          details: { type: 'array', items: { type: 'string' } },
        },
        required: ['error'],
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fullName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['customer', 'gym_owner', 'super_admin'] },
          profileImageUrl: { type: ['string', 'null'] },
        },
      },
      AuthResult: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
      Gym: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          gymName: { type: 'string' },
          description: { type: ['string', 'null'] },
          address: { type: 'string' },
          city: { type: 'string' },
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
          uploadUrl: { type: 'string', format: 'uri' },
          key: { type: 'string' },
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
          200: {
            description: 'server is up',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', examples: ['ok'] },
                    uptime: { type: 'number' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignupInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'user created',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/User' } },
            },
          },
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
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SigninInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'signed in',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/AuthResult' } },
            },
          },
          400: errorResponse('validation failed'),
          401: errorResponse('invalid email or password'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/gym': {
      post: {
        tags: ['Gym'],
        summary: 'Create the signed-in owner\'s gym',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateGymInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'gym created',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Gym' } },
            },
          },
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('not a gym owner'),
          409: errorResponse('you already have a gym'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/gym/gymDetails': {
      get: {
        tags: ['Gym'],
        summary: 'Get the signed-in owner\'s gym',
        security: bearerAuth,
        responses: {
          200: {
            description: 'the gym',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Gym' } },
            },
          },
          401: errorResponse('missing or invalid token'),
          403: errorResponse('not a gym owner'),
          404: errorResponse('no gym found'),
          500: errorResponse('something went wrong'),
        },
      },
      patch: {
        tags: ['Gym'],
        summary: 'Update the signed-in owner\'s gym',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateGymInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'gym updated',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Gym' } },
            },
          },
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('not a gym owner'),
          404: errorResponse('no gym found'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/upload/url': {
      post: {
        tags: ['Upload'],
        summary: 'Get a presigned S3 upload URL',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UploadInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'presigned url issued',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/UploadUrl' } },
            },
          },
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          500: errorResponse('could not create upload url'),
        },
      },
    },
  },
}

export default openapiSpec
