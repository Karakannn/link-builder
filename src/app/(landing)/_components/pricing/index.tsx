import BackdropGradient from "@/components/global/backdrop-gradient"
import GradientText from "@/components/global/gradient-text"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MessageCircle, Users, Zap, Heart } from "lucide-react"
import Link from "next/link"

type Props = {}

export const PricingSection = (props: Props) => {
  const features = [
    "Sürükle & Bırak Editörü",
    "Hazır Element Kütüphanesi",
    "Mobil Uyumlu Tasarım",
    "Özel Alan Adı Desteği",
    "Açılış Modal Sistemi",
    "Gelişmiş Analitik",
    "Öncelikli Destek",
    "Özel CSS/JavaScript",
  ]

  const stats = [
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      value: "10K+",
      label: "Aktif Kullanıcı"
    },
    {
      icon: <Zap className="h-6 w-6 text-green-500" />,
      value: "50K+",
      label: "Oluşturulan Sayfa"
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      value: "99%",
      label: "Memnuniyet"
    }
  ]

  return (
    <div className="w-full pt-20 flex flex-col items-center gap-3" id="pricing">      
      {/* Stats Row */}
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3">
            {stat.icon}
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Pricing Card */}
      <Card className="p-8 mt-10 w-full max-w-4xl bg-themeBlack border-themeGray relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        <div className="relative z-10">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl mb-4">Kurumsal Çözüm</CardTitle>
            <CardDescription className="text-lg text-[#B4B0AE]">
              İşletme ihtiyaçlarınız için tasarlanmış özel fiyatlandırma
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-[#B4B0AE]">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center pt-8 border-t border-themeGray">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Özel Teklifinizi Alın
                </h3>
                <p className="text-muted-foreground">
                  Demo planlayın ve kişiselleştirilmiş fiyatlandırma planı alın
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl text-lg">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Satış İle İletişim
                </Button>
                <Link href="/sign-in">
                  <Button variant="outline" className="px-8 py-3 rounded-xl text-lg">
                    Giriş Yap
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                💬 Ortalama yanıt süresi: 2 saat içinde
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
