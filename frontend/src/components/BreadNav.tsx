import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BreadNav = () => {
  return (
    <Breadcrumb>
           <BreadcrumbList>
             <BreadcrumbItem>
               <BreadcrumbLink href="/">Home</BreadcrumbLink>
             </BreadcrumbItem>
             <BreadcrumbSeparator />
             <BreadcrumbItem>
               <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
             </BreadcrumbItem>
             <BreadcrumbSeparator />
             <BreadcrumbItem>
               <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
             </BreadcrumbItem>
           </BreadcrumbList>
         </Breadcrumb>
  )
}

export default BreadNav
