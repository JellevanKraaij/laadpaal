# Use Node.js 20 Alpine
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install the dependencies using npm ci (ci is similar to install, but it's used for automated environments like Docker)
RUN npm ci

# Copy the rest of the files (excluding the ones in .dockerignore (node_modules, etc.))
COPY . .

# Generate the Prisma client
RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]