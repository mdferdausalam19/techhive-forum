export default function LoadingSpinner() {
  return (
    <div className="h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 border-t-2"></div>
    </div>
  );
}
