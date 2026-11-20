# Stufe 1: mit Node bauen
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Im Container spricht das Frontend mit dem Quarkus-Backend
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stufe 2: statische Dateien mit nginx ausliefern
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
