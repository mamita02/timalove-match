import { AdminLayout } from "@/components/admin/AdminLayout";
import { InscriptionsManager } from "@/components/AdminDashboard";

const AdminInscriptions = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <InscriptionsManager />
      </div>
    </AdminLayout>
  );
};

export default AdminInscriptions;
