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

# Start the development server
CMD ["npm", "run", "dev", "--", "-p 3001"]

#
# 🏡 Production Buil
#

FROM node:20-alpine AS build

WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# In order to run `yarn build` we need access to the Nest CLI.
# Nest CLI is a dev dependency.
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
# Copy source code
COPY --chown=node:node --from=dev /app .

# Generate the production build. The build script runs "nest build" to compile the application.
RUN npm run build

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

RUN mkdir .next
RUN chown node:node .next

# Copy public assets from the build stage
# COPY --from=build --chown=node:node /app/public ./public

# Copy the production build from the build stage
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static


ENV PORT 3001
ENV HOSTNAME 0.0.0.0

USER node

CMD ["node", "server.js"]
