# ZYVORA — Fashion Commerce Frontend

A responsive ivory / champagne / charcoal fashion storefront and separate admin workspace built with React, Vite and React Router.

## Requirements

- Node.js 20.19+ or 22.12+ (required by the Vite version in this project)
- npm
- Your existing Spring Boot backend running locally on port `9090`

## Run in VS Code

1. Extract this ZIP.
2. Open the `zyvora-frontend` folder in VS Code.
3. Open Terminal → New Terminal.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Copy `.env.example` to `.env`.
6. Set your existing backend URL and Razorpay public Key ID in `.env`:

   ```env
   VITE_API_BASE_URL=http://localhost:9090
   VITE_RAZORPAY_KEY_ID=your_razorpay_public_key_id
   ```

7. Start the frontend:

   ```bash
   npm run dev
   ```

8. Open `http://localhost:5174`.

Build check:

```bash
npm run build
```

## Existing backend is preserved

This frontend does not include or modify any Spring Boot files. It calls the existing API paths found in the uploaded backend:

### Customer API paths

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/users/register`
- `GET /api/products`
- `GET /api/cart/items`
- `GET /api/cart/items/count`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/delete`
- `GET /api/orders`
- `POST /api/payment/create`
- `POST /api/payment/verify`

### Admin API paths

- `GET /admin/business/overall`
- `GET /admin/business/daily?date=YYYY-MM-DD`
- `GET /admin/business/monthly?month=1&year=2026`
- `GET /admin/business/yearly?year=2026`
- `POST /admin/products/add`
- `DELETE /admin/products/delete`
- `PUT /admin/user/modify`

## Important backend limitations discovered in the supplied source

The admin backend does not currently expose an endpoint to list all products or all users. The admin Products screen therefore supports the existing add-product and delete-by-ID APIs, but cannot show a real inventory table. The Customers screen supports the existing modify-user API and requires a user ID and complete updated fields to be entered manually. No fake data or invented listing endpoint has been added.

The customer product endpoint `/api/products` is protected for the `CUSTOMER` role by the supplied authentication filter. Admin users therefore use the separate admin workspace rather than the customer shopping pages.

The admin add-product API requires an existing numeric `categoryId` and an image URL. The category ID must match a category already present in your database.

## Authentication and security notes

- Login stores the returned username and role in `sessionStorage`; the backend's HttpOnly `authToken` cookie remains the authentication credential.
- React route guards are for navigation and user experience only. The supplied Spring Boot authentication filter remains responsible for authorization.
- Keep Razorpay secret credentials only on the backend. The frontend environment variable must contain the public Key ID only.
- The supplied backend explicitly allows CORS from `http://localhost:5174`; keep this Vite port unless you intentionally update backend CORS configuration.
- The home page is public. Product listing, cart, checkout and orders require a customer login.

## Project structure

```text
src/
├── components/       # Shared customer/admin UI components
├── context/          # Authentication state
├── layouts/          # Separate customer and admin shells
├── pages/
│   ├── admin/        # Dashboard, products, customers, reports
│   └── ...           # Customer storefront, auth, cart and orders
├── services/         # Axios API calls grouped by backend feature
├── styles/           # Global responsive design system
└── utils/            # Formatting and API error helpers
```
