# Use Node.js Alpine as the base image
FROM node:25.2.1

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock first (for better caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the rest of the application files
COPY . .


# Build the application
RUN yarn build

# Change directory to the build folder
WORKDIR /app/build

# Install only production dependencies
RUN yarn install --production

# Expose the necessary port (optional)
EXPOSE 3333

# Run the application
CMD ["node", "bin/server.js"]

