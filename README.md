# Smart Rail-Tracking and Anti-Collision System (SRTAC)

An advanced railway management and collision prevention system featuring real-time train tracking, RFID-based signal monitoring, and emergency response capabilities.

## 🚄 Project Overview

The Smart Rail-Tracking and Anti-Collision System (SRTAC) is a comprehensive railway safety and management platform that provides:

- **Real-time Multi-Track Visualization**: Monitor multiple trains across parallel tracks (Track A, B, C) with live position updates
- **RFID-Based Signal System**: 12 RFID modules (A1-A4, B1-B4, C1-C4, including EPC RFID) for precise train detection and signal management
- **Traffic Signal Integration**: Color-coded traffic signals (Safe/Green, Caution/Yellow, Danger/Red) at key track positions
- **Wireless Communication Network**: Visual representation of wireless data transmission between trains and RFID modules
- **Emergency Stop System**: Multi-stage emergency brake system with real-time status notifications
- **Train Control Dashboard**: Individual speed control for each train with animation toggle
- **Signal Zone Management**: Four signal zones (Signal A, B, C, D) with automatic handoff
- **Distance Monitoring**: Real-time distance tracking between trains for collision prevention
- **110V DC Power Supply Indicators**: Infrastructure monitoring for power distribution

## 🎯 Key Features

### Multi-Track System
- Three parallel railway tracks with independent train operations
- Visual track junctions and switching points
- Station and Signal Cabin infrastructure display

### RFID Technology
- 12 strategically placed RFID modules across all tracks
- Active/Passive RFID state indicators
- EPC (Electronic Product Code) RFID integration
- Real-time module status monitoring

### Safety Systems
- **Auto-Brake Alert System**: Automatic speed reduction based on signal status
- **Emergency Stop**: Three-stage emergency brake protocol (Initialization → Braking → Complete Stop)
- **Collision Prevention**: Distance-based warning system
- **Signal Response Automation**: Automatic train response to signal changes

### Communication & Control
- Wireless transmission visualization
- Train-to-infrastructure communication
- Signal flow indicators between RFID modules
- Real-time train identification and tracking

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn-ui components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Notifications**: Sonner toast system

## 🎨 Design System

The project uses a comprehensive dark-themed design system with:
- **Primary Colors**: Rail-safe blue (#00d4ff) for primary trains
- **Secondary Colors**: Orange (#ff9500) and Red (#ff3366) for additional trains
- **Signal Colors**: Green (Safe), Yellow (Caution), Red (Danger)
- **Industrial Theme**: High-contrast dark background for optimal visibility
- **Semantic Tokens**: HSL-based color system for consistent theming

## 📊 System Architecture

### Components
- `RailwayTrack`: Individual track visualization with trains and signals
- `TrainControls`: Speed adjustment and animation control panel
- `SpeedDisplay`: Real-time speed monitoring with visual gauge
- `SignalStatus`: Distance and signal status indicators
- `AutoSignalResponse`: Auto-brake alert system
- `CommunicationPanel`: Train communication and emergency controls

### State Management
- Train positions, speeds, and colors
- Signal states (left/right for each track)
- Emergency stop state
- Animation control state

## 🚀 Getting Started

**URL**: https://lovable.dev/projects/0ebfbefc-5d1c-4df5-9092-bb7dd90ff4ee

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0ebfbefc-5d1c-4df5-9092-bb7dd90ff4ee) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0ebfbefc-5d1c-4df5-9092-bb7dd90ff4ee) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
