FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]