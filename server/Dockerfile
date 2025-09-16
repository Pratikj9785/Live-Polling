# Use Node 20 LTS
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (leverage Docker layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy source
COPY src ./src

# Expose the app port (Railway will set PORT env)
EXPOSE 4000

# Start the server
CMD ["node", "src/index.js"]
