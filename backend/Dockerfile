FROM node:24

WORKDIR /home/node/backend

# Install dependencies inside the image (native modules like bcrypt are built for this platform)
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN chown -R node:node /home/node/backend

USER node
EXPOSE 3000

# config.json is mounted at runtime to /home/node/backend/src/config.json
CMD ["npx", "ts-node", "--transpile-only", "./src/server.ts"]
