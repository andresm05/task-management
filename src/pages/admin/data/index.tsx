import AdminLayout from "@/layouts/_layout"
import useMiddleware from "@/hooks/useMiddleware"
import { Role } from "@/types/users"
import {IsLoading} from "@/molecules/isLoading"
import { BarData } from "@/molecules/barData"
import {DonutData} from '@/molecules/donutData';


const Chart = () => {

    const user = useMiddleware(Role.ADMIN);

    if (!user) {
        return <IsLoading />
    }


    return (
        <AdminLayout user={user}>
            <BarData />
            <DonutData />
        </AdminLayout>
    )
}

export default Chart
