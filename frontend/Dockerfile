FROM nginx:alpine

# Install required packages
RUN apk add --no-cache bash

# Copy application files
COPY . /usr/share/nginx/html

# Copy and set permissions for entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]