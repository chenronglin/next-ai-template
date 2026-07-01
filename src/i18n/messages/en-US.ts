import type { Dictionary } from "./zh-CN";

export const enUSDictionary: Dictionary = {
  metadata: {
    title: {
      default: "Next AI SaaS Starter",
      template: "%s | Next AI SaaS Starter",
    },
    description:
      "AI-ready SaaS starter built with Next.js, Bun, Prisma, Better Auth, shadcn/ui and Vercel AI SDK.",
  },
  common: {
    brand: "Next AI SaaS Starter",
    brandShort: "Next AI SaaS",
    localeSwitcher: {
      label: "Switch language",
      current: "Current language",
    },
    actions: {
      retry: "Retry",
      save: "Save",
      saving: "Saving",
      search: "Search",
      signIn: "Sign in",
      signUp: "Sign up",
      signOut: "Sign out",
      getStarted: "Get started",
    },
    nav: {
      marketing: {
        features: "Features",
        pricing: "Pricing",
        docs: "Docs",
        signIn: "Sign in",
        getStarted: "Get started",
      },
      app: {
        dashboard: "Dashboard",
        me: "Me",
        settings: "Settings",
        notes: "Notes",
        ai: "AI",
      },
      footer: {
        docs: "Docs",
        github: "GitHub",
        pricing: "Pricing",
        license: "MIT License",
      },
    },
  },
  marketing: {
    home: {
      badge: "AI-ready SaaS starter",
      title: "Next AI SaaS Starter",
      description:
        "An AI-ready SaaS starter built with Next.js, Bun, Prisma, and Better Auth. It ships a compact but complete product surface for Codex-driven iteration.",
      primaryCta: "Sign up",
      secondaryCta: "View dashboard demo",
      controlRoom: {
        title: "Template control room",
        subtitle: "Next.js 16 · Bun · SQLite",
        status: "Live",
        items: [
          { label: "Auth", value: "Ready" },
          { label: "Prisma", value: "SQLite adapter" },
          { label: "AI SDK", value: "Streaming" },
          { label: "Codex", value: "Guided" },
        ],
        routeMapTitle: "Feature route map",
        routes: [
          "/dashboard · protected server page",
          "/examples/notes · Zod + Server Actions",
          "/api/ai/chat · streaming Route Handler",
        ],
      },
      stackItems: [
        "Next.js App Router",
        "Bun",
        "SQLite",
        "Prisma",
        "Better Auth",
        "AI SDK",
        "shadcn/ui",
        "Zod",
      ],
      features: {
        auth: {
          title: "Authentication",
          description:
            "Email and password sign-up, session reads, sign-out, and a protected app shell.",
        },
        crud: {
          title: "CRUD example",
          description:
            "The Notes module demonstrates the full schema, query, action, and component path.",
        },
        ai: {
          title: "AI calls",
          description:
            "AI SDK streaming is wrapped in a Route Handler with Gateway model support.",
        },
        codex: {
          title: "Codex-friendly",
          description:
            "AGENTS.md and project skills define how new business modules should be added.",
        },
      },
    },
    pricing: {
      metadataTitle: "Pricing",
      title: "Pricing",
      description:
        "The MVP template does not bundle payments, but leaves a clear path for monetization.",
      plans: [
        { name: "Starter", description: "Placeholder for a future Stripe or Lemon Squeezy plan." },
        { name: "Growth", description: "Placeholder for a future Stripe or Lemon Squeezy plan." },
        { name: "Scale", description: "Placeholder for a future Stripe or Lemon Squeezy plan." },
      ],
      cta: "Get started",
    },
    docs: {
      metadataTitle: "Docs",
      title: "Project Docs",
      description:
        "A short summary of the template constraints. See AGENTS.md and the skills directory for the full rules.",
      cardTitle: "Codex Development Boundaries",
      items: [
        "Use Bun instead of npm, pnpm, or yarn.",
        "Use App Router and Server Components; declare use client only for interactive components.",
        "Access business data only through Prisma, with the SQLite adapter centralized in src/lib/db.ts.",
        "Validate every form, Server Action, and Route Handler input with Zod first.",
        "Add new business modules under src/features/<module>.",
      ],
    },
  },
  auth: {
    layout: {
      backHome: "Back home",
    },
    signIn: {
      metadataTitle: "Sign in",
      title: "Sign in to the app",
      form: {
        email: "Email",
        password: "Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password",
        submit: "Sign in",
        submitting: "Signing in",
        oauthPlaceholder:
          "OAuth sign-in is reserved here. Add GitHub or Google when the project needs it.",
        noAccount: "No account yet?",
        signUp: "Sign up",
        success: "Signed in",
        failure: "Sign in failed",
        incomplete: "Sign-in details are incomplete",
      },
    },
    signUp: {
      metadataTitle: "Sign up",
      title: "Create account",
      form: {
        name: "Display name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm password",
        terms: "I agree to the terms of service and privacy policy",
        submit: "Sign up",
        submitting: "Signing up",
        hasAccount: "Already have an account?",
        signIn: "Sign in",
        success: "Account created",
        failure: "Sign up failed",
        incomplete: "Sign-up details are incomplete",
      },
    },
    forgotPassword: {
      metadataTitle: "Forgot password",
      title: "Reset password",
      form: {
        email: "Email",
        submit: "Send reset email",
        submitting: "Working",
        missingEmail: "Enter your email",
        reserved:
          "Password reset email support is reserved. Enable it after wiring an email provider.",
      },
    },
    validation: {
      invalidEmail: "Enter a valid email",
      passwordMin: "Password must be at least 8 characters",
      nameMin: "Display name must be at least 2 characters",
      confirmPasswordMin: "Enter the password again",
      termsRequired: "You must accept the terms",
      passwordMismatch: "Passwords do not match",
    },
  },
  appShell: {
    signOut: {
      button: "Sign out",
      pending: "Signing out",
      success: "Signed out",
      failure: "Sign out failed",
    },
  },
  dashboard: {
    metadataTitle: "Dashboard",
    badge: "Protected dashboard",
    greeting: "Welcome, {name}",
    sessionDescription: "The account {email} passed the Better Auth session check.",
    createResource: "Create sample resource",
    statusCard: {
      title: "Template status",
      items: [
        "Next.js App Router is enabled",
        "Prisma SQLite adapter is configured",
        "Better Auth email and password auth is configured",
      ],
    },
    notesCard: {
      title: "Notes",
      description: "Notes created by the current user",
    },
    aiCard: {
      title: "AI",
      defaultModel: "Default model {model}",
    },
    recentNotes: {
      title: "Recent notes",
      empty: "No notes yet. Create the first resource on the database example page.",
    },
    quickLinks: {
      title: "Quick links",
      me: "Me",
      settings: "Settings",
      notes: "Database example",
      ai: "AI example",
    },
  },
  profile: {
    metadataTitle: "Me",
    title: "My account",
    description:
      "Verify the full path across authentication, sessions, form submission, Zod validation, and Prisma updates.",
    summaryTitle: "Account summary",
    createdAt: "Created at {date}",
    editTitle: "Edit profile",
    sessionsTitle: "Current login sessions",
    unknownDevice: "Unknown device",
    updatedAt: "Updated at {date}",
    expiresAt: "Expires at {date}",
    changePasswordTitle: "Change password",
    changePasswordDescription:
      "Reserved for the MVP. Enable Better Auth change password after adding email verification or a second confirmation step.",
    form: {
      name: "Display name",
      image: "Avatar URL",
      submit: "Save profile",
      submitting: "Saving",
    },
    validation: {
      nameMin: "Display name must be at least 2 characters",
      invalidImage: "Enter a valid avatar URL",
    },
    actions: {
      failure: "Profile update failed",
      success: "Profile updated",
    },
  },
  settings: {
    metadataTitle: "Settings",
    title: "Settings",
    description: "Save theme, default AI model, language, and notification preferences.",
    cardTitle: "Preferences",
    dangerTitle: "Danger zone",
    dangerDescription:
      "Account deletion is only a UI placeholder in the MVP. Production use needs confirmation, export, and audit policies.",
    form: {
      theme: "Theme",
      defaultModel: "Default AI model",
      language: "Default language",
      notifications: "Receive product notifications",
      submit: "Save settings",
      submitting: "Saving",
      themes: {
        system: "System",
        light: "Light",
        dark: "Dark",
      },
    },
    actions: {
      failure: "Settings save failed",
      success: "Settings saved",
    },
  },
  notes: {
    metadataTitle: "Notes CRUD",
    title: "Notes CRUD",
    description:
      "This module demonstrates Prisma queries, Server Actions, Zod validation, and a shadcn/ui table.",
    searchPlaceholder: "Search title or content",
    searchSubmit: "Search",
    create: {
      titleLabel: "Title",
      titlePlaceholder: "Example: first business module",
      contentLabel: "Content",
      contentPlaceholder: "Write the note content",
      submit: "Create note",
      submitting: "Creating",
    },
    empty: {
      title: "No notes",
      description:
        "After creating the first note, Codex can reuse this module to extend business features.",
    },
    table: {
      title: "Title",
      content: "Content",
      updatedAt: "Updated",
      actions: "Actions",
      editAria: "Edit note",
      deleteAria: "Delete note",
    },
    edit: {
      title: "Edit note",
      submit: "Save",
      submitting: "Saving",
    },
    validation: {
      titleRequired: "Title is required",
      titleMax: "Title must be at most 80 characters",
      contentRequired: "Content is required",
      contentMax: "Content must be at most 2000 characters",
      missingId: "Missing note ID",
    },
    actions: {
      createFailure: "Create note failed",
      createSuccess: "Note created",
      updateFailure: "Update note failed",
      updateSuccess: "Note updated",
      updateMissing: "No note was found to update",
      deleteFailure: "Delete note failed",
      deleteSuccess: "Note deleted",
      deleteMissing: "No note was found to delete",
    },
    error: {
      title: "Notes failed to load",
      description: "Retry or check the database connection.",
    },
  },
  ai: {
    metadataTitle: "AI example",
    title: "AI example",
    description:
      "Use the Vercel AI SDK Route Handler for streaming output and save generation history.",
    form: {
      model: "Model",
      prompt: "Prompt",
      promptPlaceholder:
        "Ask AI to draft product copy, write a SQL query, or break down a feature...",
      submit: "Generate",
      submitting: "Generating",
      clear: "Clear session",
      autoSave: "Auto-save",
      outputTitle: "Streaming output",
      waiting: "Enter a prompt to start generating.",
      requestFailure: "AI request failed. Try again later.",
      invalidPrompt: "Invalid prompt",
    },
    history: {
      title: "Generation history",
      empty: "No history yet.",
    },
    validation: {
      promptRequired: "Prompt is required",
      promptMax: "Prompt must be at most 4000 characters",
      invalidRequest: "Invalid request",
      unauthorized: "Unauthorized",
    },
    mockStream: {
      prefix: "Local demo stream: ",
      missingKey: "AI_GATEWAY_API_KEY is not configured, ",
      fallback: "so this route returns a readable mock streaming response.\n\n",
      promptLabel: "Your prompt: ",
      enableGateway:
        "\n\nAfter Vercel AI Gateway is configured, this route will automatically switch to real model output.",
    },
  },
  errors: {
    app: {
      title: "App page failed to load",
      description: "Retry, or check authentication and database configuration.",
    },
  },
};
