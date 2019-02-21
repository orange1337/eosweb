FROM node:9.11.2

ARG PORT=3039
ENV PORT=${PORT}

RUN apt-get update \
	&& apt-get install -y nodejs npm git git-core \
    && ln -s /usr/bin/nodejs /usr/bin/node

ARG PM2_KEY=key
ENV PM2_PUBLIC_KEY=${PM2_KEY}

ARG PM2_SECRET=secret
ENV PM2_SECRET_KEY=${PM2_SECRET}

WORKDIR /home/eosweb
COPY . /home/eosweb

RUN npm install -g pm2
RUN npm install -g @angular/cli@1.7.1
RUN cd /home/eosweb && npm install
RUN cd /home/eosweb/server && npm install
RUN cd /home/eosweb && ng build --prod
RUN cd /home/eosweb/server && mkdir logs

CMD ["pm2-runtime", "/home/eosweb/server/ecosystem.config.js"]

EXPOSE ${PORT}
