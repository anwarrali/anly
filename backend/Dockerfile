# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies (for nodemon)
RUN npm install

# Copy source code
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
