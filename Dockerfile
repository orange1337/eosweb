FROM node:8.1

ENV PORT 3039

RUN apt-get update \
	&& apt-get install -y nodejs npm git git-core \
    && ln -s /usr/bin/nodejs /usr/bin/node

# Adding sources
WORKDIR /home/eosweb
COPY . /home/eosweb

RUN cd /home/eosweb && npm install -g @angular/cli@1.7.1
RUN cd /home/eosweb && npm install
RUN cd /home/eosweb && ng build --prod
RUN cd /home/eosweb && mkdir server/logs

CMD [ "node", "/home/eosweb/server/server.js" ]

EXPOSE 3039