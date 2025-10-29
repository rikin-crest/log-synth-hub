# ParserPilot.ai

A modern web application for intelligent log parsing and mapping configuration generation. ParserPilot.ai helps you analyze log files, generate field mappings, and create parser configurations with an AI-powered workflow.

![ParserPilot.ai](src/assets/Crest_Logo.svg)

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

- **Node.js** >= 18.x
- **npm** or **yarn** or **bun**
- **Python 3.7+** (for GitGuardian Shield)
- **pip** (Python package manager)
- **GitGuardian API Key** (for secret scanning)
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

| Variable              | Description                         | Required | Default   |
| --------------------- | ----------------------------------- | -------- | --------- |
| `VITE_SERVER_PORT`    | Development server port             | ✅ Yes   | `8080`    |
| `VITE_SERVER_HOST`    | Development server host             | ✅ Yes   | `0.0.0.0` |
| `VITE_CERT_KEY_PATH`  | SSL certificate key path            | ✅ Yes   | -         |
| `VITE_CERT_CRT_PATH`  | SSL certificate path                | ✅ Yes   | -         |
| `GITGUARDIAN_API_KEY` | GitGuardian API key for secret scan | ✅ Yes   | -         |

**Note:** Create a `.env` file in the project root, copy the variables from `.env.example` and change the values as per your environment.

**Important:** The GITGUARDIAN_API_KEY is required as it enforces secret scanning on commit. but it is not required to start the application.

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
