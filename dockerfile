## Stage 1: Build step
FROM node:16-alpine as node-typescript-starter-builder
WORKDIR /usr/app

# Copy package.json and package-lock.json if exists
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN yarn run build

## Stage 2: Application runtime
FROM node:16-alpine
WORKDIR /app

# Set environment variables
ENV NODE_ENV production

# Copy package.json and install production dependencies
COPY package.json ./
RUN yarn install --prod

# Copy built TypeScript output from the first stage
COPY --from=node-typescript-starter-builder /usr/app/dist /app/dist

# Copy your YAML file into the container
COPY src/data/asteroids.yml /app/data/asteroids.yaml

# Expose port 80 (assuming your app listens on port 80)
EXPOSE 80

# Command to start your application
CMD ["yarn", "start"]
