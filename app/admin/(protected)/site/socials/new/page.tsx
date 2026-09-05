import { SocialLinkForm } from '@/components/admin/SmallForms';
export const dynamic = 'force-dynamic';
export default function NewSocialLinkFormPage() {
  return (
    <div className="mt-8">
      <h1 className="font-display text-2xl">New social link</h1>
      <SocialLinkForm />
    </div>
  );
}
