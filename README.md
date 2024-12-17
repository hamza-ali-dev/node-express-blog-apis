# 📚 **Authentication and Blog API**

This project provides an authentication system and basic blog functionality with two roles: **Users** and **Admins**. It includes features like email verification, server-side validation, logging with rotation, rate-limiting, and separate Swagger documentation for users and admins.

---

## 🚀 **Features**

1. **Role-Based Access Control**:
   - **Users**: Can sign up, create posts, edit/delete their own posts, and comment on other posts.
   - **Admins**: Cannot sign up directly; created via a seeder or by other admins.

2. **Swagger Documentation**:
   - 📄 [Admin Documentation](http://localhost:3000/api/docs/admin) – For endpoints accessible to admins.
   - 📄 [User Documentation](http://localhost:3000/api/docs/user) – For endpoints accessible to users.

3. **Email Verification**:
   - Users need to verify their email before signing in.

4. **Server-Side Validation**:
   - Robust validation for all endpoints to ensure data integrity.

5. **Logging with Rotation**:
   - Logging system with log rotation to manage log files effectively.

6. **Rate-Limiting**:
   - Protection against abuse by applying rate limits to all endpoints.

---

## 🛠️ **Installation**

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/hamza-ali-dev/node-express-blog-apis
   cd your-repo
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   PORT=3000
   SECRET=your_jwt_secret
   EMAIL_HOST=127.0.0.1
   EMAIL_PORT=1025
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_password
   MONGODB_URI=your_mongodb_uri
   ```

4. **Run MailDev** for email testing (if using MailDev):

   ```bash
   maildev --smtp 1025 --web 1080
   ```

5. **Run Seeders**:

   ```bash
   node seeders/adminSeeder.js
   ```

   The seeder will add a **default admin**.

6. **Start the Server**:

   ```bash
   npm start
   ```

   The server will run on [http://localhost:3000](http://localhost:3000).

---

## 📚 **API Documentation**

### 🔗 **Swagger Endpoints**

- **User Swagger Docs**: [http://localhost:3000/api/docs/user](http://localhost:3000/api/docs/user)
- **Admin Swagger Docs**: [http://localhost:3000/api/docs/admin](http://localhost:3000/api/docs/admin)

---

## 📝 **Endpoints**

### 🔒 **Authentication**

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| `POST` | `/api/user/auth/signup` | User sign-up with email verification. |
| `POST` | `/api/user/auth/signin` | User sign-in.                     |
| `GET`  | `/api/user/auth/verify/:token` | Verify email using the token. |

### 📝 **Posts**

| Method   | Endpoint                 | Description                          |
|----------|--------------------------|--------------------------------------|
| `POST`   | `/api/posts`             | Create a new post (users only).      |
| `PUT`    | `/api/posts/:id`         | Edit a post (only if it's yours).    |
| `DELETE` | `/api/posts/:id`         | Delete a post (only if it's yours).  |

### 💬 **Comments**

| Method | Endpoint                       | Description                                 |
|--------|--------------------------------|---------------------------------------------|
| `POST` | `/api/posts/:id/comments`      | Comment on a post.                          |

---

## ✅ **Server-Side Validation**

All endpoints are secured with server-side validation to ensure proper data integrity. For example:

- **Signup Validation**:
  - `firstName`: Required string.
  - `email`: Valid email format.
  - `country`: Required string.
  - `password`: Minimum 6 characters.

---

## 📈 **Logging**

- **Logging with Rotation**:
  - Logs are managed with a rotation policy to prevent large log files.
  - Logs are stored in the `logs` directory.

---

## ⚡ **Rate-Limiting**

To prevent abuse, rate limits are applied to all endpoints. Default configuration:

- **Max Requests**: 100 per 15 minutes per IP.
- Customizable via `rate-limit` middleware in `server.js`.

---

## 🛡️ **Security Best Practices**

- **JWT Authentication** for secure API access.
- **Email Verification** ensures valid user accounts.
- **Rate-Limiting** protects against brute-force attacks.
- **Environment Variables** for sensitive configurations.

---

## 💡 **How to Contribute**

1. **Fork the repository**.
2. **Create a new branch**:

   ```bash
   git checkout -b feature-name
   ```

3. **Make your changes** and commit:

   ```bash
   git commit -m "Add new feature"
   ```

4. **Push to your fork** and submit a **Pull Request**.

---

## 📝 **License**

This project is licensed under the MIT License.

---

Happy coding! 🚀
