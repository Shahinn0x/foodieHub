# FoodieHub

A full-stack food delivery platform — browse restaurants, order food, manage menus as a partner, or oversee everything as an admin.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 19, Vite 8, TailwindCSS 4, TypeScript |
| Backend  | Express 5, Node.js, MongoDB (Mongoose)       |
| UI       | shadcn, base-ui, sonner (toasts)              |

## Project Structure

```
foodieHub/
├── backend/          Express API server (port 3000)
│   └── src/
│       ├── controllers/    Route handlers
│       ├── middleware/      Auth middleware (JWT)
│       ├── models/         Mongoose schemas
│       ├── routes/         Express routes
│       └── db/             MongoDB connection
├── fronted/          React SPA (port 5173)
│   └── src/
│       ├── components/     Layout, ThemeToggle, ui/
│       ├── contexts/       AuthContext
│       ├── pages/          11 page components
│       └── lib/            API client, utils
└── README.md
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB connection string (Atlas or local)

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/foodie
ADMIN_EMAIL=admin@foodiehub.com
```

Seed the database with sample data:

```bash
node seed.js
```

Start the server:

```bash
npm start
```

API runs at **http://localhost:3000**

### 3. Frontend Setup

```bash
cd fronted
npm install
npm run dev
```

App runs at **http://localhost:5173**

## API Endpoints

### Auth
| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| POST   | `/auth/register`    | Register user or partner |
| POST   | `/auth/login`       | Login                    |
| GET    | `/auth/profile`     | Get current user profile |

### Restaurants
| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| GET    | `/restaurant/all`     | List all restaurants   |
| GET    | `/restaurant/:id`     | Get restaurant details |
| GET    | `/restaurant/:id/foods` | Get restaurant menu |

### Foods (Partner only)
| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/partner/foods`        | Add food item     |
| PUT    | `/partner/foods/:id`    | Update food item  |
| DELETE | `/partner/foods/:id`    | Delete food item  |

### Orders
| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| POST   | `/order/place`            | Place order (user)     |
| GET    | `/order/my`               | View my orders (user)  |
| GET    | `/partner/orders`         | View restaurant orders |
| PATCH  | `/partner/orders/:id/status` | Update order status |

### Cart (User only)
| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/cart`            | Get cart              |
| POST   | `/cart/add`        | Add item to cart      |
| PUT    | `/cart/:itemId`    | Update cart item qty  |
| DELETE | `/cart/:itemId`    | Remove from cart      |
| DELETE | `/cart`            | Clear cart            |

### Address (User only)
| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/address`            | Get saved addresses |
| POST   | `/address`            | Add address         |
| PUT    | `/address/:id`        | Update address      |
| DELETE | `/address/:id`        | Delete address      |

### Admin
| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/admin/dashboard`          | Platform overview stats  |
| GET    | `/admin/restaurants`        | List all restaurants     |
| PATCH  | `/admin/restaurants/:id`    | Toggle restaurant status |

## Seed Credentials

All passwords: **password123**

### Users (food customers)
| Email                 | Password    | Name          | City       |
| --------------------- | ----------- | ------------- | ---------- |
| user@foodiehub.com    | password123 | Shahin Alam   | Bangalore  |
| priya@foodiehub.com   | password123 | Priya Sharma  | Mumbai     |
| rahul@foodiehub.com   | password123 | Rahul Verma   | Delhi      |
| ananya@foodiehub.com  | password123 | Ananya Patel  | Bangalore  |
| vikram@foodiehub.com  | password123 | Vikram Singh  | Hyderabad  |

### Admin
| Email                | Password     |
| -------------------- | ------------ |
| admin@foodiehub.com  | password123  |

### Restaurant Partners
| Email                  | Password    | Restaurant       | Category      |
| ---------------------- | ----------- | ---------------- | ------------- |
| partner@foodiehub.com  | password123 | Spice Garden     | North Indian  |
| partner2@foodiehub.com | password123 | Pizza Planet     | Italian       |
| partner3@foodiehub.com | password123 | Dragon Wok       | Chinese       |
| partner4@foodiehub.com | password123 | Tandoori Flames  | Mughlai       |

## User Roles & Flows

### Customer
1. Register/login as a user
2. Browse restaurants on the home page (search, filter by category, sort by rating)
3. Click a restaurant to view its menu
4. Add items to cart, go to checkout
5. Place order with delivery address
6. Track order status on "My Orders" page

### Restaurant Partner
1. Register/login as a food partner
2. Manage restaurant details (name, hours, image)
3. Add/edit/delete menu items with prices, images, categories
4. View incoming orders, update status (Accepted → Preparing → Ready → Delivered)

### Admin
1. Login with admin credentials
2. View dashboard with platform statistics
3. View all restaurants across the platform
4. Toggle restaurant open/closed status

## Theme

The app supports light and dark mode. The theme toggle is in the top-right corner of the header (desktop) and inside the mobile menu. Default theme is light mode.

**Color palette** — warm orange/amber primary with cream backgrounds, using the Montserrat/Merriweather/Ubuntu Mono font family.

Press **D** to quickly toggle between light and dark mode.
