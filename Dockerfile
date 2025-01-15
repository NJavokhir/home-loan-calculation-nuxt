# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json /app
COPY package-lock.json /app
RUN npm install

# Copy the current directory contents into the container at /app
COPY . /app

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev"]
