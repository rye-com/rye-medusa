import {
  AdminProductsRes,
  MedusaRequest,
  MedusaResponse,
  ProductStatus,
} from "@medusajs/medusa";
import { CREATE_RYE_CART } from "../queries";
import { medusaClient, ryeClient } from "../../clients";
import { AnyVariables, OperationResult } from "@urql/core";
import { ResponsePromise } from "@medusajs/medusa-js";

type BuyerIdentity = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  provinceCode: string;
  countryCode: string;
  postalCode: string;
};

type RyeItem = {
  buyerIdentity: BuyerIdentity;
  productId: string;
  quantity: string;
  marketplace: "amazon" | "shopify";
};

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const items = req.body.items as RyeItem[];
    const buyerIdentity = req.body.buyerIdentity as BuyerIdentity;

    const cartItems = {
      amazonCartItemsInput: items.reduce((acc, curr) => {
        if (curr.marketplace === "amazon") {
          return [
            ...acc,
            {
              productId: curr.productId,
              quantity: curr.quantity,
            },
          ];
        }
        return acc;
      }, []),
      shopifyCartItemsInput: items.reduce((acc, curr) => {
        if (curr.marketplace === "shopify") {
          return [
            ...acc,
            {
              productId: curr.productId,
              quantity: curr.quantity,
            },
          ];
        }
        return acc;
      }, []),
    };

    const result = await ryeClient
      .mutation(CREATE_RYE_CART, {
        input: {
          items: cartItems,
          buyerIdentity,
        },
      })
      .toPromise();

    res.send(result.data.createCart.cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
