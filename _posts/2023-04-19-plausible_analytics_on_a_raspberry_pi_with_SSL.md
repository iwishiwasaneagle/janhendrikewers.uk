---
layout: post
title: Hosting Plausible Analytics On A Raspberry Pi 4 with SSL
description: Learn how to host Plausible, a privacy centric Google Analytics alternative, on your Raspberry Pi 4. This uses nginx, LetsEncrypt, and more for secure hosting.
date: '2023-04-19'
categories: post
usemathjax: false
tags:
  - Self-hosted
  - RPi
  - Analytics
---

Plausible is a great alternative to Google Analytics if you want to havbe the option of analytics but actually respect your users privacy. Along with that bold statement, Plausible actually offers a whole range of benefits:

- Guaranteed to be in the region you expect it to be
  - EU if not self-hosted, else whereever you desire
  - This is especially true for GDPR and other data collection laws
- [Substantially lower script size](https://plausible.io/lightweight-web-analytics#how-do-web-analytics-scripts-affect-the-page-size-and-page-load-time) for faster loading times
- No cookie tracking or other invasive methods used

Now, the fine folks at Plausible have already created amazing documentation on how to get up and running with [plausible/hosting](https://github.com/plausible/hosting/tree/master). However, this uses an outdated docker image that does not support the Raspberry Pi 4. Therefore, we have this wee guide!

## Step 1: The Config Repo

As mentioned above, the original repo does not truly support the RPi4, and until [PR#70](https://github.com/plausible/hosting/pull/70) is merged, you can get a working configuration at my fork: [iwishiwasaneagle/plausible-hosting-rpi](https://github.com/iwishiwasaneagle/plausible-hosting-rpi)

## Step 2: Run it!

This is simple, `cd` into the directory, follow the steps [here](https://plausible.io/docs/self-hosting#2-add-required-configuration) to generate a random secret key, and run `docker compose up -d`

Is that it? Well, technically yes but also no. First of all, head to `http://localhost:8000` and this should outline some issues. Plausible is running perfectly but on `localhost` and without SSL. This means you won't be able to integrate Plausible into your website in any meaningful manner, and not securely.

## Step 3. The Rest Of The Owl

So, we now have a working instance accessible at `http://localhost:8000`. You either need a static IP and a DNS A or AAAA listing pointing at it, ooooor a dynamicDNS service like [DuckDNS](https://duckdns.org). There are millions of resources out there on how to set this up so I won't bother. 

Make sure you have your port `80` (HTTP) and `443` (HTTPS) forwarded (again, millions of tutorials, beyond the scope of this tutorial, blah blah blah) to your Raspberry Pi's local IP address. This is critical to get your SSL certificate.

We will now edit our `docker-compose.yml` to look like:

```yml
version: "3.3"
services:
  mail:
    build: docker-smtp/latest
    restart: always
    networks:
      - internal

  plausible_db:
    # supported versions are 12, 13, and 14
    image: postgres:14-alpine
    restart: always
    networks:
      - internal
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres

  plausible_events_db:
    image: clickhouse/clickhouse-server:22.6-alpine
    restart: always
    networks:
      - internal
    volumes:
      - event-data:/var/lib/clickhouse
      - ./clickhouse/clickhouse-config.xml:/etc/clickhouse-server/config.d/logging.xml:ro
      - ./clickhouse/clickhouse-user-config.xml:/etc/clickhouse-server/users.d/logging.xml:ro
    ulimits:
      nofile:
        soft: 262144
        hard: 262144

  plausible:
    image: plausible/analytics:v1.5
    restart: always
    command: sh -c "sleep 10 && /entrypoint.sh db createdb && /entrypoint.sh db migrate && /entrypoint.sh run"
    networks:
      - expose
      - internal
    depends_on:
      - plausible_db
      - plausible_events_db
      - mail
    env_file:
      - plausible-conf.env
  
  nginx:
    image: nginx
    restart: always
    volumes:
      - ./nginx/:/etc/nginx/conf.d
      - ./data/certbot/conf:/etc/letsencrypt
      - ./data/certbot/www:/var/www/certbot
      - ./nginx/error.log:/var/log/nginx/error.log
    networks:
      - expose
    ports:
      - 80:80
      - 443:443
    environment:
     - NGINX_HOST=127.0.0.1
     - NGINX_PORT=80
    command: "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'"

  certbot:
    image: certbot/certbot
    restart: always
    volumes:
      - ./data/certbot/conf:/etc/letsencrypt
      - ./data/certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  db-data:
    driver: local
  event-data:
    driver: local
  geoip:
    driver: local
  
networks:
  expose:
  internal:
```

The correct usage of the networks us key, otherwise the `nginx` container can't access `plausible` which then won't be accessible over the internet. Now `mkdir` two directories: `nginx` and `data`, and create the following file at `nginx/plausible.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;

    location /.well-known/acme-challenge/ {
      root /var/www/certbot;
    }
    location / {
        return 301 https://$host$request_uri;
    }
    server_name _;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://plausible:8000;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

```

It is now time to get your SSL certificate and to enable HTTPS on your Plausible instance. Download the [`init-letsencrypt.sh`](https://github.com/wmnnd/nginx-certbot/blob/master/init-letsencrypt.sh) and edit it to include your your domain name. Give it execution permissions via 

```bash
chmod +x init-letsencrupt.sh
```

and run it! 

> Be sure to change `BASE_URL` within `plausible-conf.env` to whatever yours is for Plausible to play nicely.


## Step 4. Add script.js To Your `<head>`

```html
<script defer data-domain="yourdomain.com" src="https://yourdomain.com/js/script.js"></script>
```

If you are self-hsoting, which is probably why you're reading this, it is important in my opinion that you **DO NOT** use the script located at `https://https://plausible.io/js/script.js`. You are not paying for any bandwidth, and therefore shouldn't be freeloading. Use Cloudflare or another CDN if your private bandwidth is a concern.

## Conclusion

Plausible was really simple to set up in workflow and I hope this guide has helped you. There are additional things you can consider doing which I'll link below.
What I really appreciate about Plausible is not invading the privacy of the people visiting my website, whilst still giving me insight as to what is going on.

## Additional Tips

- Set `DISABLE_REGISTRATION=invite_only` to disable others from freely creating accounts
- [Enable other extensions](https://plausible.io/docs/script-extensions)
- [Use an integration](https://plausible.io/docs/integration-guides)
- [Set up goals and custom events](https://plausible.io/docs/goal-conversions)