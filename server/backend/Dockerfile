#
# 🧑‍💻 Development
#
FROM node:20-alpine AS dev

# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV dev

# Copy pacakge & package-lock files
COPY --chown=node:node package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code into app folder
COPY --chown=node:node . .

RUN npx prisma generate


# Start the development server
CMD ["npm", "run", "start:dev"]

#
# 🏡 Production Build
#
FROM node:20-alpine AS build

WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# In order to run `yarn build` we need access to the Nest CLI.
# Nest CLI is a dev dependency.
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
# Copy source code
COPY --chown=node:node . .

# Generate the production build. The build script runs "nest build" to compile the application.
RUN npm run  build

# Install only the production dependencies and clean cache to optimize image size.
RUN npm ci --only=production && npm cache clean --force

# Set Docker as a non-root user
USER node

#
# 🚀 Production Server
#
FROM node:20-alpine AS prod

WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Copy only the necessary files
COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules

# Set Docker as non-root user
USER node

CMD ["node", "dist/main.js"]