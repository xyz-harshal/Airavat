This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Next.js Client Starter Template

This project serves as a comprehensive starter template for modern web applications, combining Next.js, Shadcn UI, and Tailwind CSS to provide a solid foundation for building beautiful, responsive, and accessible user interfaces.

## Technology Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with server-side rendering, routing, and more
- **[React 19](https://react.dev/)** - UI library for building component-based interfaces
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn UI](https://ui.shadcn.com/)** - Re-usable components built with Radix UI and Tailwind CSS
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking for JavaScript
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carousel component for image galleries

## Features

- 🎨 Beautiful and responsive landing page with hero, features, and testimonials sections
- 🌓 Light and dark theme support using next-themes
- 📱 Mobile-friendly and responsive design
- 🧩 Reusable UI components (buttons, cards, carousel, dropdown, etc.)
- 🔒 Authentication scaffold (login/register pages)
- 📋 Team management interface structure
- 📝 TypeScript for type safety

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

```
├── app/               # Next.js application routes
│   ├── actions/       # Server actions
│   ├── components/    # App-specific components
│   ├── login/         # Authentication pages
│   └── register/
├── components/        # Shared components
│   ├── theme-provider.tsx # Theme context provider
│   └── ui/            # Shadcn UI components
├── lib/               # Utility functions and helpers
└── public/            # Static assets
```

## Customization

### Adding New Shadcn UI Components

This template uses Shadcn UI components. To add more components:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add avatar
npx shadcn@latest add calendar
```

### Styling

Styles are managed through Tailwind CSS. The main stylesheet is located in `app/globals.css`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
