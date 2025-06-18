export const PAGE_TEMPLATES = [
  {
    id: "landing",
    name: "Landing Page",
    description: "Modern landing sayfası - Hero section, özellikler ve CTA",
    thumbnail: "🚀",
    getContent: (theme: any) => [
      {
        id: "__body",
        name: "Body",
        type: "__body",
        styles: {
          backgroundColor: "white",
          height: "100%",
        },
        content: [
          {
            id: "hero-section",
            name: "Hero Section",
            type: "container",
            styles: {
              width: "100%",
              minHeight: "80vh",
              padding: "60px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: theme.gradient,
              color: "white",
              textAlign: "center",
            },
            content: [
              {
                id: "hero-title",
                name: "Hero Title",
                type: "text",
                styles: {
                  fontSize: "48px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                },
                content: {
                  innerText: "Hoşgeldiniz",
                },
              },
              {
                id: "hero-subtitle",
                name: "Hero Subtitle",
                type: "text",
                styles: {
                  fontSize: "20px",
                  marginBottom: "40px",
                  opacity: "0.9",
                },
                content: {
                  innerText: "Modern ve güçlü çözümlerimizi keşfedin",
                },
              },
              {
                id: "hero-button",
                name: "CTA Button",
                type: "button",
                styles: {
                  padding: "15px 30px",
                  fontSize: "18px",
                  backgroundColor: theme.accentColor,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                },
                content: {
                  innerText: "Başlayın",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Kişisel portfolio sayfası - Hakkımda, projeler, iletişim",
    thumbnail: "🎨",
    getContent: (theme: any) => [
      {
        id: "__body",
        name: "Body",
        type: "__body",
        styles: {
          backgroundColor: "#f8f9fa",
          height: "100%",
        },
        content: [
          {
            id: "portfolio-header",
            name: "Header",
            type: "container",
            styles: {
              width: "100%",
              padding: "40px 20px",
              textAlign: "center",
              backgroundColor: "white",
              borderBottom: `3px solid ${theme.primaryColor}`,
            },
            content: [
              {
                id: "portfolio-name",
                name: "Name",
                type: "text",
                styles: {
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: theme.primaryColor,
                  marginBottom: "10px",
                },
                content: {
                  innerText: "Ad Soyad",
                },
              },
              {
                id: "portfolio-title",
                name: "Title",
                type: "text",
                styles: {
                  fontSize: "18px",
                  color: "#666",
                },
                content: {
                  innerText: "Web Developer & Designer",
                },
              },
            ],
          },
          {
            id: "portfolio-content",
            name: "Content",
            type: "container",
            styles: {
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
              padding: "40px 20px",
            },
            content: [
              {
                id: "about-section",
                name: "About Section",
                type: "text",
                styles: {
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "#555",
                  marginBottom: "40px",
                },
                content: {
                  innerText: "Merhaba! Ben bir web developer'ım. Modern teknolojiler kullanarak yaratıcı projeler geliştiriyorum.",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "blog",
    name: "Blog",
    description: "Blog sayfası - Makale listesi ve içerik alanı",
    thumbnail: "📝",
    getContent: (theme: any) => [
      {
        id: "__body",
        name: "Body",
        type: "__body",
        styles: {
          backgroundColor: "white",
          height: "100%",
        },
        content: [
          {
            id: "blog-header",
            name: "Blog Header",
            type: "container",
            styles: {
              width: "100%",
              padding: "60px 20px 40px",
              textAlign: "center",
              borderBottom: `3px solid ${theme.primaryColor}`,
            },
            content: [
              {
                id: "blog-title",
                name: "Blog Title",
                type: "text",
                styles: {
                  fontSize: "42px",
                  fontWeight: "bold",
                  color: theme.primaryColor,
                  marginBottom: "15px",
                },
                content: {
                  innerText: "Blog",
                },
              },
              {
                id: "blog-subtitle",
                name: "Blog Subtitle",
                type: "text",
                styles: {
                  fontSize: "18px",
                  color: "#666",
                },
                content: {
                  innerText: "Düşünceler, fikirler ve deneyimler",
                },
              },
            ],
          },
          {
            id: "blog-content",
            name: "Blog Content",
            type: "container",
            styles: {
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
              padding: "40px 20px",
            },
            content: [
              {
                id: "sample-post",
                name: "Sample Post",
                type: "container",
                styles: {
                  padding: "30px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  marginBottom: "30px",
                  borderLeft: `4px solid ${theme.primaryColor}`,
                },
                content: [
                  {
                    id: "post-title",
                    name: "Post Title",
                    type: "text",
                    styles: {
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: theme.primaryColor,
                      marginBottom: "15px",
                    },
                    content: {
                      innerText: "İlk Blog Yazısı",
                    },
                  },
                  {
                    id: "post-content",
                    name: "Post Content",
                    type: "text",
                    styles: {
                      fontSize: "16px",
                      lineHeight: "1.6",
                      color: "#555",
                    },
                    content: {
                      innerText: "Bu bloguma hoşgeldiniz! Burada düzenli olarak teknoloji, tasarım ve kişisel deneyimlerim hakkında yazılar paylaşacağım.",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    name: "İletişim",
    description: "İletişim sayfası - Form ve iletişim bilgileri",
    thumbnail: "📞",
    getContent: (theme: any) => [
      {
        id: "__body",
        name: "Body",
        type: "__body",
        styles: {
          backgroundColor: "#f5f5f5",
          height: "100%",
        },
        content: [
          {
            id: "contact-header",
            name: "Contact Header",
            type: "container",
            styles: {
              width: "100%",
              padding: "60px 20px 40px",
              textAlign: "center",
              backgroundColor: "white",
              borderBottom: `3px solid ${theme.primaryColor}`,
            },
            content: [
              {
                id: "contact-title",
                name: "Contact Title",
                type: "text",
                styles: {
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: theme.primaryColor,
                  marginBottom: "15px",
                },
                content: {
                  innerText: "İletişim",
                },
              },
              {
                id: "contact-subtitle",
                name: "Contact Subtitle",
                type: "text",
                styles: {
                  fontSize: "18px",
                  color: "#666",
                },
                content: {
                  innerText: "Bizimle iletişime geçin",
                },
              },
            ],
          },
          {
            id: "contact-content",
            name: "Contact Content",
            type: "container",
            styles: {
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
              padding: "40px 20px",
            },
            content: [
              {
                id: "contact-info",
                name: "Contact Info",
                type: "container",
                styles: {
                  padding: "40px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  borderTop: `4px solid ${theme.primaryColor}`,
                },
                content: [
                  {
                    id: "email-info",
                    name: "Email Info",
                    type: "text",
                    styles: {
                      fontSize: "16px",
                      marginBottom: "20px",
                      color: "#555",
                    },
                    content: {
                      innerText: "📧 Email: info@example.com",
                    },
                  },
                  {
                    id: "phone-info",
                    name: "Phone Info",
                    type: "text",
                    styles: {
                      fontSize: "16px",
                      marginBottom: "20px",
                      color: "#555",
                    },
                    content: {
                      innerText: "📱 Telefon: +90 555 123 45 67",
                    },
                  },
                  {
                    id: "address-info",
                    name: "Address Info",
                    type: "text",
                    styles: {
                      fontSize: "16px",
                      color: "#555",
                    },
                    content: {
                      innerText: "📍 Adres: İstanbul, Türkiye",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
] as const;

export type PageTemplate = typeof PAGE_TEMPLATES[number]; 