export const metadata = {
    title: "Dashboard | CaloVision",
    description: "Your CaloVision nutrition dashboard.",
  };
  
  export default function DashboardPage() {
    return (
      <div className="mx-auto max-w-[1280px]">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-[#4dbb08]">
            Welcome to CaloVision
          </p>
  
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Dashboard coming next
          </h2>
  
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            This is the foundation of the authenticated CaloVision
            application. We'll build the actual dashboard here next.
          </p>
        </div>
      </div>
    );
  }