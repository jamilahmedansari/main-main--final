# =============================================================================
# Talk-To-My-Lawyer Development Container
# Optimized for Next.js 16 + Supabase + Stripe
# =============================================================================

FROM node:22.21.1-slim

ENV DEBIAN_FRONTEND=noninteractive

# -----------------------------
# Base packages
# -----------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    sudo \
    build-essential \
    python3 \
    vim \
    jq \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Docker CLI + Compose plugin (single install)
# -----------------------------
RUN install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" \
        > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends docker-ce-cli docker-compose-plugin \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# GitHub CLI
# -----------------------------
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
      | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
      > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends gh \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Supabase CLI
# -----------------------------
RUN curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh

# -----------------------------
# Stripe CLI
# -----------------------------
RUN curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public \
      | gpg --dearmor \
      | tee /usr/share/keyrings/stripe.gpg > /dev/null \
    && echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" \
      > /etc/apt/sources.list.d/stripe.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends stripe \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Node tooling
# -----------------------------
RUN npm install -g npm@latest pnpm@latest vercel@latest netlify-cli@latest

# -----------------------------
# Create developer user (with stable UID/GID)
# IMPORTANT: Make /workspace writable by developer
# -----------------------------
ARG USERNAME=developer
ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd -m -s /bin/bash --uid ${USER_UID} --gid ${USER_GID} ${USERNAME} \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
    && groupadd -f docker \
    && usermod -aG docker ${USERNAME} \
    && mkdir -p /workspace \
    && chown -R ${USERNAME}:${USERNAME} /workspace \
    && mkdir -p /home/${USERNAME}/.local/share/pnpm \
    && chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}

# Environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME=/home/developer/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

# Switch to developer
USER developer
WORKDIR /workspace

# Nice prompt + aliases (optional but handy)
RUN echo '\n\
alias dev="pnpm dev"\n\
alias build="pnpm build"\n\
alias lint="pnpm lint"\n\
alias start="pnpm start"\n\
' >> /home/developer/.bashrc \
    && touch /home/developer/.sudo_as_admin_successful

CMD ["bash"]