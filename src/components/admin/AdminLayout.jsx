import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="ff-admin">
      <AdminSidebar />
      <div style={{ background: 'var(--ff-gray-50)', minWidth: 0 }}>
        <div style={{ padding: '28px 32px 60px' }}><Outlet /></div>
      </div>
    </div>
  );
}
