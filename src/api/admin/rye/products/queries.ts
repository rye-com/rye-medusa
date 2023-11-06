import { gql } from "@urql/core";

export const GET_PRODUCT_BY_URL = gql`
  mutation requestProductByURL($input: RequestProductByURLInput!) {
    requestProductByURL(input: $input) {
      productID
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query productByID($input: ProductByIDInput!) {
    productByID(input: $input) {
      __typename
      id
      title
      description
      marketplace
      isAvailable
      vendor
      url
      tags
      price {
        displayValue
        value
        currency
      }
      tags

      ... on AmazonProduct {
        categories {
          name
        }
        images {
          url
        }
        featureBullets
        specifications {
          name
        }
        videos {
          url
          thumbnailURL
        }
      }

      ... on ShopifyProduct {
        descriptionHTML
        handle
        maxPrice
        minPrice
        productType
        createdAt
        publishedAt
        storeDomain
        storeCanonicalURL
        reviewsConnection {
          edges {
            node {
              rating
            }
          }
        }
        images {
          url
        }

        options {
          name
          position
          values
        }
      }

      variants {
        ... on AmazonVariant {
          id
          title
          url
          image {
            url
          }
        }
        ... on ShopifyVariant {
          title
          id
          isTaxable
          isAvailable
          isShippingRequired
          SKU
          price
          compareAtPrice
          name
          weight
          option1
          option2
          option3
          image {
            url
            __typename
          }
        }
      }
    }
  }
`;
