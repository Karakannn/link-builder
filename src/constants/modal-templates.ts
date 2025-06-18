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
          type: "shimmerButton",
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
            innerText: "Keşfet",
            shimmerColor: theme.secondaryColor,
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
              width: "100%",
              maxWidth: "700px",
              display: "flex",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
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
              width: "100%",
              maxWidth: "500px",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              textAlign: "center",
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
            marginBottom: "20px",
            textAlign: "center",
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
            fontSize: "24px",
            fontWeight: "bold",
            color: theme.primaryColor,
            marginBottom: "15px",
            textAlign: "center",
          },
          content: {
            innerText: "Güncel Kalın!",
          },
        },
        {
          id: "modal-subtitle",
          name: "Modal Subtitle",
          type: "text",
          styles: {
            fontSize: "14px",
            color: "#666",
            marginBottom: "25px",
            lineHeight: "1.5",
            textAlign: "center",
          },
          content: {
            innerText: "En son haberler ve güncellemeler için e-posta bültenimize kayıt olun.",
          },
        },
        {
          id: "modal-input",
          name: "Modal Input",
          type: "text",
          styles: {
            width: "100%",
            padding: "12px 16px",
            fontSize: "14px",
            border: `2px solid #e5e7eb`,
            borderRadius: "8px",
            marginBottom: "20px",
            outline: "none",
            textAlign: "center",
          },
          content: {
            innerText: "E-posta adresinizi girin",
          },
        },
        {
          id: "modal-button",
          name: "Modal Button",
          type: "shimmerButton",
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
            innerText: "Kayıt Ol",
            shimmerColor: theme.secondaryColor,
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
              width: "100%",
              maxWidth: "700px",
              display: "flex",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
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
              width: "100%",
              maxWidth: "450px",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              textAlign: "center",
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
            marginBottom: "20px",
            textAlign: "center",
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
            color: "white",
            marginBottom: "15px",
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
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "25px",
            lineHeight: "1.5",
            textAlign: "center",
          },
          content: {
            innerText: "Sınırlı süre için %50 indirim! Bu fırsatı kaçırmayın.",
          },
        },
        {
          id: "modal-button",
          name: "Modal Button",
          type: "shimmerButton",
          styles: {
            padding: "15px 30px",
            fontSize: "18px",
            backgroundColor: "white",
            color: theme.primaryColor,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            textAlign: "center",
          },
          content: {
            innerText: "Teklifi Kullan",
            shimmerColor: theme.secondaryColor,
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
              width: "100%",
              maxWidth: "700px",
              display: "flex",
              background: theme.gradient,
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
              color: "white",
            },
            content: [
              {
                id: "modal-image",
                name: "Modal Image",
                type: "container",
                styles: {
                  width: "40%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
              width: "100%",
              maxWidth: "500px",
              padding: "40px",
              background: theme.gradient,
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              textAlign: "center",
              color: "white",
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
          width: "100%",
          maxWidth: "500px",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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