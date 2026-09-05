import { LanguageForm } from '@/components/admin/LanguageForm';
export const dynamic = 'force-dynamic';
export default function NewLanguagePage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New language</h1>
      <LanguageForm />
    </div>
  );
}
