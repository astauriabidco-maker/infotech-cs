# Use Node.js 22.12
FROM node:22.12-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Angular app
RUN npm run build:prod

# Expose port
EXPOSE 4200

# Start server
CMD ["node", "server.js"]
