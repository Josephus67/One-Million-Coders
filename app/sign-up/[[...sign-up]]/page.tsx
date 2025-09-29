import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join Ghana Tech Online
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start your learning journey today
          </p>
        </div>
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "border-0 shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}