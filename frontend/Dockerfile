# Base stage: Node (למקרה שיש תלותיות npm)
FROM node:20 as base
WORKDIR /app

# העתק package.json אם יש תלותיות
COPY package*.json ./
RUN npm install

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# העתק את כל הקבצים ל-Nginx
COPY --from=base /app .

# חשוף פורט
EXPOSE 80

# הפעלת Nginx
CMD ["nginx", "-g", "daemon off;"]