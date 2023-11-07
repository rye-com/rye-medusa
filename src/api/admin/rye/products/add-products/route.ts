import {
  AdminProductsRes,
  MedusaRequest,
  MedusaResponse,
  ProductStatus,
} from "@medusajs/medusa";
import { GET_PRODUCT_BY_ID, GET_PRODUCT_BY_URL } from "../queries";
import { medusaClient, ryeClient } from "../../clients";
import { AnyVariables, OperationResult } from "@urql/core";
import { ResponsePromise } from "@medusajs/medusa-js";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const productUrls: { url: string; marketplace: "AMAZON" | "SHOPIFY" }[] =
      req.body.productUrls;

    const productRequests: Promise<OperationResult<any, AnyVariables>>[] = [];
    for (const { url, marketplace } of productUrls) {
      productRequests.push(
        ryeClient
          .mutation(GET_PRODUCT_BY_URL, {
            input: {
              url,
              marketplace,
            },
          })
          .toPromise()
      );
    }

    const productIds = (await Promise.all(productRequests)).map((product) => ({
      id: product.data.requestProductByURL.productID,
      marketplace: (product.operation.variables as any).input.marketplace,
    }));

    const productPromises = [];

    for (const { id, marketplace } of productIds) {
      productPromises.push(
        ryeClient
          .query(GET_PRODUCT_BY_ID, {
            input: {
              id,
              marketplace,
            },
          })
          .toPromise()
      );
    }

    const results = await Promise.all(productPromises);
    const medusaProductProms: ResponsePromise<AdminProductsRes>[] = [];
    for (const result of results) {
      console.log(result.data.productByID);
      if (result.data.productByID.isAvailable) {
        medusaProductProms.push(
          medusaClient.admin.products.create({
            title: result.data.productByID.title,
            images: result.data.productByID.images.map((i) => i.url),
            description: result.data.productByID.description,
            thumbnail: result.data.productByID.images[0].url,
            status: ProductStatus.PUBLISHED,
            metadata: {
              marketplaceId: result.data.productByID.id,
              marketplace: result.data.productByID.marketplace,
            },
            variants: [
              {
                title: result.data.productByID.title,
                inventory_quantity: 10,
                metadata: {
                  marketplaceId: result.data.productByID.id,
                  marketplace: result.data.productByID.marketplace,
                },
                prices: [
                  {
                    currency_code: result.data.productByID.price.currency,
                    amount: result.data.productByID.price.value,
                  },
                ],
              },
            ],
            is_giftcard: false,
            discountable: false,
          })
        );
      }
    }

    const products = (await Promise.all(medusaProductProms)).map(
      (product) => product.product
    );

    res.send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
