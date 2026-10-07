import PageHeader from "../ui/PageHeader";
import EmptyState from "../ui/EmptyState";

// Placeholder for app pages that are routed and protected but not built yet.
export default function ComingSoon({ eyebrow, title, description, icon }) {
  return (
    <div className="mx-auto w-full max-w-[2800px]">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <EmptyState
        icon={icon}
        title="This screen is coming soon"
        description="The page is set up and protected. Its content will be built in an upcoming task."
      />
    </div>
  );
}
