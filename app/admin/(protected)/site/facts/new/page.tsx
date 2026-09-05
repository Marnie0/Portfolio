import { AboutFactForm } from '@/components/admin/SmallForms';
export const dynamic = 'force-dynamic';
export default function NewAboutFactFormPage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New about item</h1>
      <AboutFactForm />
    </div>
  );
}
