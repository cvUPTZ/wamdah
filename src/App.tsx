// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Layout } from './components/Layout';
// import { AuthGuard } from './components/AuthGuard';
// import { Dashboard } from './pages/Dashboard';
// import { Campaigns } from './pages/Campaigns';
// import { CampaignDetails } from './pages/CampaignDetails';
// import { NewCampaign } from './pages/NewCampaign';
// import { Clients } from './pages/Clients';
// import { Login } from './pages/Login';
// import { Register } from './pages/Register';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Routes */}
//         <Route
//           path="/login"
//           element={
//             <AuthGuard requireAuth={false}>
//               <Login />
//             </AuthGuard>
//           }
//         />
//         <Route
//           path="/register"
//           element={
//             <AuthGuard requireAuth={false}>
//               <Register />
//             </AuthGuard>
//           }
//         />

//         {/* Protected Routes */}
//         <Route
//           path="/"
//           element={
//             <AuthGuard>
//               <Layout>
//                 <Dashboard />
//               </Layout>
//             </AuthGuard>
//           }
//         />
//         <Route
//           path="/campaigns"
//           element={
//             <AuthGuard>
//               <Layout>
//                 <Campaigns />
//               </Layout>
//             </AuthGuard>
//           }
//         />
//         <Route
//           path="/campaigns/new"
//           element={
//             <AuthGuard>
//               <Layout>
//                 <NewCampaign />
//               </Layout>
//             </AuthGuard>
//           }
//         />
//         <Route
//           path="/campaigns/:id"
//           element={
//             <AuthGuard>
//               <Layout>
//                 <CampaignDetails />
//               </Layout>
//             </AuthGuard>
//           }
//         />
//         <Route
//           path="/clients"
//           element={
//             <AuthGuard>
//               <Layout>
//                 <Clients />
//               </Layout>
//             </AuthGuard>
//           }
//         />

//         {/* Catch all route */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';
import { Dashboard } from './pages/Dashboard';
import { Campaigns } from './pages/Campaigns';
import { CampaignDetails } from './pages/CampaignDetails';
import { NewCampaign } from './pages/NewCampaign';
import { Clients } from './pages/Clients';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <AuthGuard requireAuth={false}>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path="/register"
          element={
            <AuthGuard requireAuth={false}>
              <Register />
            </AuthGuard>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout>
                <Dashboard />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/campaigns"
          element={
            <AuthGuard>
              <Layout>
                <Campaigns />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/campaigns/new"
          element={
            <AuthGuard>
              <Layout>
                <NewCampaign />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/campaigns/:id"
          element={
            <AuthGuard>
              <Layout>
                <CampaignDetails />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/clients"
          element={
            <AuthGuard>
              <Layout>
                <Clients />
              </Layout>
            </AuthGuard>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}