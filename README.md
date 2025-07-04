# 🪄 Jira Clone - Project Management App

A full-featured **Jira-style** issue tracking and project management system built with **Next.js 15**, **Clerk Auth**, **Prisma**, and **Radix UI**.  
Visually polished, responsive, and optimized for production deployment on **Vercel**.

---

## 🚀 Features

- 🧑‍💻 Authentication & user management via **Clerk**
- 🔐 Role-based permissions (admin, reporter, assignee)
- 📦 Project + Sprint structure with drag-and-drop issues
- 🎯 Issue prioritization & status workflows
- 📄 Markdown-based issue descriptions with live preview
- 💬 Real-time feedback with toast notifications
- 💅 Clean UI powered by **Radix UI**, **TailwindCSS**, and **Lucide Icons**
- 📊 Filter & search issues by priority, assignee, and text
- 🌙 Dark mode support with `next-themes`
- 🧰 Fully typed using **TypeScript + Zod**

---

## 🛠️ Tech Stack

| Layer            | Tools Used                                                                 |
|------------------|----------------------------------------------------------------------------|
| Framework        | [Next.js 15 (App Router + Turbopack)](https://nextjs.org/)                |
| Styling          | [TailwindCSS](https://tailwindcss.com/), [clsx](https://www.npmjs.com/package/clsx) |
| UI Components    | [Radix UI](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.dev/) |
| Forms & Schema   | [react-hook-form](https://react-hook-form.com/), [zod](https://zod.dev/)   |
| Auth             | [Clerk](https://clerk.dev/)                                                |
| DB ORM           | [Prisma](https://www.prisma.io/)                                           |
| Notifications    | [sonner](https://sonner.emilkowal.dev/)                                    |
| Markdown Editor  | [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor)          |
| Drag & Drop      | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)                   |
| Icons            | [Lucide React](https://lucide.dev/)                                        |
| Carousel         | [embla-carousel-react](https://www.embla-carousel.com/)                    |
| Date handling    | [date-fns](https://date-fns.org/)                                          |

---

## 🧪 Development

### ▶️ Start in Dev Mode
```bash
npm run dev
