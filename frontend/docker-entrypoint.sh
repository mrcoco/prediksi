#!/bin/sh

# Docker entrypoint script untuk inject environment variables
# ke dalam static HTML files

set -e

echo "Starting EduPro Frontend Docker Container..."

# Default values jika environment variables tidak di-set
EDUPRO_API_URL=${EDUPRO_API_URL:-"http://localhost/api"}
EDUPRO_APP_NAME=${EDUPRO_APP_NAME:-"EduPro"}
EDUPRO_APP_VERSION=${EDUPRO_APP_VERSION:-"1.0.0"}
EDUPRO_DEBUG=${EDUPRO_DEBUG:-"false"}

echo "Environment Variables:"
echo "  EDUPRO_API_URL: $EDUPRO_API_URL"
echo "  EDUPRO_APP_NAME: $EDUPRO_APP_NAME"
echo "  EDUPRO_APP_VERSION: $EDUPRO_APP_VERSION"
echo "  EDUPRO_DEBUG: $EDUPRO_DEBUG"

# Function untuk inject environment variables ke HTML
inject_env_to_html() {
    local html_file="$1"
    
    if [ -f "$html_file" ]; then
        echo "Injecting environment variables to $html_file"
        
        # Create environment variables script
        cat > /tmp/env-config.js << EOF
// Environment variables injected by Docker
window.ENV = {
    'EDUPRO_API_URL': '$EDUPRO_API_URL',
    'EDUPRO_APP_NAME': '$EDUPRO_APP_NAME',
    'EDUPRO_APP_VERSION': '$EDUPRO_APP_VERSION',
    'EDUPRO_DEBUG': '$EDUPRO_DEBUG'
};

console.log('[Docker] Environment variables injected:', window.ENV);
EOF
        
        # Inject script ke dalam HTML sebelum tag </head>
        if grep -q "</head>" "$html_file"; then
            # Backup original file
            cp "$html_file" "${html_file}.backup"
            
            # Insert environment script before </head>
            sed -i '/<\/head>/i\    <script src="/env-config.js"></script>' "$html_file"
            
            echo "Environment variables injected successfully to $html_file"
        else
            echo "Warning: </head> tag not found in $html_file"
        fi
        
        # Copy env-config.js to web root
        cp /tmp/env-config.js /usr/share/nginx/html/env-config.js
        chmod 644 /usr/share/nginx/html/env-config.js
    else
        echo "Warning: $html_file not found"
    fi
}

# Inject environment variables ke semua HTML files
for html_file in /usr/share/nginx/html/*.html; do
    if [ -f "$html_file" ]; then
        inject_env_to_html "$html_file"
    fi
done

# Create nginx configuration untuk handle environment variables
cat > /etc/nginx/conf.d/env-headers.conf << EOF
# Add environment info to response headers (for debugging)
add_header X-EduPro-Version "$EDUPRO_APP_VERSION" always;
add_header X-EduPro-Environment "docker" always;
EOF

echo "Environment injection completed."

# Start nginx
echo "Starting Nginx..."
exec nginx -g "daemon off;" 