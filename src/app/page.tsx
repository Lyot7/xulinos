import Image from "next/image";
import Logo from "./components/branding/logo";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Logo color="var(--color-pure-white)" />
        <Logo color="var(--color-jet)" />
        <Logo color="var(--color-van-dyke)" />
        <Logo color="var(--color-wenge)" />
        <Logo color="var(--color-pure-white)" />
        <Logo color="var(--color-deep-black)" />
        <Logo color="var(--color-gray-medium)" />
      </main>
      
    </div>
  );
}
