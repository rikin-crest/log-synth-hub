# ParserPilot.ai

A modern web application for intelligent log parsing and mapping configuration generation. ParserPilot.ai helps you analyze log files, generate field mappings, and create parser configurations with an AI-powered workflow.

![ParserPilot.ai](src/assets/Crest_Logo.svg)

## 🌐 Live Demo

**Production**: [https://parserpilot.onrender.com/](https://parserpilot.onrender.com/)

> Deployed on Render.com with automatic deployments from the main branch.

## 🚀 Product Features

- **AI-Powered Log Analysis**: Automatically analyze log files and generate field mappings
- **Interactive Workflow**: Step-by-step guided process for log parsing configuration
- **Real-time Feedback**: Live updates on mapping generation progress via chain of thoughts
- **Configuration Export**: Download generated parser configurations
- **Responsive Design**: Optimized for desktop, laptop and mobile devices
- **Secure Authentication**: Protected routes with JWT-based authentication

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Component library
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component collection
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Icon library
- **GitGuardian Shield** - Secret scanning and prevention

### Build & Optimization

- **Vite Plugin Compression** - Gzip and Brotli compression
- **Code Splitting** - Optimized bundle sizes
- **Lazy Loading** - Component-level code splitting
- **Terser** - JavaScript minification

## 📋 Prerequisites

### Core Requirements
- **Node.js** >= 20.x
- **npm** or **yarn** or **bun**

### For GitGuardian Shield (Optional)
- **Python 3.7+**
- **pip** (Python package manager)
- **GitGuardian API Key** (only needed for pre-commit secret scanning)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd log-synth-hub
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Configure environment variables**

   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # API Configuration
   VITE_API_BASE_URL=https://your-api-server

   # Server Configuration (optional, for vite dev server)
   # VITE_SERVER_PORT=8080
   # VITE_SERVER_HOST=0.0.0.0

   # GitGuardian API KEY (optional, for secret scanning before commit but required to commit)
   GITGUARDIAN_API_KEY=your_git_guardian_api_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The development server will be available at `https://localhost:8080`

5. **Build for production**

   ```bash
   # Create a production build
   npm run build

   # Preview the production build locally
   npm run preview
   ```

   The production build will be available at `http://localhost:4173` by default

## 🔐 Environment Variables

| Variable              | Description                                                                 | Required | Default           |
|-----------------------|-----------------------------------------------------------------------------|----------|-------------------|
| `VITE_API_BASE_URL`   | Base URL for API requests                                                   | ✅ Yes   | `https://your-api-server` |
| `VITE_SERVER_PORT`    | Development server port                                                     | ❌ No    | `8080`            |
| `VITE_SERVER_HOST`    | Development server host                                                     | ❌ No    | `0.0.0.0`         |
| `GITGUARDIAN_API_KEY` | GitGuardian API key for secret scanning (only required for pre-commit hook) | ❌ No    | -                 |

**Note:** Create a `.env` file in the project root, copy the variables from `.env.example` and change the values as per your environment.

## 🔒 Security

### GitGuardian Shield Integration

This repository uses [GitGuardian Shield](https://github.com/GitGuardian/ggshield) to prevent committing sensitive data like API keys, tokens, and credentials.

#### Setup Instructions

1. **Install GitGuardian Shield**

   ```bash
   pip install ggshield
   ```

2. **Authenticate with GitGuardian**
   You can either:
   - Add your GitGuardian API token to your `.env` file:
     ```
     GITGUARDIAN_API_KEY=your_api_key_here
     ```
   - Or use the interactive login:
     ```bash
     ggshield auth login
     ```

3. **Pre-commit Hook**
   A pre-commit hook is already configured to run `ggshield` before each commit to scan for potential secrets.

4. **Manual Scans**
   To manually scan your repository:
   ```bash
   ggshield secret scan repo .
   ```

## 🔑 Authentication

The application uses JWT-based authentication:

1. Users log in with username/password (Basic Auth)
2. Backend returns an access token
3. Token is stored in `localStorage`
4. All API requests include the token in the `Authorization` header
5. Expired tokens trigger automatic redirect to login page

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting (via IDE)
- Consistent naming conventions

## 📦 Production Deployment

### Render.com Deployment (Recommended)

The application is currently deployed on Render.com with automatic deployments.

#### Live URL

- **Production**: [https://parserpilot.onrender.com/](https://parserpilot.onrender.com/)

#### Features

- ✅ Automatic deployments from Git repository
- ✅ Free SSL/TLS certificates
- ✅ Global CDN
- ✅ Zero-downtime deployments
- ✅ Automatic health checks
- ✅ Environment variable management

#### Deployment Steps

1. **Connect Repository**
   - Sign up at [Render.com](https://render.com)
   - Create a new "Static Site" service
   - Connect your GitHub/GitLab repository

2. **Configure Build Settings**

   ```
   Build Command: npm run build
   Publish Directory: dist
   ```

3. **Set Environment Variables**
   - Add `VITE_API_BASE_URL` with your backend API URL

4. **Deploy**
   - Render will automatically build and deploy your application
   - Every push to the main branch triggers a new deployment

#### Custom Domain (Optional)

- Add your custom domain in Render dashboard
- Update DNS records to point to Render
- SSL certificates are automatically provisioned

---

### Docker Deployment with Nginx and HTTPS

This application can be deployed using Docker with Nginx as a reverse proxy and HTTPS support.

#### Prerequisites

- Docker and Docker Compose installed
- SSL certificates (`.crt` and `.key` files)
- Access to ports 80 and 443
- .env file with required variables

#### Directory Structure

```
log-synth-hub/
├── Dockerfile
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── certs/
│   ├── cert.crt    # Your SSL certificate
│   └── cert.key    # Your private key
└── .env
```

#### Setup Instructions

1. **Prepare SSL Certificates**

   Place your SSL certificates in the `certs/` directory:

   ```bash
   mkdir -p certs
   cp /path/to/your/cert.crt certs/
   cp /path/to/your/cert.key certs/
   chmod 600 certs/cert.key
   ```

2. **Configure Environment Variables**

   Create a `.env` file with required variables:

   ```env
   VITE_API_BASE_URL=https://your-backend-api-url
   ```

3. **Build and Start the Container**

   ```bash
   # Build and start in detached mode
   sudo docker-compose up -d --build

   # View logs
   sudo docker-compose logs -f

   # Stop the container
   sudo docker-compose down
   ```

4. **Access the Application**

   The application will be accessible on any IP address or domain pointing to your server:
   - **HTTPS**: `https://YOUR_SERVER_IP:4173` or `https://your-domain.com:4173`
   - **HTTP**: `http://YOUR_SERVER_IP:4174` (will redirect to HTTPS)

   Examples:
   - `https://10.50.1.12:4173`
   - `https://10.50.2.22:4173`
   - `http://10.50.1.12:4174` (redirects to `https://10.50.1.12:4173`)

   **Note**: You can customize the ports in `docker-compose.yml` by changing the port mappings:

   ```yaml
   ports:
     - "4173:443" # External:Internal (HTTPS)
     - "4174:80" # External:Internal (HTTP)
   ```

#### Nginx Configuration

The `nginx/nginx.conf` file handles:

- HTTP to HTTPS redirect
- SSL/TLS configuration
- React Router support (SPA routing)
- Static asset caching
- Security headers

**Generic Server Configuration**: The Nginx configuration uses `server_name _;` which is a catch-all that accepts requests from any IP address or domain name. This means:

- No need to modify the configuration for different server IPs
- Works with `10.50.1.12`, `10.50.2.22`, or any other IP
- Works with any domain name pointing to your server
- Perfect for development and flexible deployment scenarios

#### Firewall Configuration

Ensure the required ports are open:

```bash
sudo ufw allow 4173/tcp   # HTTPS
sudo ufw allow 4174/tcp   # HTTP (redirects to HTTPS)
sudo ufw status
```

**Note**: If you're using standard ports (80/443), use:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

#### Troubleshooting

1. **Check container status**

   ```bash
   sudo docker ps
   sudo docker logs parserpilot-ui
   ```

2. **Test Nginx configuration**

   ```bash
   sudo docker exec parserpilot-ui nginx -t
   ```

3. **View Nginx logs**

   ```bash
   sudo docker exec parserpilot-ui cat /var/log/nginx/error.log
   ```

4. **Restart container**
   ```bash
   sudo docker-compose restart
   ```

#### SSL Certificate Options

1. **Self-Signed Certificate** (Development)

   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout certs/cert.key -out certs/cert.crt
   ```

2. **Let's Encrypt** (Production - Recommended)
   ```bash
   sudo apt install certbot
   sudo certbot certonly --standalone -d your-domain.com
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem certs/cert.crt
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem certs/cert.key
   ```

#### Performance Optimization

The Docker setup includes:

- Multi-stage builds for smaller image size
- Gzip and Brotli compression
- Static asset caching
- Optimized Nginx configuration
- Log rotation

### Traditional Deployment

1. Build the production assets:

   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory. You can serve these files using any static file server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0

- Initial release
- AI-powered log parsing workflow
- Responsive design implementation
- Authentication system
- Environment-based configuration
- Performance optimizations

---

Built with ❤️ by the Crest Team
