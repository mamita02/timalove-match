import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminSettings as SettingsComponent } from "../components/admin/AdminSettings";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <SettingsComponent />
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;