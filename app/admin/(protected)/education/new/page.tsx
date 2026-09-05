import { EducationForm } from '@/components/admin/EducationForm';

export const dynamic = 'force-dynamic';

export default function NewEducationPage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New education entry</h1>
      <EducationForm />
    </div>
  );
}
