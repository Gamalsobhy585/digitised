"use client";

export default function Error({ error, reset }) {
  return (
    <section className="flex items-center justify-center gap-5 flex-col bg-primary h-screen">
      <h2 className="text-[35px] font-mono text-2xl text-white">
        OOPS {error?.message}!
      </h2>
      <div className="flex items-center gap-4 mt-4">
        <button
          className=" bg-white text-primary py-2 px-4 rounded-md hover:shadow-sm transition-all"
          onClick={() => reset()}
        >
          Try again
        </button>
        <a
          href="/"
          className=" bg-white text-primary py-2 px-4 rounded-md hover:shadow-sm transition-all"
        >
          Go back to home
        </a>
      </div>
    </section>
  );
}
