import type { Collection } from "tinacms";

export const ProductsCollection: Collection = {
  name: "products",
  label: "Produtos",
  path: "src/content/products",
  fields: [
    {
      type: "string",
      name: "name",
      label: "Nome",
      required: true,
    },
    {
      type: "string",
      name: "slug",
      label: "Slug",
      required: true,
    },
    {
      type: "image",
      name: "image",
      label: "Imagem",
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "Descrição",
    },
  ],
};
