FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Copy project's metadata file
COPY package*.json ./

# Install Dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose application port
EXPOSE 3400

# Start Express web server
CMD [ "node", "server.js" ]
