export default function CmsUnauthorizedPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-neutral-900 leading-tight">
        Access denied
      </h1>
      <p className="mt-2 text-sm text-neutral-500 font-bricolage">
        Your account is authenticated, but it doesn’t have CMS permissions.
      </p>
      <p className="mt-4 text-sm text-neutral-500 font-bricolage">
        Ask a Super Admin to grant you a CMS role.
      </p>
    </div>
  );
}
