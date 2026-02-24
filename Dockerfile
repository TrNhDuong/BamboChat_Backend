# Use Node.js 22 Alpine as base image (stable and lightweight)
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install all dependencies (including devDependencies for nodemon)
RUN npm install --production

# Bundle app source
COPY . .

# Set default port
ARG PORT=5000
ENV PORT=${PORT}

# Expose the dynamic port
EXPOSE ${PORT}

# Command to run the application
CMD [ "npm", "start" ]
