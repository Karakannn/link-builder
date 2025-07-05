import Image from "next/image"
import { Badge } from "@/components/ui/badge"

type Props = {}

const DashboardSnippet = (props: Props) => {
  return (
    <div className="relative py-20">
      <div className="w-full h-3/6 absolute rounded-[50%] radial--blur opacity-40 mx-10" />
      
      {/* Feature highlights */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Badge variant="secondary" className="px-4 py-2">
          ✨ Sürükle & Bırak Editörü
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          🎨 Hazır Bileşenler
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          📱 Uyumlu Tasarım
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          🚀 Anında Yayınlama
        </Badge>
      </div>

      {/* Editor mockup */}
      <div className="w-full aspect-video relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="absolute inset-4 bg-gray-800 rounded-lg border border-gray-600">
          {/* Sidebar mockup */}
          <div className="absolute left-0 top-0 w-16 h-full bg-gray-900 border-r border-gray-600 flex flex-col items-center py-4 gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
            <div className="w-8 h-8 bg-purple-500 rounded-lg"></div>
            <div className="w-8 h-8 bg-pink-500 rounded-lg"></div>
            <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
          </div>
          
          {/* Main canvas */}
          <div className="ml-16 p-8 h-full flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg opacity-80"></div>
              <div className="w-32 h-12 bg-gray-700 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 flex-1">
              <div className="bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-lg border border-pink-500/30 p-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full mb-2"></div>
                <div className="h-3 bg-gray-600 rounded mb-1"></div>
                <div className="h-2 bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30 p-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full mb-2"></div>
                <div className="h-3 bg-gray-600 rounded mb-1"></div>
                <div className="h-2 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg border border-green-500/30 p-4">
                <div className="w-8 h-8 bg-green-500 rounded-full mb-2"></div>
                <div className="h-3 bg-gray-600 rounded mb-1"></div>
                <div className="h-2 bg-gray-700 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating elements to show interactivity */}
        <div className="absolute top-8 right-8 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-12 left-24 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
      </div>
      
      <p className="text-center text-muted-foreground mt-6 text-sm">
        Gerçek zamanlı önizleme ile profesyonel görsel editörü
      </p>
    </div>
  )
}

export default DashboardSnippet
