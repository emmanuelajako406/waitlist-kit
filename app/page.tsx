import WaitlistPage from "@/components/block/waitListPage";

import { generateMetadata } from "@/lib/metadata";

// Next.js automatically detects this export object and binds it to the HTML <head>
export const metadata = generateMetadata();


export default function Home() {
  return <WaitlistPage/>
}

