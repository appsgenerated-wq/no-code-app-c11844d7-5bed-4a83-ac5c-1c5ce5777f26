# FlavorFusion: A Manifest-Powered Food Discovery App

This is a complete full-stack application built with React and Manifest. It serves as a platform for users to discover restaurants, browse menus, and leave reviews.

## Core Features

- **User Authentication**: Secure user sign-up and login, powered by Manifest's `authenticable` feature.
- **Restaurant Management**: Users can create and manage their own restaurant listings.
- **Menu Creation**: Restaurant owners can add and update menu items, complete with photos, prices, and categories.
- **Image Uploads**: Sophisticated image handling for restaurant covers, menu item photos, and user profiles, using Manifest's `type: image`.
- **Rich Data Types**: Utilizes various Manifest types like `money` for prices and `choice` for categories.
- **Role-Based Access**: Differentiates between regular users and administrators, with policies managed by Manifest.
- **Admin Panel**: A built-in admin interface at `/admin` for complete data management.

## Getting Started

### 1. Run the Backend

The Manifest backend is deployed automatically. You can access the Admin Panel using the credentials provided during setup.

- **Admin URL**: [YOUR_BACKEND_URL]/admin
- **Default Admin**: `admin@manifest.build` / `admin`
- **Demo User**: `user@manifest.build` / `password`

### 2. Run the Frontend

To run the React frontend locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Technologies Used

- **Backend**: Manifest
- **Frontend**: React, Vite
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **SDK**: `@mnfst/sdk`
