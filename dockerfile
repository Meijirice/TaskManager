# -------------------------
# Stage 1: Build React frontend
# -------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Copy frontend package.json and install dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy frontend code and build
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# -------------------------
# Stage 2: Setup backend
# -------------------------
FROM node:20-alpine
WORKDIR /app

# Copy backend package.json and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend code
COPY backend/ ./backend/

# Copy React build into backend folder
COPY --from=build /app/frontend/build ./backend/frontend/build

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start backend
CMD ["node", "backend/server.js"]
