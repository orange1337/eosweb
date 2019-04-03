FROM node:10.15.3

ARG PORT=3039
ENV PORT=${PORT}

ARG PM2_KEY=key
ENV PM2_PUBLIC_KEY=${PM2_KEY}

ARG PM2_SECRET=secret
ENV PM2_SECRET_KEY=${PM2_SECRET}

WORKDIR /home/eosweb
COPY . /home/eosweb

RUN npm install -g pm2
RUN npm install -g @angular/cli@1.7.1
RUN cd /home/eosweb && npm install
RUN cd /home/eosweb && ng build --prod
RUN cd /home/eosweb/server && mkdir logs

CMD ["pm2-runtime", "/home/eosweb/server/ecosystem.config.js", "--web"]

EXPOSE ${PORT}
EXPOSE 9615
