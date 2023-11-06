
## Getting Started

1. Create a `.env` file and add the below contents
```
DATABASE_TYPE=postgres
DATABASE_URL=postgres://postgres:2234781@localhost/medusa-store
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
STORE_CORS=http://localhost:8000,http://localhost:7001
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=rye-medusa-storefront
RYE_AUTH_HEADER="Basic {AUTH_TOKEN}" // can be found in the API Section on https://console.rye.com/account
```

2. Start backend
```
  npm install //install dependencies
  npm run seed // add dummy data
  npm start
```
3. To login to the admin section the user name is `admin@medusa-test.com` and password is `supersecret`

