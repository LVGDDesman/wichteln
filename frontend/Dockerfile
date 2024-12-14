FROM node:latest

CMD mkdir /home/node/frontend
COPY ./ /home/node/frontend/

EXPOSE 5173
WORKDIR /home/node/frontend

ENTRYPOINT npm run prod