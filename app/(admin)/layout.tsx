import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

function AdminLayout({
    children,
    }: Readonly<{ 
    children: React.ReactNode;
    }>) {
  return (
    <div className="flex flex-col flex-1"> 
      <Header/>

      <div className="flex flex-col flex-1 lg:flex-row bg-gray-100">
        <Sidebar/>
        <div className="flex flex-1 justify-center lg:justify-start items-start max-w-5xl mx-auto w-full">
            {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
