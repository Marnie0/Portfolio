import { AchievementForm } from '@/components/admin/AchievementForm';

export const dynamic = 'force-dynamic';

export default function NewAchievementPage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New achievement</h1>
      <AchievementForm />
    </div>
  );
}
