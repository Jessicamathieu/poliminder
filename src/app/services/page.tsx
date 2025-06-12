import ServiceManagementTabs from '@/components/services/ServiceManagementTabs';

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-headline">Services & Items Management</h1>
      <ServiceManagementTabs />
    </div>
  );
}
