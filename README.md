# Coordina

Coordina is a cutting-edge platform designed to revolutionize inter-departmental collaboration at the city level in Indian urban governance. By enabling departments and agencies to share resources, coordinate project timelines, and resolve conflicts efficiently, Coordina bridges the communication gaps that lead to project delays and resource wastage. Our platform integrates advanced technologies to provide a comprehensive solution for streamlined urban project management.

---

## Features

### 1. **Unique Dashboard with Calendar Integration**
- A calendar-based view to track project timelines, milestones, and overlapping tasks.
- Helps departments visualize deadlines and manage inter-departmental dependencies efficiently.

### 2. **Conflicts Mediation Page**
- Centralized space for resolving conflicts between overlapping or interfering projects.
- Integrated discussion forums allow stakeholders to collaborate in real-time.
- Prioritization of emergency projects through effective communication tools.

### 3. **Geospatial Visualization with Map Feature**
- Displays the locations of ongoing and upcoming projects on an interactive city map.
- Enables proactive conflict detection and resource allocation for overlapping project sites.
- Includes advanced GIS data integration planned for future updates.

### 4. **Resource and Data Sharing**
- Departments can share data, technical expertise, and available resources.
- Inventory of resources accessible across departments to avoid duplication and maximize utility.

### 5. **Discussion Forums**
- Dedicated sections for intra-departmental, inter-departmental, and public forums.
- Encourages transparency and citizen engagement.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:
- **Node.js** (version 14 or later)
- **npm** (comes with Node.js)
- **Git**

---

## Installation

Follow these steps to set up the Coordina project on your local machine:

### 1. Clone the Repository
```
git clone https://github.com/Prayas-35/coordina.git
cd coordina
```


### 2. Install Dependencies
```
cd client
npm install
```

### 3. Set Up Environment Variables
- Create a `.env.local`:
  ```
  code .env.local
  ```
  
- Fill in the required environment variables in the `.env.local` file, including MongoDB connection details and API keys.

### 4. Run the Development Server
```
npm run dev
```

### 5. Open the Application
Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

---

## Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Runs the app in development mode.
- **`npm run build`**: Builds the app for production.
- **`npm start`**: Runs the built app in production mode.
- **`npm run lint`**: Lints the codebase.

---

## Project Structure

- **`/main`**: Root folder containing all project files.
- **`/app`**: Contains the main application logic and API routes (Next.js App Router).
- **`/components`**: Reusable React components used across the application.
- **`/public`**: Static files served by Next.js (e.g., images, icons).
- **`/lib`**: Utility functions and helper libraries.
- **`/types`**: TypeScript type definitions.
- **`/hooks`**: Custom hooks used in the application.
- **`/convex`**: Manages data synchronization and real-time collaboration.

---

## Technologies Used

### Frontend:
- **Next.js**: Framework for server-rendered and statically generated React applications.
- **React**: Frontend library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

### Backend:
- **MongoDB**: NoSQL database for storing project and user data.

### Additional Tools:
- **Convex**: Manages data synchronization and real-time collaboration.

---

## Contributing

We welcome contributions to enhance Coordina! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature:
   ```
   git checkout -b feature-name
   ```
   
3. Commit your changes:
   ```
   git commit -m "Description of changes"
   ```
   
4. Push your changes:
   ```
   git push origin feature-name
   ```
   
5. Submit a pull request.

---

## Future Enhancements

- **Advanced Geospatial Visualization**:
  - Integration with real-time GIS data.
  - Enhanced filtering and analytics tools for project planners.

- **Citizen Engagement**:
  - Public dashboards to monitor project progress.
  - Feedback mechanisms for improved transparency.

---

Coordina is more than a tool; it's a leap forward in how cities plan, collaborate, and grow. Join us in transforming urban governance for the better!
