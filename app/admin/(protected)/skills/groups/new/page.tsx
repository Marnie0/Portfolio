import { SkillGroupForm } from '@/components/admin/SkillGroupForm';
export const dynamic = 'force-dynamic';
export default function NewSkillGroupPage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New skill group</h1>
      <SkillGroupForm />
    </div>
  );
}
