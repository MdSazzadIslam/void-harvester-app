# Asteroid Mining System

This project simulates an asteroid mining system. The system can load asteroid data from a YAML file, calculate daily resource yields, and manage resource orders.

## Project Structure

- **Domain/Model Layer**
   models/:  Defines the data structures.

- **Presentation Layer**
   controllers/: Handles incoming HTTP requests and sends responses.
   routes/: Defines the routing of the application, mapping URLs to controllers.
   middleware/: Contains custom middleware functions that preprocess requests.

- **Application/Bussiness Logic Layer**
   Services/: Encapsulates the business logic and interacts with models and controllers.

- **Infrastructure Layer**
   config/:  Manages configuration files, including app setup, Swagger configuration and environment variables.
   utils/: Contains utility functions like YAML file loading and yield calculation.
   middleware/: Contains custom middleware functions that preprocess requests.

- **Cross-Cutting Concerns**
   tests/:  Contains all tests, categorized by layer to ensure proper testing.
   gitignore/: Specifies which files and directories to ignore in Git, applicable across all layers.
   package.json/: Contains metadata about the project and its dependencies, relevant to the entire project.
   README.md/: Project documentation.

- **src/index.ts**: Entry point for the application.


## Getting Started

### Prerequisites

- Node.js
- Express.js

### Installation

1. Clone the repository

   ```bash
   https://github.com/MdSazzadIslam/void-harvester-app.git

2. Install dependencies:

   ```bash
   npm install

3. Folder structure

   ```bash
   src/
   ├── app.ts                  # Entry point for starting the application
   ├── index.ts                # Main entry point for initializing the application
   │
   ├── config/                 # Configuration files
   │   └── index.ts            # Main configuration file
   │
   ├── controllers/            # Controllers handling HTTP requests
   │   ├── resourceController.ts
   │   └── orderController.ts
   │
   ├── data/                   # Static data files
   │   └── asteroids.yml       # Initial asteroid data
   │
   ├── middlewares/            # Middleware functions
   │   └── orderValidator.ts   # Request validation middleware
   │
   ├── models/                 # Data models or entities
   │   ├── asteroids.ts
   │   ├── order.ts
   │   └── resource.ts
   │
   ├── routes/                 # Route handlers
   │   ├── orderRoute.ts
   │   ├── resourceRoute.ts
   │   └── routeBinder.ts      # Route binding and configuration
   │
   ├── services/               # Business logic services
   │   ├── resourceService.ts
   │   └── orderService.ts
   │
   └── utils/                  # Utility functions
      ├── yamlLoader.ts       # YAML file loading utility
      ├── rateLimiter.ts      # Rate limiting utility
      ├── logger.ts           # Logging utility
      └── calculation.ts      # Calculation functions


Don't forget to give this repo a ⭐ if you like and want to appreciate my efforts
