// schemas/car.js
export default {
  name: 'car',
  title: 'Car',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'discountedPrice',
      title: 'Discounted Price',
      type: 'number',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'specs',
      title: 'Specs',
      type: 'image',
    },
    {
      name: 'relatedCars',
      title: 'Related Cars',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'car' }] }],
    },
  ],
};
