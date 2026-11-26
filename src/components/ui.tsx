import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants = {
    primary:
      "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40",
    secondary:
      "bg-[var(--ink)] text-white hover:bg-[var(--ink-soft)] disabled:opacity-40",
    danger:
      "bg-[var(--danger)] text-white hover:bg-rose-700 disabled:opacity-40",
    ghost:
      "bg-transparent text-[var(--ink)] hover:bg-black/5 border border-[var(--line)]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold tracking-wide transition duration-200 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-[var(--line)] bg-white px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20",
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-[var(--line)] bg-white px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-[var(--line)] bg-white px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-sm font-medium text-[var(--ink-soft)]",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-[var(--paper-deep)] px-2.5 py-1 text-xs font-medium tracking-wide text-[var(--ink-soft)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Alert({
  children,
  variant = "error",
}: {
  children: React.ReactNode;
  variant?: "error" | "success";
}) {
  return (
    <div
      className={cn(
        "rounded-md px-3.5 py-2.5 text-sm",
        variant === "error"
          ? "border border-rose-200 bg-rose-50 text-rose-800"
          : "border border-teal-200 bg-teal-50 text-teal-900",
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-3xl font-bold text-[var(--ink)] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-xl text-[var(--muted)]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
