import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { Outlet, Route, Routes } from "react-router";
import { appRoutePaths } from "./paths";
import { LoginLayout } from "@/components/layout/LoginLayout";
import { LoginForm } from "@/components/features/LoginForm";
import { AppShell } from "@/components/layout/AppShell";
import { SideBar } from "@/components/features/Sidebar";
import { DocumentPage } from "@/components/layout/document-page/DocumentPage";
export function AppRouter() {
  return (
    <Routes>
      <Route
        path={appRoutePaths.login}
        element={
          <LoginLayout>
            <LoginForm />
          </LoginLayout>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <AppShell sidebar={<SideBar />}>
              <Outlet />
            </AppShell>
          }
        >
          <Route index element={<DocumentPage />} />
          <Route path={appRoutePaths.dashboard.slice(1)} element={<></>} />
          <Route path={appRoutePaths.projects.slice(1)} element={<></>} />
          <Route path={appRoutePaths.analytics.slice(1)} element={<></>} />
          <Route path={appRoutePaths.settings.slice(1)} element={<></>} />
          <Route path={appRoutePaths.archive.slice(1)} element={<></>} />
        </Route>
      </Route>
      <Route
        path="/admin/*"
        element={
          <p style={{ padding: "2rem" }}>
            Если вы видите эту страницу — запрос не проксируется на Nest.
          </p>
        }
      />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}
