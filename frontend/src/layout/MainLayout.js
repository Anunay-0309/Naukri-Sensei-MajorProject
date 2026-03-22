export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-8">
        {children}
      </div>
    </div>
  );
}