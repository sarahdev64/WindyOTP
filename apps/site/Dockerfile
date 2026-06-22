# =========================================
# Stage 1: Build the Vue.js Application
# =========================================
FROM node:24-alpine3.23 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json* ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the application source code into the container
COPY . .

# Build the Vue.js application
RUN npm run build

# =========================================
# Stage 2: Serve the Vue.js Application
# =========================================

FROM node:24-alpine3.23 AS runner

# Set the working directory
WORKDIR /app

# Define a default port
ARG PORT=8080
ENV PORT=${PORT}

# Copy the build output from the builder stage
COPY --from=builder /app/dist /app/dist

# Expose the port defined in ENV
EXPOSE ${PORT}

# Use npx serve to host the application
# --single flag is often used for SPA (Single Page Applications) to redirect all requests to index.html
ENTRYPOINT ["sh", "-c", "npx serve -s dist -l ${PORT}"]
