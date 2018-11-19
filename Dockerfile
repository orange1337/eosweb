FROM node:9.11.2

ENV PORT 3039

ENV PM2_PUBLIC_KEY nqwh7iksuc5x48a
ENV PM2_SECRET_KEY okw520hvcl09lqd

RUN apt-get update \
	&& apt-get install -y nodejs npm git git-core \
    && ln -s /usr/bin/nodejs /usr/bin/node

# Adding sources
WORKDIR /home/eosweb
COPY . /home/eosweb

RUN cd /home/eosweb && npm install -g @angular/cli@1.7.1
RUN npm install pm2 -g
RUN cd /home/eosweb && npm install
RUN cd /home/eosweb && ng build --prod
RUN cd /home/eosweb && mkdir server/logs

CMD [ "pm2-runtime", "/home/eosweb/server/server.js" ]

EXPOSE 3039
EXPOSE 3001