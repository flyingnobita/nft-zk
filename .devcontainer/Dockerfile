# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.245.0/containers/rust/.devcontainer/base.Dockerfile

# [Choice] Debian OS version (use bullseye on local arm64/Apple Silicon): buster, bullseye
ARG VARIANT="buster"
FROM mcr.microsoft.com/vscode/devcontainers/rust:0-${VARIANT}

# [Optional] Uncomment this section to install additional packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
    apt-get -y install --no-install-recommends nlohmann-json3-dev libgmp-dev nasm
RUN git clone https://github.com/iden3/circom.git && \
    cd circom && \
    git checkout tags/v2.0.6 -b v2.0.6 && \
    cargo build --release && \
    cargo install --path circom
