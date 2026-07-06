import Logo from "@/components/logo";

import { Badge } from "@/components/badge";
import { AvatarStack } from "@/components/avatarStack";
import { WaitlistForm } from "@/components/WaitlistForm";

import { BRAND } from "@/content/brand";

import { CountdownTimer } from "@/components/countDownTimer";

import { WAITLIST_CONTENT } from "@/content/WaitList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      
      {/* ── HEADER NAVIGATION ── */}
      <header className="w-full py-6 flex items-center justify-center 
      border-b border-foreground/10 z-10 backdrop-blur-sm">
        <Logo 
          textPosition="right" 
          containerSize={6}
        />
      </header>

      {/* ── HERO MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-24 py-3 text-center
       max-w-4xl mx-auto z-10 w-full space-y-3">
        
        <CountdownTimer launchDate={WAITLIST_CONTENT.launchDate}/>
        {/* Launch Status Badge */}
        <Badge 
          text="LAUNCHING NOV 16TH, 2026" 
          dotClassName="bg-green-500" 
          pingClassName="bg-green-400" 
        />

        {/* Dynamic Typography Header */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            {WAITLIST_CONTENT.heading}
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {WAITLIST_CONTENT.subheading}
          </p>
        </div>

        {/* Interactive Subscription Form Wrapper */}
        <WaitlistForm />

      </main>

      {/* ── SOCIAL PROOF & FOOTER ZONE ── */}
      <footer className="w-full flex flex-col items-center justify-center border-t border-foreground/10
       bg-transparent z-10 py-10 space-y-6 mt-10">
        
        {/* Avatar Stack Social Proof Component */}
        <AvatarStack 
          images={WAITLIST_CONTENT.avatars_imgs} 
          text="3000+ people have already joined" 
          textPosition="right"
          avatarSize={34}
        />

        {/* Legal & Meta Copyright Line */}
        <div className="text-sm text-foreground/80 font-medium flex items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} </span>
          <span className="h-1 w-1 rounded-full bg-foreground/30" />
          <a href="https://launchpadnext.com/templates/waitlist-kit" target="_blank" className="hover:text- transition-colors">Get this template</a>
          <span className="h-1 w-1 rounded-full bg-foreground/30" />
          <span>Built by <a href="https://launchpadnext.com" className="underline font-bold hover:opacity-80" target="_blank">LaunchPad Next</a> </span>
        </div>

      </footer>

    </div>
  );
}

