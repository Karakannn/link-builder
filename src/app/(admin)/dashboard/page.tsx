import { ChartAreaInteractive } from "@/app/(admin)/dashboard/_components/chart-area-interactive"
import { SectionCards } from "@/app/(admin)/dashboard/_components/section-cards"

type Props = {

}

const page = ({ }: Props) => {
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>

            </div>
        </div>
    )
}

export default page