FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including tsx)
RUN npm ci

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Run database migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
