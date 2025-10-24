# ParserPilot.ai - Log Synthesis Hub

A modern web application for intelligent log parsing and mapping configuration generation. ParserPilot.ai helps you analyze log files, generate field mappings, and create parser configurations with an AI-powered workflow.

![ParserPilot.ai](src/assets/Crest_Logo.svg)

## 🚀 Features

- **AI-Powered Log Analysis**: Automatically analyze log files and generate field mappings
- **Interactive Workflow**: Step-by-step guided process for log parsing configuration
- **Real-time Feedback**: Live updates on mapping generation progress via chain of thoughts
- **Configuration Export**: Download generated parser configurations
- **Responsive Design**: Optimized for desktop and mobile devices
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

### Build & Optimization
- **Vite Plugin Compression** - Gzip and Brotli compression
- **Code Splitting** - Optimized bundle sizes
- **Lazy Loading** - Component-level code splitting
- **Terser** - JavaScript minification

## 📋 Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **bun**
- SSL certificates (for HTTPS development server)

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
   VITE_API_BASE_URL=https://your-api-server:port
   
   # Server Configuration (for Vite dev server)
   VITE_SERVER_PORT=8080
   VITE_SERVER_HOST=0.0.0.0
   VITE_CERT_KEY_PATH=/path/to/cert.key
   VITE_CERT_CRT_PATH=/path/to/cert.crt
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `https://localhost:8080`

## 🏗️ Build

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build
```

Build output will be in the `dist/` directory.

## 🐳 Docker Deployment

### Prerequisites
Ensure you have a `.env` file in the project root with all required environment variables before building.

### Build Docker Image
```bash
docker build -t parserpilot-frontend:latest .
```

### Run Docker Container
```bash
docker run -d \
  -p 8080:80 \
  --name parserpilot \
  parserpilot-frontend:latest
```

### Run with Docker Compose
```bash
docker-compose up -d
```

The application will be available at `http://localhost:8080`

**Note:** The Docker container serves the built static files via nginx on HTTP (port 80 internally, mapped to 8080). HTTPS is handled by the Vite dev server for local development only.

## 📁 Project Structure

```
log-synth-hub/
├── public/              # Static assets
├── src/
│   ├── api/            # API client functions
│   │   ├── api.ts      # API configuration
│   │   ├── auth.ts     # Authentication API
│   │   └── workflow.ts # Workflow API
│   ├── assets/         # Images and static files
│   ├── components/     # React components
│   │   ├── ui/         # Reusable UI components
│   │   └── ...         # Feature components
│   ├── config/         # Configuration files
│   │   └── env.ts      # Environment variables
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── .env                # Environment variables (not in git)
├── .env.example        # Environment template
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── nginx.conf          # Nginx configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies
```

## 🔐 Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client.

**⚠️ All environment variables are required. The application will not start without them.**

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | ✅ Yes |
| `VITE_SERVER_PORT` | Dev server port | ✅ Yes |
| `VITE_SERVER_HOST` | Dev server host | ✅ Yes |
| `VITE_CERT_KEY_PATH` | SSL certificate key path | ✅ Yes |
| `VITE_CERT_CRT_PATH` | SSL certificate path | ✅ Yes |

## 🔑 Authentication

The application uses JWT-based authentication:

1. Users log in with username/password (Basic Auth)
2. Backend returns an access token
3. Token is stored in `localStorage`
4. All API requests include the token in the `Authorization` header
5. Expired tokens trigger automatic redirect to login page

## 🎨 Key Features

### Workflow Management
- Start new log parsing workflows
- Resume existing workflows
- View real-time progress updates
- Download generated configurations

### Responsive Design
- Desktop-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly UI elements
- Optimized for mobiles and tablets

### Performance Optimization
- Code splitting and lazy loading
- Gzip and Brotli compression
- Optimized bundle sizes (85% reduction)
- Efficient caching strategies

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

### Using Docker

1. Ensure `.env` file is configured with all required variables

2. Build the production image:
   ```bash
   docker build -t parserpilot-frontend:latest .
   ```

3. Run the container:
   ```bash
   docker run -d \
     -p 8080:80 \
     --name parserpilot \
     parserpilot-frontend:latest
   ```

**Important:** Environment variables are baked into the build at build-time. If you need to change configuration, rebuild the Docker image with updated `.env` file.

### Using Nginx

The project includes an `nginx.conf` for serving the built application:

```bash
npm run build
cp -r dist/* /var/www/html/
# Configure Nginx with the provided nginx.conf
```

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
- Docker deployment support
- Performance optimizations

---

Built with ❤️ by the Crest Team
