---
layout: post
title: Upgrading from Paperless-NG to Paperless-NGX
date: "2022-03-21"
categories: post
tags:
  - paperless-ng
  - raspberry-pi
  - paperless-ngx
---

As of February 2022, the paperless-ng community created a [new fork][paperless-ngx] to continue development due to the inactivity on the [original repo][jonaswinkler-ng] [^1]. This has meant new docker images, new configs, etc.

This post serves as a quick amendment to my previous posts on how to set up paperlessng on [a raspberry pi with samba][paperless-ng-on-locally-hosted-pi] and with [automated backups using rclone][paperless-ng-with-automated-backups].

{% include toc.md %}

## New Docker Containers

In theory, this should be a plug-and-play update as the image is identical except for the new software updates. The biggest difference is that the [old image][old-docker] was hosted on [dockerhub](https://hub.docker.com) and the [new image][new-docker] is hosted on the [github container registry][ghcr-io] (as per [#104][pr-104]).

```diff
150c150
<     image: jonaswinkler/paperless-ng:latest
---
>     image: ghcr.io/paperless-ngx/paperless-ngx:latest
```

## New Best Practices For Redis Broker

As of [v1.6.0][v1.6.0], it is suggested to use [named volumes][named-volumes-commit] for the redis broker.

```diff
147a148,149
>     volumes:
>       - redisdata:/data
227a230,232
>
>   volumes:
>     redisdata
```

I personally haven't bothered with this, as redis is meant to be a cache and not permanent storage.

## In Action

And just like that, I've upgrade from Paperless-NG 1.5.0 to Paperless-NGX 1.6.0. So far I can't really notice any major differences _but that's the point_. It's a continuation of the project, not an entirely new version!

```bash
ubuntu@ubuntu:~/paperless$ vim docker-compose.yml
ubuntu@ubuntu:~/paperless$ docker-compose stop paperless
Stopping paperless ... done
ubuntu@ubuntu:~/paperless$ docker-compose up --no-deps --build paperless
279a020076a7: Pull complete
...
5624cdf6a4f1: Pull complete
Digest: sha256:f2f2d77cb7898a338314a59103b1b403807a7fa479b78489edb0ebb8de477d15
Status: Downloaded newer image for ghcr.io/paperless-ngx/paperless-ngx:latest
Recreating paperless ... done
Attaching to paperless
paperless                 | Paperless-ngx docker container starting...
paperless                 | Creating directory /tmp/paperless
...
```

## _Fin._

That's it for **now**. I'm involved in a [PR #27][pr-27] to use a [Apache Tika][apache-tika-arm] container with ARM support. Once that gets merged I will probably update this post, as well as create a new and more in-depth longer one.

And remember, always create a backup before changing your system! I have my [rlcone setup][paperless-ng-with-automated-backups] but still like doing a quick `tar -czvf paperless paperless.tar.gz` before an upgrade _just in case_.

---

[^1]: Discussions can be found in [#1599](https://github.com/jonaswinkler/paperless-ng/issues/1599) and [#1632](https://github.com/jonaswinkler/paperless-ng/issues/1632).

[paperless-ng-with-automated-backups]: {% post_url 2021-10-03-scheduled-off-site-backups-for-paperless-ng-using-rclone %}
[paperless-ng-on-locally-hosted-pi]: {% post_url 2021-09-25-paperless-ng_on_localy_hosted_rpi %}

[paperless-ngx]: https://github.com/paperless-ngx/paperless-ngx
[jonaswinkler-ng]: https://github.com/jonaswinkler/paperless-ng
[old-docker]: https://hub.docker.com/r/jonaswinkler/paperless-ng
[new-docker]: https://github.com/paperless-ngx/paperless-ngx/pkgs/container/paperless-ngx
[v1.6.0]: https://github.com/paperless-ngx/paperless-ngx/releases/tag/ngx-1.6.0
[named-volumes-commit]: https://github.com/paperless-ngx/paperless-ngx/commit/bad4be4cbc7254611e720bad8fca4517f24fe210
[pr-104]: https://github.com/paperless-ngx/paperless-ngx/pull/104
[ghcr-io]: https://github.com/features/packages
[pr-27]: https://github.com/paperless-ngx/paperless-ngx/pull/27
[apache-tika-arm]: https://github.com/iwishiwasaneagle/tika-docker
