type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export default function AdminPageHeader({ title, description, actions }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-neutral-900 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-neutral-500 font-bricolage">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
