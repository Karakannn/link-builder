import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GradientText from "@/components/global/gradient-text";
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Github, 
  Mail, 
  MessageCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

type Props = {};

const ContactSection = (props: Props) => {
  const socialLinks = [
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      url: "https://twitter.com/linkbuilder",
      color: "hover:bg-blue-500/20 hover:border-blue-500/50"
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: "https://facebook.com/linkbuilder",
      color: "hover:bg-blue-600/20 hover:border-blue-600/50"
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://instagram.com/linkbuilder",
      color: "hover:bg-pink-500/20 hover:border-pink-500/50"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com/company/linkbuilder",
      color: "hover:bg-blue-700/20 hover:border-blue-700/50"
    },
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com/linkbuilder",
      color: "hover:bg-gray-500/20 hover:border-gray-500/50"
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto text-center">
        <GradientText
          className="text-4xl font-semibold mb-6"
          element="H2"
        >
          Oluşturmaya Başlamaya Hazır Mısınız?
        </GradientText>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Şimdiden muhteşem açılış sayfaları oluşturan binlerce yaratıcıya katılın. 
          Hemen başlayın veya kişiselleştirilmiş destek için ekibimizle iletişime geçin.
        </p>

        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/sign-up">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl text-lg">
            Oluşturmaya Başla
            </Button>
          </Link>
          <Button variant="outline" className="px-8 py-3 rounded-xl text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Satış İle İletişim
          </Button>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-themeBlack border-themeGray">
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold text-white mb-2">E-posta Desteği</h3>
              <p className="text-muted-foreground mb-4">
                Destek ekibimizden yardım alın
              </p>
              <a 
                href="mailto:medyaprens@gmail.com" 
                className="text-purple-500 hover:text-purple-400 font-medium"
              >
                medyaprens@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card className="bg-themeBlack border-themeGray">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold text-white mb-2">Canlı Sohbet</h3>
              <p className="text-muted-foreground mb-4">
                Anında yanıtlar için bizimle sohbet edin
              </p>
              <Button variant="outline" className="border-green-500/50 text-green-500 hover:bg-green-500/10">
                Sohbet Başlat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-muted-foreground">
            © 2024 LinkBuilder. Dünya çapındaki yaratıcılar için ❤️ ile geliştirildi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 