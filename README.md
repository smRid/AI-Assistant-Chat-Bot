# 🤖 Aidly Bot – Customizable AI Chatbot

**Aidly Bot** is a modern, customizable AI assistant platform built with Next.js 15, designed to facilitate intelligent, human-like conversations between users and customers through purpose-driven chatbots. It empowers businesses to deploy scalable assistants that can handle inquiries, resolve issues, guide users, and deliver real-time support 24/7. Whether you're building an internal support agent, a domain-specific assistant, an educational tutor, or a customer-facing helpdesk, Aidly Bot provides the flexibility, reliability, and structure to manage it all with ease.


---

## 🖼️ Preview

<p align="center">
  <img src="./public/preview-1.png" alt="Aidly Bot Preview" width="600" />
  <br />
  <img src="./public/preview-2.png" alt="Aidly Bot Preview" width="600" />
  <br />
  <img src="./public/preview-3.png" alt="Aidly Bot Preview" width="600" />
  <br />
  <img src="./public/preview-4.png" alt="Aidly Bot Preview" width="600" />
</p>

---

## 🔗 Live Demo : [View Live Demo](https://aidlybot.vercel.app)

---

## 🚀 Features

- 🧠 **AI Chatbot Sessions**: Real-time chat interface with dynamic session creation  
- 🔐 **Authentication** with Clerk, including admin and guest roles  
- 🧑‍💼 **Admin Tools**: Review and manage all chat sessions  
- 🧭 **Role-Based Navigation** based on user type (guest/admin)
- 🧬 **OpenAI-Powered**: Generates intelligent, human-like responses using OpenAI models.
- 🗂️ **GraphQL API** powered by Apollo Client and Apollo Server  
- 🎨 **Modern UI** with Tailwind CSS and React components  
- ⚙️ **Secure CORS Handling** in both code and Vercel config  
- 🕒 **Time Formatting** with `react-time-ago`  


---

## 🧩 Tech Stack

### 🧑‍💻 Client

- [Next.js 15](https://nextjs.org/) – App Router based structure  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS  
- [Apollo Client](https://www.apollographql.com/docs/react/) – State management for GraphQL  
- [Clerk](https://clerk.dev/) – Authentication & session management  
- [React Time Ago](https://github.com/catamphetamine/react-time-ago) – Human-readable time formatting  

### ⚙️ Server

- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) – GraphQL backend  
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers) – Edge Functions for APIs  
- [PostgreSQL](https://www.postgresql.org/) - Database schema & management
- [Vercel](https://vercel.com) – Hosting platform with Edge Functions and Env Variables  

---

## 🚀 Key Features

- ✅ **Dynamic Chatbot Sessions**  
  Create, review, and manage real-time chatbot conversations.

- 🔐 **Admin & Guest Access**  
  Secure role-based access with Clerk, including separate dashboards.

- 🎯 **GraphQL-Powered API**  
  Centralized data management using Apollo Server & Client.

- 🧑‍🎨 **Modern, Responsive UI**  
  Built with Tailwind CSS and fully responsive design principles.

- 🛡️ **Advanced CORS Support**  
  Fully compliant CORS handling for secure, cross-origin communication.

---

## <a name="getting-started">🚀 Getting Started</a>

To get started follow these steps:

## Cloning the Repository

Using CLI

```bash
git clone https://github.com/smRid/AI-Assistant-Chat-Bot.git
```

**\*\*_Ensure you have installed [Git](https://git-scm.com) on your machine._**

or using GitHub:

-   Go to the project [repository](https://github.com/smRid/AI-Assistant-Chat-Bot) on my GitHub page
-   Click on the green button on the top 👆
-   Click Download ZIP


### ⚙️ Installation

## Setup .env file
```bash

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_GRAPHQL_ENDPOINT=
GRAPHQL_TOKEN=
OPENAI_API_KEY=

```

Install the project dependencies using npm:

### Build the app

```bash
npm install
```

**\*\*_Ensure you have installed [NodeJS](https://nodejs.org/en) on your machine._**

### Generate the Prisma client and apply initial migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```
### Start the app

```bash
npm run dev
```

**\*\*_Navigate to http://localhost:3000 in your browser to access the local development server._**

---


## 📄 License

This project is licensed under the [MIT License](LICENSE).
