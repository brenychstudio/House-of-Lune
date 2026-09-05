import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main id="main-content" className="not-found">
      <p className="eyebrow">Not found</p>
      <h1>This object or page is not part of the BRENYCH foundation.</h1>
      <Link className="button" href="/en">
        Return to BRENYCH
      </Link>
    </main>
  );
}
