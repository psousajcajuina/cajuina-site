import type { Collection } from "tinacms";

export const BlogCollection: Collection = {
  name: "blog",
  label: "Blog",
  path: "src/content/blog",
  ui: {
    router({ document }) {
      return `/blog/${document._sys.filename}`;
    },
  },
  templates: [
    {
      name: "blog",
      label: "Publicação do Site",
      ui: {
        defaultItem: {
          draft: false,
        },
      },
      fields: [
        {
          type: "string",
          name: "title",
          label: "Título",
          isTitle: true,
          required: true,
        },
        {
          type: "string",
          name: "slug",
          label: "Slug / URL",
          description: "Url de acesso ao post. EX: /blog/<slug-de-exemplo>",
          required: true,
        },
        {
          type: "string",
          name: "description",
          label: "Descrição",
          ui: {
            component: "textarea",
          },
        },
        {
          type: "image",
          name: "coverImage",
          label: "Image de Capa",
        },
        {
          type: "string",
          name: "tags",
          label: "Tags",
          list: true,
          addItemBehavior: "append",
        },
        {
          type: "datetime",
          name: "publishedAt",
          label: "Hora da publicação",
          required: true,
          ui: { dateFormat: "DD/MM/YYYY", timeFormat: "HH:mm" },
        },
        {
          name: "updatedDate",
          label: "Updated Date",
          type: "datetime",
        },
        {
          type: "boolean",
          name: "draft",
          label: "Salvar como Rascunho",
        },
        {
          type: "rich-text",
          name: "body",
          label: "Body",
          isBody: true,
        },
      ],
    },
  ],
};
