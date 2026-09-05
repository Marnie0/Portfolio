import { HeroStatForm } from '@/components/admin/SmallForms';
export const dynamic = 'force-dynamic';
export default function NewHeroStatFormPage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New hero stat</h1>
      <HeroStatForm />
    </div>
  );
}
