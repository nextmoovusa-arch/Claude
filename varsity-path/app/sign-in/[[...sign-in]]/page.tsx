import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="font-anton text-navy text-2xl tracking-widest">VARSITY</span>
            <span className="font-anton text-red-flag text-2xl tracking-widest">PATH</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-stone">
            NEXTMOOV USA — Espace agent
          </p>
        </div>

        {/* Clerk Sign In */}
        <div className="border border-line bg-white p-8">
          <SignIn
            appearance={{
              elements: {
                card: "shadow-none border-0",
                headerTitle: "font-anton text-ink tracking-widest",
                formButtonPrimary:
                  "bg-navy hover:bg-navy-600 font-mono uppercase tracking-widest text-paper",
                formFieldInput:
                  "border-line focus:border-navy focus:ring-navy font-garamond",
              },
            }}
          />
        </div>

        <p className="mt-6 text-center font-garamond text-sm text-stone italic">
          Accès réservé aux agents NEXTMOOV
        </p>
      </div>
    </div>
  )
}
