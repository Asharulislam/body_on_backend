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
    { name: 'Machines' },
    { name: 'Profile' },
    { name: 'Notifications' },
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

      // mirrors createMachineSchema in modules/machines/machines.validation.ts
      CreateMachineInput: {
        type: 'object',
        required: ['machineName', 'description', 'imageKey'],
        properties: {
          machineName: { type: 'string', minLength: 2, example: 'Leg Press' },
          description: { type: 'string', minLength: 1, example: '45-degree plate-loaded leg press' },
          imageKey: {
            type: 'string',
            minLength: 1,
            description: 'key returned by /upload/url (folder: machines)',
            example: 'machines/abc123.jpg',
          },
        },
      },

      // mirrors updateMachineSchema in modules/machines/machines.validation.ts — all optional
      UpdateMachineInput: {
        type: 'object',
        properties: {
          machineName: { type: 'string', minLength: 2, example: 'Leg Press' },
          description: { type: 'string', minLength: 1, example: 'Recently serviced' },
          imageKey: { type: 'string', minLength: 1, example: 'machines/def456.jpg' },
        },
      },

      // mirrors updateProfileSchema in modules/user/user.validation.ts — all optional
      UpdateProfileInput: {
        type: 'object',
        properties: {
          fullName: { type: 'string', minLength: 2, example: 'John Doe' },
          profileImage: {
            type: 'string',
            description: 'key returned by /upload/url (folder: profiles)',
            example: 'profiles/abc123.jpg',
          },
        },
      },

      // mirrors saveTokenSchema in modules/notification/notification.validation.ts
      SaveDeviceTokenInput: {
        type: 'object',
        required: ['token'],
        properties: {
          token: {
            type: 'string',
            minLength: 1,
            description: 'push notification device token',
            example: 'fcm-device-token-xyz',
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

      // full record — returned by create and update
      Machine: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          machineName: { type: 'string', example: 'Leg Press' },
          description: { type: 'string', example: '45-degree plate-loaded leg press' },
          imageKey: { type: 'string', example: 'machines/abc123.jpg' },
          gymId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      // returned by list and get-one — imageKey is swapped for a viewable URL
      MachineView: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          machineName: { type: 'string', example: 'Leg Press' },
          description: { type: 'string', example: '45-degree plate-loaded leg press' },
          imageUrl: {
            type: ['string', 'null'],
            description: 'presigned S3 GET URL, valid for 5 minutes',
          },
        },
      },

      MachineList: {
        type: 'array',
        items: { $ref: '#/components/schemas/MachineView' },
      },

      Profile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fullName: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          role: { type: 'string', enum: ['customer', 'gym_owner', 'super_admin'] },
          profileImageUrl: {
            type: ['string', 'null'],
            description: 'presigned S3 GET URL, valid for 5 minutes',
          },
        },
      },

      Notification: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          type: {
            type: 'string',
            enum: ['gym_approved', 'gym_rejected', 'account_locked', 'general'],
          },
          title: { type: 'string', example: 'Gym approved' },
          body: { type: 'string', example: 'Your gym is now live on Bodyon.' },
          isRead: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      NotificationList: {
        type: 'array',
        items: { $ref: '#/components/schemas/Notification' },
      },

      DeleteResult: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
        },
      },

      SuccessResult: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
        },
      },

      UploadUrl: {
        type: 'object',
        properties: {
          uploadUrl: { type: 'string', description: 'presigned S3 URL — PUT the file here' },
          key: { type: 'string', example: 'gyms/abc123.jpg' },
        },
      },

      ViewUrl: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'presigned S3 GET URL, valid for 5 minutes',
          },
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
          201: jsonResponse('user created and signed in', 'AuthResult'),
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

    '/upload/view-url': {
      get: {
        tags: ['Upload'],
        summary: 'Get a presigned URL to view a private object',
        description:
          'Pass the key returned by /upload/url. The URL expires after 5 minutes.',
        security: bearerAuth,
        parameters: [
          {
            name: 'key',
            in: 'query',
            required: true,
            description: 'S3 object key',
            schema: { type: 'string' },
            example: 'gyms/abc123.jpg',
          },
        ],
        responses: {
          200: jsonResponse('presigned url issued', 'ViewUrl'),
          400: errorResponse('key is required'),
          401: errorResponse('missing or invalid token'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/machines': {
      post: {
        tags: ['Machines'],
        summary: "Add a machine to the signed-in owner's gym",
        description:
          'Requires the gym_owner role. Upload the image first via /upload/url and send its key.',
        security: bearerAuth,
        requestBody: jsonBody('CreateMachineInput', {
          machineName: 'Leg Press',
          description: '45-degree plate-loaded leg press',
          imageKey: 'machines/abc123.jpg',
        }),
        responses: {
          201: jsonResponse('machine created', 'Machine'),
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('forbidden: not a gym owner'),
          404: errorResponse('no gym found'),
          500: errorResponse('something went wrong'),
        },
      },
      get: {
        tags: ['Machines'],
        summary: "List machines in the signed-in owner's gym",
        description: 'Newest first.',
        security: bearerAuth,
        responses: {
          200: jsonResponse('the machines', 'MachineList'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('forbidden: not a gym owner'),
          404: errorResponse('no gym found'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/machines/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'machine id',
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      get: {
        tags: ['Machines'],
        summary: 'Get one machine',
        security: bearerAuth,
        responses: {
          200: jsonResponse('the machine', 'MachineView'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('forbidden: not a gym owner'),
          404: errorResponse('no gym found / machine not found'),
          500: errorResponse('something went wrong'),
        },
      },
      patch: {
        tags: ['Machines'],
        summary: 'Update a machine',
        description: 'Send only the fields you want to change.',
        security: bearerAuth,
        requestBody: jsonBody('UpdateMachineInput', {
          description: 'Recently serviced',
        }),
        responses: {
          200: jsonResponse('machine updated', 'Machine'),
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('forbidden: not a gym owner'),
          404: errorResponse('no gym found / machine not found'),
          500: errorResponse('something went wrong'),
        },
      },
      delete: {
        tags: ['Machines'],
        summary: 'Delete a machine',
        security: bearerAuth,
        responses: {
          200: jsonResponse('machine deleted', 'DeleteResult'),
          401: errorResponse('missing or invalid token'),
          403: errorResponse('forbidden: not a gym owner'),
          404: errorResponse('no gym found / machine not found'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/profile/me': {
      get: {
        tags: ['Profile'],
        summary: "Get the signed-in user's profile",
        security: bearerAuth,
        responses: {
          200: jsonResponse('the profile', 'Profile'),
          401: errorResponse('missing or invalid token'),
          404: errorResponse('user not found'),
          500: errorResponse('something went wrong'),
        },
      },
      patch: {
        tags: ['Profile'],
        summary: "Update the signed-in user's profile",
        description: 'Send only the fields you want to change.',
        security: bearerAuth,
        requestBody: jsonBody('UpdateProfileInput', {
          fullName: 'John Doe',
        }),
        responses: {
          200: jsonResponse('profile updated', 'Profile'),
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: "List the signed-in user's notifications",
        description: 'Newest first.',
        security: bearerAuth,
        responses: {
          200: jsonResponse('the notifications', 'NotificationList'),
          401: errorResponse('missing or invalid token'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/notifications/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'notification id',
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      delete: {
        tags: ['Notifications'],
        summary: 'Delete a notification',
        description: 'Only notifications belonging to the signed-in user can be deleted.',
        security: bearerAuth,
        responses: {
          200: jsonResponse('notification deleted', 'DeleteResult'),
          401: errorResponse('missing or invalid token'),
          404: errorResponse('notification not found'),
          500: errorResponse('something went wrong'),
        },
      },
    },

    '/notifications/device-token': {
      post: {
        tags: ['Notifications'],
        summary: 'Register a device token for push notifications',
        description:
          'Upserts the token. If it is already registered to another user, it is reassigned to the signed-in user.',
        security: bearerAuth,
        requestBody: jsonBody('SaveDeviceTokenInput', {
          token: 'fcm-device-token-xyz',
        }),
        responses: {
          200: jsonResponse('token saved', 'SuccessResult'),
          400: errorResponse('validation failed'),
          401: errorResponse('missing or invalid token'),
          500: errorResponse('something went wrong'),
        },
      },
    },
  },
}

export default openapiSpec
