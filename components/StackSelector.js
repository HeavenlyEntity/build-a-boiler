"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  // Frontend
  ReactLogo,
  NextJsLogo,
  VueLogo,
  AngularLogo,
  SvelteLogo,
  AstroLogo,
  RemixLogo,
  // Backend
  NodeJsLogo,
  PythonLogo,
  RubyLogo,
  GoLogo,
  JavaLogo,
  DotNetLogo,
  PhpLogo,
  // Database
  PostgreSQLLogo,
  MySQLLogo,
  MongoDBLogo,
  SupabaseLogo,
  FirebaseLogo,
  AppWriteLogo,
  SurrealDBLogo,
  PlanetScaleLogo,
  RedisLogo,
  SQLiteLogo,
  // ORM
  PrismaLogo,
  TypeORMLogo,
  SequelizeLogo,
  MongooseLogo,
  DrizzleLogo,
  // Auth
  Auth0Logo,
  ClerkLogo,
  NextAuthLogo,
  // Payment
  StripeLogo,
  LemonSqueezyLogo,
  GumroadLogo,
  PaddleLogo,
  PayPalLogo,
  RazorpayLogo,
  DefaultLogo,
} from "@/components/ui/TechLogos";

const FRONTEND_OPTIONS = [
  { value: null, label: "Select Frontend", icon: DefaultLogo },
  { value: "react", label: "React", icon: ReactLogo },
  { value: "nextjs", label: "Next.js", icon: NextJsLogo },
  { value: "vue", label: "Vue.js", icon: VueLogo },
  { value: "angular", label: "Angular", icon: AngularLogo },
  { value: "svelte", label: "Svelte", icon: SvelteLogo },
  { value: "astro", label: "Astro", icon: AstroLogo },
  { value: "remix", label: "Remix", icon: RemixLogo },
];

const BACKEND_OPTIONS = [
  { value: null, label: "Select Backend", icon: DefaultLogo },
  { value: "nodejs", label: "Node.js", icon: NodeJsLogo },
  { value: "python", label: "Python", icon: PythonLogo },
  { value: "ruby", label: "Ruby", icon: RubyLogo },
  { value: "go", label: "Go", icon: GoLogo },
  { value: "java", label: "Java", icon: JavaLogo },
  { value: "dotnet", label: ".NET", icon: DotNetLogo },
  { value: "php", label: "PHP", icon: PhpLogo },
];

const DATABASE_OPTIONS = [
  { value: null, label: "Select Database (Optional)", icon: DefaultLogo },
  { value: "postgresql", label: "PostgreSQL", icon: PostgreSQLLogo },
  { value: "mysql", label: "MySQL", icon: MySQLLogo },
  { value: "mongodb", label: "MongoDB", icon: MongoDBLogo },
  { value: "supabase", label: "Supabase", icon: SupabaseLogo },
  { value: "firebase", label: "Firebase", icon: FirebaseLogo },
  { value: "appwrite", label: "AppWrite", icon: AppWriteLogo },
  { value: "surrealdb", label: "SurrealDB", icon: SurrealDBLogo },
  { value: "planetscale", label: "PlanetScale", icon: PlanetScaleLogo },
  { value: "redis", label: "Redis", icon: RedisLogo },
  { value: "sqlite", label: "SQLite", icon: SQLiteLogo },
];

const ORM_OPTIONS = [
  { value: null, label: "Select ORM (Optional)", icon: DefaultLogo },
  { value: "prisma", label: "Prisma", icon: PrismaLogo },
  { value: "typeorm", label: "TypeORM", icon: TypeORMLogo },
  { value: "sequelize", label: "Sequelize", icon: SequelizeLogo },
  { value: "mongoose", label: "Mongoose", icon: MongooseLogo },
  { value: "drizzle", label: "Drizzle", icon: DrizzleLogo },
];

const AUTH_OPTIONS = [
  { value: null, label: "Select Auth (Optional)", icon: DefaultLogo },
  { value: "supabase", label: "Supabase Auth", icon: SupabaseLogo },
  { value: "auth0", label: "Auth0", icon: Auth0Logo },
  { value: "clerk", label: "Clerk", icon: ClerkLogo },
  { value: "firebase", label: "Firebase Auth", icon: FirebaseLogo },
  { value: "nextauth", label: "NextAuth.js", icon: NextAuthLogo },
  { value: "custom", label: "Custom Auth", icon: DefaultLogo },
];

const PAYMENT_OPTIONS = [
  { value: null, label: "Select Payment (Optional)", icon: DefaultLogo },
  { value: "stripe", label: "Stripe", icon: StripeLogo },
  { value: "lemonsqueezy", label: "LemonSqueezy", icon: LemonSqueezyLogo },
  { value: "gumroad", label: "Gumroad", icon: GumroadLogo },
  { value: "paddle", label: "Paddle", icon: PaddleLogo },
  { value: "paypal", label: "PayPal", icon: PayPalLogo },
  { value: "razorpay", label: "Razorpay", icon: RazorpayLogo },
];

const StackSelector = ({ onStackChange }) => {
  const [stack, setStack] = useState({
    frontend: "",
    backend: "",
    database: "",
    orm: "",
    auth: "",
    payment: "",
  });

  const handleChange = (field, value) => {
    const newStack = { ...stack, [field]: value };
    setStack(newStack);
    if (onStackChange) {
      onStackChange(newStack);
    }
  };

  const getSelectedOption = (options, value) => {
    return options.find(option => option.value === value);
  };

  const SelectField = ({ label, value, options, field, required = false }) => {
    const selectedOption = getSelectedOption(options, value);
    const IconComponent = selectedOption?.icon || DefaultLogo;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full space-y-2"
      >
        <label className="block">
          <span className={`text-sm font-semibold text-foreground ${required ? 'after:content-["*"] after:text-primary after:ml-1' : ''}`}>
            {label}
          </span>
        </label>
        <Select value={value} onValueChange={(value) => handleChange(field, value)}>
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <SelectValue placeholder={options[0].label} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => {
              const OptionIcon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <OptionIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </motion.div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SelectField
        label="Frontend"
        value={stack.frontend}
        options={FRONTEND_OPTIONS}
        field="frontend"
        required
      />

      <SelectField
        label="Backend"
        value={stack.backend}
        options={BACKEND_OPTIONS}
        field="backend"
        required
      />

      <SelectField
        label="Database"
        value={stack.database}
        options={DATABASE_OPTIONS}
        field="database"
      />

      <SelectField
        label="ORM"
        value={stack.orm}
        options={ORM_OPTIONS}
        field="orm"
      />

      <SelectField
        label="Authentication"
        value={stack.auth}
        options={AUTH_OPTIONS}
        field="auth"
      />

      <SelectField
        label="Payment"
        value={stack.payment}
        options={PAYMENT_OPTIONS}
        field="payment"
      />
    </div>
  );
};

export default StackSelector;