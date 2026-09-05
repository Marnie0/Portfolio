import { ServiceForm } from '@/components/admin/ServiceForm';

export const dynamic = 'force-dynamic';

export default function NewServicePage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New service</h1>
      <ServiceForm />
    </div>
  );
}
