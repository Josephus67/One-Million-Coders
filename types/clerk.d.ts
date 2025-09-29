// Extend Clerk types for our application
declare global {
  namespace ClerkTypes {
    interface User {
      // Custom metadata that can be stored in Clerk
      publicMetadata: {
        role?: "STUDENT" | "ADMIN";
        onboardingCompleted?: boolean;
      };
      privateMetadata: {
        internalNotes?: string;
      };
    }
  }
}

export {};