#!/bin/bash

# Setup Environment Variables untuk EduPro
# Script helper untuk memudahkan konfigurasi environment

set -e

echo "🚀 EduPro Environment Setup"
echo "=================================="

# Function untuk membuat file .env
create_env_file() {
    local env_type="$1"
    local filename="$2"
    
    echo "📝 Membuat file $filename untuk environment: $env_type"
    
    case $env_type in
        "development")
            cat > "$filename" << 'EOF'
# Frontend Configuration - Development
EDUPRO_API_URL=http://backend:8000/api
EDUPRO_APP_NAME=EduPro Dev
EDUPRO_APP_VERSION=1.0.0-dev
EDUPRO_DEBUG=true
EOF
            ;;
        "staging")
            cat > "$filename" << 'EOF'
# Frontend Configuration - Staging
EDUPRO_API_URL=https://api-staging.yourdomain.com/api
EDUPRO_APP_NAME=EduPro Staging
EDUPRO_APP_VERSION=1.0.0-staging
EDUPRO_DEBUG=true
EOF
            ;;
        "production")
            cat > "$filename" << 'EOF'
# Frontend Configuration - Production
EDUPRO_API_URL=https://api.yourdomain.com/api
EDUPRO_APP_NAME=EduPro
EDUPRO_APP_VERSION=1.0.0
EDUPRO_DEBUG=false
EOF
            ;;
        *)
            cat > "$filename" << 'EOF'
# Frontend Configuration - Default
EDUPRO_API_URL=http://backend:8000/api
EDUPRO_APP_NAME=EduPro
EDUPRO_APP_VERSION=1.0.0
EDUPRO_DEBUG=true
EOF
            ;;
    esac
    
    echo "✅ File $filename berhasil dibuat"
}

# Function untuk validasi environment variables
validate_env() {
    local env_file="$1"
    
    echo "🔍 Validating environment variables in $env_file..."
    
    if [ ! -f "$env_file" ]; then
        echo "❌ File $env_file tidak ditemukan"
        return 1
    fi
    
    # Check required variables
    local required_vars=("EDUPRO_API_URL" "EDUPRO_APP_NAME" "EDUPRO_APP_VERSION" "EDUPRO_DEBUG")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$env_file"; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo "❌ Missing required variables: ${missing_vars[*]}"
        return 1
    fi
    
    echo "✅ All required variables found"
    return 0
}

# Function untuk test docker-compose config
test_docker_compose() {
    echo "🧪 Testing docker-compose configuration..."
    
    if command -v docker-compose >/dev/null 2>&1; then
        if docker-compose config >/dev/null 2>&1; then
            echo "✅ Docker Compose configuration is valid"
        else
            echo "❌ Docker Compose configuration is invalid"
            echo "Run 'docker-compose config' for details"
            return 1
        fi
    else
        echo "⚠️  docker-compose not found, skipping validation"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "Pilih environment yang ingin di-setup:"
    echo "1) Development (default)"
    echo "2) Staging"
    echo "3) Production"
    echo "4) Custom"
    echo "5) Validate existing .env"
    echo "6) Test docker-compose config"
    echo "7) Show current .env"
    echo "8) Exit"
    echo ""
}

# Function untuk menampilkan .env saat ini
show_current_env() {
    if [ -f ".env" ]; then
        echo "📄 Current .env file:"
        echo "===================="
        cat .env
        echo "===================="
    else
        echo "❌ File .env tidak ditemukan"
    fi
}

# Function untuk custom setup
custom_setup() {
    echo "🛠️  Custom Environment Setup"
    echo "============================="
    
    read -p "API URL [http://backend:8000/api]: " api_url
    api_url=${api_url:-"http://backend:8000/api"}
    
    read -p "App Name [EduPro]: " app_name
    app_name=${app_name:-"EduPro"}
    
    read -p "App Version [1.0.0]: " app_version
    app_version=${app_version:-"1.0.0"}
    
    read -p "Debug Mode [true]: " debug_mode
    debug_mode=${debug_mode:-"true"}
    
    cat > .env << EOF
# Frontend Configuration - Custom
EDUPRO_API_URL=$api_url
EDUPRO_APP_NAME=$app_name
EDUPRO_APP_VERSION=$app_version
EDUPRO_DEBUG=$debug_mode
EOF
    
    echo "✅ Custom .env file berhasil dibuat"
}

# Main script
main() {
    # Check if we're in the right directory
    if [ ! -f "docker-compose.yml" ]; then
        echo "❌ docker-compose.yml tidak ditemukan"
        echo "Pastikan Anda menjalankan script ini di root directory project"
        exit 1
    fi
    
    while true; do
        show_menu
        read -p "Pilihan [1]: " choice
        choice=${choice:-1}
        
        case $choice in
            1)
                create_env_file "development" ".env"
                validate_env ".env"
                test_docker_compose
                break
                ;;
            2)
                create_env_file "staging" ".env"
                validate_env ".env"
                test_docker_compose
                break
                ;;
            3)
                create_env_file "production" ".env"
                validate_env ".env"
                test_docker_compose
                break
                ;;
            4)
                custom_setup
                validate_env ".env"
                test_docker_compose
                break
                ;;
            5)
                validate_env ".env"
                ;;
            6)
                test_docker_compose
                ;;
            7)
                show_current_env
                ;;
            8)
                echo "👋 Goodbye!"
                exit 0
                ;;
            *)
                echo "❌ Pilihan tidak valid"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
    
    echo ""
    echo "🎉 Setup selesai!"
    echo ""
    echo "Next steps:"
    echo "1. Review file .env yang telah dibuat"
    echo "2. Jalankan: docker-compose up --build"
    echo "3. Test konfigurasi: http://localhost/test-config.html"
    echo ""
}

# Run main function
main "$@" 