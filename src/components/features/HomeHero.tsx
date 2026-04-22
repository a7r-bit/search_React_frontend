import { appSections } from "@/types/app";

export function HomeHero() {
  return (
    <section aria-labelledby="home-hero-title" className="grid gap-2">
      <div className="p-6 rounded-md  bg-(--color-surface)">
        <p className="text-sm text-(--color-text-muted)">Project scaffold</p>
        <h2 className="text-base font-normal mb-3">
          Project structure now follows the Cursor rule template
        </h2>
        <p className="max-w-[60ch] text-(--color-text-muted)">
          The starter Vite screen was replaced with a minimal application shell,
          feature section, route module, and provider layer so the project can
          grow without another structural rewrite.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {appSections.map((section) => (
          <article
            key={section.title}
            className="p-4 border border-(--color-border) rounded-md bg-(--color-surface)"
          >
            <h3 className="font-normal text-md mt-0">{section.title}</h3>
            <p className="mb-0">{section.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
