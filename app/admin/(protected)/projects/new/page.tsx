import { ProjectForm } from '@/components/admin/ProjectForm';
export const dynamic = 'force-dynamic';
export default function NewProjectPage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New project</h1>
      <ProjectForm />
    </div>
  );
}
