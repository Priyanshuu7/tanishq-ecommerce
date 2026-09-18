import imageFragment from "./image";
import seoFragment from "./seo";

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    metafields(
      identifiers: [
        { namespace: "shopify", key: "fabric" }
        { namespace: "shopify", key: "color-pattern" }
        { namespace: "shopify", key: "sleeve-length-type" }
        { namespace: "shopify", key: "size-type" }
        { namespace: "shopify", key: "target-gender" }
        { namespace: "shopify", key: "age-group" }
      ]
    ) {
      key
      namespace
      value
      references(first: 5) {
        edges {
          node {
            ... on Metaobject {
              handle
              fields {
                key
                value
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
