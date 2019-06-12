FROM node:10.15.3

ARG PORT=3039
ENV PORT=${PORT}

WORKDIR /home/eosweb
COPY . /home/eosweb

RUN npm install -g pm2
RUN npm install -g @angular/cli@7.1.4
RUN cd /home/eosweb && npm install
RUN cd /home/eosweb && node patch
RUN cd /home/eosweb/server && npm install
RUN cd /home/eosweb && ng build --prod --aot

CMD ["pm2-runtime", "/home/eosweb/server/ecosystem.config.js", "--web"]

EXPOSE ${PORT}
EXPOSE 9615
