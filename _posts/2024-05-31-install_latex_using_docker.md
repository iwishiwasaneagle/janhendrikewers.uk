---
layout: post
title: 'Say No to Latex Bloat: A Docker Approach'
date: 2024-05-31
description: 'Bloating your system with Latex packages?
 Use Docker to create a self-contained environment for Latex, keeping your system clean and lean. This post guides you through building a custom Docker image and using it to call Latex tools from anywhere on your system.' 
tags:
    - LaTex
    - Docker
    - Hack
---

Ever wanted to use Latex but worried about bloating your system with tons of packages? This was the exact situation I found myself in whilst trying to install [TexMaths][texmaths] for [LibreOffice][libreoffice]! I have [used docker-based latex before][latexpapertemplate] through the VSCode extension [LatexWorkshop][latexworkshop] and this has worked very well. So, why not "install" latex directly on my computer? This post will guide you through creating a custom Docker image to keep Latex contained and your system clean.

By using Docker, we can create a self-contained environment with all the Latex packages we need. This way, our main system stays nice and lean. The base image for our custom build is a mere 0.07GB, but after we add Latex packages, it jumps to a whopping 4.05GB. 

## Steps

1.  We'll create a couple of files: [`core.sh`](#coresh) and a [`Dockerfile`](#dockerfile) (found [here](#code)).  We'll stick these in a directory called `/opt/latex`.
2. Give execution rights to `core.sh` by running `chmod +x core.sh` 
3.  Next, we'll create a directory called `/opt/latex/bin` and add this directory to your system's `PATH` environment variable.  This will allow us to call Latex tools from anywhere on our system.
4.  Finally, we'll create symlinks to `core.sh` in `/opt/latex/bin` for any Latex tools we want to use.  For example, we can create a symlink for `pdflatex` with `ln -s /opt/latex/{core.sh,bin/pdflatex}`.

### Extra

Since your entire home directory is mounted, you might wish to increase your security by setting `root` as the owner, and only setting owner as having write permissions. 

```bash
# Set owner and group to root
sudo chown root:root core.sh Dockerfile
# Set chmod permissions to 755
# Owner : read, write, execute
# Group : read, execute
# Public: read, execute
sudo chmod 755 core.sh Dockerfile
```

## How it Works

The `core.sh` script is the brain of the operation.  It checks if a Docker image named `latex:passthrough` exists.  If not, it builds that image using the instructions in the `Dockerfile`.  Then, it calls the desired Latex tool within the Docker container by identifying the symlink basename and passing the arguments to the container. Finally, whilst running the container we give it access to `$PWD` at `/tmp` (our working directory), and `/home` at (shock) `/home` to allow the tools to use relative and absolute file paths. This way, we can use Latex tools as if they were installed on our system, but everything actually happens within the isolated Docker environment.

The `Dockerfile` is pretty straightforward.  It starts with the `ubuntu:23.10` image and installs the `texlive-full` package, which includes everything we need to get started. This is the part where you can add additional packages, such as [`dvisvgm`][dvisvgm].  Finally, it sets the working directory to `/tmp` inside the container.

So, with Docker and a little bit of scripting, we can keep our system clean and whilst harnessing the power of latex!

## Code

### `core.sh`
```bash
#!/bin/sh

TAG="latex:passthrough"

if [ -z "$(docker images -q $TAG 2> /dev/null)" ]; then
    docker build -t $TAG /opt/latex/
fi

ME=$(basename "$0")

docker run --rm -v `pwd`:/tmp -v /home:/home $TAG $ME $@
```

### `Dockerfile`
```dockerfile
FROM ubuntu:23.10

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        texlive-full && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /tmp
```

[docker]: https://www.docker.com/
[dockerhub_ubuntu]: https://hub.docker.com/_/ubuntu
[texmaths]: https://extensions.libreoffice.org/en/extensions/show/texmaths-1/
[libreoffice]: https://www.libreoffice.org/
[latexpapertemplate]: https://github.com/iwishiwasaneagle/LatexPaperTemplate
[latexworkshop]: https://github.com/James-Yu/LaTeX-Workshop/
[dvisvgm]: https://dvisvgm.de/