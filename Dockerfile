FROM node:lts-alpine3.12

ENV NODE_ENV "production"
ENV DUMB_INIT_VERSION "1.2.4"

# Create app directory
WORKDIR /usr/src/app

# Install dumb-init
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v$DUMB_INIT_VERSION/dumb-init_${DUMB_INIT_VERSION}_x86_64
RUN chmod +x /usr/local/bin/dumb-init

# Yarn configurations
COPY .yarnrc ./

# Yarn cache and releases
COPY .yarn .yarn/

# App dependencies configurations
COPY package.json yarn.lock ./

# Check yarn configurations and cache
RUN yarn --frozen-lockfile --check-files

# Bundle app source
COPY . .

# Startup checks and graceful shutdown of Node.js services running in Kubernetes.
EXPOSE 9000

# Start the app
CMD ["dumb-init", "node", "index.js"]
