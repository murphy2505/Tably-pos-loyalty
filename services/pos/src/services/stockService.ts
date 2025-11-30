import { Router } from "express";
import { z } from "zod";
import {
  createCustomer as createCustomerSvc,
  listCustomers,
  getCustomerDetail,
} from "../services/customersService";

const router = Router();

// POST /customers (name + phone + optional email)
router.post("/", (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    phone: z.string().min(3),
    email: z.string().email().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  (async () => {
    try {
      const customer = await createCustomerSvc(
        parsed.data.name,
        parsed.data.phone,
        parsed.data.email
      );
      res.status(201).json(customer);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  })();
});

// GET /customers → lijst
router.get("/", (_req, res) => {
  (async () => {
    try {
      const list = await listCustomers();
      res.json(list);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  })();
});

// GET /customers/:id → detail
router.get("/:id", (req, res) => {
  (async () => {
    try {
      const detail = await getCustomerDetail(req.params.id);
      if (!detail) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(detail);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  })();
});

export default router;

export async function listStock(tenantId: string) {
  return [];
}
export async function purchase(tenantId: string, data: { stockItemId: string; amount: number }) {
  // TODO: increment quantity; create StockMovement type PURCHASE
  return { ok: true };
}
export async function waste(tenantId: string, data: { stockItemId: string; amount: number }) {
  // TODO: decrement quantity; WASTE
  return { ok: true };
}
export async function adjust(tenantId: string, data: { stockItemId: string; amount: number }) {
  // TODO: set quantity; ADJUSTMENT
  return { ok: true };
}
export async function history(tenantId: string) {
  return [];
}