export const MODAL_THEMES = [
  {
    id: "modern",
    name: "Modern",
    description: "Temiz ve modern tasarım",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Klasik ve nostaljik tasarım",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    primaryColor: "#f093fb",
    secondaryColor: "#f5576c",
  },
] as const;

export const MODAL_LAYOUTS = [
  {
    id: "centered",
    name: "Ortalanmış",
    description: "Modal içeriği ortalanmış",
    thumbnail: "🎯",
  },
  {
    id: "sidebar",
    name: "Kenar Çubuklu",
    description: "Sol tarafta resim, sağda içerik",
    thumbnail: "📱",
  },
] as const;

export const MODAL_TEMPLATES = [
  {
    id: "welcome",
    name: "Hoşgeldiniz",
    description: "Basit karşılama modalı",
    thumbnail: "👋",
    getContent: (theme: any, layout: any) => {
      const baseContent = [
        {
          id: "modal-title",
          name: "Modal Title",
          type: "text",
          styles: {
            fontSize: "28px",
            fontWeight: "bold",
            color: theme.primaryColor,
            marginBottom: "20px",
            textAlign: "center",
          },
          content: {
            innerText: "Hoşgeldiniz!",
          },
        },
        {
          id: "modal-subtitle",
          name: "Modal Subtitle",
          type: "text",
          styles: {
            fontSize: "16px",
            color: "#666",
            marginBottom: "30px",
            lineHeight: "1.6",
            textAlign: "center",
          },
          content: {
            innerText: "Sitemize hoşgeldiniz! En güncel içeriklerimizi keşfetmek için aşağıdaki butona tıklayın.",
          },
        },
        {
          id: "modal-button",
          name: "Modal Button",
          type: "link",
          styles: {
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: theme.primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            textAlign: "center",
          },
          content: {
            href: "#",
            innerText: "Keşfet",
          },
        },
      ];

      if (layout.id === "sidebar") {
        return [
          {
            id: "modal-container",
            name: "Modal Container",
            type: "container",
            styles: {
              display: "flex",
              width: "600px",
              height: "400px",
              padding: "0px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            },
            content: [
              {
                id: "modal-image",
                name: "Modal Image",
                type: "container",
                styles: {
                  width: "40%",
                  background: theme.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "48px",
                },
                content: [
                  {
                    id: "image-icon",
                    name: "Image Icon",
                    type: "text",
                    styles: {
                      fontSize: "48px",
                    },
                    content: {
                      innerText: "👋",
                    },
                  },
                ],
              },
              {
                id: "modal-content",
                name: "Modal Content",
                type: "container",
                styles: {
                  width: "60%",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                },
                content: baseContent,
              },
            ],
          },
        ];
      } else {
        // Centered layout
        return [
          {
            id: "modal-container",
            name: "Modal Container",
            type: "container",
            styles: {
              display: "flex",
              flexDirection: "column",
              width: "500px",
              height: "300px",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              gap: "0.5rem",
            },
            content: baseContent,
          },
        ];
      }
    },
  },
  {
    id: "newsletter",
    name: "Bülten Kaydı",
    description: "E-posta bülteni kayıt modalı",
    thumbnail: "📧",
    getContent: (theme: any, layout: any) => {
      const baseContent = [
        {
          id: "modal-icon",
          name: "Modal Icon",
          type: "text",
          styles: {
            fontSize: "48px",
            textAlign: "center",
            marginBottom: "20px",
          },
          content: {
            innerText: "📧",
          },
        },
        {
          id: "modal-title",
          name: "Modal Title",
          type: "text",
          styles: {
            fontSize: "28px",
            fontWeight: "bold",
            color: theme.primaryColor,
            marginBottom: "20px",
            textAlign: "center",
          },
          content: {
            innerText: "Bültenimize Katılın!",
          },
        },
        {
          id: "modal-subtitle",
          name: "Modal Subtitle",
          type: "text",
          styles: {
            fontSize: "16px",
            color: "#666",
            marginBottom: "30px",
            lineHeight: "1.6",
            textAlign: "center",
          },
          content: {
            innerText: "En güncel haberler ve özel teklifler için e-posta bültenimize abone olun.",
          },
        },
        {
          id: "modal-input",
          name: "Modal Input",
          type: "input",
          styles: {
            width: "100%",
            padding: "12px 16px",
            fontSize: "16px",
            border: "2px solid #e1e5e9",
            borderRadius: "8px",
            marginBottom: "20px",
            outline: "none",
          },
          content: {
            placeholder: "E-posta adresinizi girin",
          },
        },
        {
          id: "modal-button",
          name: "Modal Button",
          type: "link",
          styles: {
            width: "100%",
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: theme.primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            textAlign: "center",
          },
          content: {
            href: "#",
            innerText: "Kayıt Ol",
          },
        },
      ];

      if (layout.id === "sidebar") {
        return [
          {
            id: "modal-container",
            name: "Modal Container",
            type: "container",
            styles: {
              display: "flex",
              width: "600px",
              height: "400px",
              padding: "0px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            },
            content: [
              {
                id: "modal-image",
                name: "Modal Image",
                type: "container",
                styles: {
                  width: "40%",
                  background: theme.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "48px",
                },
                content: [
                  {
                    id: "image-icon",
                    name: "Image Icon",
                    type: "text",
                    styles: {
                      fontSize: "48px",
                    },
                    content: {
                      innerText: "📧",
                    },
                  },
                ],
              },
              {
                id: "modal-content",
                name: "Modal Content",
                type: "container",
                styles: {
                  width: "60%",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                },
                content: baseContent,
              },
            ],
          },
        ];
      } else {
        // Centered layout
        return [
          {
            id: "modal-container",
            name: "Modal Container",
            type: "container",
            styles: {
              display: "flex",
              flexDirection: "column",
              width: "500px",
              height: "300px",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              gap: "0.5rem",
            },
            content: baseContent,
          },
        ];
      }
    },
  },
  {
    id: "promotion",
    name: "Promosyon",
    description: "Özel teklif ve promosyon modalı",
    thumbnail: "🎉",
    getContent: (theme: any, layout: any) => {
      const baseContent = [
        {
          id: "modal-icon",
          name: "Modal Icon",
          type: "text",
          styles: {
            fontSize: "48px",
            textAlign: "center",
            marginBottom: "20px",
          },
          content: {
            innerText: "🎉",
          },
        },
        {
          id: "modal-title",
          name: "Modal Title",
          type: "text",
          styles: {
            fontSize: "28px",
            fontWeight: "bold",
            color: theme.primaryColor,
            marginBottom: "20px",
            textAlign: "center",
          },
          content: {
            innerText: "Özel Teklif!",
          },
        },
        {
          id: "modal-subtitle",
          name: "Modal Subtitle",
          type: "text",
          styles: {
            fontSize: "16px",
            color: "#666",
            marginBottom: "30px",
            lineHeight: "1.6",
            textAlign: "center",
          },
          content: {
            innerText: "Sınırlı süre için %50 indirim! Bu fırsatı kaçırmayın.",
          },
        },
        {
          id: "modal-button",
          name: "Modal Button",
          type: "link",
          styles: {
            width: "100%",
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: theme.primaryColor,
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
            textAlign: "center",
          },
          content: {
            href: "#",
            innerText: "Teklifi Kullan",
          },
        },
      ];

      if (layout.id === "sidebar") {
        return [
          {
            id: "modal-container",
            name: "Modal Container",
            type: "container",
            styles: {
              display: "flex",
              width: "600px",
              height: "400px",
              padding: "0px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            },
            content: [
              {
                id: "modal-image",
                name: "Modal Image",
                type: "container",
                styles: {
                  width: "40%",
                  background: theme.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "48px",
                },
                content: [
                  {
                    id: "image-icon",
                    name: "Image Icon",
                    type: "text",
                    styles: {
                      fontSize: "48px",
                    },
                    content: {
                      innerText: "🎉",
                    },
                  },
                ],
              },
              {
                id: "modal-content",
                name: "Modal Content",
                type: "container",
                styles: {
                  width: "60%",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                },
                content: baseContent,
              },
            ],
          },
        ];
      } else {
        // Centered layout
        return [
          {
            id: "modal-container",
            name: "Modal Container",
            type: "container",
            styles: {
              display: "flex",
              flexDirection: "column",
              width: "500px",
              height: "300px",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              gap: "0.5rem",
            },
            content: baseContent,
          },
        ];
      }
    },
  },
  {
    id: "custom",
    name: "Özel Modal",
    description: "Boş modal - tamamen özelleştirilebilir",
    thumbnail: "✨",
    getContent: (theme: any, layout: any) => [
      {
        id: "modal-container",
        name: "Modal Container",
        type: "container",
        styles: {
          display: "flex",
          flexDirection: "column",
          width: "500px",
          height: "300px",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          gap: "0.5rem",
        },
        content: [
          {
            id: "modal-title",
            name: "Modal Title",
            type: "text",
            styles: {
              fontSize: "24px",
              fontWeight: "bold",
              color: theme.primaryColor,
              marginBottom: "20px",
              textAlign: "center",
            },
            content: {
              innerText: "Özel Modal",
            },
          },
          {
            id: "modal-content",
            name: "Modal Content",
            type: "text",
            styles: {
              fontSize: "16px",
              color: "#666",
              lineHeight: "1.6",
              textAlign: "center",
            },
            content: {
              innerText: "Bu modalı istediğiniz gibi özelleştirebilirsiniz. Editörde düzenleyerek içeriği değiştirin.",
            },
          },
        ],
      },
    ],
  },
] as const;

export type ModalTemplate = typeof MODAL_TEMPLATES[number];
export type ModalTheme = typeof MODAL_THEMES[number];
export type ModalLayout = typeof MODAL_LAYOUTS[number]; 