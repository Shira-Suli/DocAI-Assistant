# Stage 1: Build the app using Node.js
FROM node:20 as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Build the frontend (Vite/React/whatever)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy the production build to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
