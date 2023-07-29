FROM node:18-buster

WORKDIR /app
ARG STAGE
ENV STAGE=${STAGE}
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY tsconfig.json ./tsconfig.json
COPY src ./src
COPY envs/.env.$STAGE ./envs/.env.$STAGE

RUN mkdir build && npm i && npm run build
CMD ["npm", "run", "start"]