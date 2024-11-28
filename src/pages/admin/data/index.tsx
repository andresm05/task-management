import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import DonutData from "@/molecules/donutData"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import AdminLayout from "@/layouts/_layout"
import useMiddleware from "@/hooks/useMiddleware"
import { Role } from "@/types/users"
import IsLoading from "@/molecules/isLoading"
import { useQuery } from "@apollo/client"
import { GetProjects, Project } from "@/types/projects"
import { GET_PROJECTS } from "@/utils/graphql/queries/projects"
import { Task } from "@/types/tasks"

const Chart = () => {

    const user = useMiddleware(Role.ADMIN);
    const { data, loading } = useQuery<GetProjects>(GET_PROJECTS);
    const projects = data?.projects || [];

    if (loading) {
        return <IsLoading />
    }

    if (!user) {
        return <IsLoading />
    }

    const generateRandomColor = () => {
        // Genera un color aleatorio en formato HSL
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 40) + 60; // 60% - 100%
        const lightness = Math.floor(Math.random() * 30) + 50; // 50% - 80%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

 // Generar chartData y chartConfig a partir de los proyectos
 const chartData: { name: string; totalCompleted: number; fill: string }[] = [];
 const chartConfig: ChartConfig = {};

 projects.forEach((project: Project) => {
     const totalTasks = project.tasks.length;
     const completedTasks = project.tasks.filter((task: Task) => task.status === "COMPLETED").length;
     const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
     const color = generateRandomColor();

     chartData.push({
         name: project.name, // Nombre del proyecto
         totalCompleted: completedPercentage, // Porcentaje de tareas completadas
         fill: color, // Color aleatorio
     });

     chartConfig[project.name] = {
         label: project.name,
     };
 });

    return (
        <AdminLayout user={user}>
            <Card className="m-4">
                <CardHeader>
                    <CardTitle>Porcentaje de tareas completadas por proyecto</CardTitle>
                    <CardDescription>Datos históricos</CardDescription>
                </CardHeader>
                <CardContent className="m-5">
                    <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{
                                left: 0,
                            }}
                        >
                            <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value: string) =>
                                    String(chartConfig[value as keyof typeof chartConfig]?.label || "")
                                }
                            />
                            <XAxis dataKey="totalCompleted" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="totalCompleted" layout="vertical" radius={5} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                       Porcentaje de tareas completadas por proyecto
                    </div>
                    <div className="leading-none text-muted-foreground">
                        <TrendingUp size={16} className="mr-1" />
                    </div>
                </CardFooter>
            </Card>
            <DonutData/>
        </AdminLayout>
    )
}

export default Chart
