import { useState, useCallback } from 'react';
import { Settings } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CSVUploader from '@/components/admin/CSVUploader';
import CompanyManager from '@/components/admin/CompanyManager';
import AdminAuth from '@/components/admin/AdminAuth';

const Admin = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <Layout>
      <AdminAuth>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
              <Settings className="h-8 w-8" />
              Admin Panel
            </h1>
            <p className="mt-1 text-muted-foreground">
              Upload and manage company-wise LeetCode questions
            </p>
          </div>

          {/* Content */}
          <div className="grid gap-6 lg:grid-cols-2">
            <CSVUploader onUploadComplete={handleUpdate} />
            <CompanyManager refreshKey={refreshKey} onUpdate={handleUpdate} />
          </div>
        </div>
      </AdminAuth>
    </Layout>
  );
};

export default Admin;
