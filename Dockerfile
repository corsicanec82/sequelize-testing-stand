FROM node:12.14

ARG USER_ID=$USER_ID
ARG GROUP_ID=$GROUP_ID
ARG USERNAME=$USERNAME

RUN grep :$GROUP_ID: /etc/group &>/dev/null || groupadd --gid $USER_ID $USERNAME
RUN id -u $USERNAME &>/dev/null || useradd -o --uid $USER_ID --gid $GROUP_ID --shell /bin/bash $USERNAME
RUN mkdir -p /home/$USERNAME/app && chown -R $USER_ID:$GROUP_ID /home/$USERNAME

RUN npm install -g npm-check-updates

WORKDIR /home/$USERNAME/app
ENV HOME=/home/$USERNAME
