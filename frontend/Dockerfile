# Stage 1: Build the Angular application
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

# Install dependencies (ignoring scripts to avoid potential errors in build environment if any)
RUN npm install --ignore-scripts

COPY . .

# Run the build command - adjust output path if angular.json differs
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
# Note: Check angular.json regarding outputPath. usually dist/<project-name>/browser
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy a custom nginx config if we had one, but default checks index.html
# For SPA routing, we might need a custom config, but let's try basic first.
# To support deep linking, we usually need try_files.
# Let's add a simple default.conf
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
