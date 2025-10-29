# Build stage
FROM node:24 as build

WORKDIR /app
COPY package*.json ./
COPY .env .
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Copy SSL certificates (for development, in production use volumes)
COPY ./certs/cert.crt /etc/nginx/ssl/cert.crt
COPY ./certs/cert.key /etc/nginx/ssl/cert.key

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Expose both HTTP and HTTPS ports
EXPOSE 80
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]