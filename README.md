# Expense Splitter Backend Documentation

## Overview

The backend of the Expense Splitter Service is built using Express.js with TypeScript. It manages all the core business logic, data validation, and communication with MongoDB. Its purpose is to handle group creation, expense management, balance updates, and settlement calculations.

## Architecture

The server follows an MVC (Model-View-Controller) structure with modular controllers, routes, and models. It connects to MongoDB using Mongoose and exposes RESTful APIs to the frontend.

<img width="1771" height="1058" alt="diagram-export-16-10-2025-12_35_54-AM" src="https://github.com/user-attachments/assets/e7664efd-9c19-4af5-bc75-97c43061c72e" />

## Folder Structure

The main directories are organized as follows:

- **controllers**: Business logic implementation
- **models**: Database schema definitions
- **routes**: API endpoint mappings
- **middleware**: Request processing and validation
- **utils**: Helper functions and utilities
- **config**: Configuration files

Each controller is responsible for a specific domain such as authentication, groups, expenses, balances, and settlements.

## Key Components

### Controllers
Implement all business logic. For example, `expenseController` updates balances and calculates settlements when expenses are created or modified.

### Routes
Map HTTP endpoints to corresponding controller functions, defining the API surface of the application.

### Models
Mongoose schemas defining structure for the following collections:
- User
- Group
- Expense
- Balance

### Middleware
- **verifyToken**: Handles authentication and authorization
- **validate**: Performs request data validation before processing

### Utilities
- **ApiError**: Provides consistent error handling across the application

## Core APIs

The backend exposes routes for the following operations:

- User authentication (registration, login)
- Group creation and management
- Expense management (create)
- Balance retrieval and tracking
- Settlement suggestions and calculations

These endpoints enable communication with the frontend through standard REST calls.

## Core Logic

### Expense Creation Flow

When a new expense is created, the server follows this process:

1. Validates the input data
2. Stores the expense in the Expense collection
3. Updates the Balance collection using incremental balance updates
4. Recalculates settlements if needed

### Settlement Algorithm

The settlement algorithm uses a greedy approach to match debtors and creditors efficiently. It returns a minimal set of transactions required to settle all debts within a group.

## Environment Configuration

The backend uses environment variables for configuration:

- Database connection string
- JWT secret for authentication
- Server port
- SALT
- Frontend url

## Testing and Validation

The APIs are tested using sample data and Postman. Common test flows include:

- Creating a group
- Adding expenses
- Deleting expenses
- Verifying updated balances
- Testing settlement calculations

## Future Enhancements

Possible extensions for the backend include:

- User role management (admin, member, viewer)
- Expense categories and tagging
- Multi-currency support with real-time conversion
- Expense approval workflows
- Data export functionality
- Advanced reporting and analytics
